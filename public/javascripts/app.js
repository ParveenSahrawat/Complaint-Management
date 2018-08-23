// import swal from 'sweetalert'

var baseUrl = 'http://localhost:3000';

function loadAllComplaints(){
    $.ajax({
        url : baseUrl + '/getComplaints',
        type : 'GET',
        datatype:'json',
        success : (complaints) => {
            //var comp= complaints.data
            //debugger;
            if(complaints){
                var trHTML = '';
                $.each(complaints.data, function (i, item) {
                    
                    trHTML += '<tr><td>' + complaints.data[i]._id + '</td><td>' + complaints.data[i].objectionOrSuggestion + 
                        '</td><td>' + complaints.data[i].complaintType +
                        '</td><td>' + complaints.data[i].postedOn + '</td><td>' + 
                        complaints.data[i].location + '</td><td>' + complaints.data[i].relevantParaClause + 
                        '</td><td>' + complaints.data[i].complaintDesc + '</td><td>' + 
                            complaints.data[i].status + '</td><td>' + '<a onclick="" href="http://localhost:3000/view/_id">View</a>' + '</td></tr>';
                });
            //$('#ctable').clear();
            // $('#ctable').removeClass(d-none);
            $('#ctable').append(trHTML);
            } else {

            }
        },
        error: function(err)
        {
            alert('FAILED');
        }
    });
}
function getComplaint(){
    $.ajax({
        url : baseUrl + '/view/' + _id,
        type : 'GET',
        datatype : 'json',
        success : (complaint) => {
            
        }
    });
}
function getProfileDetails(){
    $.ajax({
        url : baseUrl + '/getProfileDetails',
        type : 'GET',
        datatype : 'json',
        success: (profileDetails) => {
            if(profileDetails){
                var data = profileDetails;
                populateUserProfileFields(data);
            } else {
                alert('User details are not fetched');
            }
        }
    });
}
function populateUserProfileFields(data) {
    $('#username').val(data.username).attr('disabled', 'disabled');
    $('#mobile').val(data.mobile).attr('disabled', 'disabled');
    $('#email').val(data.email).attr('disabled', 'disabled');
    $('#aadharNumber').val(data.aadharNumber).attr('disabled', 'disabled');
}
function editProfileDetails(){
    $('.editProfileFields').removeAttr('disabled');
    $('.hide_on_edit').fadeOut(200, () => {
        $('#editProfileRow').removeClass('d-none');
    });
}
function saveUserProfile() {
        let username = $("#username").val();
        let email = $("#email").val();
        let mobile = $("#mobile").val();
        let aadharNumber = $("#aadharNumber").val();
        let err = [];
        if (!username.length)
            err.push('Userame can\'t be left empty');
        if (!validate_email(email))
            err.push('Please enter valid Email');
        if (!validate_mobile(mobile)) {
            err.push('Please Enter Valid Mobile Number');
        }
        if (validate_aadhar(aadharNumber)) {
            err.push('Please Enter Valid Aadhar number');
        }
        if (err.length) {
            swal({
                type: 'warning',
                html: err.join('<li>')
            })
        }
            // open_processing_ur_request_swal();
            $.ajax({
                url: baseUrl + '/profile',
                type: 'PATCH',
                data: {
                    username:username, email:email, mobile:mobile, aadharNumber:aadharNumber
                },
                datatype : 'json',
                success: (data) => {
                    if (data.status) {
                        savedDetails = {
                            username, email, mobile, aadharNumber
                        };
                        swal({
                            type: 'success',
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
                        swal({
                            text: e.responseJSON.message,
                            type: 'warning'
                        });
                    else
                        swal({
                            text: 'An error occured while communicating with server.\n\nTry refreshing the page.',
                            type: 'warning'
                        });
                }
            })
}
function closeEditProfile() {
        // swal({
        //     type: 'warning',
        //     text: "You have unsaved changes. On Clicking continue, your unsaved changes would be reverted.",
        //     showConfirmButton: true,
        //     showCancelButton: true,
        //     confirmButtonText: 'Continue',
        //     cancelButtonText: 'Cancel'
        // }).then(() => {
            populateUserProfileFields(savedDetails);
            show_hide_btns();
        // }, (dismiss) => {
        //     return;
        // });

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
            type: 'warning',
            text: 'Please Enter current Password'
        });
        return;
    }
    if (newPassword.length < 6) {
        swal({
            type: 'warning',
            text: 'New Password has to be of atleast 6 chars.'
        })
        return;
    }
    else if (newPassword != confirmPassword) {
        swal({
            type: 'warning',
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
                        type: 'success',
                        text: data.message
                    }).then(() => {
                        $('#changePassword button[data-dismiss="modal"]').click();
                    }, (dismiss) => {
                        $('#changePassword button[data-dismiss="modal"]').click();
                    })
                }
            },
            error: (e) => {
                if (typeof e.responseJSON != "undefined" && typeof e.responseJSON.message != "undefined")
                    swal(e.responseJSON.message);
                else
                    swal('An error occured while communicating with server.\n\nTry refreshing the page.')
            }
        })
    }
}
