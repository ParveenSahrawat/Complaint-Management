
<<<<<<< HEAD
// var baseUrl = 'https://complaint-management26.herokuapp.com';
var baseUrl = 'http://localhost:3000';
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
=======
var baseUrl = 'https://complaint-management26.herokuapp.com';
// var baseUrl = 'http://localhost:3000';

>>>>>>> d21a6175a9583ff9c1c300adcc8cea30bc6ab3a9
function loadAllComplaints() {
        $.ajax({
            url: baseUrl + '/getComplaints',
            type: 'GET',
            datatype: 'json',
            success: (complaints) => {
                //var comp= complaints.data
                //debugger;
                if (complaints) {
                    var trHTML = '';
                    $.each(complaints.data, function (i, item) {

                        trHTML += '<tr class="td-font"><td>' + complaints.data[i]._id + '</td><td>' + complaints.data[i].objectionOrSuggestion +
                            '</td><td>' + complaints.data[i].complaintType +
                            '</td><td>' + moment(complaints.data[i].postedOn).format("dddd, Do MMM YY, h:mm a") + '</td><td>' +
                            complaints.data[i].location + '</td><td>' + complaints.data[i].relevantParaClause +
                            '</td><td>' + complaints.data[i].complaintDesc + '</td><td>' +
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
    $.ajax({
        url: baseUrl + '/dashboardComplaints',
        type: 'GET',
        datatype: 'json',
        success: (complaints) => {
            //var comp= complaints.data
            //debugger;
            if (complaints.status) {
                var trHTML = '';
                $.each(complaints.data, function (i, item) {

                    trHTML += '<tr class="td-font"><td>' + complaints.data[i]._id + '</td><td>' + complaints.data[i].objectionOrSuggestion +
                        '</td><td>' + complaints.data[i].complaintType +
                        '</td><td>' + moment(complaints.data[i].postedOn).format("dddd, Do MMM YY, h:mm a") + '</td><td>' +
                        complaints.data[i].location + '</td><td>' + complaints.data[i].relevantParaClause +
                        '</td><td>' + complaints.data[i].complaintDesc + '</td><td>' +
                        complaints.data[i].status + '</td><td>' +
                        `<a href="${baseUrl}/view/${complaints.data[i]._id}">View</a>` + '</td></tr>';
                });
                //$('#ctable').clear();
                // $('#ctable').removeClass(d-none);
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
                 //flagForProfileDetails = Object.assign({} ,profileDetails);
                flagForProfileDetails = profileDetails;

                var data = profileDetails;
                populateUserProfileFields(data);
                // var user = $('#profile-user').text();
                // if(user === 'admin'){
                //     $('#goBack').attr('href').val = '/dashboard';
                // } else if(user === 'user'){
                //     $('#goBack').attr('href').val = '/allComplaints';
                // }
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
<<<<<<< HEAD
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
                if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.message != "undefined"){
                    alert(e.responseJSON.message);
                    /*swal({
                        text: e.responseJSON.message,
                        icon: 'warning'
                    });*/
                }
                else {
                    //var a=e.responseJSON.message
                    alert("Errr... Error!!"+a );
                    /*swal({
                        text: 'An error occured while saving.\n\nTry refreshing the page.',
                        icon: 'warning'
                    });*/
                }

            }
        })

}

function registerUser() {
    let username = $("#contact_username").val();
    let email = $("#contact_email").val();
    let mobile = $("#contact_mobile").val();
    let aadharNumber = $("#contact_aadharNumber").val();
    let password = $("#contact_password").val();
/*    let err = [];

    if (!username.length)
        err.push('Userame can\'t be left empty');
    if (!validate_email(email))
        err.push('Please enter valid Email');
    if (!validate_mobile(mobile)) {
        err.push('Please Enter Valid Mobile Number');
    }
    if (!validate_aadhar(aadharNumber)) {
        err.push('Please Enter Valid Aadhar number');
    }
    if (!password.length) {
        err.push('Password can\'t be left empty');
    }
    if (err.length) {
        swal("warning",{
            icon: 'warning',
            //content: "Problem"
            //html: err.join('<li>')
        })
    }*/

=======
    let username = $("#username").val();
    let email = $("#email").val();
    let mobile = $("#mobile").val();
    let aadharNumber = $("#aadharNumber").val();
    
>>>>>>> d21a6175a9583ff9c1c300adcc8cea30bc6ab3a9
    // open_processing_ur_request_swal();
    $.ajax({
        url: baseUrl + '/signup',
        type: 'POST',
        data: {
            username: username, email: email, mobile: mobile, aadharNumber: aadharNumber, password : password
        },
        datatype: 'json',
        success: (data) => {
            if (data.status) {
                savedDetails = {
                    username, email, mobile, aadharNumber,password
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
            if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.message != "undefined")
                swal(e.responseJSON.message,{
                    //text: e.responseJSON.message,
                    icon: 'warning'
                });
            else
                swal('An error occured while communicating with server.\n\nTry refreshing the page.',{
                    //text: 'An error occured while communicating with server.\n\nTry refreshing the page.',
                    icon: 'warning'
                });
        }
    })

}

function signInUser() {
    let email = $("#contact_email").val();
    let username = $("#contact_username").val();
    let password = $("#contact_password").val();
    if (!username.length)
        err.push('Userame can\'t be left empty');
    if (!validate_email(email))
        err.push('Please enter valid Email');
    if(!password.length)
        err.push('Password can\'t be left empty');

}

function closeEditProfile() {
<<<<<<< HEAD
    $("#aadharRow").removeClass("d-none");
    let username = $("#contact_username").val();
    let email = $("#contact_email").val();
    let mobile = $("#contact_mobile").val();

    let aadharNumber = parseInt($("#contact_aadharNumber").val());
    let mobileVerified = false;
     var data = {username,mobile, email,aadharNumber,mobileVerified};
    //console.log(data);
    //console.log(flagForProfileDetails);
    //console.log("heloo");

    //console.log(JSON.stringify(data) === JSON.stringify(flagForProfileDetails));

    if(JSON.stringify(data) === JSON.stringify(flagForProfileDetails)){
        $('.editProfileFields').attr('disabled');
        $('.hide_on_edit').fadeOut(200, () => {
            $('#editProfileRow').addClass('d-none');
        });
        console.log("done");
    }
      else
    {
        //Alert used here disappears in no time while using swal but does ok when using normal alert
        alert("You unsaved changes will be lost");
        /*swal("your unsaved changes would be reverted.", {
            buttons: {
                cancel: true,
                confirm: true,
            },
            closeOnClickOutside: false,
            timer: 3000,
        }).then(() => {
            populateUserProfileFields(savedDetails);
            show_hide_btns();
        }, (dismiss) => {
            return;
        });*/
    }



=======
    swal({
        icon: 'warning',
        text: "You have unsaved changes. On Clicking continue, your unsaved changes would be reverted.",
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
    });
>>>>>>> d21a6175a9583ff9c1c300adcc8cea30bc6ab3a9
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
<<<<<<< HEAD
=======
            icon : 'error',
            text : 'OldPassword and NewPassword shouldn\'t be same'
        });
        return;
    } else if (newPassword != confirmPassword) {
        swal({
>>>>>>> d21a6175a9583ff9c1c300adcc8cea30bc6ab3a9
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
                // if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.message != "undefined"){
                //     swal({
                //         icon : 'error',
                //         text : e.responseJSON.message
                //     });
                // } else 
                {
                    swal({
                        icon : 'error',
                        text : e.message
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
                    '<tr><td>' + 'Description' + '</td><td>' + complaint.complaintDesc + '</td></tr>' +
                    '<tr><td>' + 'Status' + '</td><td>' + complaint.status + '</td></tr>';
                $('#ctable').append(trHTML);
                if ($('#user').text() === 'admin')
                    $('#action_div').removeClass('d-none');
                $('#c_remarks_div').removeClass('d-none');
            }
        }
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
<<<<<<< HEAD
            icon : 'warning',
            text : 'Please enter email id'
=======
            icon : 'error',
            text : 'New Password and Confirm Password don\'t match'
>>>>>>> d21a6175a9583ff9c1c300adcc8cea30bc6ab3a9
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
<<<<<<< HEAD
                        text : 'Password reset successfull'
=======
                        text : 'Your Password is successfully changed'
                    });
                } else { 
                    swal({
                        icon : 'error',
                        text : 'Password change failed'
>>>>>>> d21a6175a9583ff9c1c300adcc8cea30bc6ab3a9
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
    $.ajax({
        type : 'GET',
        url : baseUrl + '/sendOTP',
        success : (data) => {
            console.log(data);
          if(data.status){
              $('#mobile-number').val(data.mobile);
              swal({
                  text : data.message,
                  type : 'success'
              });
          }  
        },
        error : (e) => {
            swal({
                text : e.message,
                type : 'warning'
            });
        }
    });
}
function verifyOTP(){
    if($('#otp').val().length!=4){
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
                        window.location.href = './complaints'
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
<<<<<<< HEAD


function validateOnClick(names,formdata) {
    console.log(names);
    console.log("abcdefghijklmnop");
    console.log(formdata);
    for (var input in formdata){
        //console.log(form_data[input]['name']);
        var element=$("#contact_"+formdata[input]['name']);
        //console.log(element);
        var valid=element.hasClass("valid");
        var error_element=$("span", element.parent());
        if (!valid){error_element.removeClass("error").addClass("error_show"); error_free=false;}
        else{error_element.removeClass("error_show").addClass("error");}
    }
    if (!error_free){
        //event.preventDefault();
        console.log("Submitted");
    }
    else{
        alert('No errors: Form will be submitted');
    }
}

function isTagEmpty(name) {
    //validateOnFocus(name);
    console.log(name.id);
    var input=$(name);
    var is_name=input.val();
    var id = '#'+ name.id;
    //console.log(id);

        $(id).on("keydown", function (e) {
            //console.log(e.keyCode);
            validateForm(this,e);
            console.log("a");
        });


    if(is_name){input.removeClass("invalid").addClass("valid");}
    else{input.removeClass("valid").addClass("invalid");
    }


    /*var input=$(this);
    console.log(input);
    var re = /^[6-9]{1}[0-9]{9}$/;
    var is_number=re.test(input.val());*/

/*    var input=$(this);
  //  var re = /^[0-9]{1}[0-9]{11}$/;
    var is_number=re.test(input.val());*/

};

/*
function  validateForm(name) {
    var input = $(name);
    console.log(input);
    var re = /^[6-9]{1}[0-9]{9}$/;
    var is_number = re.test(input.val());
    if (is_number) {
        input.removeClass("invalid").addClass("valid");
    }
    else {
        input.removeClass("valid").addClass("invalid");
        //console.log(name);
    }
};*/
=======
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
>>>>>>> d21a6175a9583ff9c1c300adcc8cea30bc6ab3a9
