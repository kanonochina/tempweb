//##########################
// TPH setting get variables
//##########################
	window.$_GET = {};
	function set_global_get_variables(){
		var page_query_string = decodeURIComponent(window.location.search.substring(1));
		var get_variables = page_query_string.split('&');
		var query_variable,i;

		for (i = 0; i < get_variables.length; i++) {
			query_variable = get_variables[i].split('=');
			window.$_GET[ query_variable[0] ] = query_variable[1];
		}
	}
	set_global_get_variables();

	function fire_parsely_event(event_data) {
		if (typeof event_data == 'undefined') {
			logThis('Nothing to fire for parsely event.');
			return false;
		}

		event_data.js = 1;
		
	    // event_data.urlref = document.referrer;

	    if (parselyPreload.loaded) {
	    	logThis('Fired Parsely event.');
	        PARSELY.beacon.trackPageView(event_data);
	    } else {
	    	logThis('Preloaded Parsely event.');
	        parselyPreload.eventQueue.push(event_data);
	    }

	    event_data.timestamp = Number(+ new Date() / 1000).toFixed(0);

		PARSELY.tph_events.push(event_data);
		logThis(PARSELY.tph_events);
	}

	function run_after_parsely_loads() {
		if (jQuery('.single-posts-recommended').length >= 1) {
			rec_content_block_c();
	    	logThis('Ran rec_content_block_c' );
			rec_content_frontend();
	    	logThis('Ran rec_content_frontend' );
		}
	}		   


//######################################
// Cookie Management
//######################################
	function create_cookie( name, value, days ) {
		var expires = "";
		if (typeof days == 'undefined') {
			var days = 7;
		}
		if ( days ) {
			var date = new Date();
			date.setTime( date.getTime() + ( days*24*60*60*1000 ) );
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	}

	function read_cookie( name ) {
		var nameEQ = name + "=";
		var ca = document.cookie.split( ';' );
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while ( c.charAt( 0 )==' ' ) {
				c = c.substring( 1, c.length );
				if ( c.indexOf( nameEQ ) == 0 ) {
					return c.substring( nameEQ.length,c.length );
				}
			}
		}
		return false;
	}

	function erase_cookie( name ) {
		create_cookie( name, "", -1 );
	}

//#####################################
// Get TPH Unique User IDs from cookies
//#####################################

	function tph_get_uuids() {
		var tph_uuids_cookie = [];

		if ( read_cookie( 'tph_uuid_FB' ) ) {
			tph_uuids_cookie.push( "FB-"+read_cookie( 'tph_uuid_FB' ) );
		}

		if ( read_cookie( 'tph_uuid_YLM' ) ) {
			tph_uuids_cookie.push( "YLM-"+read_cookie( 'tph_uuid_YLM' ) );
		}

		return tph_uuids_cookie;
	}


//########################
// Section Title Here
//########################

