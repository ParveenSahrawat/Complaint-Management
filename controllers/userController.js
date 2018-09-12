const express = require('express');
const request = require('request');
const validator = require('validator');
const User = require('../db/User');
const nodemailer = require('nodemailer');
const validateUserFields = require('./userFieldsController');
// const { emailConfig, adminEmailAddress, adminName } = require('./../config/email');
const { Organization_name } = require('../config/organization');
const bcrypt = require('bcrypt-nodejs');
const {adminEmailAddress, adminName, emailConfig} = require('../config/email');

module.exports.createUser = (req, res) => {

    validateUserFields.checkUserFields(req, res);
    var adminRegistration = false;
    var adminEmailAddress = `parveen.sahrawat1209@gmail.com`;
    if(req.originalUrl == '/signup/admin')
        adminRegistration = true;
    User.findOne({
        email : req.body.email
    }).then((doc) => {
            if (doc) {
                res.status(500).send({
                  status : 0,
                  message : 'User already exists'
                });
            } else {
                var record = new User()
                record.username = req.body.username;
                record.email = req.body.email;
                record.mobile = req.body.mobile;
                record.aadharNumber = req.body.aadharNumber;
                record.password = record.hashPassword(req.body.password);
                record.save().then((doc) => {
                            var emailSubject = 'Account Creation Successful.';
                            var emailMessage = `<p>Dear ${record.username},</p>
                                            <p>Your account on ${Organization_name} has successfully been created.</p><br>
                                            <small>In Case you haven't created this account. Kindly contact on ${adminEmailAddress}</small>`;
                        nodemailer.createTestAccount((error, account) => {
                          let transporter = nodemailer.createTransport(emailConfig);
                          let mailOptions = {
                            from : `"${adminName}" ${adminEmailAddress}`,
                            to : `${req.body.email}`,
                            subject : emailSubject,
                            html : emailMessage
                          }
                          transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                // Ignore
                                res.send()
                                console.log('Could not send user-registration email. Error',error);
                            }
                            console.log('Message sent : %s ', info.messageId);
                            console.log('Preview URL : %s ',nodemailer.getTestMessageUrl(info));
                            console.log(`This is get when signing up ${doc}`);
                            // generateOTP(req, res);
                            // let id = doc._id;
                            res.redirect(`/login`);
                        });                          
                    });  
                }).catch((e) => {
                  res.status(500).json({
                    status : 0,
                      message: 'Sever error',
                      err: e
                  }); 
          });
        }
      }).catch((e) => {
        res.status(500).send({
          status : 0,
          message : 'Error in communicating with the server',
          errorDetails : e
        });
    });
}
module.exports.fetchLoggedUserDetails = (req, res) => {

  User.findById(req.user._id).then((doc) => {
    var { username, mobile, email, aadharNumber, mobileVerified } = doc;
    if (doc) {
        res.json({ username, mobile, email, aadharNumber, mobileVerified });
    }
    else {
        res.status(400).json({
            status: 0,
            msg: 'User Not Found',
            code: 'AC - 1'
        })
    }
}).catch((e) => {
    res.status(400).json({
        status: 0,
        msg: 'User Not Found',
        code: 'AC-2'
    })
})
}
module.exports.generateOTP = (req, res) => {
  console.log(`In generate otp ${req.user}`);
  console.log(`Body in generateOTP ${req.body.email}`);
  if(req.user.mobileVerified){
      res.status(400).send({
        status : 0,
        message : 'User already has mobile verified',
        reason : 'alreadyVerififed'
      });
    //   next();
  } else {
      otp = Math.floor(1000 + Math.random() * 9000);
      var validTill = Date.now() + 300000;
      var smsContent = `Dear User,\n Please use ${otp} as OTP for verifying your mobile number. This OTP is valid for next 5 mins.`;
      var smsLink = encodeURI(`http://bhashsms.com/api/sendmsg.php?user=MKUKREJA26&pass=123456&sender=ENBINC&phone=${req.user.mobile}&text=${smsContent}&priority=ndnd&stype=normal`);

      request(smsLink, (error, result, body) => {
        if(error){
          res.status(500).send({
            status : 0,
            message : `Error occured while sending OTP`,
            errorDetails : error
          });
        } else {
            var refNo = result.body.replace(/\s/g, '');
            console.log(`this is refNo ${refNo}`); 
            User.findByIdAndUpdate(req.user._id, {
              $push : {
                OTP : {
                  otp, validTill, refNo, mobile : req.user.mobile
                }
              }
            }).then((doc) => {
              res.status(200).send({
                status : 1,
                message : `OTP is sent to your mobile`,
                mobile : req.user.mobile
              });
            }).catch((error) => {
                res.status(400).send({
                  status : 0,
                  message : `Error occured while sending OTP`,
                  errorDetails : error
                });
            });
          };
        });
      }
  }
