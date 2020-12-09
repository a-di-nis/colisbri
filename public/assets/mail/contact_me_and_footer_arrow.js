//FORM VALIDATION
var nameRegex = /^[a-zA-Z ]+$/;
var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function validate() {
    if( document.getElementById("name").value == "" || nameRegex.test(document.getElementById("name").value) == false) {
        document.getElementById("name-error").style.height = "25px";
        // document.getElementById("name-error").style.visibility="visible";
        document.getElementById("name").focus() ;
        return false;
    }
    if( document.getElementById("surname").value == "" || nameRegex.test(document.getElementById("surname").value) == false) {
        document.getElementById("surname-error").style.height = "25px";
        document.getElementById("surname").focus() ;
        return false;
    }
    if( document.getElementById("email").value == "" ) {
        document.getElementById("email-error").style.height = "25px";
        document.getElementById("email").focus() ;
        return false;
    }

    // var emailID = document.getElementById("email").value;
    // atpos = emailID.indexOf("@");
    // dotpos = emailID.lastIndexOf(".");
    
    if (emailRegex.test(document.getElementById("email").value) == false) {
        document.getElementById("email-error").style.height = "25px";
        document.getElementById("email-error").innerHTML = "Veuillez entrer une bonne adresse email";
        document.getElementById("email").focus();
        return false;
    }
    document.getElementById("name-error").style.height = "0";
    document.getElementById("surname-error").style.height = "0";
    document.getElementById("email-error").style.height = "0";
    return true;
}

document.querySelector("#contactForm").addEventListener("submit", function(e) {
    e.preventDefault(); //stop form from submitting
    
    if (validate()) {
        jQuery.post("/form-data",
            {
                name: document.getElementById("name").value,
                surname: document.getElementById("surname").value,
                email: document.getElementById("email").value,
                company: document.getElementById("company").value
            },
            function(data) {
                // console.log(data);
                if (data.status == true)
                {
                    console.log("Working");
                    document.getElementById("success-message").style.height = "4rem";
                    document.getElementById("success-message").style.padding = "0.5 0";
                    document.getElementById("success-message").innerHTML = "Merci pour votre soutien !";
                    document.getElementById("error-message").style.height = "0";
                    jQuery("#contactForm")[0].reset();
                }
                else
                {
                    console.log("Error");
                    document.getElementById("error-message").style.height = "4rem";
                    document.getElementById("error-message").style.padding = "0.5 0";
                    document.getElementById("error-message").innerHTML = "Oops !";
                    document.getElementById("success-message").style.height = "0";
                }
            }
        );
    }
});
document.getElementById("error-message").style.height = "0";
document.getElementById("success-message").style.height = "0";
document.getElementById("error-message").style.padding = "0";
document.getElementById("success-message").style.padding = "0";

function hideElem() {
    document.getElementById("name-error").style.height = "0";
    document.getElementById("surname-error").style.height = "0";
    document.getElementById("email-error").style.height = "0";
}
