(function ($) {
    $(document).ready(function () {

        $('#mobile-navigation')
            .on('show.bs.collapse', function () {
                $('#navbar-hamburger').addClass('hidden');
                $('#navbar-close').removeClass('hidden');
                $('body').addClass('menu-open');

                if ($('li.current-menu-item').length) {
                    $('li.current-menu-item').addClass('open');
                }
                if ($('li.current-category-parent').not('.current-menu-item').length) {
                    $('li.current-category-parent').not('.current-menu-item').addClass('open');
                }
            })
            .on('hide.bs.collapse', function () {
                $('#navbar-hamburger').removeClass('hidden');
                $('#navbar-close').addClass('hidden');
                $('body').removeClass('menu-open');
                if ($('li.menu-item').not('.current-menu-item').not('.current-category-parent').length) {
                    $('li.menu-item').not('.current-menu-item').not('.current-category-parent').removeClass('open');
                }

                if ($('li.current-category-parent.current-menu-item').length) {
                    $('li.current-category-parent.current-menu-item').addClass('open');
                }
            });

        $('i.dropdown-activator').click(function (e) {
            e.preventDefault();
            $(this).parent().parent().toggleClass('open');
            //$(this).parent().parent().siblings().removeClass('open');

            if ($(window).width() < 992) {
                var offset = $(this).parent().parent().offset().top + $(this).parent().parent().height();
                if( offset > $(window).height() ) {
                    $('.navbar-collapse').animate({scrollTop: offset - $(window).height()}, 1000);
                }
            }
        })

        $('.navbar-default .navbar-nav.navbar-right a.social-icons i.fa-search').click(function (e) {
            e.preventDefault();
            if ($('.desktop-search-form').length) {
                $('.desktop-search-form').fadeToggle("fast", function () {
                    $(this).toggleClass('activeform');
                    $('.desktop-search-form input').focus();
                });
            }
        })

        if ($('.mobile-search-form').length) {
            $('.mobile-search-form').on('click', '#mobile-search-icon', function (e) {
                e.preventDefault();
                if ($("#mobile-search-term").val() != '') {
                    $('form#mobile-search').submit();
                } else {
                    $("#mobile-search-term").focus();
                }
            })
        }

        if ($('.row.main-vertical-block div .panel-heading a').length) {
            $('.row.main-vertical-block div .panel-heading a').hover(
                function () {
                    $(this).parent().addClass("active").siblings('.panel-body').addClass('active');
                }, function () {
                    $(this).parent().removeClass("active").siblings('.panel-body').removeClass('active');
                }
            );
        }

        var cnt = 2;
        // Load More button
        $('.btn-load-more').on('click', function (e) {
            e.preventDefault();
            console.log(cnt);
            if( cnt < 6 ) {
               $('div[data-placement-id="posts-block-' + cnt + '"]').toggle().fadeIn();
            }

            if( cnt >= 5 ) {
                $(this).attr('disabled', 'disabled').html('More Below');
            }

            cnt++;
        })

        var cnt_sub = 1;

        if( $( 'div.page-container' ).length ) {
            if ($('div.page-container').hasClass('subcategory-page')) {
                if (!$('.subcategory-load-1').length) {
                    $('.btn-sub-load-more').attr('disabled', 'disabled').html('More Below');
                }
            }
        }

        $('.btn-sub-load-more').on('click', function (e) {
            e.preventDefault();

            if( $( '.subcategory-load-' + cnt_sub ).length ) {
                $( '.subcategory-load-' + cnt_sub ).toggle().fadeIn();
            }

            var new_cnt = cnt_sub + 1;

            if( ! $( '.subcategory-load-' + new_cnt ).length ) {
                $(this).attr('disabled', 'disabled').html('More Below');
            }

            cnt_sub++;

        })


        var cnt_main = 1;

        if( $( 'div.page-container' ).length ) {
            if ($('div.page-container').hasClass('category-page')) {
                if (!$('.category-main-load-more-1').length) {
                    $('.btn-main-load-more').attr('disabled', 'disabled').html('More Below');
                }
            }
        }

        $('.btn-main-load-more').on('click', function (e) {
            e.preventDefault();

            if( $( '.category-main-load-more-' + cnt_main ).length ) {
                $( '.category-main-load-more-' + cnt_main ).toggle().fadeIn();
            }

            var new_main_cnt = cnt_main + 1;

            if( ! $( '.category-main-load-more-' + new_main_cnt ).length ) {
                $(this).attr('disabled', 'disabled').html('More Below');
            }

            cnt_main++;

        })


        /* Make Social Icons fixed at the bottom on mobile */

        $(window).scroll(function() {
            var distanceFromTop = $(this).scrollTop();
            if( $('.single-post-social-top').length ) {
                if (distanceFromTop >= $('.single-post-social-top').offset().top) {
                    $('.sticky-social').addClass('fixed');
                } else {
                    $('.sticky-social').removeClass('fixed');
                }
            }
        });



        $(window).on('resize', function () {
            if( $('#wpadminbar').length ) {
                $(".navbar-collapse").css({maxHeight: $(window).height() - $(".navbar-header").height() - $("#wpadminbar").height() + "px"});
            } else {
                $(".navbar-collapse").css({maxHeight: $(window).height() - $(".navbar-header").height() + "px"});
            }
        });

        $(window).resize();

        /**
         * Determine the mobile operating system.
         * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
         *
         * @returns {String}
         */
        function getMobileOperatingSystem() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;

            if (/windows phone/i.test(userAgent)) {
                return "Windows Phone";
            }

            if (/android/i.test(userAgent)) {
                return "Android";
            }

            if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                return "iOS";
            }

            return "unknown";
        }

         if( $('body').hasClass('single-post')) {
            if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                if (typeof $( 'a[href^="sms:?"]' ).attr( 'href' ) != "undefined") {
                    var new_url = $( 'a[href^="sms:?"]' ).attr( 'href' ).replace( 'sms:?', 'sms:&' );
                    $( 'a[href^="sms:?"]' ).attr( 'href', new_url );
                }
            }

            if( getMobileOperatingSystem() === 'unknown' ) {
                if(  $( 'a[href^="sms:"]' ).length ) {
                    $( 'a[href^="sms:"]' ).parent().remove();
                }
            }
        }

        // if we are on university template, edit SMS links to only have page url
        if($('body').hasClass('page-template-university-ecourse-template')){
            if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                if (typeof $('.at-bottom-sms-share  a').attr( 'href' ) != "undefined") {
                    var url = $('.at-bottom-sms-share  a').attr( 'href' ).replace( 'sms:?', 'sms:&' );
                    var new_url = url.replace(/body=.* /, 'body=');
                    $( '.at-bottom-sms-share a' ).attr( 'href', new_url );
                }
            }

            if( getMobileOperatingSystem() === 'unknown' ) {
                if(  $( 'a[href^="sms:"]' ).length ) {
                    $( 'a[href^="sms:"]' ).parent().remove();
                }
            }
        }


        /*** Advertise page ***/

        if( $('div.page-container.advertise-page').length ) {

            /**
             * Copyright 2012, Digital Fusion
             * Licensed under the MIT license.
             * http://teamdf.com/jquery-plugins/license/
             *
             * @author Sam Sehnert
             * @desc A small plugin that checks whether elements are within
             *         the user visible viewport of a web browser.
             *         only accounts for vertical position, not horizontal.
             */
            $.fn.visible = function (partial) {

                var $t = $(this),
                    $w = $(window),
                    viewTop = $w.scrollTop(),
                    viewBottom = viewTop + $w.height(),
                    _top = $t.offset().top,
                    _bottom = _top + $t.height(),
                    compareTop = partial === true ? _bottom : _top,
                    compareBottom = partial === true ? _top : _bottom;

                return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
            };

            function growBars() {

                $('.demographics .verticalCenter > span').each(function () {
                    thisHeight = ($(this).attr('rel') * 2.5 + 60) / 2;
                    topHeight = thisHeight;
                    if ($(window).width() < 767) {
                        topHeight = thisHeight + 30;
                    }
                    $(this).animate({paddingTop: topHeight, paddingBottom: thisHeight}, 2 * 1000).addClass('grownUp');
                    $(this).promise().done(function () {
                        // $(this).addClass('grownUp');
                    });
                });

            }

            function resizeTheStuff(element) {
                windowWidth = $(window).width();
                if (windowWidth < 767) {
                    $('.rotate').each(function () {
                        oldText = $(this).html();
                        oldText = oldText.replace('<br>', ' — ');
                        $(this).html(oldText);
                    });
                } else {
                    $('.rotate').each(function () {
                        newText = $(this).html();
                        newText = newText.replace(" — ", "<br>");
                        $(this).html(newText);
                    });
                }

                maxHeight = 0;
                $('.purpleBoxEqual').height('initial');
                $('.purpleBoxEqual').each(function () {
                    theHeight = $(this).height();
                    if (theHeight > maxHeight) {
                        maxHeight = theHeight;
                    }
                });
                $('.purpleBoxEqual').height(maxHeight);
                // alert('.purpleBoxEqual'+' '+maxHeight);

                maxHeight = 0;

                originalWidth = 100 / 6;
                width = 0;
                $('.wide1667').each(function () {
                    $(this).css('right', width + '%');
                    width = originalWidth + width;
                });

                originalWidth = 100 / 3;
                width = 0;
                $('.wide33').each(function () {
                    $(this).css('right', width + '%');
                    width = originalWidth + width;
                });

                originalWidth = 100 / 2;
                width = 0;
                $('.gender .wide50').each(function () {
                    $(this).css('right', width + '%');
                    width = originalWidth + width;
                });
                originalWidth = 100 / 2;
                width = 0;
                $('.children .wide50').each(function () {
                    $(this).css('right', width + '%');
                    width = originalWidth + width;
                });


            }


            $(window).on("load resize", function (e) {
                element = '';
                resizeTheStuff(element);
            });

            $(window).on("load resize scroll", function (e) {

                if ($('.animateTrigger').visible() || $('.demographicTitle').visible()) {
                    growBars();
                }

            });

        }

        /*** END - Advertise page ***/

        /*** Vertical image in posts ***/

        /* if( $('.row.vertical-image-wrapper').length ) {
            var vert_img_wrapper_row = $('.row.vertical-image-wrapper');
            var vert_img_wrapper = $('.row.vertical-image-wrapper .vertical-image-center');
            var vert_img = $('.row.vertical-image-wrapper img');
            var vert_caption = $('.row.vertical-image-wrapper .vertical-image-caption');
            var vert_text = $('.row.vertical-image-wrapper .vertical-image-text');

            var containerWidth = $('.single-post-content-inner').width();
            var viewportWidth = $(window).width();
            var imageWidth = parseInt(vert_img.attr('width'));
            var imageHeight = parseInt(vert_img.attr('height'));
            console.log(imageHeight + vert_caption.outerHeight());

            vert_img_wrapper.css('width', imageWidth + 'px');
            vert_img_wrapper.css('height', (imageHeight + vert_caption.outerHeight()) + 'px');
            vert_text.css('height', imageHeight + 'px');
            vert_text.css('width', (containerWidth - imageWidth ) + 'px');


            if( viewportWidth > 767 ) {
                vert_img_wrapper_row.removeClass('vert-mobile');
                vert_caption.css('margin-left', '0').css('margin-right', '0' );
            } else {
                vert_img_wrapper_row.addClass('vert-mobile');
                vert_caption.css('margin-left', ( (containerWidth - imageWidth ) / 2) ).css('margin-right', ( (containerWidth - imageWidth ) / 2) );
            }

            $(window).on('resize', function() {
                containerWidth = $('.single-post-content-inner').width();
                viewportWidth = $(window).width();
                vert_img_wrapper.css('width', vert_img.width() + 'px');
                vert_img_wrapper.css('height', (imageHeight + vert_caption.outerHeight()) + 'px');
                vert_text.css('height', imageHeight + 'px');
                vert_text.css('width', ( containerWidth - vert_img.width() ) + 'px');

                if( viewportWidth > 767 ) {
                    vert_img_wrapper_row.removeClass('vert-mobile');
                    vert_caption.css('margin-left', '0').css('margin-right', '0' );
                } else {
                    vert_img_wrapper_row.addClass('vert-mobile');
                    vert_caption.css('margin-left', ( (containerWidth - imageWidth ) / 2) ).css('margin-right', ( (containerWidth - imageWidth ) / 2) );
                }

            });


        } */

        /*** End of Vertical image in posts ***/

        /*** Social icons bouncing features ***/

        var utmSource = document.referrer;
        if (utmSource.length && utmSource.length > 0) {
            if (utmSource.toLowerCase().indexOf('pinterest.') >= 0) {
                if( $('.single-social-pinterest a i').length ) {
                    $('.single-social-pinterest').addClass('animated infinite bounce');
                }
            }
            else {
                if( $('.single-social-facebook a i').length ) {
                    $('.single-social-facebook').addClass('animated infinite bounce');
                }
            }
        }
        else {
            if( $('.single-social-facebook a i').length ) {
                $('.single-social-facebook').addClass('animated infinite bounce');
            }
        }


    });
})(jQuery);