jQuery(document).ready(function($) {
	
	//####################################################################################
	// Check and see if Google Tag Manager is enabled, don't fire local FB pixel if true..
	//####################################################################################
	if ( use_google_tag_manager == false ) {
  
		//################################
		// Tracking pixel for signup forms
		//################################
			jQuery( '.yesmailForm' ).on( 'submit', function() {
				var form_location = jQuery( this ).attr( 'form-location' );
				if ( form_location == '' || form_location == null ) {
					form_location = 'not_set';
				}
			
				jQuery( document ).on( 'DOMNodeInserted', function( e ) {
					if ( jQuery( e.target ).hasClass( 'error' ) ) {
						fbq( 'trackCustom', 'emailSignup', {
							custom_param1: form_location,
							custom_param2: 0
						});
					} else if ( jQuery(e.target).hasClass( 'success' ) ) {
					   fbq( 'trackCustom', 'emailSignup', {
							custom_param1: form_location,
							custom_param2: 1
						}); 
					}
				});
			});

		//#########################################################################
		// Google Adwords + Taboola onclick= attribute addition to affiliate links
		//#########################################################################

			jQuery( 'a[href*="go2cloud.org"],a[href*="t.thepennyhoarder.com"]' ).each( function() {
				jQuery( this ).attr( 'onclick', 'goog_report_conversion(); taboola_clickout();' );
			})
		
		//########################################
		// Facebook init to start Facebook scripts
		//########################################

			!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
			n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
			n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
			t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
			document,'script','https://connect.facebook.net/en_US/fbevents.js');

			fbq( 'init', '263664193816679' );
			fbq( 'track', 'PageView' );
			fbq( 'track', 'ViewContent' );

		//#############################################
		// ClickOut to Facebook on specific pages only.
		//#############################################

			jQuery( "body" ).on( 'click', 'a[href*="thepennyhoarder.go2cloud.org"],a[href*="t.thepennyhoarder.com"]', function( event ) {
				if ( get_url_query_parameter('aff_id') == '4' || get_url_query_parameter('aff_id') == '44' || get_url_query_parameter('aff_id') == '70' || get_url_query_parameter('aff_id') == '84' ) {
					fbq( 'track', 'ClickOut' );
				}
			})
			
	}



	//######################################
	// HasOffers Aff_Sub5 add timestamp UUID
	//######################################
		var check_for_ho_links_loop = 0;
		var check_for_ho_links = setInterval( function() {
			if ( jQuery( 'a[href*=aff_sub5]' ).length >= 1 )  {
				var uuid_timestamp = + new Date();

				jQuery( 'a[href*=aff_sub5]' ).each( function() {
					
					if ( ( ( this.href ).indexOf( 'aff_unique1' ) == -1 ) && ( ( ( this.href ).indexOf( 'aff_id=4&' ) != -1 ) || ( ( this.href ).indexOf( 'aff_id=44&' ) != -1 ) || ( ( this.href ).indexOf( 'aff_id=70&' ) != -1 ) || ( ( this.href ).indexOf( 'aff_id=84&' ) != -1 ) ) ) {
					
						var add_link = '&aff_unique1=' + uuid_timestamp;
						var new_url = jQuery( this ).attr( 'href' ) + add_link;
						jQuery( this ).attr( 'href', new_url );

					}

				});

				clearInterval( check_for_ho_links );
			}

			check_for_ho_links_loop++
			if ( check_for_ho_links_loop >= 60 ) {
				// it has been 3 seconds, stop trying
				clearInterval( check_for_ho_links );
			}
		}, 50 ); 

	//################################
	// HasOffers Popular URL Parameters
	//################################
		// var append_this = '?aff_id=56&utm_source=most_popular&utm_medium=organic';
		// jQuery('.trending-block-popular .trending-block-popular a').each(function(element){
		//     var new_link = jQuery(this).attr('href') + append_this;
		//     jQuery(this).attr('href', new_link);
		// });


	//##################################
	// Open external links in a new tab.
	//##################################

		$( "a[href^='http']" ).filter( function() {
			return this.hostname && this.hostname !== location.hostname;
		}).attr( 'target', '_blank' );
		$( "a[href^=http]" ).each( function() {
			if ( this.href.indexOf( 't.thepennyhoarder.com' ) > -1 ) {
				$( this ).attr( 'target', '_blank' );
			} else if ( this.href.indexOf( 'thepennyhoarder.go2cloud.org' ) > -1) {
				$( this ).attr( 'target', '_blank' );
			}

		});

	//############################################
	// Modify WP caption to use custom TPH caption
	//############################################

		var caption = jQuery('meta[itemprop=caption]').attr("content");
		if (caption === undefined || caption === null || caption == 'undefined') {
			// do nothing if it's undefined
		} else {
			jQuery(".single-post-image-meta-copyright span").text(caption);
		} 

		// Has offers modifications of links on page and tracking urls  

		// updating aff_id and aff_sub3 to values in the URL if they exist
		function replaceQueryParam(param, newval, search) {
			var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
			var query = search.replace(regex, "$1").replace(/&$/, '');
			return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
		}

		// Get all offer links in a post, and register an impressions for them in has offers. 
		// it first appends relevent aff_id info from the URL if it exists
		 
		// Get all offer links in a post, and register an impressions for them in has offers. 
		// it first appends relevent aff_id info from the URL if it exists
		function track_has_offers() {
			var media_buy = get_url_query_parameter( 'media_buy' );
			// Check the cookies to see if UUIDs exist in them.
			var tph_uuids = tph_get_uuids();
			var tph_uuids = tph_uuids.join( "|" );

			// Check to see if the aff_unique2 params in the URL match the cookie.  Prefer the cookie on a per-platform basis if not empty.
			if ( typeof tph_uuids === "undefined" || !tph_uuids ) {
				tph_uuids = get_url_query_parameter( 'aff_unique2' );
			}

			affPos = 0;

			var trackHasOffers = [];
			var check_count = 0;
			var update_ho_tp = setInterval(function(){
				if ( jQuery( 'a[href*="thepennyhoarder.go2cloud.org"]' ).length >= 1) {
					jQuery( 'a[href*="thepennyhoarder.go2cloud.org"]' ).each( function() {

						var this_aff_link = jQuery( this ).attr( 'href' );

						// step 1
						// append source and aff_sub if it exists
							parts = document.location.pathname.split('/');
							source = parts[parts.length - 2];

							if (this_aff_link.indexOf('source=') == -1){
								this_aff_link = this_aff_link + '&source=' + source;
							}

							if ( media_buy !== undefined && this_aff_link.indexOf( 'aff_sub=' ) == -1 ) {
								this_aff_link = this_aff_link + '&aff_sub=' + media_buy;
							} 

							if ( typeof last_aff_link != 'undefined' && last_aff_link == this_aff_link ){
							} else {
								affPos = affPos + 1;
							}
							
							if ( this_aff_link.indexOf( 'aff_unique2=' ) == -1 ){
								this_aff_link = this_aff_link + '&aff_unique2=' + tph_uuids;
							}

							var last_aff_link = jQuery(this).attr('href');

						// step 2
						// append aff_sub5 to affiliate links
							if (this_aff_link.indexOf('aff_sub5=') == -1){
								this_aff_link = this_aff_link + '&aff_sub5=' + affPos;
							}

						// step 3
						// replace current aff link with new one containing additional get variables
							if ( jQuery(this).attr('href') != this_aff_link ) {
							  jQuery(this).attr('href', this_aff_link);
							}

						// step 4
						// add this link to our tracking array so that an impression is tracked for it
							if (this_aff_link.indexOf('offer_id') > -1 && jQuery.inArray( this_aff_link, trackHasOffers ) == -1) {
								trackHasOffers.push(jQuery(this).attr('href'));
							}
					});

					if (typeof trackHasOffers == 'object' && trackHasOffers.length >= 1) {
						// remove duplicates from tracking
						trackHasOffers = trackHasOffers.reduce(function(o, v, i) {
							o[i] = v;
							return o;
						}, {});

						logThis("track_has_offers", trackHasOffers);

						if (typeof trackHasOffers == 'object' && trackHasOffers.length >= 1) {
							// create the impression pixel images and append them to the body 
							var hasoffers_pix = '';
							// jQuery.each(trackHasOffers, function(i, post){
							jQuery.each(trackHasOffers, function(index, item){
								var item = 'https://thepennyhoarder.go2cloud.org/aff_i?'+item.substring(item.indexOf("?") + 1);

								if (window.location.href.indexOf('www.thepennyhoarder.com') == -1 && get_url_query_parameter('aff_id') == false) {
									item = item.replace('aff_id=2&','aff_id=68&');
								} 

								hasoffers_pix = hasoffers_pix + '<img class="hidden" src="'+item+'"  width="1" height="1" />' + "\n";
							});

							jQuery('body').append(hasoffers_pix);    
						}              
					}

					clearInterval(update_ho_tp);
					// logThis("ads found");
				}
				check_count++;
				if (check_count == 20) {
					// logThis("checked for 4 seconds, no ads found");
					clearInterval(update_ho_tp);
				}
			}, 200);
		}
		track_has_offers();

		

	//############################################
	// Bank Rate Test JS
	//############################################

		host = window.location.protocol + "//" + document.domain;
		pageTitle = document.title;
		pageURL = window.location.href.replace(host, "");

		window.addEventListener('blur', function() {
			if (document.activeElement.id == 'placement_180826_0_iframe') {

				// alert("Clicked in the iframe "+pageTitle+" - "+pageURL);

				if (document.domain.indexOf("staging") > -1 || document.domain.indexOf("local") > -1) {
					logThis('Clicked Bank Rate iFrame Test:', pageURL, pageTitle);
					analytics.track('Clicked Bank Rate iFrame', {
						'Page URL': pageURL,
						'Page Title': pageTitle
					}, function() {
						logThis("segment tracked successfully iframe click for bank rate: ");
					});
				} else {
					analytics.track('Clicked Bank Rate iFrame', {
						'Page URL': pageURL,
						'Page Title': pageTitle
					});

				}

			}
		});

	//##############################################################
	// CT FaceBook HasOffers
	//##############################################################
		// temp scipt to help find differences between fb and ho reported clicks
		jQuery("body").on('click', 'a[href*="thepennyhoarder.go2cloud.org"],a[href*="t.thepennyhoarder.com"]', function(event) {

			var click_info             = {};
				click_info.browser_url = location.href;
				click_info.user_agent  = navigator.userAgent;
				click_info.ip          = jQuery('.clicker_number').attr('data-count');
				click_info.clicked_url = this.href;
				click_info.referrer    = document.referrer;
				click_info = encodeURIComponent( JSON.stringify( click_info ) );
		  
			var this_domain = jQuery('meta[rel="currentDomain"]').attr('content');
		  
			var post_to_url = this_domain + '/scripts/hoc.php?data='+click_info;
			
			jQuery.getJSON(post_to_url, function(data_returned) {
			});
		});

	//##########################################
	// Yesmail API
	//##########################################

		// Get the date
		today = $("meta[rel='date:today']").attr('content');


		if ($('meta[rel="email:yesmail"]').attr('content') == 'true') {
				$('#sidebar .clearfix.email-form,#footerForm').addClass('yesmailForm');
				$('#sidebar .clearfix.email-form').attr('form-location','sidebar');
				$('#footerForm').attr('form-location','footer');
		}

		// When the yesmail email input is selected, remove the error message
		$('body').on('focus', '.yesmailForm input[name="email"]', function(event) {
			$(this).closest('form').find('input').removeClass('has-error'); // remove the error class
			$(this).closest('form').find('.help-block').remove(); // remove the error text
		});

		$('body').on('submit', '.yesmailForm', function(event) {

			// Stop the form from submitting the normal way and refreshing the page
			event.preventDefault();

			// When yesmail submit is pressed, remove the error message
			$(this).find('input').removeClass('has-error'); // remove the error class
			$(this).find('.help-block').remove(); // remove the error text
			
			capturelocation = $(this).attr('form-location');
			captureurl = $('meta[rel="url:full"]').attr('content');
			$('form[form-location="'+capturelocation+'"] input[type="submit"]').attr('value','...');
			$('form[form-location="'+capturelocation+'"] input[type="submit"]').prop('disabled',true);
			// Get the form data
			// There are many ways to get this data using jQuery (you can use the class or id also)
			var formData = {
				'email': $(this).find('input[name="email"]').val(),
				'firstName': $(this).find('input[name="firstName"]').val(),
				'lastName': $(this).find('input[name="lastName"]').val(),
				'templateID': $(this).find('input[name="templateID"]').val(),
				'targetList': $(this).find('input[name="targetList"]').val(),
				'listType': $(this).find('input[name="listType"]').val(),
				'captureurl': captureurl,
				'capturelocation': capturelocation
			};

			logThis("Form data");
			logThis(formData);

			// Process the form
			// To test locally, or on staging, uncomment below and comment production url. 
			yesmailURL = $('meta[rel="currentDomain"]').attr('content') + '/api/process-yesmail-api-request.php';
			// yesmailURL = 'https://www.thepennyhoarder.com/api/process-yesmail-api-request.php'; 
			// yesmailURL = 'http://local.thepennyhoarder.com/api/process-yesmail-api-request.php'; 

			logThis( yesmailURL );
			$.ajax({
					type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
					url: yesmailURL, // the url where we want to POST
					data: formData, // our data object
					dataType: 'json', // what type of data do we expect back from the server
					encode: true,
					success: function( dataReturned ) {
						logThis( "Successful Call" );
						logThis( dataReturned );
						logThis( capturelocation );

						// Here we will handle errors and validation messages
						if ( typeof dataReturned == 'undefined' || dataReturned == null ) {
							$('form[form-location="'+capturelocation+'"] input[type="email"]').addClass('has-error'); // Red input box on error
								if (capturelocation == 'footer') {
									$('form[form-location="'+capturelocation+'"] .input-group').after('<div class="help-block error">There was an issue, please try again.</div>'); // Generic error message return
								}   else {
									$('form[form-location="'+capturelocation+'"] .input-group-btn').after('<div class="help-block error">There was an issue, please try again.</div>'); // Generic error message return
								}

						} else if (!dataReturned.success) {
							// Handle errors for email
							if (dataReturned.errors.email != '') {
								$('form[form-location="'+capturelocation+'"] input[type="email"]').addClass('has-error'); // Red input box on error
								
								if (capturelocation == 'footer') {
									$('form[form-location="' + capturelocation + '"] .input-group').after('<div class="help-block error">' + dataReturned.errors.email + '</div>'); // Error message return
								// if capture location is subsribe page
								} else if(capturelocation == 'subscribe-page'){
									// if email required error AND first name required error, show message on both inputs
									if(dataReturned.errors.email == 'Email is required.' && dataReturned.errors.name == 'First name is required.'){
										$( 'form[form-location="' + capturelocation + '"] input[name="email"]' ).attr( 'placeholder', 'Please enter your email address.' ).val(''); // Error message return
										$( 'form[form-location="' + capturelocation + '"] input[name="firstName"]' ).addClass( 'has-error' ); // Red input box on error
										$( 'form[form-location="' + capturelocation + '"] input[name="firstName"]' ).attr( 'placeholder', 'Please enter your first name.' ).val(''); // Error message return
									// else if only email error, show message on email input
									} else if(dataReturned.errors.email == 'Email is required.'){
										$( 'form[form-location="' + capturelocation + '"] input[name="email"]' ).attr( 'placeholder', 'Please enter your email address.' ).val(''); // Error message return
									// else if only first name error, show message on first name input
									} else if( dataReturned.errors.name == 'First name is required.' ){
										$( 'form[form-location="' + capturelocation + '"] input[type="email"]' ).removeClass( 'has-error' )
										$( 'form[form-location="' + capturelocation + '"] input[name="firstName"]' ).addClass( 'has-error' ); // Red input box on error
										$( 'form[form-location="' + capturelocation + '"] input[name="firstName"]' ).attr( 'placeholder', 'Please enter your first name.' ).val(''); // Error message return
									} else {
										$('form[form-location="'+capturelocation+'"] input[name="email"]').attr('placeholder', dataReturned.errors.email).val(''); // Error message return
									}
								// else if capture location is university landing page
								} else if(capturelocation == 'university-ecourse-page') {
									// if email required error AND first name required error, show message on both inputs
									if(dataReturned.errors.email == 'Email is required.' && dataReturned.errors.name == 'First name is required.'){
										$( 'form[form-location="' + capturelocation + '"] input[name="email"]' ).attr( 'placeholder', 'Please enter your email address.' ).val(''); // Error message return
										$( 'form[form-location="' + capturelocation + '"] input[name="firstName"]' ).addClass( 'has-error' ); // Red input box on error
										$( 'form[form-location="' + capturelocation + '"] input[name="firstName"]' ).attr( 'placeholder', 'Please enter your first name.' ).val(''); // Error message return
									// else if only email error, show message on email input
									} else if(dataReturned.errors.email == 'Email is required.'){
										$( 'form[form-location="' + capturelocation + '"] input[name="email"]' ).attr( 'placeholder', 'Please enter your email address.' ).val(''); // Error message return
									// else if only first name error, show message on first name input
									} else if( dataReturned.errors.name == 'First name is required.' ){
										$( 'form[form-location="' + capturelocation + '"] input[type="email"]' ).removeClass( 'has-error' )
										$( 'form[form-location="' + capturelocation + '"] input[name="firstName"]' ).addClass( 'has-error' ); // Red input box on error
										$( 'form[form-location="' + capturelocation + '"] input[name="firstName"]' ).attr( 'placeholder', 'Please enter your first name.' ).val(''); // Error message return
									// else, show error message on email input
									} else {
										$('form[form-location="'+capturelocation+'"] input[name="email"]').attr('placeholder', dataReturned.errors.email).val(''); // Error message return
									}
								} else if (capturelocation == 'money-in-your-pocket') {
									$( '#money-in-your-pocket-email' ).hide();
									$( '#money-in-your-pocket' ).append( '<div class="money-in-your-pocket-already-subscribed"><img class="thumbs-up-error" src="/wp-content/themes/pennyhoarder/assets/images/miyp-thumbs-up-selected.png" /> <span class="money-in-your-pocket-blurb">Looks like you’re already a faithful Penny Hoarder! <span class="money-in-your-pocket-blurb-second-line">We hope you’re enjoying the newsletter.</span></span></div>' );
								} else {
									$( 'form[form-location="'+capturelocation+'"] .input-group-btn' ).after( '<div class="help-block error">' + dataReturned.errors.email + '</div>' ); // Error message return
								}

							} else {
								$( 'form[form-location="' + capturelocation + '"] input[type="email"]' ).addClass( 'has-error' ); // Red input box on error
								if ( capturelocation == 'footer' ) {
									$( 'form[form-location="' + capturelocation + '"] .input-group' ).after( '<div class="help-block error">There was an issue, please try again...</div>' ); // Error message return
								 } else {
									$( 'form[form-location="' + capturelocation + '"] .input-group-btn' ).after( '<div class="help-block error">There was an issue, please try again...</div>' ); // Error message return
								}
							}

						} else {
							// ALL GOOD! just show the success message!
							
							// $('form[form-location="'+capturelocation+'"] input[type="submit"]').attr('value','Success! You Rock!');
							// $('form[form-location="'+capturelocation+'"] input[type="submit"]').prop('disabled', 'true');
							if ( capturelocation == 'footer' ) {
								$( 'form[form-location="' + capturelocation + '"] .input-group' ).after( '<div class="help-block success" hidden>Success! You Rock!</div>' );
							} else if ( capturelocation == 'subscribe-page' ) {
								$( 'form[form-location="' + capturelocation + '"]' ).parent().hide();
								$( '.subscribe-description' ).parent().append( '<img class="success-stamp" src="/wp-content/themes/pennyhoarder/assets/images/success.png">' );
							} else if ( capturelocation == 'university-ecourse-page' ){
								$( 'form[form-location="' + capturelocation + '"]' ).parent().hide();
								$( '.subscribe-description' ).parent().append( '<h3 class="form-success-message">THANK YOU!</h3>' );
								$( '.subscribe-description' ).parent().append( '<div class="form-success-btn"><img src="/wp-content/themes/pennyhoarder/assets/images/success-checkmark.png"> SUCCESS</div>' );
							} else if ( capturelocation == 'money-in-your-pocket' ) {
								$( '#money-in-your-pocket-email' ).hide();
								$( '#money-in-your-pocket' ).append( '<div class="money-in-your-pocket-new-subscriber"><img class="thumbs-up-success" src="/wp-content/themes/pennyhoarder/assets/images/miyp-check-mark.png" /> <span class="money-in-your-pocket-blurb">Thank you!</span></div>' );
							} else {
								$( 'form[form-location="' + capturelocation + '"] .input-group-btn' ).after( '<div class="help-block success" hidden>Success! You Rock!</div>' );
							}
							
							$(' form[form-location="' + capturelocation + '"] .help-block' ).slideDown();
							// $('form[form-location="'+capturelocation+'"] input[type="submit"]').after('<div class="help-block">' + dataReturned.message + '</div>');
						}

						$( 'form[form-location="' + capturelocation + '"] input[type="submit"]' ).prop( 'disabled', false );
						$( 'form[form-location="' + capturelocation + '"] input[type="submit"]' ).attr( 'value','SUBMIT' );
					},
					error: function( xhr, textStatus, error ) {
						logThis( "CALL FAILED" );
						logThis( dataReturned );
						logThis( 'textStatus: ' + textStatus );
						logThis( 'error: ' + error );
						logThis( 'responseText: ' + xhr.responseText );
					}

				});

			// $(this).find('input[type="submit"]').prop('disabled',false);
			// $(this).find('input[type="submit"]').attr('value','SUBMIT');
				
		});

	// Let's wait a bit longer to run these.
	$( window ).load( function() {

		//########################
		// Get the Parsely UUID
		//########################
			
			var loop_parsely_uuid = 0;
			var parsely_uuid_exists = setInterval( function() {

				if ( typeof PARSELY != 'undefined' &&  typeof PARSELY.config != 'undefined' && typeof PARSELY.config.parsely_site_uuid != 'undefined' &&  PARSELY.config.parsely_site_uuid != '' ) {

					// Get the unique user identifier from Parsely
					parsely_uuid = PARSELY.config.parsely_site_uuid;

					if(window.location.hostname == 'www.thepennyhoarder.com'){
						current_page_url = location.href;
					} else {
					current_page_url = location.href.replace('http://local', 'https://www');
						}

					// parsely api endpoint to track page the user is on
					var parsely_track_profile_url = 'https://api.parsely.com/v2/profile?apikey=thepennyhoarder.com&uuid='+parsely_uuid+'&url='+current_page_url;

					// send data to parsely to track in users profile
					jQuery.get(parsely_track_profile_url, function(response, status){
						// logThis(response);
					});

					// logThis( parsely_uuid );
					clearInterval( parsely_uuid_exists );
				} else {
					loop_parsely_uuid++;

					if ( loop_parsely_uuid >= 15 ) {
						// it has been 3 seconds, stop trying
						logThis('Parsely not ready, cannot get uuid.');
						clearInterval( parsely_uuid_exists );
					}
				}

			}, 200 );




					//###############
					// Parsely Beacon
					//###############
						var url = 'https://www.thepennyhoarder.com' + location.pathname;
						// var urlref = 'https://www.thepennyhoarder.com';

						var beacon_data = {
							url: url,
							// urlref: urlref,
							// surl: urlref,
							action: '_tph_uiuid',
							data: {
									_tph_unique2: tph_uuids_object,
									_tph_uuid_cookie: tph_uuids_cookie
							}
						};
						fire_parsely_event(beacon_data);


	  
		//###############################
		// TPH Fingerprinting to Redshift
		//###############################
		// If a user comes with an aff_unique2 set, split it into an object and cookies.
		// Get the URL parameters, split them into an object, check the object against
			var tph_uuids_object = {};
			
			if ( get_url_query_parameter('aff_unique2') !== false ) {
				var tph_uuid = get_url_query_parameter('aff_unique2');
				var tph_uuids = tph_uuid.split("|");
				// Parse into object -- YLM-12345678, FB-123456789
				for ( var i = 0; i < tph_uuids.length; i++ ) {
					var split = tph_uuids[i].split('-');
					tph_uuids_object[split[0].trim()] = split[1].trim();
					create_cookie( 'tph_uuid_'+split[0].trim(), split[1].trim(), 365 );
				}
			}

			var tph_uuids_cookie = tph_get_uuids();



		//#####################
		// Money In Your Pocket
		//#####################
		if ( $( 'body' ).hasClass( 'single-post' ) ) {
			var post_id = jQuery( '#post_id' ).val();
			jQuery( "#money-in-your-pocket-thumbs img.money-in-your-pocket.thumbs-up" ).bind( "mouseenter", function() {
				if ( window.innerWidth > 1199 && !jQuery( "#money-in-your-pocket-thumbs img.thumbs-down" ).hasClass( "thumbs-down-selected" ) ){
						jQuery( this ).attr( "src", "/wp-content/themes/pennyhoarder/assets/images/miyp-thumbs-up-selected.png" );
				}
			});
			jQuery( "#money-in-your-pocket-thumbs img.money-in-your-pocket.thumbs-up" ).bind( "mouseleave", function() {
				if ( window.innerWidth > 1199 && !jQuery( "#money-in-your-pocket-thumbs img.thumbs-down" ).hasClass( "thumbs-down-selected" ) ){
					jQuery( this ).attr( "src", "/wp-content/themes/pennyhoarder/assets/images/miyp-thumbs-up.png" );
				}
			});
			jQuery( "#money-in-your-pocket-thumbs img.money-in-your-pocket.thumbs-down" ).bind( "mouseenter", function() {
				if ( window.innerWidth > 1199 ){
					jQuery( this ).attr( "src", "/wp-content/themes/pennyhoarder/assets/images/miyp-thumbs-down-selected.png" );
				}
			});
			jQuery( "#money-in-your-pocket-thumbs img.money-in-your-pocket.thumbs-down" ).bind( "mouseleave", function() {
				if ( window.innerWidth > 1199 ){
					jQuery( this ).attr( "src", "/wp-content/themes/pennyhoarder/assets/images/miyp-thumbs-down.png" );
				}
			});

			//#####################################################################################
			// Check the thumb cookie status for Money In Your Pocket, set one if it doesn't exist.
			//#####################################################################################


				if ( read_cookie( 'tph_thumbs_up' ) == false ) {
					create_cookie( 'tph_thumbs_up', '[0]', 3650 );
				}

				if ( read_cookie( 'tph_thumbs_down' ) == false ) {
					create_cookie( 'tph_thumbs_down', '[0]', 3650 );
				}

				if ( read_cookie( 'user_email' ) == false ) {
					create_cookie( 'user_email', '0', 3650 );
				}

			//#####################################
			// Check for thumb status on page load.
			//#####################################

				parsely_thumb_list( post_id );

		}
	}) // Window Load
}); // Document Ready

