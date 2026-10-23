/* =====================================================
   AGENT 008
   PORTFOLIO INTERACTIONS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       01. ЭЛЕМЕНТЫ ГАЛЕРЕИ
    ================================================= */

    const grid = document.getElementById("archiveGrid");

    const cards = Array.from(
        document.querySelectorAll(".archive-card")
    );

    const filters = Array.from(
        document.querySelectorAll(".archive-filter")
    );

    const galleryCount = document.getElementById("galleryCount");
    const emptyMessage = document.getElementById("archiveEmpty");

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxCounter = document.getElementById("lightboxCounter");

    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");

    if (!grid || !lightbox || !lightboxImage) {
        return;
    }

    let activeFilter = "all";
    let currentIndex = 0;
    let visibleCards = [];

    let previousFocus = null;
    let savedScrollY = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    let imageLoadToken = 0;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =================================================
       02. ОБНОВЛЕНИЕ СПИСКА ФОТОГРАФИЙ
    ================================================= */

    function getVisibleCards() {
        return cards.filter((card) => {
            const matchesCategory =
                activeFilter === "all" ||
                card.dataset.category === activeFilter;

            return matchesCategory && !card.hidden;
        });
    }


    function updateGallery() {
        visibleCards = getVisibleCards();

        if (galleryCount) {
            const count = String(visibleCards.length).padStart(2, "0");

            galleryCount.textContent =
                `${count} РАБОТ`;
        }

        if (emptyMessage) {
            emptyMessage.hidden = visibleCards.length > 0;
        }

        // Если галерея уже открыта, переключаемся только
        // между фотографиями выбранной категории.
        if (lightbox.classList.contains("is-open")) {
            if (visibleCards.length === 0) {
                closeLightbox();
                return;
            }

            const currentCard = lightboxImage.dataset.cardId;

            let newIndex = visibleCards.findIndex(
                (card) => card.dataset.cardId === currentCard
            );

            if (newIndex < 0) {
                newIndex = Math.min(
                    currentIndex,
                    visibleCards.length - 1
                );
            }

            currentIndex = newIndex;
            showImage(currentIndex);
        }
    }


    /* =================================================
       03. ФИЛЬТРЫ
    ================================================= */

    filters.forEach((filterButton) => {
        filterButton.addEventListener("click", () => {

            activeFilter = filterButton.dataset.filter || "all";

            filters.forEach((button) => {
                const isActive = button === filterButton;

                button.classList.toggle("is-active", isActive);
                button.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            cards.forEach((card) => {
                const matchesCategory =
                    activeFilter === "all" ||
                    card.dataset.category === activeFilter;

                card.classList.toggle(
                    "is-filtered-out",
                    !matchesCategory
                );

                card.hidden = !matchesCategory;
            });

            updateGallery();
        });
    });


    /* =================================================
       04. ПОДГОТОВКА КАРТОЧЕК
    ================================================= */

    cards.forEach((card, index) => {

        card.dataset.cardId = `archive-${index}`;

        const image = card.querySelector("img");

        // Если data-full не задан, используем src миниатюры.
        if (!card.dataset.full && image) {
            card.dataset.full = image.currentSrc || image.src;
        }

        if (!card.dataset.alt && image) {
            card.dataset.alt = image.alt || "Фотография из портфолио";
        }

        card.addEventListener("click", () => {

            visibleCards = getVisibleCards();

            const indexInVisible = visibleCards.indexOf(card);

            if (indexInVisible !== -1) {
                openLightbox(indexInVisible, card);
            }
        });

    });

    updateGallery();


    /* =================================================
       05. ОТКРЫТИЕ LIGHTBOX
    ================================================= */

    function openLightbox(index, card) {

        visibleCards = getVisibleCards();

        if (!visibleCards.length) {
            return;
        }

        currentIndex = Math.max(
            0,
            Math.min(index, visibleCards.length - 1)
        );

        previousFocus = card || document.activeElement;
        savedScrollY = window.scrollY;

        lightbox.inert = false;
        lightbox.setAttribute("aria-hidden", "false");
        lightbox.classList.add("is-open");

        document.body.classList.add("lightbox-open");

        // Блокируем прокрутку страницы без скачка вверх.
        document.body.style.position = "fixed";
        document.body.style.top = `-${savedScrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";

        showImage(currentIndex);

        if (lightboxClose) {
            lightboxClose.focus({ preventScroll: true });
        }
    }


    /* =================================================
       06. ПОКАЗ ФОТОГРАФИИ
    ================================================= */

    function showImage(index) {

        if (!visibleCards.length) {
            return;
        }

        currentIndex =
            (index + visibleCards.length) % visibleCards.length;

        const card = visibleCards[currentIndex];

        const thumbnail = card.querySelector("img");

        const imageSource =
            card.dataset.full ||
            (thumbnail ? thumbnail.currentSrc || thumbnail.src : "");

        const imageAlt =
            card.dataset.alt ||
            (thumbnail ? thumbnail.alt : "") ||
            "Фотография из портфолио";

        if (!imageSource) {
            return;
        }

        const token = ++imageLoadToken;

        lightboxImage.classList.add("is-changing");

        // Создаём отдельный объект изображения, чтобы
        // не показывать пустой экран при загрузке файла.
        const preloadImage = new Image();

        preloadImage.onload = () => {
            if (token !== imageLoadToken) {
                return;
            }

            lightboxImage.src = imageSource;
            lightboxImage.alt = imageAlt;
            lightboxImage.dataset.cardId = card.dataset.cardId;

            lightboxImage.classList.remove("is-changing");
        };

        preloadImage.onerror = () => {
            if (token !== imageLoadToken) {
                return;
            }

            // Показываем путь к изображению даже при ошибке
            // загрузки, чтобы было понятно, какую работу проверить.
            lightboxImage.src = imageSource;
            lightboxImage.alt = `${imageAlt}. Не удалось загрузить изображение.`;

            lightboxImage.classList.remove("is-changing");
        };

        preloadImage.src = imageSource;

        if (preloadImage.complete && preloadImage.naturalWidth > 0) {
            if (token === imageLoadToken) {
                lightboxImage.src = imageSource;
                lightboxImage.alt = imageAlt;
                lightboxImage.dataset.cardId = card.dataset.cardId;
                lightboxImage.classList.remove("is-changing");
            }
        }

        if (lightboxCounter) {
            const current = String(currentIndex + 1).padStart(2, "0");
            const total = String(visibleCards.length).padStart(2, "0");

            lightboxCounter.textContent = `${current} / ${total}`;
        }

        if (lightboxCaption) {
            lightboxCaption.textContent =
                `${imageAlt} · ${String(currentIndex + 1).padStart(2, "0")}`;
        }

        if (lightboxPrev) {
            lightboxPrev.disabled = visibleCards.length < 2;
        }

        if (lightboxNext) {
            lightboxNext.disabled = visibleCards.length < 2;
        }
    }


    /* =================================================
       07. ПЕРЕКЛЮЧЕНИЕ ФОТОГРАФИЙ
    ================================================= */

    function showPrevious() {
        if (visibleCards.length > 1) {
            showImage(currentIndex - 1);
        }
    }

    function showNext() {
        if (visibleCards.length > 1) {
            showImage(currentIndex + 1);
        }
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener("click", showPrevious);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener("click", showNext);
    }


    /* =================================================
       08. ЗАКРЫТИЕ LIGHTBOX
    ================================================= */

    function closeLightbox() {

        if (!lightbox.classList.contains("is-open")) {
            return;
        }

        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        lightbox.inert = true;

        document.body.classList.remove("lightbox-open");

        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";

        window.scrollTo({
            top: savedScrollY,
            behavior: prefersReducedMotion ? "auto" : "instant"
        });

        // Сбрасываем src после завершения закрытия,
        // чтобы не запускать лишние загрузки.
        window.setTimeout(() => {
            if (!lightbox.classList.contains("is-open")) {
                lightboxImage.removeAttribute("src");
                lightboxImage.removeAttribute("data-card-id");
                lightboxImage.classList.remove("is-changing");
            }
        }, 300);

        if (
            previousFocus &&
            typeof previousFocus.focus === "function" &&
            previousFocus.isConnected
        ) {
            previousFocus.focus({ preventScroll: true });
        }
    }

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

 
 // Закрытие при нажатии на свободный тёмный фон.
lightbox.addEventListener("click", (event) => {
    const clickedElement = event.target;

    const clickedOnBackground =
        clickedElement === lightbox ||
        clickedElement.classList.contains("lightbox__figure") ||
        clickedElement.classList.contains("lightbox__hint");

    if (clickedOnBackground) {
        closeLightbox();
    }
});



    /* =================================================
       09. КЛАВИАТУРА
    ================================================= */

    document.addEventListener("keydown", (event) => {

        if (!lightbox.classList.contains("is-open")) {
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            closeLightbox();
            return;
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            showPrevious();
            return;
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            showNext();
        }
    });


    /* =================================================
       10. СВАЙПЫ НА ТЕЛЕФОНЕ
    ================================================= */

    lightbox.addEventListener(
        "touchstart",
        (event) => {

            if (!event.changedTouches.length) {
                return;
            }

            touchStartX = event.changedTouches[0].clientX;
            touchStartY = event.changedTouches[0].clientY;

        },
        { passive: true }
    );


    lightbox.addEventListener(
        "touchend",
        (event) => {

            if (!event.changedTouches.length) {
                return;
            }

            const touchEndX = event.changedTouches[0].clientX;
            const touchEndY = event.changedTouches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Реагируем только на выраженный горизонтальный свайп.
            if (
                Math.abs(deltaX) > 55 &&
                Math.abs(deltaX) > Math.abs(deltaY) * 1.25
            ) {

                if (deltaX > 0) {
                    showPrevious();
                } else {
                    showNext();
                }
            }

        },
        { passive: true }
    );


    /* =================================================
       11. ТЕКУЩИЙ ГОД
    ================================================= */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =================================================
       12. ГОТОВО
    ================================================= */

    console.log(
        "%c008 — VISUAL ARCHIVE",
        "color: #fff; background: #080808; padding: 8px; font-size: 13px;"
    );

});