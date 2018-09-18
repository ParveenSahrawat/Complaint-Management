function validate_mobile(a)
{
	var mob_regex=/^[6-9]{1}[0-9]{9}$/;
	if(!(mob_regex.test(a)))
		return false;
	return true;
}

function validate_email(a)
{
    var email_regex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(!(email_regex.test(a)))
		return false;
	return true;
}
function validate_phone(phone_num) {
	var phone = /^[0-9]{8,12}$/;
	if (!(phone.test(phone_num))) {
		return false;
	} else
		return true;
}

function validate_aadhar(number) {
    // var aadhar_regex = /^[0-9]{12}$/;
    var aadhar_regex = /^\d{4}\s\d{4}\s\d{4}$/;
    var aadhar_regex = /^\d{12}$/;
    return !(aadhar_regex.test(number));
}

function validate_Name(name) {
    console.log("Its mine" + name);
	//var input=$(this);
    /*var is_name=input.val();
    if(is_name){input.removeClass("invalid").addClass("valid");}
    else{input.removeClass("valid").addClass("invalid");}*/
}

function  validateForm(name,e) {
	//console.log("hh");
	//console.log(e.keyCode);
	//console.log(name);
	var id = name.id;
    var input = $(name);
    //console.log(input);
    if(name.id=="contact_username"){
    	validate_Name(name);
	}
    else if(name.id=="contact_email"){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var is_email=re.test(input.val());
        if(is_email){input.removeClass("invalid").addClass("valid");}
        else{input.removeClass("valid").addClass("invalid");}
	}
    else if(name.id=="contact_aadharNumber"){
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
            // Allow: Ctrl/cmd+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+C
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+X
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }

        var re = /^[0-9]{1}[0-9]{11}$/;
        var is_number=re.test(input.val());

        if(is_number){input.removeClass("invalid").addClass("valid");}
        else{input.removeClass("valid").addClass("invalid");

	    }
    }
    else if(name.id=="contact_mobile"){

        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
            // Allow: Ctrl/cmd+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+C
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+X
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
        var re = /^[6-9]{1}[0-9]{9}$/;
        var is_number = re.test(input.val());
        if (is_number) {
        input.removeClass("invalid").addClass("valid");
        }
        else {
            input.removeClass("valid").addClass("invalid");
            //console.log(name);
		 }

    }
    else if(name.id=="contact_password"){

    }
};