//########################
// Money In Your Pocket
//########################

// AMP slated for phase 2 if viable.  CSS/cookie/origin/session limitations.

	if (typeof tph_thumbs_down == 'undefined') {
		var tph_thumbs_down = [];
	}
	if (typeof tph_thumbs_up == 'undefined') {
		var tph_thumbs_up = [];
	}
	if (typeof tph_user_email == 'undefined') {
		var tph_user_email = [];
	}

	function parsely_thumb_list( post_id ) {
		// Parse the cookie into an array
		tph_thumbs_down = JSON.parse( read_cookie( "tph_thumbs_down" ) );
		tph_thumbs_up = JSON.parse( read_cookie( "tph_thumbs_up" ) );
		tph_user_email = JSON.parse( read_cookie( "user_email" ) );
		
		// Is this post thumbed up already? 
		if ( jQuery.inArray( post_id, tph_thumbs_up ) >= 0 ) {
			// Don't display any Money in Your Pocket.
			jQuery( "#money-in-your-pocket" ).hide();
			// Is email set in the cookie?
			// if ( tph_user_email.length > 1 ) {
			// }
		}

		// If the cookie is already set to thumbs down on this post, select it for this user.
		if ( jQuery.inArray( post_id, tph_thumbs_down ) >= 0 ) {
			jQuery( ".money-in-your-pocket.thumbs-down" ).addClass( "thumbs-down-selected" ).attr( "src", "/wp-content/themes/pennyhoarder/assets/images/miyp-thumbs-down-selected.png" );
			jQuery( ".money-in-your-pocket.thumbs-up" ).attr( "src", "/wp-content/themes/pennyhoarder/assets/images/miyp-thumbs-up-deselected.png" );

		}
	}

	// Store users email in the cookie.
	function parsely_user_email() {
		var user_email = jQuery( '.at-newsletter-email-field.form-control' ).val();
		create_cookie( 'tph_user_email', user_email, 3650 );
	}

	// User selects 'X'.
	function money_in_your_pocket_hide() {

		jQuery( "#money-in-your-pocket" ).hide();
	}

	function parsely_thumbs_up( post_id ) {
		if (typeof tph_thumbs_up == 'undefined') {
            return; // not fully loaded yet
        }

		tph_thumbs_up.push( post_id );
		create_cookie( "tph_thumbs_up", JSON.stringify( tph_thumbs_up ), 3650 );
		
		// Switch to selected image on thumbs up and disable further button pushing.
		jQuery( ".money-in-your-pocket.thumbs-up" ).addClass( "thumbs-up-selected" ).attr( "src", "/wp-content/themes/pennyhoarder/assets/images/miyp-thumbs-up-selected.png" )
		jQuery( "#money-in-your-pocket-thumbs").attr( "disabled", true );
		jQuery( ".money-in-your-pocket.thumbs-down" ).attr( "src", "/wp-content/themes/pennyhoarder/assets/images/miyp-thumbs-down-deselected.png" )
		
		// Wait just half a second now.
		setTimeout(function () {
			jQuery( "#money-in-your-pocket" ).addClass( "flipped" );
		}, 500);
	   
		// Post ID, URL, Thumbs Up.
		parsely_submit_thumb( post_id, window.location.href, 1 );
	}

	function parsely_thumbs_down( post_id ) {
		if (typeof tph_thumbs_down == 'undefined') {
            return; // not fully loaded yet
        }

		// If it's already selected, deselect it, and continue.
		if ( jQuery( "#money-in-your-pocket-thumbs .thumbs-down" ).hasClass( "thumbs-down-selected" ) ) {
			jQuery( ".money-in-your-pocket.thumbs-down-selected" ).removeClass( "thumbs-down-selected" ).attr( "src", "/wp-content/themes/pennyhoarder/assets/images/miyp-thumbs-down.png" );
			// Switch to normal image on thumbs up.
			jQuery( ".money-in-your-pocket.thumbs-up" ).attr( "src", "/wp-content/themes/pennyhoarder/assets/images/miyp-thumbs-up.png" );
			
			// Submit the post ID, URL, Thumbs Down Deselected.
			parsely_submit_thumb( post_id, window.location.href, 2);

			// Splice out that ID safely from the array
			var thumbs_index = jQuery.inArray( post_id, tph_thumbs_down);
			if ( thumbs_index >= 0 ) {
				tph_thumbs_down.splice( thumbs_index, 1 );
			}
			// Recreate the cookie without that ID.
			create_cookie( "tph_thumbs_down", JSON.stringify( tph_thumbs_down ), 3650 );
		} else {

			jQuery( ".money-in-your-pocket.thumbs-down" ).addClass( "thumbs-down-selected" ).attr( "src", "/wp-content/themes/pennyhoarder/assets/images/miyp-thumbs-down-selected.png" );
			// Switch to deselected image for thumbs up.
			jQuery( ".money-in-your-pocket.thumbs-up" ).attr( "src", "/wp-content/themes/pennyhoarder/assets/images/miyp-thumbs-up-deselected.png" );
			tph_thumbs_down.push( post_id );
			create_cookie( "tph_thumbs_down", JSON.stringify( tph_thumbs_down ), 3650 );
			// Post ID, URL, and Thumbs Up/Down
			parsely_submit_thumb( post_id, window.location.href, 0 );
		}

	}

	// Submit the data to the data pipeline.
	// https://www.parse.ly/help/integration/dynamic/
	// https://www.parse.ly/help/integration/validate/






	function parsely_submit_thumb( post_id, url, thumb_status ) {
		create_cookie( 'tph_parsely_UUID', parsely_uuid, 3650 );
		// get post url
		var url = 'https://www.thepennyhoarder.com' + location.pathname;
		// get full host url
		// var urlref = 'https://www.thepennyhoarder.com';
		// and Date/Time in "YYYY-MM-DD HH:MM:SS
		var currentdate = new Date(); 
		var parsely_datetime = currentdate.getUTCFullYear() + "-" + ( currentdate.getUTCMonth() + 1 ) + "-" + currentdate.getUTCDate() + " " + currentdate.getUTCHours() + ":" + currentdate.getUTCMinutes() + ":" + currentdate.getUTCSeconds(); 
		// logThis(document.cookie);
		// logThis( parsely_datetime );
		// Example result to the pipeline: 
			//  "extra_data": {"_thumb_status": 1, "_thumb_parsely_uuid": "########-####-####-####-############", "_thumb_post_id": "58971", "_thumb_timestamp": "2017-9-20 20:0:39", "_thumb_url": "https://www.thepennyhoarder.com/life/college/millennials-scared-to-invest/"}

			var beacon_data = {
				url: url,
				// urlref: urlref,
				// surl: urlref,
				action: '_miyp_submit_thumb',
				data: {
					_thumb_parsely_uuid: parsely_uuid,
					_thumb_post_id: post_id,
					_thumb_url: url,
					_thumb_status: thumb_status,
					_thumb_timestamp: parsely_datetime
				}
			};
			fire_parsely_event(beacon_data);

		return true;

	}


