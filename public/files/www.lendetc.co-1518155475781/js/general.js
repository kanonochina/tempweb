$(function () {
    if (!window.lmpost) {
        window.lmpost = {};
    }

    var baseApiUrl = "https://formrequests.com/";

    if (!lmpost.urls) lmpost.urls = {};
    if (!lmpost.urls.portalUrl) lmpost.urls.portalUrl = baseApiUrl + '/cserv';
    if (!lmpost.urls.apiUrl) lmpost.urls.apiUrl = 'https://www.loanmatchingservice.com/';
    if (!lmpost.urls.submitUrl) lmpost.urls.submitUrl = 'post/live.aspx';
    if (!lmpost.urls.supportUrl) lmpost.urls.supportUrl = 'https://www.loanmatchingservice.com/misc/';
    if (!lmpost.urls.hitUrl) lmpost.urls.hitUrl = 'https://www.sparning.com/hit/hit.core.js';

    //if (!lmpost.urls.apiUrl) lmpost.urls.apiUrl = baseApiUrl + '/api2/';
    //if (!lmpost.urls.submitUrl) lmpost.urls.submitUrl = 'post/live.aspx';
    //if (!lmpost.urls.supportUrl) lmpost.urls.supportUrl = baseApiUrl + '/api2/misc/';
    //if (!lmpost.urls.hitUrl) lmpost.urls.hitUrl = baseApiUrl + '/api2/hit/hit.core.js';

    lmpost.registerHit = function () {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', lmpost.urls.hitUrl);
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    lmpost.actionUrl = function (action, params) {
        var url = window.lmpost.urls.apiUrl + '/misc/?responsetype=json&action=' + action,
            proto = url.match(/^(http|https):(\/)+/),
            si = proto ? proto[0].length : 0,
            ps = "";

        params = params || {};
        params.uts = new Date().getTime();
        params.uid = lmpost.options.hituid;

        for (var p in params) {
            var v = params[p];
            if (v) ps += '&' + p + "=" + escape(params[p]);
        }

        return (proto ? proto[0] : "") + url.substr(si).replace(/(\/){2,}/g, '/') + ps;
    };

    lmpost.makeUrl = function (baseUrl) {
        if (!baseUrl.match(/^(http|https):/)) {
            return lmpost.urls.apiUrl + baseUrl;
        }
        else {
            return baseUrl;
        }
    };

    lmpost.scriptUrl = function (scriptPath) {
        var url = lmpost.options.domain + scriptPath,
            proto = url.match(/^(http|https):(\/)+/),
            si = proto ? proto[0].length : 0;

        return (proto ? proto[0] : "") + url.substr(si).replace(/(\/){2,}/g, '/');
    };

    lmpost.blinkErrorElements = function (root) {
        var colorArray = new Array("#fff", "#F94722", "#FFFFFF", "#F94722", "#FFFFFF", "#FEE0DA");
        if (!root) root = jQuery;
        if (root.find(':visible.error').length) {
            root.find(':visible.error').animate({
                backgroundColor: colorArray[1]
            }, 150)
            .animate({
                backgroundColor: colorArray[2]
            }, 100)
            .animate({
                backgroundColor: colorArray[3]
            }, 100)
            .animate({
                backgroundColor: colorArray[4]
            }, 100)
            .animate({
                backgroundColor: colorArray[5]
            }, 100, function () {
                $(this).removeAttr('style');
            });
        }

    };

    var isNumeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    lmpost.calculateAPR = function (amount, totalFee, numberOfDays) {
        var apr = 0,
		inputReady = isNumeric(amount) && isNumeric(totalFee) && isNumeric(numberOfDays) && amount > 0 && numberOfDays > 0;

        if (!inputReady) {
            return -1;
        }

        apr = 36500 * (totalFee / amount / numberOfDays);

        return apr;
    };

    // Copy query fields data to small forms.

    var smallForms = $('form.apply-now'),
        isUsualSmallForm = smallForms.find('#SSN').length == 0;
    var ctrs = isUsualSmallForm ? ['ZipCode', 'Email'] : ['RequestedAmount', 'YOB', 'ZipCode', 'SSN'];
    smallForms.each(function () {
        var el = $(this);

        for (var c in ctrs) {
            var ctr = el.find('#' + ctrs[c]),
                par = getParameterByName(ctrs[c]);
            par && ctr && ctr.length && ctr.val(par);
        }
    }
    );

    // Init redirection from main form on Press Enter.
    $('form.apply-now input').keypress(function (e) {
        if ((e.which == 13) && ($(this).val().length !== 0)) {
            $(".btn-cash")[0].click();
        }
    });


    // Init redirection from main form.
    $('form.apply-now a.btn-cash').on('click',
        function () {
            var elem = $(this),
                form = elem.closest('form');

            if (form.validate) {
                form.validate(
                    { errorPlacement: function (error, element) { } }
                );
                if (!form.valid()) {
                    lmpost.blinkErrorElements();
                    return false;
                }
            } //if

            var queryParams = form.find(':not(.b2c-dont-send)').serialize(),
                targetUrl = lmpost.urls.supportUrl,
                href = elem.attr('href') + '', pos = href.indexOf('?'),
                ltid = href.toLowerCase().indexOf('title') > 0 ? 18 : 9,
                underpop = elem.attr('target') == '_blank',
                target = ((pos > 0) ? href.substr(0, pos) : href) + '?' + (queryParams || '').replace(/\+/g, '%20'),
                ajaxopt = {
                    type: 'get',
                    dataType: 'jsonp',
                    timeout: 5000
                },
                transferFunc = function () {
                    if (!underpop) {
                        window.location.href = target;
                    }
                    else {
                        var zip = $('#ZipCode').val();
                        window.setTimeout(function () {
                            window.location.href = '/Home/Loan-Offers' + (zip == '' ? '' : '?zipcode=' + zip);
                        }, 5000); 
                    }

                },
                returningCustomerFunc = function (data) {
                    if (data.RID) {
                        lmpost.RID = data.RID;
                    }
                    transferFunc();
                },
                callback = transferFunc;
            if (isUsualSmallForm) {
                ajaxopt.url = targetUrl + '?action=subscribe&responsetype=json&uid=' + lmpost.options.hituid + '&LeadTypeID=' + ltid + '&PathID=1&' + queryParams;
            } else {
                ajaxopt.url = targetUrl + '?action=leadreturn&responsetype=json&uid=' + lmpost.options.hituid + '&leadtypeid=' + ltid + '&' + queryParams;
                callback = returningCustomerFunc;
            };
            $.ajax(ajaxopt).done(callback).fail(callback);

            if (underpop) {
                elem.attr('href', target);
                return true;
            } else return false;
        }
    );







    // Init redirection from main form.

    //}
    //else
    //{
    //    // returning customer small form
    //}

    $('.form-apply-wrap #RequestedAmount').before("<em class='ico-amount'></em>");
    $('.form-apply-wrap #FName').before("<em class='ico-name'></em>");
    $('.form-apply-wrap #LName').before("<em class='ico-name'></em>");
    $('.form-apply-wrap #Email').before("<em class='ico-email'></em>");
    $('.form-apply-wrap #ZipCode').before("<em class='ico-code'></em>");

    var handlers = lmpost.onGeneralStart;
    if (handlers && handlers.length) {
        for (var i in handlers) {
            handlers[i]();
        }
    }
});



this.randomtip = function () {
    var length = $(".faq-tips li").length;
    var ran = Math.floor(Math.random() * length) + 1;
    $(".faq-tips li:nth-child(" + ran + ")").show();
};

function loadExitFrame() {
    if (!lmpost.options.exitBlockerUrl) return;
    var url = lmpost.options.exitBlockerUrl,
                subid = window.lmpost.options.campaignid,
                zip = $('#ZipCode').val(),
                protocol = document.location.protocol;
    if (!url) { return; }
    if (url && url.indexOf('{AffID}') > 0) { url = url.replace('{AffID}', !subid ? '' : subid); }
    if (url && url.indexOf('{ZipCode}') > 0) { url = url.replace('{ZipCode}', !zip ? '' : zip); }
    if (protocol == "https:") url = url.replace('http:', protocol);
    if ($('#exitFrame').length == 0) {
        var unloadFunc = function (e) {
            $(window).off('beforeunload');

            $('#exitFrame').show();
            return "Press CANCEL to view options!";
        };

        $(window).on("click", function (e) {
            var el = e.target;

            if (el.href) {
                $(window).off('beforeunload');
                setTimeout(function () { $(window).on('beforeunload', unloadFunc); }, 1000);
            }

            return true;
        });

        $('body').append('<iframe id="exitFrame" src="' + url + '" style="overflow:hidden; display:none; top: 0; width: 100%; height: 100%; left: 0; z-index: 10001; position: fixed; background:#fff;"/>');
        $(window).on('beforeunload', unloadFunc);
    }
};


$(document).ready(function () {
    randomtip();

    //$(".form-apply input").keypress(function (e) {
    //    if (e.keyCode == 13) {
    //        $(".btn-cash").trigger('click');
    //    }
    //});

    var protocol = document.location.protocol;
    if (protocol == 'file:') protocol = 'http:';


    if (!getParameterByName('ZipCode'))
        loadExitFrame();
    $('div.form-container').on('change', '#ZipCode', function () {
        $('#exitFrame').remove();
        loadExitFrame();
    });

    var origSuccess = lmpost.options.onSuccess;
    lmpost.options.onSuccess = function (data, defaultHandler) {
        $(window).off('beforeunload');

        if (origSuccess)
        { origSuccess(data, defaultHandler); }
        else
        {
            defaultHandler && defaultHandler(data);
        }
    };


    if ($.fancybox) {
        /*Popups*/
        $(".r-popup, .form-popup")
            .fancybox({
                'width': 960,
                'height': 550,
                'margin': 5,
                'autoDimensions': false
            });
    }

    $(".r-rules").click(function () {
        $('#r-rules').load('/Content/_APR-Rules.html');
    });

    $(".r-loan").click(function () {
        $('#r-loan').load('/Content/_APR-Loan.html');
    });

    $(".r-military").click(function () {
        $('#r-military').load('/Content/_APR-Military.html');
    });

    return false;
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS, "i");
    var results = regex.exec(window.location.search);
    if (results != null) {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    return null;
}
