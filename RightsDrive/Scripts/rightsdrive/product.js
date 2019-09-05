//-- product.js --

function getBookHTML() {

    var deferred = $.Deferred();
    $("#BookExtras").hide();

    var data = {
        client_id: client_id_val
    };

    var args = {
        ajaxUrl: DCWebServiceURL + "/api/rh/book?slug=" + BookSlug,
        headers: bearerHeader,
        htmlMethod: "GET",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        pushData: data //JSON.stringify(data)
    };

    var ajaxPromise = DKAjax(args)
        .done(function (data) {
            var productDto = data;
            var ShowTabContainer = false;

            ProductID = data.id;
            $("#TitleName").html(data.name);
            $("#ReqTitle").val(data.name);
            
            $('title').text("Rights Hive | " + data.name);
            $("#CoverImgSlides").html('<li data-thumb="' + data.mostRecentCoverUrl.replace("thumb/", "") + '"><img src="' + data.mostRecentCoverUrl.replace("thumb/", "") + '" alt="" /></li>');

            $("#CoverImg").html('<img src="' + data.mostRecentCoverUrl.replace("thumb/", "") + '" alt="" />');
            
            
            $("#Desc").html(data.mostRecentDesc);
            $('.flexslider').flexslider({
                animation: "slide",
                controlNav: "thumbnails"
            });

            if (productDto.productTypeCodeID == 3072) { //series
                //console.log("series");
                $("#CardTitle").html("Title Series");
                $("#TitleLabel").html("Title Series Name");
                $("#SeriesContainer").hide();
            }

            if (productDto.seriesProductID > 0) {
                getSeriesTitlesHTML(productDto.seriesProductID, productDto.seriesProductName);
                $("#SeriesProductID").val(productDto.seriesProductID);
                $("#SeriesName").html("Series: " + productDto.seriesProductName);
                $("#product-info-main").removeClass("col-12");
                $("#product-info-main").addClass("col-9");
                $("#SeriesTitles").addClass("col-3");
            }

            //getSeriesDD(productDto.publisherOrg.id, productDto.productGroupID);

            if (productDto.bookEditions == null || productDto.bookEditions.length == 0) {
                toastr.error("Error Loading Editions", "Error");
            }
            else {
                $.each(productDto.bookEditions, function (i, edition) {
                    $("#SubTitle").html(edition.subTitle);
                    
                    //-- Show Contributors --------------------------
                    var Contributors = "";
                    var AboutAuthorHtml = "";
                    if (edition.contributors.length > 0) {
                        $.each(edition.contributors, function (i, contributor) {
                            if (contributor.contributorType == 114) { // author
                                if (Contributors == "")
                                    Contributors = "By " + contributor.name;
                                else
                                    Contributors = Contributors + ", " + contributor.name;

                                if (contributor.biography != "") {
                                    AboutAuthorHtml = contributor.biography
                                }
                            }
                            else {
                                //-- skip other types of contributors
                            }
                        });
                    }
                    $("#Contributors").html(Contributors);

                    //-- Desc ---------------------------------------
                    var BookDescHTML = "";
                    var ReviewDescHTML = "";
                    var ShortDescHTML = "";
                    $.each(edition.bookDescs, function (i, desc) {
                        if (desc.descType == 6116) { //use main desc
                            BookDescHTML = desc.description.replace(/&nbsp;/g, " ");
                        }
                        else if (desc.descType == 4039) {
                            ShortDescHTML = desc.description.replace(/&nbsp;/g, " ");
                        }
                        else if (desc.descType == 1017) {
                            ReviewDescHTML = desc.description.replace(/&nbsp;/g, " ");
                        }
                    });
                    if (BookDescHTML == "")
                        BookDescHTML = ShortDescHTML;

                    //if (BookDescHTML == "") {
                    //    $("#DescTab").hide();
                    //    $("#BookEditionDescription").html("");
                    //    $("#BookEditionDescription").hide();
                    //}
                    //else {
                    //    ShowTabContainer = true;
                    //    $("#DescTab").show();
                    //    $("#DescTabContent").show();
                    //    $("#BookEditionDescription").html(BookDescHTML);
                    //    $("#BookEditionDescription").show();
                    //}
                    if (ReviewDescHTML == "") {
                        $("#ReviewTab").hide();
                        $("#ReviewDesc").html("");
                        $("#ReviewDesc").hide();
                    }
                    else {
                        ShowTabContainer = true;
                        $("#ReviewTab").show();
                        //$("#DescTabContent").show();
                        $("#Reviews").html("<p style='font-style:italic;'>"+ReviewDescHTML+"</p>");
                        //$("#Reviews").show();
                    }
                    if (AboutAuthorHtml == "") {

                    }
                    else {
                        ShowTabContainer = true;
                        $("#AboutTab").show();
                        $("#AboutAuthor").html("<p style=''>" + AboutAuthorHtml + "</p>");
                        $("#AboutAuthor").show();
                    }
                    if (ShowTabContainer)
                        $("#BookExtras").show();


                    if (edition.bookFormats == null || edition.bookFormats.length == 0) {
                        toastr.error("Error Loading Formats", "Error");
                    }
                    else {
                        $.each(edition.bookFormats, function (i, format) {
                            //console.log(format.isbn);

                            var pubdate = new Date(format.publicationDate);
                            pubdate = (pubdate.getMonth() + 1) + '/' + pubdate.getDate() + '/' + pubdate.getFullYear();

                            $("#PubDate").html(pubdate);                            
                            $("#Format").html(format.formatName );
                            $("#ISBN13").html(format.isbn);
                            $("#Pages").html(format.pageCount);

                            //var rowHTML = '<tr>\
                            //    <td class="v-align-middle">\
                            //        <p>'+ pubdate + '</p>\
                            //    </td>\
                            //    <td class="v-align-middle ">\
                            //        <p> <a id="'+ edition.id + '" href="#" class="EditionDetail">Edition ' + edition.editionNumber + '</a></p>\
                            //    </td>\
                            //    <td class="v-align-middle">\
                            //        <p><a id="'+ format.id + '" href="#" class="BookFormatDetail" >' + format.formatName + '</a></p>\
                            //    </td>\
                            //    <td class="v-align-middle">\
                            //        <p>'+  + '</p>\
                            //    </td>\
                            //</tr>';
                            //$("#BookFormatsTableBody").append(rowHTML);

                            //var AllFilesHTML = "";
                            //if (format.files.length > 0) {
                            //    for (var f = 0; f < format.files.length; f++) {
                            //        filetype = "";
                            //        if (format.files[f].fileTypeID == 6124)
                            //            filetype = "Thumb";
                            //        else if (format.files[f].fileTypeID == 3041)
                            //            filetype = "Interior";
                            //        else if (format.files[f].fileTypeID == 3039)
                            //            filetype = "Front Cover";
                            //        else if (format.files[f].fileTypeID == 6088)
                            //            filetype = "Marketing Kit";
                            //        else if (format.files[f].fileTypeID == 6089)
                            //            filetype = "InDesign";

                            //        AllFilesHTML = AllFilesHTML + "<li> <a href='" + format.files[f].publicUrl + "' class='link' target=_new >" + format.files[f].fileName + "." + format.files[f].fileExtension + " (" + filetype + ")</a></li>";
                            //    }

                                
                            //}
                            ////-- Files -----
                            //if (AllFilesHTML == "")
                            //    $("#AllFiles").html("None");
                            //else
                            //    $("#AllFiles").html(AllFilesHTML);

                            //-- Get All Contracts --
                            //-- Show Existing Royalties --------------------------
                            var ExistingRoyalties = "";
                            if (productDto.langAndCountryList.length > 0) {
                                for (var f = 0; f < productDto.langAndCountryList.length; f++) {
                                    ExistingRoyalties = ExistingRoyalties +
                                        "<tr><td>" + productDto.langAndCountryList[f].language + "</td><td>" +
                                        productDto.langAndCountryList[f].countries + "</td></tr>";
                                }
                            }
                            
                            $('#LangCountryTableBody tr').remove();
                            if (ExistingRoyalties == "")
                                $('#LangCountryTableBody').append("<tr><td>No International Rights Sold</td><td></td></tr>");
                            else
                                $('#LangCountryTableBody').append(ExistingRoyalties);

                            //-- Show Product Categories ----------------------

                            var ExistingProductCategoriesHTML = "";
                            if (productDto.productCategories != null && productDto.productCategories.length > 0) {
                                for (var f = 0; f < productDto.productCategories.length; f++) {
                                    ExistingProductCategoriesHTML = ExistingProductCategoriesHTML +
                                        "<tr><td>" + productDto.productCategories[f].catName + "</td></tr>";
                                }
                            }
                            //console.log("sadf=" + ExistingProductCategoriesHTML);
                            $('#ProductCategoriesBody tr').remove();
                            if (ExistingProductCategoriesHTML == "")
                                $('#ProductCategoriesBody').append("<tr><td>None</td></tr>");
                            else
                                $('#ProductCategoriesBody').append(ExistingProductCategoriesHTML);

                          

                        });
                    }
                });
            }

           


            //LinkEvents();
            //sortDropDownsListByText();

            deferred.resolve();
        })
        .fail(function (xhr, status, request) {
            toastr.error("Error Loading", "Error");
            deferred.resolve();
        });

    return deferred.promise();
}

