const express = require('express');
const request = require('request');
const User = require('../db/User');
const nodemailer = require('nodemailer');
const validateUserFields = require('./userFIeldsController');
// const { emailConfig, adminEmailAddress, adminName } = require('./../config/email');
const { Organization_name } = require('../config/organization');

module.exports.createUser = (req, res, next) => {
    validateUserFields.checkUserFields(req, res);
    var adminRegistration = false;
    var adminEmailAddress = `parveen.sahrawat1209@gmail.com`;
    if(req.originalUrl == '/signup/admin')
        adminRegistration = true;
    User.findOne({
        email : req.body.email
    }, (err, doc) => {
        if (err) {
            res.status(500).send('error occured')
        } else {
            if (doc) {
                res.status(500).send('Username already exists')
            } else {
                var record = new User()
                record.username = req.body.username;
                record.email = req.body.email;
                record.mobile = req.body.mobile;
                record.aadharNumber = req.body.aadharNumber;
                record.password = record.hashPassword(req.body.password);
                record.save().then(() => {
                            var emailSubject = 'Account Creation Successful.';
                            var emailMessage = `<p>Dear ${record.username},</p>
                                            <p>Your account on ${Organization_name} has successfully been created.</p><br>
                                            <small>In Case you haven't created this account. Kindly contact on ${adminEmailAddress}</small>`;
                        nodemailer.createTestAccount((error, account) => {
                          let transporter = nodemailer.createTransport({
                            host : 'smtp.gmail.com',
                            port : 587,
                            secure : false,
                            auth : {
                              user : 'parveen.sahrawat1209@gmail.com',
                              pass : 'helloeagle23'
                            }
                          });
                          let mailOptions = {
                            from : `"Parveen Sahrawat " ${adminEmailAddress}`,
                            to : `${req.body.email}`,
                            subject : emailSubject,
                            html : emailMessage
                          }
                          transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                // Ignore
                                console.log('Could not send user-registration email. Error',error);
                            }
                            console.log('Message sent : %s ', info.messageId);
                            console.log('Preview URL : %s ',nodemailer.getTestMessageUrl(info));
                            res.redirect('/login');
                        });                          
                    });  
                }).catch((e) => {
                  res.status(500).json({
                      msg: 'Sever error',
                      err: e
                  }); 
          });
        }
      }
    });
}


module.exports.generateOTP = (req, res, next) => {
    console.log(req.user);
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

      request(smsLink, (error, res, body) => {
        if(error){
          res.status(500).send({
            status : 0,
            message : `Error occured while sending OTP`,
            errorDetails : error
          });
        } else {
          var refNo = res.body.replace(/\s/g, '');
          console.log(refNo); 
          var query = User.findByIdAndUpdate(req.user._id, {
            $push : {
              OTP : {
                otp, validTill, refNo, mobile : req.user.mobile
              }
            }
          }).then((doc) => {
            res.send({
              status : 1,
              message : `OTP is sent to your mobile`,
              mobile : req.user.mobile
            }).catch((error) => {
              req.status(400).send({
                status : 0,
                message : `Error occured while sending OTP`,
                errorDetails : error
              });
            });
          });
        }
      });
      next();
  }
}
module.exports.checkOTP = (req, res) => {
  if(typeof(req.body.otp) !== 'undefined'){
    User.findById(
      {'_id' : req.user._id},
      {'OTP' :  {
          $elemMatch : {
            'otp' : req.body.otp,
            'validTill' : { $gte : new Date() }
          }
        }
    }).then((doc) => {
      if(doc){
        if(typeof(doc.OTP != 'undefined') && doc.OTP.lenth){
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
