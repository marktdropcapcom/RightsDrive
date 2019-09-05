function getAccountPublicInfo() {

    var deferred = $.Deferred();

    var data = {
        client_id: client_id_val
    };

    var args = {
        ajaxUrl: DCWebServiceURL + "/api/account/info",
        headers: bearerHeader,
        htmlMethod: "GET",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        pushData: data //JSON.stringify(data)
    };

    var ajaxPromise = DKAjax(args)
        .done(function (data) {

            $("#UsernameVal").html(data.name);
            $("#DashboardLink").attr("href", "/home/dashboard/" + data.id);

            var avatarImg = "/content/images/av1_1.png"; // default avatar image
            avatarImageExists(data.avatarImg).then(function () {

                if (AvatarImgExist)
                    avatarImg = data.avatarImg;

                $("#AvatarImg").attr("src", avatarImg).attr("data-src", avatarImg).attr("data-src-retina", avatarImg);
            });

            if (data.role == "Admin") {
                $("#SearchBarContainer").show();
                $("#SearchBar").autocomplete({
                    source: function (request, response) {
                        $.ajax({
                            url: DCWebServiceURL + "/api/searchbar?term=" + request.term,
                            headers: bearerHeader,
                            htmlMethod: "GET",
                            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                            data: {
                                client_id: client_id_val
                            },
                            success: function (data) {
                                response(data);
                            }
                        });
                    },
                    minLength: 3,
                    select: function (event, ui) {
                        if (ui.item.category == "Product") {
                            window.location.href = "/home/product/" + ui.item.id;
                        }
                        else {
                            window.location.href = "/home/org/" + ui.item.id;
                        }
                        //console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
                    }
                }).autocomplete("instance")._renderItem = function (ul, item) {
                    if (item.category == "Product") {
                        return $("<li>")
                            .append("<div><i class='fa fa-book'></i> " + item.label + "</div>")
                            .appendTo(ul);
                    }
                    else {
                        return $("<li>")
                            .append("<div><i class='fa fa-users'></i> " + item.label + "</div>")
                            .appendTo(ul);
                    }
                };

                IsLoggedInAdmin = 1;
            }
            else if (data.role == "Publisher") {
                IsPublisher = 1;
            }

            LoggedInUserID = data.id;
            LoggedInOrgName = data.loggedInOrgName;

            $("#ProfileLink").attr("href", "/home/userperson/" + data.id);

            if (window.location.pathname == "" || window.location.pathname == "/") {
                window.location.replace("/home/dashboard/" + LoggedInUserID);
            }

            deferred.resolve();
        })
        .fail(function (xhr, status, request) {
            $(".logoff").click(); // logout user
            //toastr.error("Error Loading User", "Error");
            deferred.resolve();
        });

    return deferred.promise();
}
function getLangs() {

    var deferred = $.Deferred();

    var data = {
        client_id: client_id_val
    };

    var args = {
        ajaxUrl: DCWebServiceURL + "/api/languages",
        headers: bearerHeader,
        htmlMethod: "GET",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        pushData: data //JSON.stringify(data)
    };

    var ajaxPromise = DKAjax(args)
        .done(function (data) {

            $("#AllLanguages").find('li').remove();
            $.each(data, function (i, item) {
                $('#AllLanguages').append("<li id='Lang-" + item.id + "' class='liItem'>" + item.name + "</li>");
                $('#AllInterestLanguages').append("<li id='Lang-" + item.id + "' class='liItem'>" + item.name + "</li>");
            });
            setLiClick();
            deferred.resolve();
        })
        .fail(function (xhr, status, request) {
            toastr.error("Error Loading", "Error");
            deferred.resolve();
        });

    return deferred.promise();
}
function getMiscCriteria() {

    var deferred = $.Deferred();

    var data = {
        client_id: client_id_val
    };

    var args = {
        ajaxUrl: DCWebServiceURL + "/api/misccriteria",
        headers: bearerHeader,
        htmlMethod: "GET",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        pushData: data //JSON.stringify(data)
    };

    var ajaxPromise = DKAjax(args)
        .done(function (data) {

            $("#AllMiscCriteria").find('li').remove();
            $("#SearchCritieriaID").find('option').remove();
            $.each(data, function (i, item) {
                //$('#AllMiscCriteria').append($('<option>', {
                //    value: item.id,
                //    text: item.name
                //}));
                $('#AllMiscCriteria').append("<li id='Misc-" + item.id + "' class='liItem'>" + item.name + "</li>");
                $('#SearchCritieriaID').append($('<option>', {
                    value: item.id,
                    text: item.name
                }));

            });
            sortULByText("AllMiscCriteria");

            AllProductCategories = data;
            setLiClick();

            deferred.resolve();
        })
        .fail(function (xhr, status, request) {
            toastr.error("Error Loading", "Error");
            deferred.resolve();
        });

    return deferred.promise();
}
function getCountries() {

    var deferred = $.Deferred();

    var data = {
        client_id: client_id_val
    };

    var args = {
        ajaxUrl: DCWebServiceURL + "/api/countries",
        headers: bearerHeader,
        htmlMethod: "GET",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        pushData: data //JSON.stringify(data)
    };

    var ajaxPromise = DKAjax(args)
        .done(function (data) {

            $("#AllInterestCountry").find('option').remove();
            $.each(data, function (i, item) {
                $('#AllInterestCountry').append("<li id='Country-" + item.id + "' class='liItem'>" + item.name + "</li>");
                $('#AllPrimaryCountry').append("<li id='Country-" + item.id + "' class='liItem'>" + item.name + "</li>");

                if (item.id == 294 || item.id == 293 || item.id == 297 ||
                    item.id == 296 ||
                    item.id == 1295 ||
                    item.id == 1294
                ) {
                    // don't include China ex. Hong kong, Taiwan, MAcua
                    //-- dont include worldwide countries
                }
                else
                    $('#CountryID').append("<option class='liItem' value='" + item.id + "'>" + item.name + "</option>");
            });

            setLiClick();
            deferred.resolve();
        })
        .fail(function (xhr, status, request) {
            toastr.error("Error Loading", "Error");
            deferred.resolve();
        });

    return deferred.promise();
}
function getTitles() {
    var deferred = $.Deferred();

    if ($("#SearchTitle").val() == "" && $("#SearchISBN").val() == "") {
        $("#AllInterestTitles").find('li').remove();
        $('#AllInterestTitles').append("<li id='' class=''>Use search to find titles.</li>");
        $("#AllFavoriteTitles").find('li').remove();
        $('#AllFavoriteTitles').append("<li id='' class=''>Use search to find titles.</li>");

        setLiClick();
        deferred.resolve();
        return deferred.promise();
    }

    $("#AllInterestTitles").find('li').remove();
    $('#AllInterestTitles').append("<li id='' class=''>Loading ...</li>");
    $("#AllFavoriteTitles").find('li').remove();
    $('#AllFavoriteTitles').append("<li id='' class=''>Loading ...</li>");

    var data = {
        client_id: client_id_val,
        ID: 0,
        Name: $("#SearchTitle").val(),
        PublisherID: "",
        ISBN: $("#SearchISBN").val()
    };



    var args = {
        ajaxUrl: DCWebServiceURL + "/api/bookformats",
        headers: bearerHeader,
        htmlMethod: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        pushData: data //JSON.stringify(data)
    };

    var ajaxPromise = DKAjax(args)
        .done(function (data) {

            $("#AllInterestTitles").find('li').remove();
            $("#AllFavoriteTitles").find('li').remove();

            if (data.length == 0) {
                $('#AllInterestTitles').append("<li id='' class=''>None Found</li>");
                $('#AllFavoriteTitles').append("<li id='' class=''>None Found</li>");
            }
            else {
                $.each(data, function (i, item) {
                    //console.log(item.id);
                    $('#AllInterestTitles').append("<li id='Title-" + item.id + "' class='liItem'>" +
                        item.productName + "(" + item.isbn + ")</li>");
                    $('#AllFavoriteTitles').append("<li id='Title-" + item.id + "' class='liItem'>" +
                        item.productName + "(" + item.isbn + ")</li>");

                    //$('#AllInterestTitles').append($('<option>', {
                    //    value: item.id,
                    //    text: item.productName + "(" + item.isbn + ")"
                    //}));

                });
            }
            setLiClick();
            deferred.resolve();
        })
        .fail(function (xhr, status, request) {
            toastr.error("Error Loading", "Error");
            deferred.resolve();
        });

    return deferred.promise();
}
function checkPwd(str) {
    if (str.length < 8) {
        toastr.error("Password must be longer than eight characters.", "Error");
        return false;
    } else if (str.length > 50) {
        toastr.error("Password is too long.", "Error");
        return false;
    } else if (str.search(/\d/) == -1) {
        toastr.error("Password must have at least one number.", "Error");
        return false
    } else if (str.search(/[a-zA-Z]/) == -1) {
        toastr.error("Password must have at least one letter.", "Error");
        return false
    }
    //else if (str.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
    //    return("bad_char");
    //}
    return true;
}
function setLiClick() {
    $(".liItem").off();
    $(".liItem").click(function () {
        //var ID = $(this).attr("id");
        if ($(this).hasClass("dc-selected"))
            $(this).removeClass("dc-selected");
        else
            $(this).addClass("dc-selected");
    });
}