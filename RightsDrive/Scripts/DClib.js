/* 
DK Center Script Library
*/

// HELPER FUNCTIONS
function parseNum(value) {

    var tryParse = parseFloat(value);

    if (isNaN(tryParse))
        return 0
    else
        return tryParse;
}
function getAccessTokenFromStorage() {
    var tKey = "accessToken";
    return localStorage.getItem(tKey);
}


// GLOBAL VARIABLES
var client_id_val = "099153c2625149bc8ecb3e85e03f0022";

// DEV START
var DCWebServiceURL = "https://localhost:44347"; // "http://localhost:62493";
//var DCWebServiceURL = "https://api.dropcap.com";



// WEB SERVICE FUNCTIONS
function DKAjax(args) {
    var ajaxRequest;

    if (args.async == undefined
        || args.async == "") {
        args.async = true;
    }
    if (args.htmlMethod == undefined
        || args.contentType == "") {
        args.htmlMethod = "POST";
    }
    if (args.contentType == undefined
        || args.contentType == "") {
        args.contentType = "application/json; charset=utf-8";
    }
    if (args.headers == undefined
        || args.headers == "") {
        args.headers = {};
    }

    //-- Send Ajax --
    ajaxRequest = $.ajax({
        type: args.htmlMethod,
        headers: args.headers,
        url: args.ajaxUrl,
        data: args.pushData,
        async: args.async,
        contentType: args.contentType
        //success: args.bindFunc,
        //error: args.error
    });

    return ajaxRequest;
}


// ERROR HANDLERS
function DKAjaxErrorNotifcation(xhr, status, request, arr) {

    var toastrError = "";

    if (typeof xhr === "undefined" ||
        typeof xhr.responseText === "undefined" ||
        xhr.responseText === null ||
        xhr.responseText == "") {
        toastrError = "An error occurred while processing your request";
    }
    else {
        var responseError = JSON.parse(xhr.responseText);
        var errorMessage = "";

        if (typeof responseError.message === "undefined" ||
            responseError.message === null ||
            responseError.message == "") {

            if (typeof responseError.error_description === "undefined" ||
                responseError.error_description === null ||
                responseError.error_description == "") {

                errorMessage = "";
            }
            else {
                errorMessage = responseError.error_description;
            }
        }
        else {
            errorMessage = responseError.message;
        }

        var found = false;
        if (typeof arr === "undefined" ||
            arr === null ||
            arr.length == 0) {
            // do nothing
        }
        else {
            found = arr.includes(errorMessage);
        }

        if (found) {
            toastrError = errorMessage;
        }
        else {
            toastrError = "An error occurred while processing your request";
        }
    }

    toastr.error(toastrError, "Error");
}
function DKAjaxErrorHandler(xhr, status, request) {

    if (typeof xhr === "undefined") {
        // do nothing
    }
    else {
        // DEV START
        console.log(xhr);
        // DEV END
    }

    if (typeof status === "undefined") {
        // do nothing
    }
    else {
        // DEV START
        console.log(status);
        // DEV END
    }

    if (typeof request === "undefined") {
        // do nothing
    }
    else {
        // DEV START
        console.log(request);
        // DEV END
    }


    if (typeof request === "undefined" ||
        typeof request.status === "undefined") {
        // do nothing
    }
    else if (request.status == 200) {
        // do nothing
    }
    else if (request.status == 404) {
        // do nothing
    }
    else if (request.status == 401) {
        // PRD START
        //window.location = "/account/login?ReturnURL=" + window.location.pathname; // unauthorized => redirect user to login
        // PRD END
    }
    else if (request.status == 403) {
        // PRD START
        //window.location = "/"; // forbidden => redirect user to homepage
        // PRD END
    }
    else if (request.status == 500) {
        // do nothing
    }
    else {
        // do nothing
    }
}
function DKErrorNotifcation(err, arr) {
    if (typeof err === "undefined" ||
        err === null ||
        typeof err.message === "undefined" ||
        err.message === null ||
        err.message == "") {
        // do nothing
    }
    else {
        var found = false;
        if (typeof arr === "undefined" ||
            arr === null ||
            arr.length == 0) {
            // do nothing
        }
        else {
            found = arr.includes(err.message);
        }

        var toastrError = "";
        if (found) {
            toastrError = err.message;
        }
        else {
            toastrError = "An error occurred while processing your request";
        }

        toastr.error(toastrError, "Error");
    }
}
function DKErrorHandler(err) {
    if (typeof err === "undefined" ||
        err === null) {
        // do nothing
    }
    else {
        // DEV START
        console.log(err);
        // DEV END
    }
}


//-- TinyMCE plaintext
function setPlainText() {
    var ed = tinyMCE.get('elm1');

    ed.pasteAsPlainText = true;

    //adding handlers crossbrowser
    if (tinymce.isOpera || /Firefox\/2/.test(navigator.userAgent)) {
        ed.onKeyDown.add(function (ed, e) {
            if (((tinymce.isMac ? e.metaKey : e.ctrlKey) && e.keyCode == 86) || (e.shiftKey && e.keyCode == 45))
                ed.pasteAsPlainText = true;
        });
    } else {
        ed.onPaste.addToTop(function (ed, e) {
            ed.pasteAsPlainText = true;
        });
    }
}

