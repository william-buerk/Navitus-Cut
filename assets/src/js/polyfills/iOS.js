/** iOS FIX to incorrect focus bug with keyboard not showing up
 * and then the last touchup element gets clicked. **/

if (/iPad|iPhone|iPod/g.test(navigator.userAgent)) {
    (function ($) {
        return $.fn.focus = function () {
            return arguments[0];
        };
    })(jQuery);
}