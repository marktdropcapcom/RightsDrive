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