// FORM VALIDATION
function basicFormValidate(formObject) {
    // for more info visit the official plugin documentation: 
    // http://docs.jquery.com/Plugins/Validation

    formObject.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "",  // validate all fields including form hidden input
        //messages: {
        //    select_multi: {
        //        maxlength: jQuery.validator.format("Max {0} items allowed for selection"),
        //        minlength: jQuery.validator.format("At least {0} items must be selected")
        //    }
        //},

        rules: {
            password: {
                required: true,
                minlength: 5
            },
            confirmPassword: {
                required: true,
                minlength: 5,
                equalTo: "#Password"
            }
        },

        //invalidHandler: function (event, validator) { //display error alert on form submit              

        //},

        errorPlacement: function (error, element) { // render error placement for each input type
            var cont = $(element).parent('.input-group');
            if (cont.length > 0) {
                cont.after(error);
            } else {
                element.after(error);
            }
        },

        highlight: function (element) { // hightlight error inputs
            $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.form-group').removeClass('has-error'); // set success class to the control group
        }//,

        //submitHandler: function (form) {

        //}
    });
}
function avatarImageExists(image_url) {

    var deferred = $.Deferred();

    var request = new XMLHttpRequest();
    var status;
    var statusText;
    request.open("GET", image_url, true);
    request.send();
    request.onload = function () {
        status = request.status;
        statusText = request.statusText;
        //console.log(status + "|" + statusText);
        if (status == 200) //if(statusText == OK)
        {
            //your required operation on valid URL
            AvatarImgExist = true;
        }
        else {
            //your operation for broken URL
            AvatarImgExist = false;
        }
        deferred.resolve();
    }

    return deferred.promise();
}


//--- Time and Money Functions ----------------
function formatMoney(num) {
    return parseFloat(Math.round(num * 100) / 100).toFixed(2);
}
function isoToDateTime(value) {
    var output = '';
    if (value != '0001-01-01T00:00:00') {
        var d = new Date();
        d.setISO8601(value);
        //desired output format: 5/17/2011 8:34:56 AM - below does not return local time
        output = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear() + " " + setClockTime(d)
    }
    return output;
}
function setClockTime(d) {
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var suffix = "AM";
    if (h > 11) { suffix = "PM"; }
    if (h > 12) { h = h - 12; }
    if (h == 0) { h = 12; }
    if (h < 10) { h = "0" + h; }
    if (m < 10) { m = "0" + m; }
    if (s < 10) { s = "0" + s; }
    return h + ":" + m + ":" + s + " " + suffix;
}
Date.prototype.setISO8601 = function (dString) {
    var regexp = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;
    if (dString.toString().match(new RegExp(regexp))) {
        var regexp = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;
        if (dString.toString().match(new RegExp(regexp))) {
            var d = dString.match(new RegExp(regexp));
            var offset = 0;
            this.setUTCDate(1);
            this.setUTCFullYear(parseInt(d[1], 10));
            this.setUTCMonth(parseInt(d[3], 10) - 1);
            this.setUTCDate(parseInt(d[5], 10));
            this.setUTCHours(parseInt(d[7], 10));
            this.setUTCMinutes(parseInt(d[9], 10));
            this.setUTCSeconds(parseInt(d[11], 10));
            if (d[12]) {
                this.setUTCMilliseconds(parseFloat(d[12]) * 1000);
            }
            else {
                this.setUTCMilliseconds(0);
            }
            if (d[13] != 'Z') {
                offset = (d[15] * 60) + parseInt(d[17], 10);
                offset *= ((d[14] == '-') ? -1 : 1);
                this.setTime(this.getTime() - offset * 60 * 1000);
            }
        }
        else {
            this.setTime(Date.parse(dString));
        }
        return this;
    }
}

// GLOBAL PLUGIN SETTINGS
// Toastr
toastr.options = {
    "closeButton": true,
    "debug": false,
    "positionClass": "toast-top-center",
    "onclick": null,
    "showDuration": "1000",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}
// TinyMCE
tinymce.init({
    selector: 'textarea.tinymce-biography',
    height: 100,
    menubar: false,
    plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table contextmenu paste code'
    ],
    toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
    content_css: [
        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
        '//www.tinymce.com/css/codepen.min.css']
});

