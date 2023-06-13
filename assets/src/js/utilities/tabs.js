(function ($, talonUtil) {
    "use strict";

    talonUtil.setupTabs = () => {
        const setActiveTab = (tab, tabTarget) => {
            tab.classList.add("active");
            tab.setAttribute("aria-expanded", "true");
            tabTarget.style.display = "";
        };

        const tabFunction = (tabGroup) => {
            let tabs = tabGroup.querySelectorAll("[data-tab]"),
                activeCount = 0;

            for(let tc = 0; tc < tabs.length; tc++) {
                let tabControl = tabs[tc],
                    relatedData = tabControl.getAttribute("data-target"),
                    tabControlID = tabGroup.getAttribute("id"),
                    tabTarget = document.getElementById(relatedData);

                if(relatedData) {
                    if(!tabControlID) {
                        tabControl.setAttribute("id", talonUtil.generateID("data-toggle-"));
                        tabControlID = tabControl.getAttribute("id");
                    }

                    tabTarget.setAttribute("aria-labelledby", tabControlID);
                    tabControl.setAttribute("aria-haspopup", "true");
                    tabControl.setAttribute("role", "button");

                    if(tabControl.classList.contains("active") && activeCount === 0) {
                        tabControl.setAttribute("aria-expanded", "true");
                        tabTarget.style.display = "";
                        activeCount++;
                    } else {
                        tabControl.setAttribute("aria-expanded", "false");
                    }


                    const tabClickEvent = () => {
                        let openTab = tabGroup.querySelector(".active"),
                            openTabId = openTab.getAttribute("data-target"),
                            openTabTarget = document.getElementById(openTabId);

                        if(!tabControl.classList.contains("active")) {
                            openTab.classList.remove("active");
                            openTab.setAttribute("aria-expanded", "false");
                            openTabTarget.style.display = "none";

                            setActiveTab(tabControl, tabTarget);
                        }
                    };

                    tabControl.addEventListener("click", (e) => {
                        if (talonUtil.a11yClick(e) === true) {
                            e.preventDefault();
                            tabClickEvent();
                        }
                    });
                }
            }

            if(activeCount === 0) {
                let firstTab = tabs[0],
                    firstTabRelated = firstTab.getAttribute('data-target'),
                    firstTabTarget = document.getElementById(firstTabRelated);

                setActiveTab(firstTab, firstTabTarget);
            }
        };


        const dataTabs = document.querySelectorAll("[data-tabs]:not([data-init])");

        for(let t = 0; t < dataTabs.length; t++) {
            let tabGroup = dataTabs[t];

            tabFunction(tabGroup);
        }
    };
})(jQuery, window.talonUtil);