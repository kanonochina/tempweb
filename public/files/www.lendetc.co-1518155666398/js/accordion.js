$(document).ready(function () {
    $(".accordion h2:first").addClass("active");
    $(".accordion p:not(:first)").hide();

    $(".accordion h2").click(function () {

        $(this).next("p").slideToggle("slow")
        .siblings("p:visible").slideUp("slow");
        $(this).toggleClass("active");
        $(this).siblings("h2").removeClass("active");
    });
});