$(function () {

    var form = $('form.form-contact');

    var setError = function (field) {
        var target;
        target = (field == 'Email') ? form.find('#ContactEmail') : form.find('#' + field);

        target.addClass('error');
    };

    // Init redirection from main form.

    if (form.length) {
        form.find('.captcha-wrapper').prepend('<img id="cpimg" src="' + lmpost.actionUrl('captcha', { uid: lmpost.options.hituid, uts: new Date().getTime() }) + '" title="Captcha code"/>');
        var submitBtn = form.find('a.btn'),
			submitHandler = function () {
			    var targetUrl = lmpost.urls.supportUrl,
					options = lmpost.options,
					project = options.projectName,
					hitID = options.hituid,
					query = form.serialize().replace('ContactEmail', 'Email');

			    if (form.valid()) {
			        $('<div class="processmsg"><p>Please wait. Your data is being processed...</p></div>').insertBefore(form);
			        form.hide();
			        $('div.svcerrormsg').hide();

			        $.ajax(
						{
						    url: lmpost.actionUrl('contactus1', { uid: lmpost.options.hituid, clienturl: location.href }) + '&' + query,
						    type: 'get',
						    dataType: 'jsonp',
						    success: function (data) {
						        if (data && data.Result < 2) {
						            $('div.thakyoumsg').show();
						            $('div.svcerrormsg').hide();
						        }
						        else {
						            form.show();
						            $('div.svcerrormsg').show();
						            if (data && data.Errors && data.Errors.length) {
						                $.each(data.Errors, function (index, value) {
						                    value.Field && setError(value.Field);
						                    if (value.Field == 'Captcha') {
						                        var image = new Image();
						                        image.onload = function () {
						                            form.find('#cpimg').attr('src', image.src);
						                        };

						                        image.src = lmpost.actionUrl('captcha', { uid: lmpost.options.hituid, uts: new Date().getTime()});
						                    }
						                }
											);
						            } //if
						            lmpost.blinkErrorElements();
						        }


						        $('div.processmsg').remove();
						    },

						    error: function () {
						        form.show();
						        $('div.svcerrormsg').show();
						        $('div.processmsg').remove();
						    }
						}
						);
			    }
			    else {
			        lmpost.blinkErrorElements();
			    }

			    return false;
			};

        submitBtn.on('click', submitHandler);
    }


    lmpost.registerHit();

    form.validate({
        rules: {
            Name: {
                required: true
            },
            Phone: {
                required: true
            },
            Message: {
                required: true
            },
            ContactEmail: {
                required: true,
                email: true
            }
        },
        messages: {
            ContactEmail: "Please enter a valid email address"
        }
    });
});
