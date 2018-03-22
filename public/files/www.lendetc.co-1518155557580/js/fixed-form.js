// impormant mast have data-title="form" & data-content="main-content"


$(window).scroll(function () {
    let pointToStop = $('[data-content="main-content"]').innerHeight() - $('[data-title="form"]').innerHeight() - 100;
    if ($('body').scrollTop() > 30 && $(window).width() > 768) {
        if ($('body').scrollTop() < pointToStop) {
            $('[data-title="form"]').removeClass('absolute');
            $('[data-title="form"]').addClass('fixed');
        } else {
            $('[data-title="form"]').removeClass('fixed');
            $('[data-title="form"]').addClass('absolute');
        } 
    }
});