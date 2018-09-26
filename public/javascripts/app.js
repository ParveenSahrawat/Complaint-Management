
const baseUrl = 'http://localhost:3000';
//IIFE Created For Form Validation
(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
            ['submit', 'click'].forEach(function(e) {
               form.addEventListener(e, function(event) {
                   if (form.checkValidity() === false) {
                       event.preventDefault();
                       event.stopPropagation();
                   }
                   form.classList.add('was-validated');
               }, false);
            });
            /*form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);*/
        });
    }, false);
})();

function loadAllComplaints() {
        $.ajax({
            url: baseUrl + '/getComplaints',
            type: 'GET',
            datatype: 'json',
            success: (complaints) => {
                if (complaints) {
                    var trHTML = '';
                    $.each(complaints.data, function (i, item) {

                        trHTML += '<tr class="td-font"><td>' + complaints.data[i]._id + '</td><td>' + complaints.data[i].objectionOrSuggestion +
                            '</td><td>' + complaints.data[i].complaintType +
                            '</td><td>' + moment(complaints.data[i].postedOn).format("dddd, Do MMM YY, h:mm a") + '</td><td>' +
                            complaints.data[i].location + '</td><td>' + complaints.data[i].relevantParaClause + '</td><td>' +
                            complaints.data[i].status + '</td><td>' + `<a href="${baseUrl}/view/${complaints.data[i]._id}">View</a>` + '</td></tr>';
                    });
                    //$('#ctable').clear();
                    // $('#ctable').removeClass(d-none);
                    $('#ctable').append(trHTML);

                } else {
                    
                }
            },
            error: function (err) {
                alert('FAILED');
            }
        });
}
function loadAllComplaintsForAdmin() {
    if($('#adminCheck').text() === 'true')
        $('#addAdmin').removeClass('d-none');
    $.ajax({
        url: baseUrl + '/dashboardComplaints',
        type: 'GET',
        datatype: 'json',
        success: (complaints) => {
            if (complaints.status) {
                var trHTML = '';
                $.each(complaints.data, function (i, item) {

                    trHTML += '<tr class="td-font"><td>' + complaints.data[i]._id + '</td><td>' + complaints.data[i].objectionOrSuggestion +
                        '</td><td>' + complaints.data[i].complaintType +
                        '</td><td>' + moment(complaints.data[i].postedOn).format("dddd, Do MMM YY, h:mm a") + '</td><td>' +
                        complaints.data[i].location + '</td><td>' + complaints.data[i].relevantParaClause + '</td><td>' +
                        complaints.data[i].status + '</td><td>' +
                        `<a href="${baseUrl}/view/${complaints.data[i]._id}">View</a>` + '</td></tr>';
                });
                $('#ctable').append(trHTML);
            } else {
                swal({
                    icon : 'error',
                    text : 'Error in loading complaints'
                })
            }
        },
        error: function (err) {
            swal({
                icon : 'error',
                text : err,message
            })
        }
    });
}
var flagForProfileDetails;
function loadAnalytics() {
    $.ajax({
        url: baseUrl + '/getAllComplaints',
        type: 'GET',
        dataType: 'json',
        success: (complaints) => {
            console.log(complaints);
            var ctxBar = document.getElementById("myChart").getContext('2d');
            var ctxPie = document.getElementById("myPieChart")
            var ctxLine = document.getElementById("myLineChart");
            console.log(complaints.results);
            // var comp = $.map(complaints.results, (value, key) => {
            //     return { [key] : value};
            // });
            var comp = Object.keys(complaints.results.counts).map(function (key) {
                return { [key]: complaints.results.counts[key] };
            });
            var getSum = (total, currentElement) => total + valueOf(currentElement);
            // var totalComplaints = Object.values(comp).reduce((total, current) => total + current.value, 0);
            var totalComplaints = 0;
            for (var i = 0; i < complaints.results.statusCount.length; i++) {
                totalComplaints += complaints.results.statusCount[i];
            }
            console.log(comp);
            var myChart = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: ["Land Use Proposals", "Zoning Acquisition", "Infrastructure Provisions", "Demographic & Population Projections", "Environment Related", "MCA/Control Area/Village Boundary", "Traffic & Transportation", "Others"],
                    datasets: [{
                        label: `${totalComplaints} of Complaints`,
                        data: [
                            comp[7]['Land Use Proposals'],
                            comp[0]['Zoning Acquisition'],
                            comp[4]['Infrastructure Provisions'],
                            comp[3]['Demographic & Population Projections'],
                            comp[5]['Environment Related'],
                            comp[1]['MCA/Control Area/Village Boundary'],
                            comp[2]['Traffic & Transportation'],
                            comp[6]['Others']
                        ],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 120, 98, 0.2)',
                            'rgba(255, 140, 150, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(75, 192, 192, 0.2)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    responsive: true,
                }
            });
            var myPieChart = new Chart(ctxPie, {
                type: 'pie',
                data: {
                    labels: ['Pending', 'Replied'],
                    datasets: [{
                        data: [complaints.results.statusCount[0], complaints.results.statusCount[1]]
                    }],
                    backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(173, 255, 47, 0.6)']
                },
                options: {
                    cutoutPercentage: 0,
                    rotation: -0.5 * Math.PI,
                    circumference: 2 * Math.PI,
                    responsive: true
                },
            });
            var myLineChart = new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        data: [
                            complaints.results.monthArray[0],
                            complaints.results.monthArray[1],
                            complaints.results.monthArray[2],
                            complaints.results.monthArray[3],
                            complaints.results.monthArray[4],
                            complaints.results.monthArray[5],
                            complaints.results.monthArray[6],
                            complaints.results.monthArray[7],
                            complaints.results.monthArray[8],
                            complaints.results.monthArray[9],
                            complaints.results.monthArray[10],
                            complaints.results.monthArray[11]
                        ],
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        lineTension: 0.1

                    }]
                },
                options: {
                    showLine: true,
                    spanGaps: true,
                    responsive: true
                }
            });
        },
    });
}
function getProfileDetails() {
    $.ajax({
        url: baseUrl + '/getProfileDetails',
        type: 'GET',
        datatype: 'json',
        success: (profileDetails) => {
            if (profileDetails) {
                flagForProfileDetails = profileDetails;
                delete flagForProfileDetails.mobileVerified;
                var data = profileDetails;
                populateUserProfileFields(data);

            } else {
                alert('User details are not fetched');
            }
        }
    });
}
function populateUserProfileFields(data) {
    $('#contact_username').val(data.username).attr('disabled', 'disabled');
    $('#contact_mobile').val(data.mobile).attr('disabled', 'disabled');
    $('#contact_email').val(data.email).attr('disabled', 'disabled');
    $('#contact_aadharNumber').val(data.aadharNumber).attr('disabled', 'disabled');
}
function editProfileDetails() {
    $('.editProfileFields').removeAttr('disabled');
    $('#aadharRow').addClass('d-none');
    $('.hide_on_edit').fadeOut(200, () => {
        $('#editProfileRow').removeClass('d-none');
    });
}
function saveUserProfile() {
    let username = $("#contact_username").val();
    let email = $("#contact_email").val();
    let mobile = $("#contact_mobile").val();
    let aadharNumber = $("#contact_aadharNumber").val();

        // open_processing_ur_request_swal();
        $.ajax({
            url: baseUrl + '/profile',
            type: 'PATCH',
            data: {
                username: username, email: email, mobile: mobile, aadharNumber: aadharNumber
            },
            datatype: 'json',
            success: (data) => {
                if (data.status) {
                    savedDetails = {
                        username, email, mobile, aadharNumber
                    };
                    swal({
                        icon: 'success',
                        text: data.message,
                        timer: 3000
                    }).then(() => {
                        closeEditProfile();
                    }, (dismiss) => {
                        closeEditProfile();
                    })
                }
            },
            error: (e) => {
                if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.message != "undefined") {
                    swal({
                        text: e.responseJSON.message,
                        type: 'warning'
                    });
                }
                else {
                    swal({
                        text: 'An error occured while communicating with server.\n\nTry refreshing the page.',
                        type: 'warning'
                    });
                }
            }
        })

}
function registerUser() {
    let username = $("#contact_username").val();
    let middleName = $("#contact_middlename").val();
    let lastName = $("#contact_lastname").val();
    let email = $("#contact_email").val();
    let mobile = $("#contact_mobile").val();
    let aadharNumber = $("#contact_aadharNumber").val();
    let password = $("#contact_password").val();

    $.ajax({
        url: baseUrl + '/auth/signup',
        type: 'POST',
        data: {
            username: username, middleName : middleName, lastName : lastName,
            email: email, mobile: mobile, aadharNumber: aadharNumber, password : password
        },
        datatype: 'json',
        success: (data) => {
            if (data.status) {
                swal({
                    icon : 'success',
                    text : data.message
                }).then(() => {
                    window.location.href = './login'
                });
            } else {
                swal({
                    icon : 'error',
                    text : data.message
                });
            }
        },
        error: (e) => {
            if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.message != "undefined")
                swal(e.responseJSON.message,{
                    text: e.responseJSON.message,
                    icon: 'warning'
                });
            else
                swal({
                    text: 'An error occured while communicating with server.\n\nTry refreshing the page.',
                    icon: 'warning'
                });
        }
    })

}
function signInUser() {
    let email = $("#contact_email").val();
    let password = $("#contact_password").val();
    $.ajax({
        url : baseUrl + '/auth/login',
        type : 'POST',
        data : { email : email, password : password },
        datatype : 'json',
        success : (data) => {
            console.log(data);
            if(error) {
                swal({
                    icon : 'error',
                    text : 'Please enter valid email and password'
                });
            }
        }
    });
}
function closeEditProfile() {
    $("#aadharRow").removeClass("d-none");
    let username = $("#contact_username").val();
    let email = $("#contact_email").val();
    let mobile = $("#contact_mobile").val();

    let aadharNumber = parseInt($("#contact_aadharNumber").val());
     var data = {username,mobile, email,aadharNumber};
    if(JSON.stringify(data) === JSON.stringify(flagForProfileDetails)){
        $('.editProfileFields').attr('disabled');
        $('.hide_on_edit').fadeOut(200, () => {
            $('#editProfileRow').addClass('d-none');
        });
        //console.log("done");
    }
      else
    {
        //Alert used here disappears in no time while using swal but does ok when using normal alert
        alert("You unsaved changes will be lost");
        /*swal({
            text: 'You have unsaved changes. On Clicking continue, your unsaved changes would be reverted.',
            type: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Continue',
            cancelButtonText: 'Cancel'
        }).then(() => {
            populateUserProfileFields(savedDetails);
            $('#aadharRow').removeClass('d-none');
            show_hide_btns();
        }, (dismiss) => {
            return;
        });*/
    }

    function show_hide_btns() {
        $('.editProfileFields').attr('disabled', 'disabled');
        $('.hide_on_edit').fadeIn();
        $('#editProfileRow').addClass('d-none');
    }
}
function saveNewPassword() {
    var oldPassword = $("#oldPassword").val();
    var newPassword = $("#newPassword").val();
    var confirmPassword = $("#confirmPassword").val();

    if (!oldPassword.length) {
        swal({
            icon: 'warning',
            text: 'Please Enter current Password'
        });
        return;
    }
    if (newPassword.length < 6) {
        swal({
            icon: 'warning',
            text: 'New Password has to be of atleast 6 chars.'
        });
        return;
    } else if(oldPassword === newPassword){
        swal({
            icon : 'error',
            text : 'OldPassword and NewPassword shouldn\'t be same'
        });
        return;
    } else if (newPassword != confirmPassword) {
        swal({
            icon: 'warning',
            text: 'New Password and Confirm Password do not match'
        });
        return;
    }
    else {
        // open_processing_ur_request_swal();
        $.ajax({
            type: 'PATCH',
            url: baseUrl + '/changePassword',
            data: {
                newPassword,
                oldPassword
            },
            success: (data) => {
                if (data.status) {
                    swal({
                        icon: 'success',
                        text: data.message
                    }).then(() => {
                        $('#changePassword button[data-dismiss="modal"]').click();
                    }, (dismiss) => {
                        $('#changePassword button[data-dismiss="modal"]').click();
                    })
                }
            },
            error: (e) => {
                 if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.message != "undefined"){
                     swal({
                         icon : 'error',
                         text : e.responseJSON.message
                     });
                 }
                 else
                {
                    if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.message != "undefined")
                        swal(e.responseJSON.message);
                    else
                        swal('An error occured while communicating with server.\n\nTry refreshing the page.',{
                            type: warning,
                        })
                }        
            }
        })
    }
}
function getComplaint() {
    let params = (new URL(document.location)).searchParams;
    console.log(params);
    let id = params.get('_id');
    $.ajax({
        url: baseUrl + '/complaint/' + $("#uid").text(),
        type: 'GET',
        datatype: 'json',
        success: (complaint) => {
            if (complaint) {
                let trHTML = '';
                console.log(complaint);
                if (complaint.status === 'Registered') {
                    $('#registered').addClass('active');
                    $('ul li:first-child:after').animate({width : '100%'}, 'slow');
                } else if (complaint.status === 'Under Consideration') {
                    $('#registered').addClass('active');
                    $('#under-consideration').addClass('active');
                } else if (complaint.status === 'Replied') {
                    $('#registered').addClass('active');
                    $('#under-consideration').addClass('active');
                    $('#replied').addClass('active');
                }
                trHTML += '<tr><td>' + 'Id' + '</td><td>' + complaint._id + '</td></tr>' +
                    '<tr><td>' + 'Name' + '</td><td>' + complaint.objectionOrSuggestion + '</td></tr>' +
                    '<tr><td>' + 'Type' + '</td><td>' + complaint.complaintType + '</td></tr>' +
                    '<tr><td>' + 'Date' + '</td><td>' + moment(complaint.postedOn).format("dddd, Do MMM YY, h:mm a") + '</td></tr>' +
                    '<tr><td>' + 'Location' + '</td><td>' + complaint.location + '</td></tr>' +
                    '<tr><td>' + 'Relevant Paraclause' + '</td><td>' + complaint.relevantParaClause + '</td></tr>'+
                    '<tr><td>' + 'Status' + '</td><td>' + complaint.status + '</td></tr>';
                $('#ctable').append(trHTML);
                if ($('#user').text() === 'admin')
                    $('#action_div').removeClass('d-none');
            }
        }
    });
}
function registerComplaint(){
    var objectionOrSuggestion = $('#objectionOrSuggestion').val();
    var complaintType = $('#complaintType').val();
    var location = $('#location').val();
    var relevantParaClause = $('#relevantParaClause').val();
    var complaintDesc = $('#complaintDesc').val();
    $.ajax({
        url : baseUrl + '/newComplaint',
        type : 'POST',
        data : { objectionOrSuggestion : objectionOrSuggestion, complaintType : complaintType,
                location : location, relevantParaClause : relevantParaClause, complaintDesc : complaintDesc },
        datatype : 'json',              
        success : (data) => {
            if(data.status){
                swal({
                    icon : 'success',
                    text : `Your ${objectionOrSuggestion} is successfully registered`
                });
            } else {
                swal({
                    icon : 'error',
                    text : data.message
                });
            }
        }, 
        error : ((err) => {
                if (typeof err.responseJSON != "undefined" && typeof err.responseJSON.message != "undefined")
                    swal({
                        icon : 'error',
                        text : err.responseJSON.message
                    });
                else
                    swal({
                        icon : 'error',
                        text : 'An error occured while communicating with server.'});
        })
    });
}
function changeStatus() {
    let newStatus = $('#c_new_status').val();
    if (!newStatus) {
        swal('Please select an option')
        return;
    }
    else {
        if ($('#c_new_status').val() == "Replied" && !$('#c_remarks').val().trim()) {
            swal('Please Enter Reply comment.');
            return;
        }
        else {
            var remarks = $('#c_remarks').val();
            // open_processing_ur_request_swal();
            $.ajax({
                type: 'POST',
                url: baseUrl + '/complaints/updateStatus/' + $("#uid").text(),
                data: { newStatus, remarks },
                success: (data) => {
                    if (data) {
                        swal('Status Updated Successfully');
                        // window.location.href = window.location.href;
                    }
                },
                error: (e) => {
                    if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.message != "undefined")
                        swal(e.responseJSON.message);
                    else
                        swal('An error occured while communicating with server.');
                }
            });
        }
    }
}
function setPassword(){
    let newPass = $('#reset-password').val();
    let confirmPass = $('#confirm-password').val();
    if(!newPass.length)
        return;
    else if(!confirmPass.length)
        return;    
    else if(newPass !== confirmPass){
        swal({
            icon : 'error',
            text : 'New Password and Confirm Password don\'t match'
        });
        return;
    } else {
        let currentUrl = window.location.href;
        console.log(currentUrl);
        let token = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
        console.log(token);
        $.ajax({
            url : baseUrl + `/resetPassword/${token}`,
            type : 'PATCH',
            data : {newPass, confirmPass},
            datatype : 'json',
            success : (data) => {
                if(data.status){
                    swal({
                        icon : 'success',
                        text : 'Your Password is successfully changed'
                    }).then(() => {
                        window.location.href = '../login'
                    })
                } else { 
                    swal({
                        icon : 'error',
                        text : 'Password change failed'
                    });
                }
            },
            error: (e) => {
                if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.message != "undefined")
                    swal({
                        icon : 'error',
                        text : e.responseJSON.message
                    });
                else
                    swal({
                        icon : 'error',
                        text : 'An error occured while communicating with server.'});   
            }
        });
    }
}   
function sendOTP(){
    var timer = document.getElementById('timer');
    var time = 0;
    if($('#mobileverified').text() === true)
        return;
    $.ajax({
        type : 'GET',
        url : baseUrl + '/sendOTP',
        success : (data) => {
            console.log(data);
          if(data.status){
              $('#mobile-number').val(data.mobile);
              swal({
                  text : data.message,
                  icon : 'success'
              }).then(() => {
                var resendOtpInterval = setInterval(() => {
                    timer.innerHTML = time;
                    time++;
                    if(time > 59){
                        clearInterval(resendOtpInterval);
                        time = 0;
                        timer.innerHTML = '';
                        timer.classList.add('d-none');
                        document.getElementById('resendOtpCode').classList.remove('d-none')
                    }    
                }, 1000);
              });
          }  
        },
        error : (e) => {
            swal({
                text : e.message,
                icon : 'warning'
            });
        }
    });
}
function verifyOTP(){
    if($('#otp').val() === ''){
        swal({
            icon : 'warning',
            text : 'Enter Valid OTP'
        })
        return;
    }
    else{
        var otp = $('#OTP').val();
        $.ajax({
            url: baseUrl + '/otp',
            type : 'POST',
            data  : {otp},
            success : (data) => {
                if(data.status){
                    console.log(data.status)
                    swal({
                        icon  : 'success',
                        text : data.message
                    }).then(() => {
                        if($('#usertype').text() === 'user')
                            window.location.href = './complaints'
                        else {
                            window.location.href = './dashboard'
                        }    
                    });
            }
                else{
                    swal({
                        text: data.message,
                        icon: 'warning'
                    });
                }
            },
            error : (e)=>{
                if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.message != "undefined")
                    swal({
                        text: e.responseJSON.message,
                        icon: 'warning'
                    });
                else
                    swal({
                        text: 'An error occured while communicating with server.\n\nTry refreshing the page.',
                        icon: 'warning'
                    });            
            }
        })
    }
}
function emailVerification(){
    let currentUrl = window.location.href;
    let emailToken = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
    $.ajax({
        url : baseUrl + `/verification/${emailToken}`,
        type : 'POST',
        data : {},
        success : (emailVerificationData) => {
            if(emailVerificationData.status){
                let loginlink = $('#loginLink');
                let anchorTag = `<a href="${baseUrl}/login">Please Login</a>`
                loginlink.append(anchorTag);
                $('#emailVerified').removeClass('d-none');
            } else {
                $('#emailNotVerified').removeClass('d-none');
            }
        },
        error : (err) => {
            if (typeof err.responseJSON != "undefined" && typeof err.responseJSON.message != "undefined")
                swal({
                    text: err.responseJSON.message,
                    icon: 'warning'
                });
            else
                swal({
                    text: 'An error occured while communicating with server.',
                    icon: 'warning'
                });    
        }
    });
}
function relevantParaClauseLinks(){
    let paraClauseLink = $('#paralinkUrl').val();
    console.log(paraClauseLink);
    if(paraClauseLink !== ''){
        $.ajax({
            url : baseUrl + '/paraclauselinks',
            type : 'POST',
            data : { paraClauseLink : paraClauseLink },
            datatype : 'json',
            success : (data) => {
                if(data.status){
                    // if($('#usertype').text() === 'admin')
                        let linkListItem = `<li><a href='${paraClauseLink}' target='_blank'>${paraClauseLink}</a><button id='${paraClauseLink}' onclick='removeParaClauseLink()'>Remove</button></li>`;
                    // else 
                    //     let linkListItem = `<li><a href='${paraClauseLink}' target='_blank'>${paraClauseLink}</a></li>`;
                    $('#paralinksList').append(linkListItem);
                    $('#paralinkUrl').val() = '';
                } else {
                    swal({
                        icon : 'error',
                        text : 'An error occured in adding paralink'
                    });
                }
            },
            error : (err) => {
                if (typeof err.responseJSON != "undefined" && typeof err.responseJSON.message != "undefined")
                    swal({
                        text: err.responseJSON.message,
                        icon: 'warning'
                    });
                else
                    swal({
                        text: 'An error occured while communicating with server.',
                        icon: 'warning'
                    });  
            }
        });
    } else {
        $('#addParalink').attr('disabled');
    }
}
function getParaClauseLinks(){
    $.ajax({
        url : baseUrl + '/paralinks',
        type : 'GET',
        success : (links) => {
            if(links.status){
                var listItems = '';
                // if($('#usertype' === 'admin')){
                //     $.each(links.data, (i, link) => {
                //         listItems += `<li><a href='${links.data[i].paraClauseLink}'>${links.data[i].paraClauseLink}</a><button onclick='removeParaClauseLink()'>Remove</button></li>`
                //     });
                // }else {
                    $.each(links.data, (i, link) => {
                        listItems += `<li><a href='${links.data[i].paraClauseLink}'>${links.data[i].paraClauseLink}</a></li>`
                    // });
                })
                $('#paralinksList').append(listItems);
            }
            else {
                swal({
                    icon : 'error',
                    text : 'links.message'     
                });
            }
        }
    });
}
function closeAddingLink(){
    swal({
        icon : 'warning',
        text : 'Are you sure, you don\'t want to add links',
        buttons : true
    }).then(() => {
        window.location.href = './dashboard'
    });
}
function removeParaClauseLink(){

}
