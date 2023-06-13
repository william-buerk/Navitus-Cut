/* ================================================================
    Tabs
=========================================== */

(function ($, talonUtil) {

    $('.talon-tabs').each(function(){
        var $this = $(this);

        $this.find('.talon-tab:first-child > a').addClass('active');
        $this.find('.talon-tab-pane').hide();
        $this.find('.talon-tab-pane:first-child').show();
    });

})(jQuery, window.talonUtil);