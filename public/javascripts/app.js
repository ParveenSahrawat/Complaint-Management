// import swal from 'sweetalert'

var baseUrl = 'https://complaint-management26.herokuapp.com/login';
// var baseUrl = 'http://localhost:3000'

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
            if (complaints) {
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

            }
        },
        error: function (err) {
            alert('FAILED in getting data');
        }
    });
}
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
    $('#username').val(data.username).attr('disabled', 'disabled');
    $('#mobile').val(data.mobile).attr('disabled', 'disabled');
    $('#email').val(data.email).attr('disabled', 'disabled');
    $('#aadharNumber').val(data.aadharNumber).attr('disabled', 'disabled');
}
function editProfileDetails() {
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
            username: username, email: email, mobile: mobile, aadharNumber: aadharNumber
        },
        datatype: 'json',
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
    swal({
        type: 'warning',
        text: "You have unsaved changes. On Clicking continue, your unsaved changes would be reverted.",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel'
    }).then(() => {
        populateUserProfileFields(savedDetails);
        show_hide_btns();
    }, (dismiss) => {
        return;
    });

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
                    '<tr><td>' + 'Relevant Paraclause' + '</td><td>' + complaint.relevantParaClause + '</td></tr>'
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
            })
        }
    }
}