//##########################################################
// Add Parsely tracking to all social share links on posts
//##########################################################

	jQuery( ".single-social li a" ).on( 'click', function() {
		
		// if (typeof PARSELY != 'undefined' && typeof PARSELY.beacon != 'undefined') {
			// get post url
			var url = 'https://www.thepennyhoarder.com' + location.pathname;
			// get full host url
			// var urlref = 'https://www.thepennyhoarder.com';
			// get button classes from parent of this link so we know what platform we are sharing to
			var button_classes = jQuery( this ).parent().attr( 'class' );
			// only grab the first class (ie: at-top-fb-share)
			var button_location = button_classes.split(' ')[0];
			// check if clicked button is on sticky menu or not
			// if it is sticky, replace 'top' in class with 'sticky'
			if( jQuery( this ).parents( '.sticky-social' ).hasClass( 'fixed' ) ){
				var action_name = button_location.replace( 'top', 'sticky' );
			} else {
				var action_name = button_location;
			}
			// append '_' to beginning of action name because that's how parsely wants the action value to start
			var action = '_' + action_name;
			// send data to parse.ly

			var beacon_data = {
				url: url,
				// urlref: urlref,
				// surl: urlref,
				action: '_social_share_click',
				data: {
					_share_icon_click: action,
				}
			};
			fire_parsely_event(beacon_data);

			return true;

		// } else {
			// logThis('Parsely not ready, will not submit data.');
			// return false;
		// }
			   

	});




