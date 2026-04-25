document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = document.getElementById('overlay');

    const toggleMenu = () => {
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    // Mobile Accordion
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => link.parentElement.classList.toggle('active'));
    });

    document.querySelectorAll('.submenu-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            link.parentElement.classList.toggle('active');
        });
    });

    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slider .slide');
    if (heroSlides.length > 0) {
        let currentHero = 0;
        setInterval(() => {
            heroSlides[currentHero].classList.remove('active');
            currentHero = (currentHero + 1) % heroSlides.length;
            heroSlides[currentHero].classList.add('active');
        }, 4000);
    }

    // --- Helper for Infinite Loop Sliders ---
    const setupInfiniteSlider = (sliderSelector, isReverse = false, slidesPerView = 5) => {
        const track = document.querySelector(`${sliderSelector} .slider-track`);
        const slides = document.querySelectorAll(`${sliderSelector} .slide-base`);
        
        if (!track || slides.length === 0) return;
        const totalOriginal = slides.length;
        let index = isReverse ? totalOriginal : 0;

        // Clone slides on both ends for safety
        slides.forEach(slide => {
            const cloneEnd = slide.cloneNode(true);
            const cloneStart = slide.cloneNode(true);
            track.appendChild(cloneEnd);
            track.insertBefore(cloneStart, track.firstChild);
        });

        // Adjusted index due to prepended clones
        index += totalOriginal;

        const updatePosition = (smooth = true) => {
            const slideWidth = slides[0].offsetWidth;
            track.style.transition = smooth ? 'transform 0.8s ease-in-out' : 'none';
            track.style.transform = `translateX(-${index * slideWidth}px)`;
        };

        // Initial position
        updatePosition(false);

        const getSlidesPerView = () => {
            if (window.innerWidth <= 600) return 2;
            if (window.innerWidth <= 1024) return 3;
            return slidesPerView;
        };

        const move = () => {
            if (isReverse) index--; else index++;
            updatePosition(true);

            // Seamless jump
            if (!isReverse && index >= totalOriginal * 2) {
                setTimeout(() => {
                    index = totalOriginal;
                    updatePosition(false);
                }, 800);
            } else if (isReverse && index <= totalOriginal - getSlidesPerView()) {
                setTimeout(() => {
                    index = totalOriginal * 2 - getSlidesPerView();
                    updatePosition(false);
                }, 800);
            }
        };

        let interval = setInterval(move, 3000);
        track.addEventListener('mouseenter', () => clearInterval(interval));
        track.addEventListener('mouseleave', () => interval = setInterval(move, 3000));

        window.addEventListener('resize', () => updatePosition(false));
    };

    // Initialize both sliders
    setupInfiniteSlider('.brand-slider-home:not(.brand-slider-reverse)', false, 5);
    setupInfiniteSlider('.brand-slider-reverse', true, 6);
});
