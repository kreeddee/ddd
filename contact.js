/* =========================================
   AGENT 008 — CONTACT PAGE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // Обновляем год в подвале
    const year = document.getElementById("currentYear");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Скрываем экран загрузки
    const loader = document.getElementById("loader");

    if (loader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                loader.classList.add("is-hidden");
            }, 500);
        });

        // Запасной вариант, если событие load уже произошло
        if (document.readyState === "complete") {
            loader.classList.add("is-hidden");
        }
    }

    // Плавное появление блоков при прокрутке
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries, obs) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }

            });

        }, {
            threshold: 0.12
        });

        revealElements.forEach((element, index) => {
            element.style.transitionDelay = `${(index % 4) * 100}ms`;
            observer.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

    }

    // Мобильное меню — используем исходные классы сайта
    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");

    if (menuToggle && navigation) {

        const closeMenu = () => {
            navigation.classList.remove("is-open");
            menuToggle.classList.remove("is-active");
            menuToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        };

        menuToggle.addEventListener("click", () => {

            const isOpen = navigation.classList.toggle("is-open");

            menuToggle.classList.toggle("is-active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            document.body.classList.toggle("menu-open", isOpen);

        });

        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 700) {
                closeMenu();
            }
        });

    }

});