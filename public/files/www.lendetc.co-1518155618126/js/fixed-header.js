// impormant mast have data-header="header"

$(window).scroll(function () {

    if ($('body').scrollTop() > 50) {
        $('[data-header="header"]').addClass('colorfull');
    } else {
        $('[data-header="header"]').removeClass('colorfull');
    }
});