function getSeriesTitlesHTML(SeriesID, SeriesName) {

    var deferred = $.Deferred();

    var data = {
        client_id: client_id_val
    };


    var args = {
        ajaxUrl: DCWebServiceURL + "/api/rh/series/titlelist/" + SeriesID,
        headers: bearerHeader,
        htmlMethod: "GET",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        pushData: data //JSON.stringify(data)
    };
    var rowHTML = "";

    var ajaxPromise = DKAjax(args)
        .done(function (data) {

            var len = data.length;

            if (len == 0) {
                rowHTML = "&nbsp;"; // no titles in series
            }
            else {
                rowHTML = "<div class='col-12' style='font-weight:bold; text-align:center; margin-bottom:15px;border-bottom:1px solid #666;'>Other Titles In This Series:</div>";
                for (var i = 0; i < len; i++) {
                    //-- get special html --
                    var SpecialHtml = "";
                    var img = "";

                    if (data[i].id == ProductID)
                        continue; // don't show current title

                    if (data[i].mostRecentCoverUrl != "")
                        img = "<img src='" + data[i].mostRecentCoverUrl + "' style='' />";

                    rowHTML = rowHTML +
                        '<div class="col-12" style="margin-bottom:15px;">' +
                        '<div class="product-wrapper" style="display:block;">' +
                        '<div class="product-img" style="">' +
                        '<a href="/book/' + data[i].slug + '">' + img + '</a>' +
                        '<div class="quick-view">' +
                        '<a class="action-view" href="/book/' + data[i].slug + '" title="Quick View"><i class="fa fa-search-plus"></i></a>' +
                        '</div>' +
                        '<div class="product-details text-center">' +
                        '<h4><a href="/book/' + data[i].slug + '">' + data[i].name + '</a></h4>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    
                }
            }
            $("#SeriesTitles").html(rowHTML);


            deferred.resolve();
        })
        .fail(function (xhr, status, request) {
            toastr.error("Error Loading", "Error");
            deferred.resolve();
        });
}










