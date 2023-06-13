/* ================================================================
    UTILITY FUNCTIONS AND GLOBAL VARS

    - Speeds
    - Generate Random Id
    - Toggles
    - Debounce
    - Get Viewport Width
    - A11y Click
    - User Binds
   ================================================================ */

(function ($, talonUtil, undefined) {
    "use strict";


    // Fast for most debouncers, etc. but for transitions try and match typicall css transition length
    talonUtil.speeds = {
        fast: 200,
        transition: 300
    };


    // Generate Random ID
    talonUtil.generateID = function () {
        let globalIdCounter = 0;
        return function (baseStr) {
            baseStr = baseStr ? baseStr : "generatedID-";
            return baseStr + globalIdCounter++;
        };
    }();


    //Setup expanding functionality for [data-toggle] elements (e.g. accordions, tabs, expanders)
    talonUtil.setupToggles = function () {
        const dataToggles = document.querySelectorAll("[data-toggle]:not([data-init])");

        // for(let d = 0; d < dataToggles.length; d++) {
        //     let toggle = dataToggles[d],
        //         relatedData = toggle.getAttribute("data-target"),
        //         toggleID = toggle.getAttribute("id"),
        //         isHold = toggle.getAttribute("data-hold") || false,
        //         bodyTag = document.body,
        //         htmlTag = document.documentElement;

        //         function toggleControl(controls) {
        //             // Clear out Toggle Handler for easy exit of toggle if it exists
        //             let currentControl = document.getElementById(relatedData);
        //             console.log(relatedData);
        //             console.log(currentControl)

        //             if (toggle.classList.contains("active")) {
        //                 //update a11y and classes, etc. if already opened

        //                 htmlTag.removeEventListener("click touchstart keyup", dataToggleHandler);
        //                 if(toggle.classList.contains('search-toggle')){
        //                     bodyTag.classList.remove('search-active');
        //                 }
        //                 currentControl.style.display = 'none';
        //                 toggle.classList.remove("active")
        //                 toggle.setAttribute("aria-expanded", "false");
        //             } else {
        //                 // Set up attributes and classes for styling and a11y
        //                 toggle.classList.add("active")
        //                 toggle.setAttribute("aria-expanded", "true");

        //                 if(toggle.classList.contains('search-toggle')){
        //                     bodyTag.classList.add('search-active');
        //                 }

        //                 setTimeout(function () {

        //                     // Set up later timeout functionality to make sure we can clearout if other data toggles are pressed
        //                     var later = function later() {
        //                         let hasInput = currentControl.querySelectorAll("input, select, textarea");

        //                         if (hasInput.length > 0) {
        //                             currentControl.querySelector("input, select, textarea").firstChild.focus();
        //                         } else {
        //                             currentControl.focus();
        //                         }
        //                     };

        //                     currentControl.style.display = '';

        //                     timeoutItem = setTimeout(later, talonUtil.speeds.transition);
        //                 }, talonUtil.speeds.transition);

        //                 // Set up Toggle Handler for easy exit of toggle

        //                 if (!isHold) {
        //                     htmlTag.addEventListener("click touchstart keyup", dataToggleHandler);
        //                 }
        //             }
        //         }

        //         function dataToggleHandler(e) {
        //             var requiresTrigger = false;
        //             //Check if escape is keyup-ed
        //             if (e.which === 27) {
        //                 requiresTrigger = true;
        //                 toggle.focus();
        //             } else {
        //                 //otherwise check if touch/click is outside of bounds
        //                 var target = e.target;
        //                 if (target.closest("#" + relatedData).length <= 0 && target.closest("#" + toggleID).length <= 0) {
        //                     requiresTrigger = true;
        //                 }
        //             }

        //             if (requiresTrigger) {
        //                 toggleControl();
        //                 //Clear timeout to help prevent focus / other data toggle press conflicts
        //                 clearTimeout(timeoutItem);
        //                 timeoutItem = null;
        //             }
        //         }

        //         // No point in doing anything if there isn't a proper related element set
        //         if (relatedData) {
        //             var controls = document.getElementById(relatedData),
        //                 timeoutItem = null,
        //                 isExpanded = toggle.classList.contains("active");

        //             // make sure there is an ID set for the toggle for a11y needs
        //             if (!toggleID) {
        //                 toggle.setAttribute("id", talonUtil.generateID("data-toggle-"));
        //                 toggleID = toggle.getAttribute("id");
        //             }

        //             console.log("controls " + toggleID)

        //             //Indicate initialization
        //             toggle.setAttribute("data-init", "");

        //             // finish up a11y setup for related element
        //             controls.setAttribute("aria-labelledby", toggleID);

        //             //Setup proper roles for a11y and then bind interaction functionality

        //             toggle.setAttribute("role", "button")
        //             toggle.setAttribute("aria-haspopup", "true")
        //             toggle.setAttribute("aria-expanded", isExpanded)
        //             toggle.addEventListener("click", function (e) {
        //                 if (talonUtil.a11yClick(e) === true) {
        //                     e.preventDefault();
        //                     //Call function that controls show/hide
        //                     toggleControl(controls);
        //                 }
        //             });

        //             if (isExpanded && !isHold) {
        //                 htmlTag.addEventListener("click touchstart keyup", dataToggleHandler);
        //             }
        //         }
        //     }






        // for(let d = 0; d < dataToggles.length; d++) {
        //     let toggle = dataToggles[d],
        //         relatedData = toggle.getAttribute("data-target"),
        //         toggleID = toggle.getAttribute("id"),
        //         isHold = toggle.getAttribute("data-hold") || false,
        //         bodyTag = document.body,
        //         htmlTag = document.documentElement;

        //         function toggleControl() {
        //             // Clear out Toggle Handler for easy exit of toggle if it exists
        //             let currentControl = document.getElementById(relatedData);

        //             if (toggle.classList.contains("active")) {
        //                 //update a11y and classes, etc. if already opened
        //                     htmlTag.removeEventListener("click touchstart keyup", dataToggleHandler);
        //                     if(toggle.classList.contains('search-toggle')){
        //                         bodyTag.classList.remove('search-active');
        //                     }
        //                     currentControl.style.display = 'none';
        //                     toggle.classList.remove("active")
        //                     toggle.setAttribute("aria-expanded", "false");
        //             } else {
        //                 // Set up attributes and classes for styling and a11y
        //                 toggle.classList.add("active")
        //                 toggle.setAttribute("aria-expanded", "true");

        //                 if(toggle.classList.contains('search-toggle')){
        //                     bodyTag.classList.add('search-active');
        //                 }

        //                 setTimeout(function () {

        //                     // Set up later timeout functionality to make sure we can clearout if other data toggles are pressed
        //                     var later = function later() {
        //                         let hasInput = currentControl.querySelectorAll("input, select, textarea");

        //                         if (hasInput.length > 0) {
        //                             currentControl.querySelector("input, select, textarea").firstChild.focus();
        //                         } else {
        //                             currentControl.focus();
        //                         }
        //                     };

        //                     currentControl.style.display = '';

        //                     timeoutItem = setTimeout(later, talonUtil.speeds.transition);
        //                 }, talonUtil.speeds.transition);

        //                 if (!isHold) {
        //                     document.addEventListener("click", function(e) {
        //                         // loop parent nodes from the target to the delegation node
        //                             console.log(e.target);
        //                             targetCheck(currentControl, e)
        //                     }, false);
        //                 }
        //             }
        //         }

        //         function targetCheck(currentControl, e){
        //             for (var target = e.target; target && target != this; target = target.parentNode) {
        //                 console.log(target)
        //                 if (target.contains("#" + currentControl.getAttribute('id'))) {
        //                     dataToggleHandler.call(e);
        //                     break;
        //                 }
        //             }
        //         }

        //         function dataToggleHandler(e) {
        //             var requiresTrigger = false;
        //             //Check if escape is keyup-ed
        //             if (e.which === 27) {
        //                 requiresTrigger = true;
        //                 toggle.focus();
        //             } else {
        //                 //otherwise check if touch/click is outside of bounds
        //                 var target = e.target;
        //                 if (target.closest("#" + relatedData).length <= 0 && target.closest("#" + toggleID).length <= 0) {
        //                     requiresTrigger = true;
        //                 }
        //             }

        //             if (requiresTrigger) {
        //                 toggleControl();
        //                 //Clear timeout to help prevent focus / other data toggle press conflicts
        //                 clearTimeout(timeoutItem);
        //                 timeoutItem = null;
        //             }
        //         }

        //         // No point in doing anything if there isn't a proper related element set
        //         if (relatedData) {
        //             var controls = document.getElementById(relatedData),
        //                 timeoutItem = null,
        //                 isExpanded = toggle.classList.contains("active");

        //             // make sure there is an ID set for the toggle for a11y needs
        //             if (!toggleID) {
        //                 toggle.setAttribute("id", talonUtil.generateID("data-toggle-"));
        //                 toggleID = toggle.getAttribute("id");
        //             }

        //             console.log("controls " + toggleID)

        //             //Indicate initialization
        //             toggle.setAttribute("data-init", "");

        //             // finish up a11y setup for related element
        //             controls.setAttribute("aria-labelledby", toggleID);

        //             //Setup proper roles for a11y and then bind interaction functionality

        //             toggle.setAttribute("role", "button")
        //             toggle.setAttribute("aria-haspopup", "true")
        //             toggle.setAttribute("aria-expanded", isExpanded)
        //             toggle.addEventListener("click", function (e) {
        //                 if (talonUtil.a11yClick(e) === true) {
        //                     e.preventDefault();
        //                     //Call function that controls show/hide
        //                     toggleControl(controls);
        //                 }
        //             });

        //             if (isExpanded && !isHold) {
        //                 console.log('expanded and not hold');
        //                 document.addEventListener("click touchstart keyup", function(e) {
        //                     console.log(e.target)
        //                     // loop parent nodes from the target to the delegation node
        //                     for (var target = e.target; target && target != this; target = target.parentNode) {
        //                         console.log(target)
        //                         if (target.matches(controls)) {
        //                             dataToggleHandler.call(target, e);
        //                             break;
        //                         }
        //                     }
        //                 }, false);
        //             }
        //         }
        //     }

        // $("[data-toggle]:not([data-init])").each(function (key, val) {
        //     var $toggle = $(this),
        //         relatedData = $toggle.data("target"),
        //         toggleID = $toggle.attr("id"),
        //         parentID = $toggle.data("parent"),
        //         isOverlay = $toggle.data("toggle") === "overlay" || false,
        //         isTabs = $toggle.data("toggle") === "tab" && parentID || false,
        //         isHold = $toggle.data("hold") || false,
        //         $bodyTag = $("body"),
        //         $htmlTag = $("html");

        //     if (isTabs) {
        //         var $parentWrap = $("#" + parentID),
        //             $relatedTabs = $parentWrap.find("[data-toggle=tab]");
        //     }

        //     // POPOVER/DROPDOWN functionality
        //     function toggleControl() {
        //         // Clear out Toggle Handler for easy exit of toggle if it exists

        //         if (isOverlay) {
        //             $htmlTag.removeClass("js-data-toggled");
        //         }

        //         if ($toggle.hasClass("active")) {
        //             //update a11y and classes, etc. if already opened
        //             var shouldSlideUp = false;

        //             if (!isTabs) {
        //                 shouldSlideUp = true;
        //             } else {
        //                 //Check to see if any other of your tab siblings are also open... if so close
        //                 if ($relatedTabs.filter("[aria-expanded=true]").length > 1) {
        //                     shouldSlideUp = true;
        //                 }
        //             }

        //             if (shouldSlideUp) {
        //                 $htmlTag.off("click touchstart keyup", dataToggleHandler);
        //                 if($toggle.hasClass('search-toggle')){
        //                     $bodyTag.removeClass('search-active');
        //                 }
        //                 $controls.slideUp();
        //                 $toggle.removeClass("active").attr("aria-expanded", "false");
        //             }
        //         } else {
        //             // Set up attributes and classes for styling and a11y
        //             $toggle.addClass("active").attr("aria-expanded", "true");

        //             if($toggle.hasClass('search-toggle')){
        //                 $bodyTag.addClass('search-active');
        //             }

        //             $controls.slideDown(function () {

        //                 if (isOverlay) {
        //                     $htmlTag.addClass("js-data-toggled");
        //                 }

        //                 // Set up later timeout functionality to make sure we can clearout if other data toggles are pressed
        //                 var later = function later() {
        //                     if ($controls.find("input, select, textarea").length > 0) {
        //                         $controls.find("input, select, textarea").first().focus();
        //                     } else {
        //                         $controls.focus();
        //                     }
        //                 };

        //                 timeoutItem = setTimeout(later, talonUtil.speeds.transition);
        //             });

        //             // Set up Toggle Handler for easy exit of toggle
        //             if (isOverlay) {
        //                 $htmlTag.addClass("js-data-toggled");
        //             }

        //             if (!isHold) {
        //                 $htmlTag.on("click touchstart keyup", dataToggleHandler);
        //             }
        //         }
        //     }

        //     //namespaced function for use in html event checks from above
        //     function dataToggleHandler(e) {
        //         var requiresTrigger = false;
        //         //Check if escape is keyup-ed
        //         if (e.which === 27) {
        //             requiresTrigger = true;
        //             $toggle.focus();
        //         } else {
        //             //otherwise check if touch/click is outside of bounds
        //             var $target = $(e.target);
        //             if ($target.closest("#" + relatedData).length <= 0 && $target.closest("#" + toggleID).length <= 0) {
        //                 requiresTrigger = true;
        //             }
        //         }

        //         if (requiresTrigger) {
        //             toggleControl();
        //             //Clear timeout to help prevent focus / other data toggle press conflicts
        //             clearTimeout(timeoutItem);
        //             timeoutItem = null;
        //         }
        //     }

        //     // No point in doing anything if there isn't a proper related element set
        //     if (relatedData) {
        //         var $controls = $("#" + relatedData),
        //             timeoutItem = null,
        //             isExpanded = $toggle.hasClass("active");

        //         // make sure there is an ID set for the toggle for a11y needs
        //         if (!toggleID) {
        //             $toggle.attr("id", talonUtil.generateID("data-toggle-"));
        //             toggleID = $toggle.attr("id");
        //         }

        //         //Indicate initialization
        //         $toggle.attr("data-init", "");

        //         // finish up a11y setup for related element
        //         $controls.attr({ "aria-labelledby": toggleID });

        //         //Setup proper roles for a11y and then bind interaction functionality

        //         $toggle.attr({ "role": "button", "aria-haspopup": "true", "aria-expanded": isExpanded }).on("click", function (e) {
        //             if (talonUtil.a11yClick(e) === true) {
        //                 e.preventDefault();
        //                 //Call function that controls show/hide
        //                 toggleControl();
        //             }
        //         });

        //         if (isExpanded && !isHold) {
        //             $htmlTag.on("click touchstart keyup", dataToggleHandler);
        //         }
        //     }
        // });
        };


    //Debouncer to be used for scrolling and resize bindings
    talonUtil.debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function later() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };


    //Get correct viewport size helper - don't use $(window).width();
    talonUtil.getViewportW = window.getViewportW || function () {
        var win = typeof window != 'undefined' && window,
            doc = typeof document != 'undefined' && document,
            docElem = doc && doc.documentElement;

        var a = docElem.clientWidth,
            b = win.innerWidth;
        return a < b ? b : a;
    };


    /** Click vs. Keyboard user **/
    talonUtil.setupUserBinds = function () {
        const body = document.body,
            html = document.documentElement;

        if (!html.classList.contains("js-user-bind-init")) {
            html.classList.add("js-user-bind-init");
            body.addEventListener("keyup", () => {
                if (!html.classList.contains("js-keyboard-user")) {
                    html.classList.remove("js-click-user");
                    html.classList.add("js-keyboard-user");
                }
            });

            body.addEventListener("click", () => {
                if (!html.classList.contains("js-click-user")) {
                    html.classList.remove("js-keyboard-user");
                    html.classList.add("js-click-user");
                }
            });
        }
    };
})(jQuery, window.talonUtil = window.talonUtil || {});