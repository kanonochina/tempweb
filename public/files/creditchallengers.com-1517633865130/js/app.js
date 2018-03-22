$(function() {

    // loadPush();
    var $formStart = Math.floor(Date.now() / 1000);

    var isValid = true;

    var $validator = $("#cta_form").validate({
      rules: {
        first_name: {
          required: true
        },
        last_name: {
          required: true
        },
        email: {
          required: true,
          email: true
        },
        phone: {
          required: true,
          digits: true
        },
        address: {
          required: true
        },
        zip: {
          required: true,
          digits: true,
          minlength: 5,
          maxlength: 5
        },
        debt: {
          required: true
        }
      }
    });


    function validateForm()
    {
       var $valid = $("#cta_form").valid();
        if(!$valid) {
            $validator.focusInvalid();
            return false;
        }
        return true;
    }

    $(document).ready(function() {

          function scrollIntoView() {
              $('html, body').animate({
                  scrollTop: $("#form").offset().top-50
              }, 500);
          }

          setTimeout(scrollIntoView, 500);

          function triggerSlide()
          {
            hash = location.hash.replace('#', '');
            tab = $('#show-tab-' + hash);
              console.log(tab);
            if (tab.length !== 0) {
              tab.tab('show');
            }
            return false;
          }
          
          triggerSlide();


          $(document).keypress(function(e) {
              if (e.which == 13) {
                 e.preventDefault();
                  var isValid = validateForm();
                  setTimeout(function() {
                    if (isValid) {
                      $('.tab-pane.active').find('.btn-next').click();
                    }
                  }, 250);
                  return false;
              }
          });

          $('#form').bootstrapWizard({
              tabClass: '',
              onNext: function(tab, navigation, index) {
                if (!validateForm()) {
                  return false;
                }
                setTimeout(function() {
                  $('.tab-pane.active').find('.form-control').eq(0).focus();
                }, 500);
                return true;
              },
              onTabShow: function(tab, navigation, index) {
                $('.tab-pane.active').find('.form-control').focus();
              }
          });
          
          $('.btn-redirect').click(function() {
            var el = $(this);
            setTimeout(function() {
              doRedirect(el.attr('data-link'));
            }, 250);
            return true;
          });

          $('.submit-form').on('click', function(){
            if (!$(this).hasClass('disabled')) {
              $(this).addClass('disabled');
              submitForm();
            } else {
              // console.log('Form data already submitted');
            }
            return true;
          }); 

          $('.progress').change(function() {
            $(this).parents('.tab-pane').find('.btn-next').click();
          });

          $('.btn-loan-yes').on('click', function() {
            // $('#method').val('submitPaydayLoanLead');
          });


          /*
          $('#zip_code').blur(function() {
            zip = $(this).val();
            jQuery.ajax({
              url: $home + '/ajax.php',
              type: 'POST',
              data: {check: 'getLocationFromZip', zip_code: zip},
            }).done(function(res) {
              if (res.city) {
                $('#city').val(res.city);
              }
              if (res.state) {
                $('#state').val(res.state);
                // $('#license_state option[value="' + res.state + '"]').prop('selected', true);
              }
            });
          });
          */

          $('#submit').on('click', function(e) {
              e.preventDefault();
              $('#cta_form').submit();
              return true;
          });

          $('.btn-loan-yes').on('click', function() {
              
              $('.disclaimer1').stop(true, true).fadeOut(500, function() {
                  $('.disclaimer2').stop(true, true).fadeIn(500);
              });
              ga('send', 'event', 'buttons', 'yes', 'Personal Loan');
              // console.log('Fired GA event');
          });

          $('.btn-loan-no').on('click', function() {
              ga('send', 'event', 'buttons', 'no', 'Personal Loan');
              // console.log('Fired GA event');
          });

          // function showLastSlide() {
            // $('#rootwizard').bootstrapWizard('display', $('#stepid').val());
          // }

          $('.tcpa-opt-out').on('click', function() {
            $('#tcpa_optout').val('true');
            return false;
          });
      });
    
    /*
    $('.btn-check-email').on('click', function() {
      pattern = /@gmail\.com$/i
      email = $('#email_address').val();

      // Is this a gmail user, and should we verify?
      if (pattern.test(email) && $verify) {
        $('#cta_form').prop('action', 'submit_verify.php').submit();
        return false;
      }
      return true;
    });
    */

    /*
    function submitForm() {
      frm = $('#cta_form');
      frmData = frm.serialize();
      // console.log('Form data submitted');
      // console.log(frmData);
      jQuery.ajax({
        url: $home + '/submit.php?ajax=true',
        data: frmData
      });
      return true;
    }
    */

    function doRedirect(redirectUrl) {
        // var redirectUrl = $('#redirect_url').val();
        // console.log(redirectUrl);
        redirectUrl += (redirectUrl.indexOf('?') === -1) ? '?' : '&';
        redirectUrl += 'email=' + encodeURIComponent($('#email_address').val());
        redirectUrl += '&income=' + encodeURIComponent(parseInt($('#income').val()));
        redirectUrl += '&ip=' + encodeURIComponent($('#ip_address').val());
        // redirectUrl += '&first_name=' + encodeURIComponent($('#first_name').val());
        // redirectUrl += '&last_name=' + encodeURIComponent($('#last_name').val());
        // redirectUrl += '&zip=' + encodeURIComponent($('#zip_code').val());
        // redirectUrl += '&address=' + encodeURIComponent($('#address').val());
        setTimeout(function() {
          window.location.href = redirectUrl;
        }, 500);
    }

    $('.btn-check-income').on('click', function() {
      var limit = parseInt($(this).attr('data-income-threshold'));
      var income = parseInt($('#income').val());

      if (!isNaN(limit) && !isNaN(income)) {
        if (income <= limit) {
          // $('#show-tab-terms').tab('show');
          // $('#btn-final-submit').html('Finish').attr('data-link', $('#income_redirect_url').val()).click();
          $('#cta_form').submit();
          
          // loadPush();
          // $('#show-tab-loading').tab('show');
          // setTimeout(function() {
            // submitForm();
            // doRedirect($('#income_redirect_url').val());
          // }, 750);

          return false;
        }  
      }
    });

    
    $('.btn-check-cc-debt').on('click', function() {

        nextTab = 'show-tab-ssn';

        if (validateForm()) {
          val = $('#cc_debt_over_10k').children('option:selected').val();
          console.log(val);
          if (val == 'Yes') {
            nextTab = 'show-tab-cc-debt-optin';
          }  
          $('#' + nextTab).tab('show');
        }
        return false;
    });

    $('.btn-validate-phone').on('click', function() {

      var field = $(this).attr('data-field');
      var el = $(this);
      setTimeout(function() {
        if ($('#' + field).hasClass('error')) {
          $('#show-tab-phone').tab('show');
          return false;
        } else {
          // el.parents('.tab-pane').find('.btn-next').click();
          return true;
        }
      }, 500);
      
      // return false;
    });

  
    // Handle the messages on the ty page if redirecting
    var redirectTimeout = $('#redirectTimeout').val();
    if (typeof redirectTimeout != "undefined") {
     setTimeout(function() {
      $('#line1').fadeOut(300, function() {
        $('#line2').fadeIn(300);
      });
     }, (redirectTimeout-2)*1000)
    }

    $('.tcpa-income-check').on('change', function() {
        threshold = parseInt($(this).attr('data-income-threshold'));
        amount =    parseInt($(this).children('option:selected').val());
        if (isNaN(amount) || amount >= threshold) {
          $('#tcpa-terms').stop(true, true).fadeOut(300);
          $('#agree').prop('required', false);
        } else {
          $('#tcpa-terms').stop(true, true).fadeIn(300);
          $('#agree').prop('required', true);
        }
    });


});