//function getProductDetailsInfoPage(ProductID) {

//    var deferred = $.Deferred();
//    $("#BookFormatsTableBody").html("");

//    if (ProductID == 0) {
//        getSeriesDD(0);
//        deferred.resolve();
//        return deferred.promise();
//    }

//    var data = {
//        client_id: client_id_val
//    };

//    var args = {
//        ajaxUrl: DCWebServiceURL + "/api/product/" + ProductID,
//        headers: bearerHeader,
//        htmlMethod: "GET",
//        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
//        pushData: data //JSON.stringify(data)
//    };

//    var ajaxPromise = DKAjax(args)
//        .done(function (productDto) {
//            ProductDTO = productDto;
//            var AllFilesHTML = "";
//            var AllContractsHTML = "";
//            $("#ProductID").val(productDto.id);
//            $("#ProductTypeCodeID").val(productDto.productTypeCodeID);
//            $("#ProductTitle").val(productDto.name);
//            $('title').text(productDto.name);
//            $("#PublisherOrgID").val(productDto.publisherOrg.id);
//            $("#RightsAgentOrgID").val(productDto.rightsAgentOrgID);

//            if (productDto.productTypeCodeID == 3072) {
//                console.log("series");
//                $("#CardTitle").html("Title Series");
//                $("#TitleLabel").html("Title Series Name");
//                $("#SeriesContainer").hide();

//            }

//            if (productDto.excludeFromDashboard + "" == "true")
//                $("#ExcludeFromDashboard").val(1);
//            else
//                $("#ExcludeFromDashboard").val(0);

//            if (productDto.mostRecentCoverUrl != "") {
//                $("#mostRecentCoverUrl").attr("src", productDto.mostRecentCoverUrl.replace("thumb/", ""));

//            }

//            $("#SeriesProductID").val(productDto.seriesProductID);
//            $("#SeriesProductName").val(productDto.seriesProductName);

//            //getSeriesDD(productDto.publisherOrg.id, productDto.productGroupID);

//            $.each(productDto.bookEditions, function (i, edition) {

//                $("#AddBookFormat").show();
//                if (edition.bookFormats == null || edition.bookFormats.length == 0) {
//                    //var pubdate = new Date(format.publicationDate);
//                    //pubdate = (pubdate.getMonth() + 1) + '/' + pubdate.getDate() + '/' + pubdate.getFullYear();

