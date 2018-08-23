function validate_mobile(a)
{
	var mob_regex=/^[7-9]{1}[0-9]{9}$/;
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