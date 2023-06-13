(function ($, talonUtil) {
    "use strict";

    talonUtil.setupToggles = () => {
        const dataToggle = document.querySelectorAll("[data-toggle]:not([data-init])");

        for(let d = 0; d < dataToggle.length; d++) {
            let toggle = dataToggle[d],
                relatedData = toggle.getAttribute("data-target"),
                toggleTarget = document.getElementById(relatedData),
                toggleID = toggle.getAttribute("id"),
                isHold = toggle.hasAttribute("data-hold") || false;

            if(relatedData) {
                let isExpanded = false;

                if(!toggleID) {
                    toggle.setAttribute("id", talonUtil.generateID("data-toggle-"));
                    toggleID = toggle.getAttribute("id");
                }

                toggleTarget.setAttribute("aria-labelledby", toggleID);
                toggle.setAttribute("role", "button");

                const toggleClickEvent = () => {
                    if(toggle.classList.contains("active")) {
                        toggleTarget.style.display = "none";
                        toggle.classList.remove("active");
                        toggle.setAttribute("aria-expanded", "false");
                        isExpanded = false;
                    } else {
                        toggleTarget.style.display = "";
                        toggle.classList.add("active");
                        toggle.setAttribute("aria-expanded", "true");
                        isExpanded = true;
                    }
                };

                toggle.addEventListener("click", (e) => {
                    e.preventDefault();
                    toggleClickEvent();
                });

                const checkForClose = (e) => {
                    if (!isHold && isExpanded && !e.target.closest("#" + relatedData) && !e.target.closest("#" + toggleID)) {
                        toggleClickEvent();
                    }
                };

                document.addEventListener("click", (e) => { checkForClose(e); }, false);
                document.addEventListener("keyup", (e) => {
                    if (e.which === 27) {
                        if (isExpanded && e.target.closest("#" + relatedData) || isExpanded && e.target.closest("#" + toggleID)) {
                            toggleClickEvent();
                            toggle.focus();
                        }
                    } else {
                        checkForClose();
                    }
                }, false);
            }
        }
    };
})(jQuery, window.talonUtil);