//                    var rowHTML = '<tr>\
//                            <td class="v-align-middle">\
//                                <p>-</p>\
//                            </td>\
//                            <td class="v-align-middle ">\
//                                <p> <a id="'+ edition.id + '" href="#" class="EditionDetail">Edition ' + edition.editionNumber + '</a></p>\
//                            </td>\
//                            <td class="v-align-middle">\
//                                <p>-</p>\
//                            </td>\
//                            <td class="v-align-middle">\
//                                <p>-</p>\
//                            </td>\
//                        </tr>';
//                    $("#BookFormatsTableBody").append(rowHTML);
//                }
//                else {
//                    $.each(edition.bookFormats, function (i, format) {
//                        //console.log(format.isbn);

//                        var pubdate = new Date(format.publicationDate);
//                        pubdate = (pubdate.getMonth() + 1) + '/' + pubdate.getDate() + '/' + pubdate.getFullYear();

//                        var rowHTML = '<tr>\
//                                <td class="v-align-middle">\
//                                    <p>'+ pubdate + '</p>\
//                                </td>\
//                                <td class="v-align-middle ">\
//                                    <p> <a id="'+ edition.id + '" href="#" class="EditionDetail">Edition ' + edition.editionNumber + '</a></p>\
//                                </td>\
//                                <td class="v-align-middle">\
//                                    <p><a id="'+ format.id + '" href="#" class="BookFormatDetail" >' + format.formatName + '</a></p>\
//                                </td>\
//                                <td class="v-align-middle">\
//                                    <p>'+ format.isbn + '</p>\
//                                </td>\
//                            </tr>';
//                        $("#BookFormatsTableBody").append(rowHTML);

//                        if (format.files.length > 0) {


//                            for (var f = 0; f < format.files.length; f++) {
//                                filetype = "";
//                                if (format.files[f].fileTypeID == 6124)
//                                    filetype = "Thumb";
//                                else if (format.files[f].fileTypeID == 3041)
//                                    filetype = "Interior";
//                                else if (format.files[f].fileTypeID == 3039)
//                                    filetype = "Front Cover";
//                                else if (format.files[f].fileTypeID == 6088)
//                                    filetype = "Marketing Kit";
//                                else if (format.files[f].fileTypeID == 6089)
//                                    filetype = "InDesign";

//                                AllFilesHTML = AllFilesHTML + "<li> <a href='" + format.files[f].publicUrl + "' class='link' target=_new >" + format.files[f].fileName + "." + format.files[f].fileExtension + " (" + filetype + ")</a></li>";
//                            }
//                        }

//                        $("#UploadFileISBN").append($("<option></option>")
//                            .attr("value", format.isbn)
//                            .text(format.isbn));

//                    });
//                }
//            });

//            //-- Get All Contracts --
//            //-- Show Existing Royalties --------------------------
//            var ExistingRoyalties = "";
//            if (ProductDTO.langAndCountryList.length > 0) {
//                for (var f = 0; f < productDto.langAndCountryList.length; f++) {
//                    ExistingRoyalties = ExistingRoyalties +
//                        "<tr><td>" + productDto.langAndCountryList[f].language + "</td><td>" +
//                        productDto.langAndCountryList[f].countries + "</td></tr>";
//                }
//            }

//            $('#LangCountryTableBody tr').remove();
//            if (ExistingRoyalties == "")
//                $('#LangCountryTableBody').append("<tr><td>None</td><td></td></tr>");
//            else
//                $('#LangCountryTableBody').append(ExistingRoyalties);

//            //-- Show Product Categories ----------------------

//            var ExistingProductCategoriesHTML = "";
//            if (productDto.productCategories != null && ProductDTO.productCategories.length > 0) {
//                for (var f = 0; f < productDto.productCategories.length; f++) {
//                    ExistingProductCategoriesHTML = ExistingProductCategoriesHTML +
//                        "<tr><td>" + productDto.productCategories[f].catName + "</td></tr>";
//                }
//            }
//            //console.log("sadf=" + ExistingProductCategoriesHTML);
//            $('#ProductCategoriesBody tr').remove();
//            if (ExistingProductCategoriesHTML == "")
//                $('#ProductCategoriesBody').append("<tr><td>None</td></tr>");
//            else
//                $('#ProductCategoriesBody').append(ExistingProductCategoriesHTML);


//            //-- Files -----
//            if (AllFilesHTML == "")
//                $("#AllFiles").html("None");
//            else
//                $("#AllFiles").html(AllFilesHTML);


//            LinkEvents();
//            sortDropDownsListByText();

//            if (IsLoggedInAdmin == 1) {
//                $("#DeleteButton").show();
//                $("#ExcludeContainer").show();
//                $("#RightsAgentOrgContainer").show();

//            }
//            else {
//                $("#DeleteButton").hide();
//            }