//##########################################################
// Recommended Content
//##########################################################

	function rec_content_block_c(){

		// get unique user identifier from parsely
		var uuid = PARSELY.config.parsely_site_uuid;

		var parsely_related_content_url = 'https://api.parsely.com/v2/related?apikey=thepennyhoarder.com&uuid='+uuid+'&limit=25';

		var posts = [];

		var post_titles = [];

		var debug = get_url_query_parameter('tph_debug_block_c');

		// logThis('UUID: ' + uuid);
		// logThis('PRS URL: ' + parsely_related_content_url);

		// api call to parsely to get all recommended posts based on uuid. 
		// we are getting 11 posts. 10 to display, and 1 for back up in case current post is a post in the returned list
		jQuery.get(parsely_related_content_url, function(response, status){

			if(debug == true){

				jQuery('.debug-c').append("<pre>Parsely UUID: "+PARSELY.config.parsely_site_uuid+"</pre>");

				jQuery('.debug-c').append("<pre>Parsely Get Request Status: "+status+"</pre>");

				jQuery('.debug-c').append("<pre>Parsely Response: "+JSON.stringify(response)+"</pre>");

			}

			// remove what was already in subcategory element to make way for unique posts
			// jQuery('.category-subcategory-post').remove();

			var count = 0;

			// lets loop through each returned post
			jQuery.each(response.data, function(i, post){

				// get location path from returned url
				response_path = post.url.replace('https://www.thepennyhoarder.com', '');

				// make sure we don't show any posts from staging
				// also make sure we don't show a post if we are currently on it
				// finally, make sure we have no posts with duplicate titles in block c
				// also make sure we have no posts with duplicate titles in block b
				if(response_path != location.pathname && post.url.indexOf('https://www.thepennyhoarder.com') != -1 && post_titles.indexOf(post.title) == -1 && jQuery('.block-b').text().indexOf(post.title) == -1 ){

					count++;

					// if we have shown less than 10 posts, keep going until we reach the max
					if(count <= 10){

						// add post title to array so we can check to make sure there are no duplicates
						post_titles.push(post.title);

						// add post title, url and image to array to send through ajax
						posts.push({url:post.url, image:post.image_url, title:post.title});

					}

				}

			});

			// array of all post data
			var postData = {
				posts: posts,
			}

			var expected_posts_returned = '11';

			jQuery('.debug-c').append("<pre>Expected Unique Posts Returned: "+expected_posts_returned+"</pre>");
			jQuery('.debug-c').append("<pre>Actual Unique Posts Returned: "+count+"</pre>");

			if(count >= expected_posts_returned){
				jQuery('.debug-c').append("<pre>Passed. Expected amount or more posts have been returned by Parsely.</pre>");
			} else {
				jQuery('.debug-c').append("<pre>Failed. Not enough posts returned from Parsely.</pre>");
			}

			});
	}

	function rec_content_frontend(){

		// if aff_id is not empty, set it
		if(get_url_query_parameter('aff_id') != '' && get_url_query_parameter('aff_id') != false){
			var aff_id = get_url_query_parameter('aff_id');
		// else, if aff_id is empty, set it to the default of 76
		} else {
			var aff_id = 76;
		}

		// get aff_sub2 (path basename) by splitting pathname and returning last value in array
		var aff_sub2 = window.location.pathname.split('/').filter(function(el){ return !!el; }).pop();

		// get aff_sub3 from url parameter
		var aff_sub3 = getUrlParam('aff_sub3');

		// get unique user identifier from parsely
		var uuid = PARSELY.config.parsely_site_uuid;

		var parsely_related_content_url = 'https://api.parsely.com/v2/related?apikey=thepennyhoarder.com&uuid='+uuid+'&limit=25';

		var post_titles = [];

		// logThis('UUID: ' + uuid);
		// logThis('PRS URL: ' + parsely_related_content_url);

		// api call to parsely to get all recommended posts based on uuid. 
		// we are getting 11 posts. 10 to display, and 1 for back up in case current post is a post in the returned list
		jQuery.get(parsely_related_content_url, function(response, status){
			if(status == 'success'){

				// remove what was already in subcategory element to make way for unique posts
				jQuery('.category-subcategory-post').remove();

				var count = 0;

				// lets loop through each returned post
				jQuery.each(response.data, function(i, post){

					// get location path from returned url
					response_path = post.url.replace('https://www.thepennyhoarder.com', '');

					current_post_title = jQuery('.single-post-title').text();

					// make sure we don't show any posts from anywhere but production
					// also make sure we don't show a post if we are currently on it by checking current path vs post path and current title vs post title
					// finally, make sure we have no posts with duplicate titles in block c
					// also make sure we have no posts with duplicate titles in block b
					if(response_path != location.pathname && post.title != current_post_title && post.url.includes('https://www.thepennyhoarder.com') == true && post_titles.indexOf(post.title) > -1 === false && jQuery('.block-b').text().indexOf(post.title) > -1 === false ){

						// if we have shown less than 10 posts, keep going until we reach the max
						if(count <= 9){

							count++;

							// add post title to array so we can check to make sure there are no duplicates
							post_titles.push(post.title);

							// format url to include block, block position, post id and current post id
							// ie: rc=c-2-8292-3733
							// if aff_sub3 is not empty, add it to url along with dynamic aff_id and aff_sub2
							if(aff_sub3 != ''){
								url = post.url + '?aff_id='+aff_id+'&utm_source=tph&utm_medium=organic&aff_sub2='+aff_sub2+'&aff_sub3='+aff_sub3+'&rc=on-c-' + count + '-' + current_post_id;
							// else, only add dynamic aff_id and aff_sub2 to url
							} else {
								url = post.url + '?aff_id='+aff_id+'&utm_source=tph&utm_medium=organic&aff_sub2='+aff_sub2+'&rc=on-c-' + count + '-' + current_post_id;
							}

							// classes for mobile sizes
							// if first post, make full width
							if(count <= 1){
								var mobile_class = 'col-xs-12';
							// else, if post is after #5, hide on sm and xs
							} else if(count > 5){
								var mobile_class = 'col-xs-6 hidden-xs hidden-sm';
							// else, just make half width
							}else {
								var mobile_class = 'col-xs-6';
							}

							// append post image, title, and link inside subcategory-post element
							jQuery('.category-subcategory-posts').append('<div class="'+mobile_class+' col-md-2 category-subcategory-post text-center block-c"><div class="col-xs-12 category-subcategory-post-image"><a class="recommended-'+count+'" href='+url+'></a></div><div class="col-xs-12 category-subcategory-post-content"><a href='+url+' class="photo-essay-article-content-title">'+post.title+'</a></div></div>');

							// append picture inside of link so it does not turn out empty
							jQuery('.recommended-'+count).append('<picture class="four_by_six"><img class="lazyload" src='+post.image_url+' alt='+post.title+'></picture>');

						}

					}

				});

			}
		});
	}


//##########################################################
// Replace logout URLs on frontend so they don't throw 404
//##########################################################

	jQuery(document).ready(function($){
		// if wp-admin-bar-logout exists (user is logged in)
		if($('#wp-admin-bar-logout').length){
			logout_element = $('#wp-admin-bar-logout').find('a');
			logout_link = logout_element.attr('href');

			// if logoout_link contains 'action=logout', fix url then replace it
			if (logout_link.indexOf("action=logout") >= 0) {
				new_url = logout_link.replace('staff', 'wp-login.php');
				$(logout_element).attr('href', new_url);
			}
		}
	});