module.exports.checkOTP = (req, res) => {
  console.log(`In check otp ${typeof(req.body.otp)}`);
  console.log(req.user);
  if(req.body.otp){
    User.findById(
      {'_id' : req.user.id},
      {'OTP' :  {
          $elemMatch : {
            'otp' : req.body.otp,
            'validTill' : { $gte : new Date() }
          }
        }
    }).then((doc) => {
      if(doc){
        console.log(doc.OTP);
        if(typeof(doc.OTP != undefined) && doc.OTP.length){
          var verifiedMobile = doc.OTP[0].mobile;
          
          User.findByIdAndUpdate(req.user._id, {
            $set : {
              mobileVerified : true,
              mobile : verifiedMobile
            }
          }).then((doc) => {
            // unset mob verified for previous verified user (if any)
            User.updateMany(
              {
                $and : [
                  { '_id' : {$ne : req.user._id }},
                  { mobile : verifiedMobile },
                  { mobileVerified : true }
                ]
              },
              {
                $set : {
                  mobileVerified : false
                }
              }).then((doc) => {
                res.status(200).send({
                  status : 1,
                  message : `Mobile number ${verifiedMobile} is verified`
                  })
                }).catch((error) => {
                  res.status(500).send({
                    status : 0,
                    message : `Error occured while processing your request`,
                    errorDetails : 'OTP_5'
                  });
              });
          }).catch((error) => {
            res.status(500).send({
              status : 0,
              message : `An error occured while processing your request`,
              errorDetails : 'OTP-4'
            })
          })
        } else {
          //Invalid OTP
          res.status(500).send({
            status : 0,
            message : `Entered OTP either invalid or has been expired`,
            errorDetails : 'OTP_3'
          })
        }
      } else {
        // user not found 
         res.status(500).send({
           status : 0,
           message : `user doesn't exists`,
           errorDetails : 'OTP_2',
         });
      }
    });
  } else {
    res.status(500).send({
      status : 0,
      message : `Invalid request`,
      errorDetails : 'OTP_1'
    });
  }
}
module.exports.editUserDetails = (req, res) => {
  console.log('In edit ');
  if( typeof(req.body.username) === 'undefined' || typeof(req.body.email) === 'undefined' || typeof(req.body.mobile) === 'undefined' || typeof(req.body.aadharNumber) === 'undefined'){
    res.status(400).send({
      status : 0,
      message : 'Invalid request'
    });
  } else {
    let username = req.body.username;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let aadharNumber = req.body.aadharNumber;
      if(!validator.trim(username).length){
        return res.status(400).send({
          status : 0,
          message : `Name can't be empty`
        });
      } else if(!validator.isEmail(email)){
        return res.status(400).json({
          status : 0,
          message : `Invalid email address`
        });
      } else if(!validator.isMobilePhone(mobile, "en-IN")){
        return res.status(400).json({
          status : 0,
          message : 'Invalid mobile number'
        });
      } else if(!(validator.isNumeric(aadharNumber) && validator.trim(aadharNumber).length === 12)){
        return res.status(400).json({
          status : 0,
          message : 'Invalid aadharNumber'
        });
      }
      // All Good. çheck duplicacy of Mobile, Email
      // Checking If Email isn't associated with any other account.
      User.findOne({
        'email' : email,
        '_id' : {
          $ne : req.user._id
        }
      }).then((doc) => {
          if(doc){
            return res.status(400).json({
              status : 0,
              message : `Entered email is already associated with an account`
            })
          } else {
            User.findOne({
              'mobile' : mobile,
              '_id' : {
                $ne : req.user._id
              }
            }).then((doc) => {
              if(doc){
                return res.sendStatus(400).json({
                  status : 0,
                  message : `Entered mobile is already associted with an account`
                })
              } else {
                User.findByIdAndUpdate(req.user._id, {
                  $set : {
                    username, email, aadharNumber,mobile
                  }
                }, (error, doc) => {
                  if(error){
                    return res.status(500).json({
                      status : 0,
                      message : `An error occured while updating the document`,
                      errorDetails : error
                    })
                  } else {
                    res.send({
                      status : 1,
                      message : 'Update successfull',
                      newDetails : doc
                    })
                  }
                })
              }
            })
          }
      })
  }
}
module.exports.changePassword = (req, res) => {
  console.log('in changepassword');
  if(typeof(req.body.oldPassword) === 'undefined' || typeof(req.body.newPassword) === 'undefined' || req.body.newPassword.length < 6){
    res.status(400).send({
      status : 0,
      message : 'Invalid request'
    }); 
  } else {
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    User.findById(req.user._id).then((doc) => {
      if(doc){
        bcrypt.compare(oldPassword, doc.password, (error, passwordMatched) => {
          if(error){
            res.status(400).json({
              status : 0,
              message : 'Password not matched',
              errorDetails : 'An error occured while processing your request',
              error
            });
          } else if(passwordMatched){
            let salt = bcrypt.genSalt(10, (error, salt) => {
              if(error){
                res.status(400).json({
                  status : 0,
                  message : 'An error occured while changing password',
                  errorDetails : 'An error occured while changing password',
                  error
                });
              } else {
                let hash = bcrypt.hashSync(newPassword, salt);
                User.findByIdAndUpdate(req.user._id, {
                  $set : {
                    password : hash
                  }
                }).then((passwordChanged) => {
                  if(passwordChanged){
                    res.status(200).json({
                      status : 1,
                      message : 'Password changed successfully',
                    });
                  }
                }).catch((error) => {
                  res.status(400).json({
                    status : 0,
                    message : 'An error occured while processing your request',
                    errorDetails : 'An error occured while processing your request',
                    error
                  });
                });
              }
            });
          }
        });
      }
    }).catch((error) => {
      res.status(404).json({
        status : 0,
        message : 'user not found',
        errorDetails : 'User not found',
        error
      });
    });
  }
}
module.exports.forgotPassword = (req, res) => {
  console.log(`In forgot password`);
  if(typeof(req.body.email) === 'undefined'){
    res.status(400).send({
      status : 0,
      message : 'Invalid Request'
    });
  } else {
    let resetEmail = req.body.email;
    User.findOne({email : resetEmail}).then((doc) => {
      if(!doc){
        res.status(400).send({
          status : 0,
          message : 'Entered email id doesn\'t exists'
        });
      } else {
        let emailSubject = `${Organization_name} account reset password`;
        let emailMessage = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `http://${req.headers.hostname}/resetPassword` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        
        nodemailer.createTestAccount((err, account) => {
          let transporter = nodemailer.createTransport(emailConfig);
          let mailOptions = {
            from : `"${adminName}"${adminEmailAddress}`,
            to : `${resetEmail}`,
            subject : emailSubject,
            html : emailMessage
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if(err)
              return console.log(`Error in sending reset mail : ${err}`);
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          });
        });
      }
    }).catch((err) => {
      res.status(500).send({
        status : 0,
        message : `Entered email doesn't exist`,
        errorDetails : err
      });
    });
  }
}
module.exports.resetPassword = (req, res) => {
  console.log('In reset password');

}
!function(){
  User.findOne({superAdmin : true}).then((doc) => {
    if(doc)
      return console.log(`Superadmin exists`);
    else {
      let user = new User();
        user.username = adminName;
        user.email = adminEmailAddress;
        user.password = user.hashPassword(123456);
        user.mobile = 9999999999;
        user.aadharNumber = 123456789012;
        user.userType = 'admin';
        user.superAdmin = true;
        user.save().then((superadmin) => {
        if(superadmin){
          console.log(`Superadmin created succesfully  ${superadmin}`);
        } 
      }).catch((err) => {
        console.log('Error in creating superadmin');
      });
    }
  }).catch((err) => {
    console.log(`Error in finding the superadmin ${err}`);
  });
}();