//            deferred.resolve();
//        })
//        .fail(function (xhr, status, request) {
//            toastr.error("Error Loading", "Error");
//            deferred.resolve();
//        });

//    return deferred.promise();
//}
//function getPublisherOrgs() {

//    var deferred = $.Deferred();
//    var data = {
//        client_id: client_id_val
//    };

//    var args = {
//        ajaxUrl: DCWebServiceURL + "/api/orgs/publishers",
//        headers: bearerHeader,
//        htmlMethod: "GET",
//        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
//        pushData: data //JSON.stringify(data)
//    };

//    var ajaxPromise = DKAjax(args)
//        .done(function (data) {

//            $.each(data, function (i, item) {
//                //console.log(item.id);
//                $('#PublisherOrgID').append($('<option>', {
//                    value: item.id,
//                    text: item.name
//                }));
//            });

//            sortDropDownsListByText();
//            deferred.resolve();
//        })
//        .fail(function (xhr, status, request) {
//            toastr.error("Error Loading", "Error");
//            deferred.resolve();
//        });

//    return deferred.promise();
//}
//function getSeriesDD(PublisherOrgID, selectedID) {

//    var deferred = $.Deferred();
//    $('#ProductGroupID').empty()
//    $("#ProductGroupID").append("<option value='0'>None</option>");

//    if (PublisherOrgID == "" || PublisherOrgID == 0)
//        return;

//    var data = {
//        client_id: client_id_val,
//        ID: 0,
//        Name: "",
//        PublisherID: PublisherOrgID
//    };

//    var args = {
//        ajaxUrl: DCWebServiceURL + "/api/title/series",
//        headers: bearerHeader,
//        htmlMethod: "POST",
//        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
//        pushData: data //JSON.stringify(data)
//    };

//    var ajaxPromise = DKAjax(args)
//        .done(function (data) {
//            var len = data.length;
//            if (len == 0) {
//                return; // do nothing
//            }
//            for (var i = 0; i < len; i++) {
//                if (data[i].id == selectedID)
//                    selected = "selected";
//                else
//                    selected = "";

//                $("#ProductGroupID").append("<option value='" + data[i].id + "' " + selected + ">" + data[i].name + "</option>");
//            }

//            deferred.resolve();
//        })
//        .fail(function (xhr, status, request) {
//            toastr.error("Error Loading", "Error");
//            deferred.resolve();
//        });
//}
//function getBisacDD(InputID, bisacLevel, selectedID) {

//    var deferred = $.Deferred();

//    if (bisacLevel == "")
//        bisacLevel = "ALL";

//    $('#' + InputID).empty()

//    if (bisacLevel == "DASHBOARD") {
//        $("#" + InputID).append("<option value='0' selected></option>");
//    }

//    var data = {
//        client_id: client_id_val
//    };

//    var args = {
//        ajaxUrl: DCWebServiceURL + "/api/bisacs?BisacLevel=" + bisacLevel,
//        headers: bearerHeader,
//        htmlMethod: "GET",
//        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
//        pushData: data //JSON.stringify(data)
//    };

//    var ajaxPromise = DKAjax(args)
//        .done(function (data) {
//            var len = data.length;
//            if (len == 0) {
//                return; // do nothing
//            }
//            for (var i = 0; i < len; i++) {
//                if (data[i].id == selectedID)
//                    selected = "selected";
//                else
//                    selected = "";

//                if (bisacLevel == "DASHBOARD") {
//                    $("#" + InputID).append("<option value='" + data[i].id + "' " + selected + ">" + data[i].description + "</option>");
//                }
//                else {
//                    $("#" + InputID).append("<option value='" + data[i].code + "' " + selected + ">" + data[i].description + " (" + data[i].code + ")</option>");
//                }
//            }
//            BisacArray = data;
//            deferred.resolve();
//        })
//        .fail(function (xhr, status, request) {
//            toastr.error("Error Loading", "Error");
//            deferred.resolve();
//        });

//    return deferred.promise();
//}
//function getCustomCriteriaDD(InputID, selectedID) {

//    var deferred = $.Deferred();

//    $('#' + InputID).empty()
//    $("#" + InputID).append("<option value='0' selected></option>");


//    var data = {
//        client_id: client_id_val
//    };

//    var args = {
//        ajaxUrl: DCWebServiceURL + "/api/getcustomcriteria",
//        headers: bearerHeader,
//        htmlMethod: "GET",
//        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
//        pushData: data //JSON.stringify(data)
//    };

//    var ajaxPromise = DKAjax(args)
//        .done(function (data) {
//            var len = data.length;
//            if (len == 0) {
//                return; // do nothing
//            }
//            for (var i = 0; i < len; i++) {
//                if (data[i].id == selectedID)
//                    selected = "selected";
//                else
//                    selected = "";

