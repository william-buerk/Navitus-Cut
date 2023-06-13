/* ================================================================
    SITE INIT - GLOBAL FUNCTIONS
    ================================================================ */

(function ($, talonUtil) {

    /** Click Navigation **/
    $(".main-nav").clickMenu();

    /** Focus Overlay **/
    $("body").focusOverlay();

    /** Stop referrer Phishing hack */
    let blankLink = document.querySelectorAll("[target=_blank]");
    let newLink = document.querySelectorAll("[target=new]");

    for (let bl = 0; bl < blankLink.length; bl++) {
        blankLink[bl].setAttribute('rel', 'noopener noreferrer');
    }

    for (let nl = 0; nl < newLink.length; nl++) {
        newLink[nl].setAttribute('rel', 'noopener noreferrer');
    }

    talonUtil.setupToggles();
    talonUtil.setupTabs();
    talonUtil.setupUserBinds();
})(jQuery, window.talonUtil);