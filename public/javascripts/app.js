var baseUrl = '';
$(function () {
    let t = trimChar(window.location.pathname, '/').split('/').length;
    while (t--) baseUrl += '../';
    baseUrl = baseUrl.substring(1) + '';
    populate_links();
    if (typeof (pname) != "undefined") {
        switch (pname) {
            case 'new': init_newComplaint(); break;
            case 'home': load_all_complaints(); break;
            case 'profile': load_profile_data(); break
            case 'forgotPassword': init_forgotPass(); break;
            case 'resetPassword': init_resetPassword(); break;
            case 'login': init_loginPage(); break;
            case 'view': load_complaint(); init_frola_editor(); break;
            case 'stats': initStats(); break;
            case 'manageAdminUsers': initManageAdminUsers(); break;
            case 'relevantParaLinks': init_relevantParaLinks(); break;
        }
    }
    else {
        // Pagename not defined
    }

});
function loadAllComplaints(){
    $.ajax({
        url: '/allComplaints',
        type: 'GET',
        success: function (data) {
            if (data.status) {
                var m = data.data;
                if (isad) {
                    chead = '<tr><th scope="col">ID</th><th>Objection/ Suggestion</th><th>Type</th><th scope="col">Complainant</th><th scope="col">DateTime</th><th scope="col">DateTime</th><th scope="col">Status</th><th>View</th></tr>';
                    cfoot = '<tr><th scope="col">Complaint ID</th><th>Objection/ Suggestion</th><th>Type</th><th scope="col">Complainant</th><th scope="col">DateTime</th><th scope="col">DateTime</th><th scope="col">Status</th><th>View</th></tr>';
                    $('#cfoot').html(cfoot);
                }
                else {
                    chead = '<tr><th scope="col">#</th><th>Type</th><th scope="col">DateTime</th><th>DateTime-2</th><th scope="col">Status</th><th scope="col">View</th></tr>';
                    cfoot = '';
                }
                $('#chead').html(chead);
                cbody = '';
                for (var i = 0; i < m.length; i++) {
                    let t = m[i];
                    if (!isad) {
                        cbody += `<tr>
                                <td scope="row"> ${t.complaintNumber}</td>
                                <td scope="row"> ${t.complaintType} - ${t.objectionOrSuggestion}</td>
                                <td scope="row"> ${moment(t.postedOn).format("dddd, Do MMM YY, h:mm a")}</td>
                                <td scope="row"> ${t.postedOn}</td>
                                <td scope="row"> ${t.status}</td>
                                <td scope="row"> <a href="./view/${t.complaintNumber}">View</a></td>
                            </tr>`;
                    }
                    else {
                        cbody += `<tr>
                                <td scope="row"> ${t.complaintNumber}</td>
                                <td scope="row"> ${t.objectionOrSuggestion}</td>
                                <td scope="row"> ${t.complaintType} </td>
                                <td scope="row"> ${t.complainant.name} </td>
                                <td scope="row"> ${moment(t.postedOn).format("dddd, Do MMM YY, h:mm a")}</td>
                                <td scope="row"> ${t.postedOn}</td>
                                <td scope="row"> ${t.status}</td>
                                <td scope="row"> <a href="./view/${t.complaintNumber}">View</a></td>
                            </tr>`;
                    }
                }
                $('#cbody').html(cbody);
                if (!isad) {
                    $('#ctable').DataTable({
                        language: {
                            "emptyTable": 'You haven\'t posted any suggestion or objection yet.',
                            "infoEmpty": "No suggestions or objections to show",
                            "zeroRecords": "No matching suggestion or objection found",
                        },
                        columnDefs: [{
                            orderable: false,
                            targets: 5
                        },
                        {
                            orderData: [3],
                            targets: 2
                        },
                        {
                            visible: false,
                            targets: 3
                        }
                        ]
                    });
                    $('#ctable').removeClass('d-none');
                }
                else {
                    var ctable = $('#ctable').DataTable({
                        language: {
                            "emptyTable": "No suggestions or objections to show",
                            "infoEmpty": "No suggestions or objections to show",
                            "zeroRecords": "No matching suggestion or objection found"
                        },
                        columnDefs: [{
                            orderable: false,
                            targets: 7
                        }, {
                            orderData: [5],
                            targets: 4
                        }, {
                            visible: false,
                            targets: 5
                        }],
                        initComplete: function () {
                            this.api().columns().every(function () {
                                var column = this;
                                var select = $('<select><option value="">Showing All</option></select>')
                                    .appendTo($(column.footer()).empty())
                                    .on('change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );

                                        column
                                            .search(val ? '^' + val + '$' : '', true, false)
                                            .draw();
                                    });

                                column.data().unique().sort().each(function (d, j) {
                                    select.append('<option value="' + d + '">' + d + '</option>')
                                });
                            });
                        }
                    });
                    $('#cfoot>tr>th:nth-child(1),#cfoot>tr>th:nth-child(4),#cfoot>tr>th:nth-child(5),#cfoot>tr>th:nth-child(7)').html('')
                    $('#ctable').removeClass('d-none');
                }
            }
            else {
                show_error_swal(data.msg);
            }
        },
        error: (e) => {
            if (typeof e.responseJSON != "undefined")
                show_error_swal(e.responseJSON.msg);
            else
                show_error_swal('An error occured while communicating with server.\n\nTry refreshing the page.');
        }
    });
}

}