//                $("#" + InputID).append("<option value='" + data[i].id + "' " + selected + ">" + data[i].description + "</option>");

//            }
//            deferred.resolve();
//        })
//        .fail(function (xhr, status, request) {
//            toastr.error("Error Loading", "Error");
//            deferred.resolve();
//        });

//    return deferred.promise();
//}

//function ShowEdition(EditionID, productDto) {

//    $('html, body').animate({
//        scrollTop: $("#EditionDetails").offset().top
//    }, 1000);

//    if (EditionID == 0) {
//        $("#EditionCardTitle").text("Add New Edition");
//        $("#SaveEditionButton").text("Add New Edition");
//        $("#AddContributor").hide();
//        $("#AddEditionDesc").hide();
//        $("#AddEditionCrit").hide();

//        var newEditionNumber = 1;
//        $.each(productDto.bookEditions, function (i, edition) {
//            newEditionNumber++;
//        });

//        if (newEditionNumber == 0) {
//            newEditionNumber = 1;
//        }

//        $("#EditionID").val(0);
//        $("#Title").val($("#ProductTitle").val());
//        $("#SubTitle").val("");
//        $("#EditionNumber").val(newEditionNumber);
//        $("#FromAgeCodeID").val("");
//        $("#ToAgeCodeID").val("");

//        $("#PrimaryLanguageCodeID option[value='2012']").prop('selected', true);
//        $("#IsIllustrated option[value='false']").prop('selected', true);

//        $("#BisacSubjectHeadingID1").val("");
//        $("#BisacSubjectHeadingID2").val("");
//        $("#BisacSubjectHeadingID3").val("");
//    }
//    else { //-- show existing edition --
//        $("#EditionCardTitle").text("Edition Details");
//        $("#SaveEditionButton").text("Save");
//        $("#AddContributor").show();
//        $("#AddEditionDesc").show();
//        $("#AddEditionCrit").show();

//        $("#EditionID").val(EditionID);
//        var EditionDto;
//        $.each(productDto.bookEditions, function (i, edition) {
//            if (edition.id == EditionID) {
//                EditionDto = edition;
//            }
//        });

//        $("#Title").val(EditionDto.title);
//        $("#SubTitle").val(EditionDto.subTitle);
//        $("#EditionNumber").val(EditionDto.editionNumber);
//        $("#FromAgeCodeID").val(EditionDto.fromAgeCodeID);
//        $("#ToAgeCodeID").val(EditionDto.toAgeCodeID);
//        $("#PrimaryLanguageCodeID option[value='" + EditionDto.primaryLanguageCodeID + "']").prop('selected', true);
//        $("#IsIllustrated option[value='" + EditionDto.isIllustrated + "']").prop('selected', true);

//        $("#BisacSubjectHeadingID1").val(EditionDto.bisacSubjectHeadingID1);
//        $("#BisacSubjectHeadingID2").val(EditionDto.bisacSubjectHeadingID2);
//        $("#BisacSubjectHeadingID3").val(EditionDto.bisacSubjectHeadingID3);

//        $("#BookDescTableBody").empty();
//        if (EditionDto.bookDescs == null || EditionDto.bookDescs.length == 0) {
//            var rowHTML = '<tr>\
//                                <td class="v-align-middle ">\
//                                <p> </p>\
//                            </td>\
//                            <td class="v-align-middle">\
//                                <p> none</p>\
//                            </td>\
//                            <td class="v-align-middle ">\
//                                <p>-</p>\
//                            </td>\
//                        </tr>';
//            $("#BookDescTableBody").append(rowHTML);
//        }
//        else {
//            $.each(EditionDto.bookDescs, function (i, desc) {
//                var rowHTML = '<tr>\
//                                 <td class="v-align-middle ">\
//                                    <p>'+ desc.id + '</p>\
//                                </td>\
//                                <td class="v-align-middle">\
//                                    <p><a href="#" id="'+ desc.id + '" class="EditEditionDesc">' + desc.descTypeName + '</a></p>\
//                                </td>\
//                                <td class="v-align-middle ">\
//                                    <p>'+ desc.description + ' </p>\
//                                </td>\
//                            </tr>';
//                $("#BookDescTableBody").append(rowHTML);
//            });
//        }

