/* =========================================
   MAJESTIC HOMES & PROPERTIES
   MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =========================================
       MOBILE MENU
    ========================================= */

    const menuButton = document.getElementById("menuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuButton && mobileMenu) {

        menuButton.addEventListener("click", () => {

            const isOpen = mobileMenu.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            const lines = menuButton.querySelectorAll("span");

            if (lines.length >= 3) {

                lines[0].style.transform =
                    isOpen
                        ? "translateY(7px) rotate(45deg)"
                        : "";

                lines[1].style.opacity =
                    isOpen ? "0" : "";

                lines[2].style.transform =
                    isOpen
                        ? "translateY(-7px) rotate(-45deg)"
                        : "";
            }
        });


        mobileMenu.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

                mobileMenu.classList.remove("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                const lines =
                    menuButton.querySelectorAll("span");

                if (lines.length >= 3) {

                    lines[0].style.transform = "";
                    lines[1].style.opacity = "";
                    lines[2].style.transform = "";
                }

            });

        });

    }



    /* =========================================
       SERVICE ACCORDIONS
    ========================================= */

    const serviceCards =
        document.querySelectorAll(
            "#second-services .service-card"
        );

    serviceCards.forEach((card) => {

        const header =
            card.querySelector(".service-header");

        if (!header) return;

        header.addEventListener("click", () => {

            const wasActive =
                card.classList.contains("active");

            serviceCards.forEach((item) => {
                item.classList.remove("active");
            });

            if (!wasActive) {
                card.classList.add("active");
            }

        });

    });



    /* =========================================
       PROPERTY GUIDANCE ACCORDIONS
    ========================================= */

    const guideItems =
        document.querySelectorAll(".guide-item");

    guideItems.forEach((item) => {

        const header =
            item.querySelector(".guide-header");

        if (!header) return;

        header.addEventListener("click", () => {

            const wasActive =
                item.classList.contains("active");

            guideItems.forEach((guide) => {
                guide.classList.remove("active");
            });

            if (!wasActive) {
                item.classList.add("active");
            }

        });

    });



    /* =========================================
       BUTTONS + SMOOTH SCROLL
    ========================================= */

    const internalLinks =
        document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            let target = null;

            try {

                target =
                    document.querySelector(targetId);

            } catch (error) {

                console.warn(
                    "Invalid button/link target:",
                    targetId
                );

                return;
            }

            if (!target) {

                console.warn(
                    "Button target not found:",
                    targetId
                );

                return;
            }

            event.preventDefault();

            const navbar =
                document.querySelector(".navbar");

            const navbarHeight =
                navbar
                    ? navbar.offsetHeight
                    : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight -
                10;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: "smooth"
            });

        });

    });



    /* =========================================
       NAVBAR SCROLL EFFECT
    ========================================= */

    const navbar =
        document.querySelector(".navbar");

    function updateNavbar() {

        if (!navbar) return;

        if (window.scrollY > 40) {

            navbar.style.background =
                "rgba(5, 5, 5, 0.97)";

        } else {

            navbar.style.background =
                "rgba(8, 8, 8, 0.9)";
        }

    }

    if (navbar) {

        updateNavbar();

        window.addEventListener(
            "scroll",
            updateNavbar,
            { passive: true }
        );

    }



    /* =========================================
       PROPERTY ENQUIRY FORM PROGRESS
    ========================================= */

    const quoteForm =
        document.getElementById("quoteForm");

    const progressBar =
        document.getElementById("formProgress");

    if (quoteForm && progressBar) {

        const fields =
            quoteForm.querySelectorAll(
                "input:not([type='hidden']), select, textarea"
            );


        function updateProgress() {

            if (!fields.length) {

                progressBar.style.width = "0%";

                return;
            }

            let completed = 0;

            fields.forEach((field) => {

                if (
                    field.value &&
                    field.value.trim() !== ""
                ) {

                    completed++;

                }

            });

            const percentage =
                (completed / fields.length) * 100;

            progressBar.style.width =
                percentage + "%";

        }


        fields.forEach((field) => {

            field.addEventListener(
                "input",
                updateProgress
            );

            field.addEventListener(
                "change",
                updateProgress
            );

        });

        updateProgress();



        /* =========================================
           FORMSPREE
        ========================================= */

        quoteForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                const submitButton =
                    quoteForm.querySelector(
                        ".submit-button"
                    );

                const message =
                    document.getElementById(
                        "formMessage"
                    );

                if (!submitButton || !message) {
                    return;
                }

                const originalText =
                    submitButton.innerHTML;

                submitButton.disabled = true;

                submitButton.innerHTML =
                    "Sending...";

                message.textContent = "";

                message.style.color = "";


                try {

                    if (
                        !quoteForm.action ||
                        quoteForm.action.includes(
                            "YOUR_FORM_ID"
                        )
                    ) {

                        throw new Error(
                            "Formspree form URL has not been configured."
                        );

                    }


                    const formData =
                        new FormData(quoteForm);


                    const response =
                        await fetch(
                            quoteForm.action,
                            {
                                method: "POST",
                                body: formData,
                                headers: {
                                    Accept:
                                        "application/json"
                                }
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Form submission failed."
                        );

                    }


                    message.textContent =
                        "Thank you. Your enquiry has been sent successfully.";

                    message.style.color =
                        "#3d8b40";


                    quoteForm.reset();

                    updateProgress();


                    submitButton.innerHTML =
                        "Enquiry Sent ✓";


                    setTimeout(() => {

                        submitButton.innerHTML =
                            originalText;

                        submitButton.disabled =
                            false;

                    }, 4000);


                } catch (error) {

                    console.error(error);

                    message.textContent =
                        "Something went wrong. Please try again or call us directly.";

                    message.style.color =
                        "#b42318";


                    submitButton.innerHTML =
                        originalText;

                    submitButton.disabled =
                        false;

                }

            }
        );

    }



    /* =========================================
       IMAGE ERROR HANDLING
    ========================================= */

    document
        .querySelectorAll("img")
        .forEach((image) => {

            image.addEventListener(
                "error",
                () => {

                    console.warn(
                        "Image could not be loaded:",
                        image.src
                    );

                    image.style.background =
                        "#222";

                }
            );

        });



    /* =========================================
       HERO VIDEO
    ========================================= */

    const heroVideo =
        document.querySelector(
            ".hero-video"
        );

    if (heroVideo) {

        heroVideo.addEventListener(
            "error",
            () => {

                console.warn(
                    "Hero video could not be loaded."
                );

            }
        );

    }



    /* =========================================
       MAJESTIC VIDEO INSIDE TEXT
    ========================================= */

    /*
       The HTML still uses:
       wallformTextVideo
       wallformTextCanvas

       We keep those IDs so the existing CSS
       doesn't break.

       The visible text itself is now:
       MAJESTIC
    */

    const majesticVideo =
        document.getElementById(
            "wallformTextVideo"
        );

    const majesticCanvas =
        document.getElementById(
            "wallformTextCanvas"
        );


    if (majesticVideo && majesticCanvas) {

        const ctx =
            majesticCanvas.getContext("2d");


        if (ctx) {

            let animationStarted = false;


            /* -----------------------------------------
               RESIZE CANVAS
            ----------------------------------------- */

            function resizeMajesticCanvas() {

                const width =
                    Math.min(
                        Math.max(
                            window.innerWidth - 40,
                            280
                        ),
                        1400
                    );

                const height =
                    width * 0.38;


                const dpr =
                    Math.min(
                        window.devicePixelRatio || 1,
                        2
                    );


                majesticCanvas.width =
                    Math.floor(
                        width * dpr
                    );

                majesticCanvas.height =
                    Math.floor(
                        height * dpr
                    );


                majesticCanvas.style.width =
                    width + "px";

                majesticCanvas.style.height =
                    height + "px";


                ctx.setTransform(
                    dpr,
                    0,
                    0,
                    dpr,
                    0,
                    0
                );

            }



            /* -----------------------------------------
               DRAW MAJESTIC TEXT
            ----------------------------------------- */

            function drawMajesticText() {

                const width =
                    majesticCanvas.clientWidth;

                const height =
                    majesticCanvas.clientHeight;


                if (!width || !height) {

                    requestAnimationFrame(
                        drawMajesticText
                    );

                    return;
                }


                ctx.clearRect(
                    0,
                    0,
                    width,
                    height
                );


                /* -----------------------------------------
                   DRAW MAJESTIC AS MASK
                ----------------------------------------- */

                ctx.save();


                const fontSize =
                    Math.min(
                        width * 0.18,
                        230
                    );


                ctx.font =
                    `900 ${fontSize}px Arial, sans-serif`;


                ctx.textAlign =
                    "center";


                ctx.textBaseline =
                    "middle";


                ctx.fillStyle =
                    "#ffffff";


                ctx.fillText(
                    "ADPATRAS",
                    width / 2,
                    height / 2
                );


                ctx.restore();



                /* -----------------------------------------
                   PUT VIDEO INSIDE MAJESTIC
                ----------------------------------------- */

                if (
                    majesticVideo.readyState >= 2 &&
                    majesticVideo.videoWidth > 0 &&
                    majesticVideo.videoHeight > 0
                ) {

                    ctx.globalCompositeOperation =
                        "source-in";


                    const videoRatio =
                        majesticVideo.videoWidth /
                        majesticVideo.videoHeight;


                    const canvasRatio =
                        width / height;


                    let drawWidth;
                    let drawHeight;
                    let offsetX;
                    let offsetY;


                    if (
                        videoRatio >
                        canvasRatio
                    ) {

                        drawHeight =
                            height;

                        drawWidth =
                            height *
                            videoRatio;

                        offsetX =
                            (width -
                                drawWidth) / 2;

                        offsetY = 0;


                    } else {

                        drawWidth =
                            width;

                        drawHeight =
                            width /
                            videoRatio;

                        offsetX = 0;

                        offsetY =
                            (height -
                                drawHeight) / 2;

                    }


                    ctx.drawImage(
                        majesticVideo,
                        offsetX,
                        offsetY,
                        drawWidth,
                        drawHeight
                    );


                    ctx.globalCompositeOperation =
                        "source-over";

                }


                requestAnimationFrame(
                    drawMajesticText
                );

            }



            /* -----------------------------------------
               START MAJESTIC VIDEO
            ----------------------------------------- */

            function startMajesticVideo() {

                resizeMajesticCanvas();


                const playPromise =
                    majesticVideo.play();


                if (playPromise) {

                    playPromise.catch(() => {

                        console.warn(
                            "Majestic text video could not autoplay."
                        );

                    });

                }


                if (!animationStarted) {

                    animationStarted = true;

                    requestAnimationFrame(
                        drawMajesticText
                    );

                }

            }



            majesticVideo.addEventListener(
                "loadeddata",
                startMajesticVideo
            );


            majesticVideo.addEventListener(
                "canplay",
                startMajesticVideo
            );


            majesticVideo.addEventListener(
                "playing",
                startMajesticVideo
            );


            window.addEventListener(
                "resize",
                resizeMajesticCanvas
            );


            resizeMajesticCanvas();


            if (
                majesticVideo.readyState >= 2
            ) {

                startMajesticVideo();

            }

        }

    }



    /* =========================================
       NUMBER COUNTERS
    ========================================= */

    const counters =
        document.querySelectorAll(
            ".stat-number"
        );


    function startCounter(counter) {

        if (
            counter.dataset.counted === "true"
        ) {
            return;
        }


        const target =
            Number(
                counter.dataset.target
            );


        if (!Number.isFinite(target)) {
            return;
        }


        counter.dataset.counted =
            "true";


        const duration = 1600;


        const startTime =
            performance.now();


        function updateCounter(
            currentTime
        ) {

            const progress =
                Math.min(
                    (
                        currentTime -
                        startTime
                    ) / duration,
                    1
                );


            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const value =
                Math.floor(
                    target * eased
                );


            counter.textContent =
                value.toLocaleString();


            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            } else {

                counter.textContent =
                    target.toLocaleString();

            }

        }


        counter.textContent = "0";


        requestAnimationFrame(
            updateCounter
        );

    }



    if (counters.length) {

        if (
            "IntersectionObserver"
            in window
        ) {

            const counterObserver =
                new IntersectionObserver(
                    (entries) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    startCounter(
                                        entry.target
                                    );


                                    counterObserver.unobserve(
                                        entry.target
                                    );

                                }

                            }
                        );

                    },
                    {
                        threshold: 0.15
                    }
                );


            counters.forEach(
                (counter) => {

                    counterObserver.observe(
                        counter
                    );

                }
            );


        } else {

            counters.forEach(
                (counter) => {

                    startCounter(
                        counter
                    );

                }
            );

        }

    }



    /* =========================================
       TESTIMONIALS AUTO MOVE
    ========================================= */

    /*
       The new HTML uses:

       .testimonials-marquee
       .testimonials-track
       .testimonial-card

       So we target .testimonials-track directly.
    */

    const testimonialTrack =
        document.querySelector(
            ".testimonials-section .testimonials-track"
        );


    if (testimonialTrack) {

        let testimonialPosition = 0;

        let testimonialPaused = false;


        const testimonialCards =
            testimonialTrack.children;


        if (
            testimonialCards.length > 1
        ) {


            testimonialTrack.addEventListener(
                "mouseenter",
                () => {

                    testimonialPaused =
                        true;

                }
            );


            testimonialTrack.addEventListener(
                "mouseleave",
                () => {

                    testimonialPaused =
                        false;

                }
            );


            testimonialTrack.addEventListener(
                "touchstart",
                () => {

                    testimonialPaused =
                        true;

                },
                {
                    passive: true
                }
            );


            testimonialTrack.addEventListener(
                "touchend",
                () => {

                    setTimeout(() => {

                        testimonialPaused =
                            false;

                    }, 1500);

                },
                {
                    passive: true
                }
            );



            function moveTestimonials() {

                if (
                    !testimonialPaused
                ) {

                    testimonialPosition -=
                        0.25;


                    const firstCard =
                        testimonialCards[0];


                    if (firstCard) {

                        const cardWidth =
                            firstCard.offsetWidth;


                        const gap = 24;


                        if (
                            Math.abs(
                                testimonialPosition
                            ) >=
                            cardWidth + gap
                        ) {

                            testimonialPosition =
                                0;


                            testimonialTrack.appendChild(
                                testimonialTrack.firstElementChild
                            );

                        }


                        testimonialTrack.style.transform =
                            `translateX(${testimonialPosition}px)`;

                    }

                }


                requestAnimationFrame(
                    moveTestimonials
                );

            }


            requestAnimationFrame(
                moveTestimonials
            );

        }

    }

});
