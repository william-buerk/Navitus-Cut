
/* ================================================================
    Photo Gallery
    ================================================================ */

(function ($, talonUtil) {
    $('.photo-gallery.rotating').slick({
        dots: false,
        speed: 300,
        slidesToShow:3,
        arrows: true,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    $(".photo-overlay").modaal({
        type: 'image'
    });

    $('.image-gallery__strip-stage').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.image-gallery__thumb-strip'
    });

    $('.image-gallery__thumb-strip').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: '.image-gallery__strip-stage',
        dots: false,
        centerMode: true,
        focusOnSelect: true,
        arrows:true,
        responsive: [
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 479,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
})(jQuery, window.talonUtil);