//        $("#BookCritsTableBody").empty();
//        if (EditionDto.bookCriteria == null || EditionDto.bookCriteria.length == 0) {
//            var rowHTML = '<tr>\
//                                <td class="v-align-middle ">\
//                                <p> </p>\
//                            </td>\
//                            <td class="v-align-middle">\
//                                <p> none</p>\
//                            </td>\
//                            <td class="v-align-middle ">\
//                                <p>-</p>\
//                            </td>\
//                        </tr>';
//            $("#BookCritsTableBody").append(rowHTML);
//        }
//        else {
//            $.each(EditionDto.bookCriteria, function (i, crit) {
//                var rowHTML = '<tr>\
//                                 <td class="v-align-middle ">\
//                                    <p> '+ crit.id + '</p>\
//                                </td>\
//                                <td class="v-align-middle">\
//                                    <p> <a href="#" id="'+ crit.id + '" class="EditEditionCrit">' + crit.criteriaName + '</a></p>\
//                                </td>\
//                                <td class="v-align-middle ">\
//                                    <p>'+ crit.criteriaDetails + ' </p>\
//                                </td>\
//                            </tr>';
//                $("#BookCritsTableBody").append(rowHTML);
//            });
//        }

//        $("#BookContributorTableBody").empty();
//        if (EditionDto.contributors == null || EditionDto.contributors.length == 0) {
//            var rowHTML = '<tr>\
//                                <td class="v-align-middle ">\
//                                <p> </p>\
//                            </td>\
//                        </tr>';
//            $("#BookContributorTableBody").append(rowHTML);
//        }
//        else {
//            $.each(EditionDto.contributors, function (i, contributor) {
//                var rowHTML = '<tr><td>&nbsp;</td><td class="v-align-middle" ><p><i class="fa fa-user"></i> <a href="#" id="' + contributor.id + '" class="EditEditionContributor">' + contributor.contributorTypeName + ' ' + contributor.name + '</a></p>\
//                                </td>\
//                            </tr>';
//                $("#BookContributorTableBody").append(rowHTML);
//            });
//        }

//        $(".EditEditionDesc").off();
//        $(".EditEditionDesc").click(function () {
//            var id = $(this).attr('id');
//            $("#BookEditionDescID").val(id);
//            ShowBookEditionDesc(id, productDto);
//            $('#modalDescSlideUp').modal('show');
//        });
//        $(".EditEditionCrit").off();
//        $(".EditEditionCrit").click(function () {
//            var id = $(this).attr('id');
//            $("#BookCriteriaID").val(id);
//            ShowBookEditionCrit(id, productDto);
//            $('#modalCritSlideUp').modal('show');
//        });
//        $(".EditEditionContributor").off();
//        $(".EditEditionContributor").click(function () {
//            var id = $(this).attr('id');
//            $("#BookContributorID").val(id);
//            ShowBookContributor(id, productDto);
//            $('#modalContributorSlideUp').modal('show');
//        });
//    }
//}
//function ShowBookFormat(BookFormatID, productDto) {

//    $('html, body').animate({
//        scrollTop: $("#BookFormatDetails").offset().top
//    }, 1100);

//    //-- set up BookFormatEditionID dropdown --
//    $('#BookFormatEditionID').children().remove();
//    $.each(productDto.bookEditions, function (i, edition) {
//        $('#BookFormatEditionID').append($('<option>', {
//            value: edition.id,
//            text: "Edition " + edition.editionNumber
//        }));
//    });

//    if (BookFormatID == 0) {
//        $("#BookFormatCardTitle").text("Add New Format");
//        $("#SaveBookFormatButton").text("Add New Format");
//        $("#BookFormatID").val(0);
//        $("#BookFormatEditionID option:last-child").prop('selected', true);
//        $("#FormatID option[value='2997']").prop('selected', true);
//        $("#Isbn13").val("");
//        $("#ASIN").val("");
//        $("#PublicationDate").val("");
//        $("#PageCount").val("");
//        $("#WordCount").val("");
//        $("#FormatFiles").html("None");


//        $("#Height").val("");
//        $("#Width").val("");
//        $("#Depth").val("");
//        $("#MeasureUnit").val("");
//        $("#Weight").val("");
//        $("#WeightUnit").val("");
//        $("#CartonQty").val("");
//        $("#RetailPrice").val("");
//        $("#RetailCurrency").val("");

//        $("#AmazonListingURL").val("");
//    }
//    else {
//        $("#BookFormatCardTitle").text("Book Format Details");
//        $("#SaveBookFormatButton").text("Save");
//        $("#BookFormatID").val(BookFormatID);

//        var BookFormatDto;
//        var EditionID = 0;
//        $.each(productDto.bookEditions, function (i, edition) {
//            $.each(edition.bookFormats, function (i, format) {
//                if (format.id == BookFormatID) {
//                    BookFormatDto = format;
//                    EditionID = edition.id;
//                }
//            });
//        });

