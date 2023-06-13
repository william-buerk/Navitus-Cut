/*! CLICK NAVIGATION FUNCTIONALITY
    Version: 0.9.8.4
    Author: Nick Goodrum
    Licensed under MIT:
    http://www.opensource.org/licenses/mit-license.php
    Followed WAI-ARIA spec except for typing a letter key keyboard functionality (optional) and left/right moving to next previous main tiers
    TO DO - CONFIRM DATA-ATTRIBUTE APPROACH, EXTEND MEGA / SLIDING TO REDUCE CODE BASE, DETERMINE IF MORE OR LESS OF THE WAI-ARIA SPEC IS NEEDED */

(function(window, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
            return factory(window, $);
        });
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        module.exports = factory(window, require('jquery'));
    } else {
        factory(window, jQuery);
    }
}(typeof window !== "undefined" ? window : this, function(window, $) {
    'use strict';
    var ClickMenu = window.ClickMenu || {};

    /*----------- ADD DEBOUNCER -----------*/

    // Code from Underscore.js

    var debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    /*-----------  ADD PROTOTYPE FOR OLDER BROWSERS -----------*/
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(){
            var fn = this, args = Array.prototype.slice.call(arguments),
                object = args.shift();
            return function(){
                return fn.apply(object, args.concat(Array.prototype.slice.call(arguments)));
            };
        };
    }

    ClickMenu = (function() {

        function ClickMenu(element, settings) {
            var _ = this,
                dataSettings;

            _.defaults = {
                menutype : "dropdown",
                animationSpeed : 400,
                toggle : "toggle-menu",
                menu: "cm-menu",
                htmlClass: "cm-js-menu-active",
                expanderText: "expand / collapse",
                //TODO: Eventually add parentLi Selector option so they aren't only lis
                landings : false,
                expanders: false,
                singleClick : true,
                isAutoClose: true,
                isRTL : false
            };

            dataSettings = $(element).data() || {};

            _.options = $.extend({}, _.defaults, dataSettings, settings);

            _.menu = element;
            _.$menu = $(element);
            _.$menuBar = _.$menu.find("." + _.options.menu);
            _.$menuToggle = _.$menu.find("." + _.options.toggle);
            _.$html = $("html");
            _.touchStart = false;
            _.isActive = false;
            _.isToggled = false;
            _.leavingMenu = false;
            _.currentFocus = 0;
            _.initialLinks = [];
            _.currentLinks = [];

            // Add in proxies so _ scope ties to this function even when called via outside event bindings, etc.
            _.keyHandler = $.proxy(_.keyHandler, _);
            _.findCurrentLinks = $.proxy(_.findCurrentLinks, _);
            _.resetMenus = $.proxy(_.resetMenus, _);
            _.cleanUpEvents = $.proxy(_.cleanUpEvents, _);
            _.destroy = $.proxy(_.destroy, _);
            _.showMenu = $.proxy(_.showMenu, _);
            _.hideMenu = $.proxy(_.hideMenu, _);
            _.menuToggle = $.proxy(_.menuToggle, _);
            _.subMenuToggle = $.proxy(_.subMenuToggle, _);
            _.menuHandler = $.proxy(_.menuHandler, _);
            _.menuToggleHandler = $.proxy(_.menuToggleHandler, _);

            if ( _.$menuBar.length > 0 ) {
                _.init();
            }
        }

        return ClickMenu;
    }());

    ClickMenu.prototype.init = function() {
        var _ = this;

        //Bind Toggle Function to expand/collapse menu in small screens
        _.$menuToggle.on("touchstart click", _.menuToggle);

        // Add Aria Aspects and initial classes to menu wrap and menu
        _.$menu.addClass("cm-js-enabled").attr({"role" : "navigation"});
        _.$menuBar.attr("role", "menubar");

        //If there are prior dropdowns you want to get the highest one and add to the numbers
        var idNum = 1;

        if ( $("[id^='cm-dropdown']").last().length > 0 ) {
            var highestNum = 0;

            $("[id^='cm-dropdown']").each(function(){
                var currentNum = $(this).attr("id").split("dropdown")[1];

                highestNum = currentNum && highestNum < parseInt(currentNum, 10) ? parseInt(currentNum, 10) : highestNum;
            });

            idNum = highestNum + 1;
        }

        _.$menu.on('keydown', _.keyHandler);
        //With Firefox 52 support coming in - this is a clean solution for tab users to toggle open/close menus - but will need to possibly consider if focusin is worth the fighting
        _.$menuBar.on('focusin', _.showMenu);

        _.$menu.find("." + _.options.menu + " a").each(function () {
            var $anchor = $(this),
                $parentLi = $anchor.closest('li'),
                $sibling;

            $anchor.attr({"role" : "menuitem", "tabindex" : "-1" });
            $parentLi.attr("role", "presentation");

            if ( ! $parentLi.data("type") && $parentLi.parent().hasClass(_.options.menu)) {
                $parentLi.attr('data-type', _.options.menutype);
            }

            // Have anchor do what it normally would do unless it has subs

            if ( $anchor.siblings().not("a").length > 0  && $parentLi.attr("data-option") !== "openSubs" ) {
                //Style it up via class
                var $expandable = $anchor.siblings(),
                    newID = "cm-dropdown" + idNum;

                if (_.options.expanders) {
                    $sibling = $("<a id='"+ newID +"' href='#' role='menuitem' aria-haspopup='true' class='has-sub' tabindex='-1'><span><span class='visually-hidden'>" + _.options.expanderText + " " + $anchor.text() + "</span></span></a>");
                    $anchor.wrap("<div class='expander-wrap'></div>").after($sibling);

                    $sibling.on("click", _.subMenuToggle);
                } else {
                    //if there is an ID use it and make sure the expandable item gets it otherwise add the new id created
                    if ( $anchor.attr("id") ) {
                        newID = $anchor.attr("id");
                    }  else {
                        $anchor.attr("id", "cm-dropdown" + idNum);
                    }
                    // bind click functionality for anchors as well as aria / class
                    $anchor.attr({ "aria-haspopup" : "true" }).addClass("has-sub").on("click", _.subMenuToggle);
                }

                var visibleAlready = $expandable.height() > 0 ? true : false;
                $expandable.attr({"role": "menu", "aria-expanded" : visibleAlready, "aria-hidden" : !visibleAlready, "aria-labelledby" : newID });

                if (_.options.landings && !_.options.expanders) {
                    var $duplicate = $expandable.is("ul") ? $("<li class='link-landing' role='presentation'>" + $anchor.get(0).outerHTML + "</li>") : $("<div class='link-landing' role='presentation'>" + $anchor.get(0).outerHTML + "</div>");
                    $duplicate.children().removeAttr("aria-haspopup class id");
                    $duplicate.find("a").removeClass("has-sub");
                    $expandable.prepend($duplicate);
                }

                if ( $parentLi.data("type") && $parentLi.data("type") === "sliding") {
                    var $subMenu = $("<div class='sub-menu cm-js-inactive'></div>");

                    $expandable.wrap($subMenu);

                    var adjustMenu = function(){
                        var maxWidth = _.$menu.innerWidth(),
                            leftPosition = $parentLi.position().left,
                            $adjustable;

                        $adjustable = $parentLi.children(".sub-menu");
                        $adjustable.find("> ul > li > ul").innerWidth(maxWidth);

                        $adjustable.innerWidth(maxWidth).css("left", "-" + leftPosition + "px");
                    };

                    var debounceAdjustments = debounce(adjustMenu, 300);

                    $(window).load(function(){
                        adjustMenu();

                        $(window).resize(debounceAdjustments);
                    });

                }

                if (newID === "cm-dropdown" + idNum) {
                    idNum++;
                }
            }

            // ADD In Initial Links for main tier
            if ( $anchor.closest("[role]:not(a)").is("[data-type]") && $anchor.is(":visible") ) {
                _.initialLinks.push($anchor);

                if (_.options.expanders && $sibling) {
                    _.initialLinks.push($sibling);
                }
            }

        });

        _.currentLinks = _.initialLinks;

        if ( _.currentLinks[_.currentFocus] ) {
            _.currentLinks[_.currentFocus].attr("tabindex", "0");
        }

        _.$menu.trigger("init", [_]);

    };

    ClickMenu.prototype.keyHandler = function(e) {
        var _ = this,
            keyPress = e.keyCode;

        if ( ! _.$menu.hasClass("cm-js-inFocus") && keyPress !== 9 ) {
            _.$menu.addClass("cm-js-inFocus").attr("tabindex", "-1");
        }
        switch (keyPress) {
            //TAB
            case 9:
                _.$menu.removeClass("cm-js-inFocus");
                break;
            //LEFT UP RIGHT DOWN
            case 37:
            case 38:
            case 39:
            case 40:
                //Prevent Scrolling aspects from browser
                e.preventDefault();

                //Maintain currentLink since it will potentially be overwritten with the next focus
                var oldLink = _.currentLinks[_.currentFocus];

                //Don't do anything if in mid transition
                if (oldLink) {
                    var inMainTier = oldLink.closest("[role]:not(a)").is("[data-type]"),
                        next, direction, close, open;

                    //IF LEFT / UP  (Depending on TIER) change next item to rotate to

                    if (inMainTier) {
                        // IF LEFT / RIGHT rotate to new item
                        if (keyPress === 37) {
                            direction = _.options.isRTL ? "next" : "prev";
                        } else if (keyPress === 39) {
                            direction = _.options.isRTL ? "prev" : "next";
                        } else if (keyPress === 40 || keyPress === 38) {
                            open = true;
                        }
                    } else {
                        // IF UP / DOWN rotate to new item - IF LEFT on sub subs close menu
                        if (keyPress === 38) {
                            direction = "prev";
                        } else if (keyPress === 40) {
                            direction = "next";
                        } else if ( keyPress === 39) {
                            if (_.options.isRTL) {
                                close = true;
                            } else {
                                open = true;
                            }
                        //} else if ( ! inSecondTier && keyPress === 37 ) {
                        } else if ( keyPress === 37 ) {
                            if (_.options.isRTL) {
                                open = true;
                            } else {
                                close = true;
                            }
                        }
                    }

                    if (direction) {

                        if (direction === "prev") {
                            //If there aren't any prior items move to last item in the list
                            _.currentFocus = _.currentFocus - 1 >= 0 ? _.currentFocus - 1 : _.currentLinks.length - 1;
                        } else {
                            //If there aren't any more items move to first item in the list
                            _.currentFocus = _.currentFocus + 1 < _.currentLinks.length ? _.currentFocus + 1 : 0;
                        }
                        next = _.currentLinks[_.currentFocus];

                    }

                    //If there isn't anything next click the anchor
                    if (next) {
                        oldLink.attr("tabindex", "-1");
                        _.currentLinks[_.currentFocus].attr("tabindex", "0").focus();
                    } else if (close) {
                        //Same as ESCAPE - TBD should we actually close the whole menu and go to a previous item (ARIA Spec)?
                        _.$menu.find(".opened").last().find("[aria-haspopup]").first().trigger("click");
                    } else if (open) {
                        //Only open if it isn't opened - escape is how to close a menu
                        //Also don't trigger click on a normal link - TBD should we really close the whole menu and go to the next item (ARIA Spec)?
                        if ( ! oldLink.closest("li").hasClass("opened") && _.currentLinks[_.currentFocus].hasClass("has-sub") ) {
                            _.currentLinks[_.currentFocus].trigger("click");
                        }
                    }
                }
                break;
            //ESCAPE
            case 27:
                e.preventDefault();
                _.$menu.find(".opened").last().find("[aria-haspopup]").first().trigger("click");
                break;
            //SPACE BAR (ENTER ALREADY BY DEFAULT DOES THIS)
            case 32:
                e.preventDefault();
                _.currentLinks[_.currentFocus].trigger("click");
                break;
        }
    };

    ClickMenu.prototype.findCurrentLinks = function($parentLi, $currAnchor, skipFocus) {
        var _ = this;

        $.each(_.currentLinks, function() {
            var $anchor = this;
            $anchor.attr("tabindex", "-1");
        });

        _.currentLinks = [];
        _.currentFocus = 0;

        if ( $parentLi && ! $parentLi.data("type") ) {
            var actualKey = 0;

            $parentLi.closest("[role=menu]").find("a, input, select, textarea, button").filter(":visible").each(function(key, val){
                //How do you find :hidden items that aren't actually hidden? Check the height of the parent - be careful of floating clearout issues
                var $item = $(val);
                //Looks like even with animation speed done correctly there can be a minor amount of pixels still transitioning in css
                if ($item.closest("[role=menu]").height() > 10 && $item.closest("[role=menu]").width() > 10) {
                    _.currentLinks.push($item);

                    if ($currAnchor && $currAnchor.attr("id") && $currAnchor.attr("id") === $item.attr("id")) {
                        _.currentFocus = actualKey;
                    }
                    actualKey++;
                }
            });

        } else {
            var $tabbables = _.$menuBar.find("a, input, select, textarea, button").filter(":visible");

            $tabbables.each(function(key, val){
                var $item = $(val);
                if ( $item.closest("[role]:not(a)").is("[data-type]") ) {
                    _.currentLinks.push($item);
                }
            });
            //If a ParentLi is supplied e.g. from submenutoggle then get the eq otherwise get the first visible eq
            _.currentFocus = $parentLi ? $parentLi.index() : 0;
        }

        if ( _.currentLinks[_.currentFocus] ) {
            _.currentLinks[_.currentFocus].attr("tabindex", "0");

            if ( ! _.leavingMenu && ! skipFocus ) {
                _.currentLinks[_.currentFocus].focus();
            }
        }
    };

    ClickMenu.prototype.resetMenus = function ($links) {
        $links.each(function(){
            var $toggle = $(this),
                $opened = $toggle.closest(".opened"),
                labelId = $toggle.attr("id"),
                $relatedSub = $("[aria-labelledby='" + labelId + "']");

            $toggle.attr("tabindex", "-1");
            $relatedSub.attr({"aria-hidden": true, "aria-expanded": false });
            $opened.removeClass("opened animating animated");
        });
    };

    ClickMenu.prototype.cleanUpEvents = function () {
        var _ = this;
        _.$menu.find("li a").off("click", _.subMenuToggle);

        // Change into FOCUS with corresponding namespace function
        _.$menu.off('keydown', _.keyHandler);
        _.$menuBar.off("focusin", _.showMenu);

        _.$html.off("touchstart click focusin", _.menuHandler);
        _.$html.off("touchstart click focusin", _.menuToggleHandler);
    };

    ClickMenu.prototype.destroy = function() {
        var _ = this;

        _.$menu.removeClass("cm-js-enabled cm-js-inFocus cm-js-active").removeAttr("tabindex");
        _.$menuBar.removeAttr("role");
        _.$menu.find("[role=presentation]").removeAttr("role").filter(".opened").removeClass("opened animating animated");
        _.$menu.find("[role=menuitem]").removeAttr("tabindex aria-haspopup role").removeClass("has-sub");
        _.$menu.find("[role=menu]").removeAttr("aria-expanded aria-hidden aria-labelledby role");
        _.cleanUpEvents();
    };

    ClickMenu.prototype.getClickMenu = function () {
        return this;
    };

    ClickMenu.prototype.showMenu = function(e) {
        var _ = this;

        //Need to make it check for hasClass on the current item rather than html and all items
        if ( _.$menuBar.height() <= 10 && ! _.$menu.hasClass("cm-js-active") && ! _.$menu.hasClass("cm-animate-out") ) {
            _.$menu.trigger("beforeMenuShow", [_]);

            _.isActive = true;
            _.isToggled = true;
            _.$menu.addClass("cm-js-active");

            _.$menuToggle.addClass("active");
            _.$html.addClass(_.options.htmlClass); // ADD FOR INITIAL STYLING

            _.findCurrentLinks();

            _.$html.off("touchstart click focusin", _.menuToggleHandler);

            // ADD TOGGLE HANDLER AFTER ANIMATION TO PREVENT CLOSING MENUS FROM REMOVING THE HANDLER
            setTimeout(function(){
                _.$menu.trigger("afterMenuShow", [_]);
                _.$html.addClass(_.options.htmlClass).on("touchstart click focusin", _.menuToggleHandler);
            }, _.options.animationSpeed);
        }

    };

    ClickMenu.prototype.hideMenu = function(e) {
        var _ = this;

        if ( _.$menu.hasClass("cm-js-active") && _.$html.hasClass(_.options.htmlClass) ) {
            _.$menu.trigger("beforeMenuHide", [_]);

            _.isActive = false;
            _.isToggled = false;
            _.$menu.removeClass("cm-js-active cm-js-inFocus");
            _.$menuToggle.removeClass("active");

            _.$html.removeClass(_.options.htmlClass).off("touchstart click focusin", _.menuToggleHandler);
            _.$menu.addClass("cm-animate-out");

            setTimeout(function(){
                _.$html.removeClass(_.options.htmlClass);
                _.$menu.removeClass("cm-animate-out").trigger("afterMenuHide", [_]);
            }, _.options.animationSpeed);
        }
    };

    ClickMenu.prototype.menuToggle = function(e) {
        var _ = this;
        e.preventDefault();

        if ( e.type === "touchstart" || ! _.touchStart ) {
            if (_.isActive) {
                _.hideMenu();
            } else {
                _.showMenu();
            }
        }

        _.touchStart = e.type === "touchstart" ? true : false;

    };

    ClickMenu.prototype.subMenuToggle = function(e, params) {
        var _ = this;

        var $currAnchor = $(e.currentTarget),
            $parentLi = $currAnchor.closest("li"),
            $menuCol = $currAnchor.closest("[data-type]"),
            menuType = $menuCol.data("type"),
            $relatedMenu = $("[aria-labelledby=" + $currAnchor.attr("id") + "]");

        var subDefaults = { skipFocus : false },
            subOptions = $.extend({}, subDefaults, params);


        _.$html.off("touchstart click focusin", _.menuHandler);

        if ($parentLi.hasClass("opened")) {

            _.$menu.trigger("beforeSubClose", [_, $currAnchor, $relatedMenu]);

            if (_.options.singleClick) {
                e.preventDefault();

                if (menuType === "sliding" && $parentLi.parents(".sub-menu").hasClass("sub-menu")) {
                    $parentLi.parents(".sub-menu").addClass("cm-js-inactive");
                }

                $parentLi.removeClass("opened animating animated");

                if (_.$menu.find(".opened").length > 0 && _.options.isAutoClose){
                    _.$html.on("touchstart click focusin", _.menuHandler);
                }

                $relatedMenu.attr({ "aria-expanded" : "false", "aria-hidden" : "true" });

                $relatedMenu.find("[aria-expanded=true]").each(function(){
                    var $childMenu = $(this);

                    $childMenu.attr({ "aria-expanded" : "false", "aria-hidden" : "true" }).closest("[role=presentation]").removeClass("opened animating animated");
                });

                setTimeout(function(){

                    //Update Current Links for keyboard
                    _.findCurrentLinks($parentLi, $currAnchor, subOptions.skipFocus);

                    _.$menu.trigger("afterSubClose", [_, $currAnchor, $relatedMenu]);

                }, _.options.animationSpeed);

            }
        } else {
            // Otherwise Open submenu and attach site click handler
            // Also - close any other open menus and their children
            e.preventDefault();

            _.$menu.trigger("beforeSubOpen", [_, $currAnchor, $relatedMenu]);

            $parentLi.addClass("opened animating").siblings().removeClass("opened animating animated")
                        .find(".opened").removeClass("opened animating animated");

            //FOR SLIDING MENUS
            $parentLi.siblings().find(".sub-menu").addClass("cm-js-inactive");

            if ( menuType === "sliding" && $parentLi.parents(".sub-menu").length > 0 ) {
                $parentLi.parents(".sub-menu").removeClass("cm-js-inactive");
            }
            //END FOR SLIDING MENU

            $relatedMenu.attr({ "aria-expanded" : "true", "aria-hidden" : "false" });

            //Wait until timer is complete so the bindings and currentLink groupings don't overlap
            setTimeout(function(){
                if ($parentLi.hasClass("animating")) {
                    $parentLi.removeClass("animating").addClass("animated");
                }

                //Update Current Links for keyboard
                _.findCurrentLinks($relatedMenu, $relatedMenu.find("a").first(), subOptions.skipFocus);

                // ADD TOGGLE HANDLER AFTER ANIMATION TO PREVENT CLOSING MENUS FROM REMOVING THE HANDLER
                if ( _.options.isAutoClose ) { // Only add if (default) menus set to auto close
                    _.$html.on("touchstart click focusin", _.menuHandler);
                }

                _.$menu.trigger("afterSubOpen", [_, $currAnchor, $relatedMenu]);

            }, _.options.animationSpeed);
        }
    };

    ClickMenu.prototype.menuToggleHandler = function(e) {
        var _ = this;

        if ( ! $.contains(_.menu, e.target) && ! _.$menu.is( $(e.target) ) && _.isToggled ) {
            _.isToggled = false;
            _.touchStart = false;

            if ( _.$menuToggle.length > 0 ) {
                _.$menuToggle.trigger("click");
            } else {
                _.hideMenu();
            }

            _.$html.removeClass(_.options.htmlClass).off("touchstart click focusin", _.menuToggleHandler);
        }
    };

    ClickMenu.prototype.menuHandler = function(e) {
        var _ = this;

        if ( ! $.contains(_.menu, e.target) && ! _.$menu.is($(e.target)) ) {
            //Make sure not to leave any tabindex=0 on submenu links by making sure the toggle knows we are leaving the menu
            _.leavingMenu = true;

            _.resetMenus( _.$menu.find(".opened > .has-sub, .opened > .expander-wrap > .has-sub") );
            _.findCurrentLinks();

            _.$html.off("touchstart click focusin", _.menuHandler);

            setTimeout(function(){
                //We now know we have left the menu and are done triggering sub menus
                _.leavingMenu = false;
            }, _.options.animationSpeed);
        }
    };

    $.fn.clickMenu = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;

        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined') {
                _[i].clickMenu = new ClickMenu(_[i], opt);
            } else {
                ret = _[i].clickMenu[opt].apply(_[i].clickMenu, args);
            }

            if (typeof ret != 'undefined') return ret;
        }

        return _;
    };

}));