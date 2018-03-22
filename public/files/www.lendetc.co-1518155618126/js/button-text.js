// impormant mast have data-title="get-started"

function changeText() {
    if ($(window).width() <= '767') {
        $('[data-title="get-started"]').text('Get Started!');
    } else {
        $('[data-title="get-started"]').text('Get Started Now!');
    }
};

$(window).on('load resize', changeText);