//        $("#BookFormatEditionID option[value='" + EditionID + "']").prop('selected', true);
//        //console.log(BookFormatDto.isbn);
//        $("#FormatID option[value='" + BookFormatDto.formatID + "']").prop('selected', true);
//        $("#Isbn13").val(BookFormatDto.isbn);
//        $("#ASIN").val(BookFormatDto.asin);
//        var pubdate = new Date(BookFormatDto.publicationDate);
//        let pubdateDisplay = (pubdate.getMonth() + 1) + '/' + pubdate.getDate() + '/' + pubdate.getFullYear();
//        let mm = (pubdate.getMonth() + 1);
//        let dd = pubdate.getFullYear() + "-" + mm + "-" + pubdate.getDay();
//        //$("#PublicationDate").datepicker();
//        $("#PublicationDate").datepicker('update', pubdateDisplay);
//        //$("#PublicationDate").val(pubdate);
//        $("#PageCount").val(BookFormatDto.pageCount);
//        $("#WordCount").val(BookFormatDto.wordCount);

//        if (BookFormatDto.files.length > 0) {
//            var fileHTML = "";
//            for (var f = 0; f < BookFormatDto.files.length; f++) {
//                fileHTML = fileHTML + "<li><a href='" + BookFormatDto.files[f].publicUrl + "' class='link' target=_new >" + BookFormatDto.files[f].fileName + "." + BookFormatDto.files[f].fileExtension + "</a></li>";
//            }
//            $("#FormatFiles").html(fileHTML);
//        }
//        else {
//            $("#FormatFiles").html("None");
//        }

//        $("#Height").val(BookFormatDto.height);
//        $("#Width").val(BookFormatDto.width);
//        $("#Depth").val(BookFormatDto.depth);
//        $("#MeasureUnit option[value='" + BookFormatDto.measureUnit + "']").prop('selected', true);
//        $("#Weight").val(BookFormatDto.weight);
//        $("#WeightUnit option[value='" + BookFormatDto.weightUnit + "']").prop('selected', true);

//        $("#CartonQty").val(BookFormatDto.cartonQty);
//        $("#RetailPrice").val(BookFormatDto.retailPrice);
//        $("#RetailCurrency option[value='" + BookFormatDto.retailCurrency + "']").prop('selected', true);

//        $("#AmazonListingURL").val(BookFormatDto.amazonListingURL);
//    }
//}
//function ShowBookEditionDesc(DescID, productDto) {

//    if (DescID == 0) {
//        $("#DescType").val("");
//        $("#BookEditionDescription").val("");
//    }
//    else {
//        $("#DescType").val("");
//        $("#BookEditionDescription").val("");
//        var BookDescDto;
//        $.each(productDto.bookEditions, function (i, edition) {
//            $.each(edition.bookDescs, function (i, desc) {
//                if (desc.id == DescID) {
//                    BookDescDto = desc;
//                }
//            });
//        });
//        $("#DescType option[value='" + BookDescDto.descType + "']").prop('selected', true);
//        $("#BookEditionDescription").val(BookDescDto.description);
//    }
//}
//function ShowBookEditionCrit(CritID, productDto) {

//    if (CritID == 0) {
//        $("#CritType").val("");
//        $("#BookEditionCriteriaDesc").val("");
//    }
//    else {
//        $("#CritType").val("");
//        $("#BookEditionCriteriaDesc").val("");
//        var BookCritDto;
//        $.each(productDto.bookEditions, function (i, edition) {
//            $.each(edition.bookCriteria, function (i, crit) {
//                if (crit.id == CritID) {
//                    BookCritDto = crit;
//                }
//            });
//        });
//        $("#CritType option[value='" + BookCritDto.codeID + "']").prop('selected', true);
//        $("#BookEditionCriteriaDesc").val(BookCritDto.criteriaDetails);
//    }
//}
//function ShowBookContributor(ContributorID, productDto) {

//    if (ContributorID == 0) {
//        $("#BookContributorID").val(0);
//        $("#ContributorType").val("");
//        $("#BookContributorName").val("");
//        $("#Biography").val("");
//    }
//    else {
//        $("#BookContributorID").val(ContributorID);
//        $("#ContributorType").val("");
//        $("#BookContributorName").val("");
//        $("#Biography").val("");
//        var BookContributorDto;
//        $.each(productDto.bookEditions, function (i, edition) {
//            $.each(edition.contributors, function (i, contributor) {
//                if (contributor.id == ContributorID) {
//                    BookContributorDto = contributor;
//                }
//            });
//        });
//        $("#ContributorType option[value='" + BookContributorDto.contributorType + "']").prop('selected', true);
//        $("#Biography").val(BookContributorDto.biography);
//        $("#BookContributorName").val(BookContributorDto.name);
//    }
//}



