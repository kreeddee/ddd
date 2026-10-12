/* =====================================================
   AGENT 008
   ИНТЕРАКТИВНОСТЬ И АНИМАЦИИ
===================================================== */


document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       01. ЭКРАН ЗАГРУЗКИ
    ================================================= */

    const loader = document.getElementById("loader");

    function hideLoader() {

        if (!loader) {
            return;
        }

        loader.classList.add("is-hidden");

    }

    // Минимальное время показа анимации.
    // Если изображения или другие ресурсы загружаются долго,
    // посетитель всё равно не будет ждать их бесконечно.

    const minimumLoaderTime = new Promise((resolve) => {
        setTimeout(resolve, 900);
    });

    const pageReady = new Promise((resolve) => {

        if (document.readyState === "complete") {

            resolve();

        } else {

            window.addEventListener(
                "load",
                resolve,
                { once: true }
            );

        }

    });

    Promise.all([minimumLoaderTime, pageReady]).then(() => {

        hideLoader();

    });

    // Страховка: скрываем экран загрузки,
    // даже если отдельный ресурс долго не загружается.

    setTimeout(hideLoader, 3500);


    /* =================================================
       02. ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ ПРОКРУТКЕ
    ================================================= */

    const revealElements = document.querySelectorAll(".reveal");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

    } else {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    }


    /* =================================================
       03. МОБИЛЬНОЕ МЕНЮ
    ================================================= */

   /* =================================================
   03. МОБИЛЬНОЕ МЕНЮ 008
================================================= */

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

const navigationLinks = document.querySelectorAll(
    ".navigation__link"
);

const pageShell = document.getElementById("pageShell");


function closeMenu() {
    if (!menuToggle || !navigation) {
        return;
    }

    menuToggle.classList.remove("is-active");
    navigation.classList.remove("is-open");

    if (pageShell) {
        pageShell.classList.remove("menu-open");
    }

    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
}


function openMenu() {
    if (!menuToggle || !navigation) {
        return;
    }

    menuToggle.classList.add("is-active");
    navigation.classList.add("is-open");

    if (pageShell) {
        pageShell.classList.add("menu-open");
    }

    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Закрыть меню");
}


if (menuToggle && navigation) {

    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.contains("is-open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });


    navigationLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });


    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });


    window.addEventListener("resize", () => {
        if (window.innerWidth > 700) {
            closeMenu();
        }
    });

}


    /* =================================================
       04. АКТИВНЫЙ ПУНКТ МЕНЮ
    ================================================= */

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const currentId = entry.target.id;

                    navigationLinks.forEach((link) => {

                        const isActive =
                            link.getAttribute("href") === `#${currentId}`;

                        link.classList.toggle("active", isActive);

                    });

                });

            },
            {
                rootMargin: "-35% 0px -50% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {

            sectionObserver.observe(section);

        });

    }


    /* =================================================
       05. ТЕКУЩИЙ ГОД
    ================================================= */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {

        currentYear.textContent = new Date().getFullYear();

    }


    /* =================================================
       06. КНОПКИ: МЯГКАЯ РЕАКЦИЯ
    ================================================= */

    const interactiveButtons = document.querySelectorAll(
        ".button, .header__button"
    );

    interactiveButtons.forEach((button) => {

        button.addEventListener("pointerdown", () => {

            button.classList.add("is-pressed");

        });

        const releaseButton = () => {

            button.classList.remove("is-pressed");

        };

        button.addEventListener("pointerup", releaseButton);

        button.addEventListener("pointercancel", releaseButton);

        button.addEventListener("pointerleave", releaseButton);

    });


    /* =================================================
       07. ПРОВЕРКА ЗАПУСКА
    ================================================= */

    console.log(
        "%c008 — АГЕНТ ТВОИХ ЭМОЦИЙ",
        "color: #ffffff; background: #080808; padding: 10px; font-size: 14px;"
    );

    console.log(
        "Система готова. Добро пожаловать в архив эмоций."
    );
/* ========================================
   SPACE EFFECT — КОМЕТЫ ДЛЯ 008
======================================== */

(() => {
    const container = document.querySelector(".comets-container");

    // Если космического фона нет на странице,
    // ничего не запускаем.
    if (!container) return;

    // Уважаем системную настройку уменьшения анимации.
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) return;

    let cometTimer;
    let stopped = false;

    // Создаём одну комету.
    function createComet() {
        if (stopped || document.hidden) return;

        const comet = document.createElement("span");

        comet.className = "comet";

        // Начальная позиция.
        // Комета появляется в верхней или правой части экрана.
        const startX = 45 + Math.random() * 65;
        const startY = Math.random() * 45;

        // Случайная длина хвоста.
        const length = 70 + Math.random() * 110;

        // Случайная длительность полёта.
        const duration = 1.5 + Math.random() * 1.5;

        comet.style.left = `${startX}%`;
        comet.style.top = `${startY}%`;

        comet.style.setProperty(
            "--comet-length",
            `${length}px`
        );

        comet.style.setProperty(
            "--comet-duration",
            `${duration}s`
        );

        container.appendChild(comet);

        // Удаляем элемент после завершения анимации.
        window.setTimeout(() => {
            comet.remove();
        }, duration * 1000 + 100);
    }

    // Кометы появляются с небольшими случайными паузами.
    function scheduleNextComet() {
        if (stopped || document.hidden) return;

        const delay = 2500 + Math.random() * 4500;

        cometTimer = window.setTimeout(() => {
            createComet();
            scheduleNextComet();
        }, delay);
    }

    // Не тратим ресурсы, когда вкладка не видна.
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            window.clearTimeout(cometTimer);
        } else if (!stopped) {
            scheduleNextComet();
        }
    });

    // Останавливаем эффект при включении
    // системной настройки уменьшения анимации.
    reducedMotion.addEventListener("change", (event) => {
        if (event.matches) {
            stopped = true;
            window.clearTimeout(cometTimer);
            container.replaceChildren();
        }
    });

    scheduleNextComet();
})();
});