// Impersonation
function Impersonate(username) {
    //e.preventDefault();

    //var formObject = $(this).closest('form'); // get jquery form object from input parent form
    //var username = $("input[name='impersonationUsername']", formObject).val(); // get username from input value

    //note: impersonationCode is a global var
    getImpersonationCode(username).then(function () {
        if (typeof impersonationCode === "undefined" ||
            impersonationCode === null ||
            impersonationCode == "") {

            // do nothing, error displayed in getImpersonationCode function
            //App.unblockUI();
        }
        else {
            impersonateUser(username, impersonationCode);
        }
    });
};
function getImpersonationCode(username) {

    var deferred = $.Deferred();

    var data = {
        ImpersonateUsername: username,
        client_id: client_id_val
    };

    var args = {
        ajaxUrl: DCWebServiceURL + "/api/account/getImpersonationCode",
        headers: bearerHeader,
        htmlMethod: "GET",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        pushData: data //JSON.stringify(data)
    };

    var ajaxPromise = DKAjax(args)
        .done(function (data) {
            if (typeof data === "undefined" ||
                data === null ||
                data == "") {

                // throw error
                try {
                    throw new Error("An error occurred while processing your request");
                }
                catch (err) {
                    DKErrorNotifcation(err);
                    DKErrorHandler(err);
                    deferred.resolve();
                }
            }
            else {
                impersonationCode = data;
                deferred.resolve();
            }
        })
        .fail(function (xhr, status, request) {
            DKAjaxErrorNotifcation(xhr, status, request);
            DKAjaxErrorHandler(xhr, status, request);
            deferred.resolve();
        });

    return deferred.promise();
}
function impersonateUser(username, impersonationCode) {

    var loginData = {
        grant_type: "password",
        username: username,
        password: impersonationCode,
        client_id: client_id_val
    };

    var args = {
        ajaxUrl: DCWebServiceURL + "/oauth2/token",
        htmlMethod: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        pushData: loginData //JSON.stringify(data)
    };

    var ajaxPromise = DKAjax(args)
        .done(function (data) {
            if (typeof data === "undefined" ||
                data === null ||
                typeof data.access_token === "undefined" ||
                data.access_token === null ||
                data.access_token == "") {

                // throw error
                try {
                    throw new Error("An error occurred while processing your request");
                }
                catch (err) {
                    //App.unblockUI();
                    DKErrorNotifcation(err);
                    DKErrorHandler(err);
                }
            }
            else {
                // log off any existing user or accesstoken
                localStorage.removeItem("accessToken");
                localStorage.removeItem("cart");

                // on success set jtoken in session storage
                localStorage.setItem(tokenKey, data.access_token);

                // on success update impersonation form values and submit form
                //$("input[name='impersonationAccessToken']", formObject).val(data.access_token);

                //App.blockUI();
                //formObject.submit(); // submit form
                //location.reload();
                window.location = "/";
            }
        })
        .fail(function (xhr, status, request) {
            // App.unblockUI();
            // DKAjaxErrorNotifcation(xhr, status, request);
            //DKAjaxErrorHandler(xhr, status, request);
            alert("Error with inpersonation");
        });
}
// Form validation
function userFormValidate(formObject) {
    // for more info visit the official plugin documentation: 
    // http://docs.jquery.com/Plugins/Validation

    $.validator.addMethod("loginRegex", function (value, element) {
        return this.optional(element) || /^[a-z0-9\-]+$/i.test(value);
    }, "Username must contain only letters, numbers, or dashes.");

    formObject.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "",  // validate all fields including form hidden input
        //messages: {
        //    select_multi: {
        //        maxlength: jQuery.validator.format("Max {0} items allowed for selection"),
        //        minlength: jQuery.validator.format("At least {0} items must be selected")
        //    }
        //},

        rules: {
            password: {
                required: true,
                minlength: 5
            },
            confirmPassword: {
                required: true,
                minlength: 5,
                equalTo: "#Password"
            },
            username: {
                required: true,
                loginRegex: "Username must contain only letters, numbers, or dashes."
            },
            userRole: {
                required: true,
                minlength: 1
            }
        },

        messages: { // custom messages for radio buttons and checkboxes
            userRole: {
                required: "Please select at least one role.",
                minlength: jQuery.validator.format("Please select at least one role.")
            }
        },

        //invalidHandler: function (event, validator) { //display error alert on form submit              

        //},

        errorPlacement: function (error, element) { // render error placement for each input type
            if (element.parents('.mt-radio-list').length > 0 || element.parents('.mt-checkbox-list').length > 0) {
                if (element.parents('.mt-radio-list').length > 0) {
                    error.appendTo(element.parents('.mt-radio-list')[0]);
                }
                if (element.parents('.mt-checkbox-list').length > 0) {
                    error.appendTo(element.parents('.mt-checkbox-list')[0]);
                }
            } else if (element.parents('.mt-radio-inline').length > 0 || element.parents('.mt-checkbox-inline').length > 0) {
                if (element.parents('.mt-radio-inline').length > 0) {
                    error.appendTo(element.parents('.mt-radio-inline')[0]);
                }
                if (element.parents('.mt-checkbox-inline').length > 0) {
                    error.appendTo(element.parents('.mt-checkbox-inline')[0]);
                }
            }
            else {
                var cont = $(element).parent('.input-group');
                if (cont.length > 0) {
                    cont.after(error);
                } else {
                    element.after(error);
                }
            }
        },

        highlight: function (element) { // hightlight error inputs
            $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.form-group').removeClass('has-error'); // set success class to the control group
        }//,

        //submitHandler: function (form) {

        //}
    });
}

// GLOBAL VARIABLES
var tokenKey = "accessToken";
var impersonationCode = "";



