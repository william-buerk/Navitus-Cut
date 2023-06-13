/* ================================================================
    Lists
    ================================================================ */

(function ($, talonUtil) {
    /** List Tool on load */
    $('.list-tool.expand-list, .list-tool.accordion-list').each(function(){
        var $this = $(this);

        $this.find('.item:first-child > a').addClass('active');
        $this.find('.item .item-content').hide();
        $this.find('.item:first-child .item-content').show();
    });

})(jQuery, window.talonUtil);