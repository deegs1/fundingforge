/**
 * FundingForge - Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== SCROLL ANIMATIONS =====
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize scroll animations only if motion is allowed
    if (!prefersReducedMotion) {
        initScrollAnimations();
        initCounterAnimations();
    }

    /**
     * Initialize Intersection Observer for scroll-triggered animations
     * Using Intersection Observer API for better performance than scroll events
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate');

        if (animatedElements.length === 0) return;

        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px 0px -50px 0px', // trigger slightly before element is fully visible
            threshold: 0.1 // trigger when 10% of element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Unobserve after animation to prevent memory bloat
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Initialize counter animations for statistics
     * Uses requestAnimationFrame for smooth 60fps animation
     */
    function initCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');

        if (counters.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5 // trigger when 50% visible
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    /**
     * Animate a counter from 0 to target value
     * @param {HTMLElement} element - The counter element with data-counter attribute
     */
    function animateCounter(element) {
        const target = parseFloat(element.dataset.counter);
        const duration = parseInt(element.dataset.duration) || 2000; // default 2 seconds
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';
        const decimals = parseInt(element.dataset.decimals) || 0;

        const startTime = performance.now();
        const startValue = 0;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function: easeOutQuart for smooth deceleration
            const easedProgress = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (target - startValue) * easedProgress;

            element.textContent = prefix + currentValue.toFixed(decimals) + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for header
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // ===== FORM HANDLING =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Collect form data
            const formElements = contactForm.elements;
            let formData = {};

            for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                if (element.name && element.value) {
                    formData[element.name] = element.value;
                }
            }

            // Display success message
            contactForm.innerHTML = `
                <div class="form-success">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank you for reaching out!</h3>
                    <p>We've received your message and will get back to you shortly.</p>
                </div>
            `;

            console.log('Form submitted with data:', formData);
        });
    }

    // Add name attributes to form elements
    const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
    formInputs.forEach((input, index) => {
        if (!input.name) {
            if (input.type === 'text' && index === 0) {
                input.name = 'name';
            } else if (input.type === 'email') {
                input.name = 'email';
            } else if (input.type === 'text' && index === 2) {
                input.name = 'organization';
            } else if (input.tagName.toLowerCase() === 'textarea') {
                input.name = 'message';
            }
        }
    });

    // ===== MOBILE MENU =====
    const createMobileMenu = () => {
        const header = document.querySelector('header');
        if (!header) return;

        const nav = header.querySelector('nav');
        const navList = nav.querySelector('ul');

        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');

        // Add mobile menu button to header
        header.querySelector('.container').insertBefore(mobileMenuBtn, nav);

        // Add mobile menu functionality
        mobileMenuBtn.addEventListener('click', function() {
            navList.classList.toggle('show');
            const isExpanded = navList.classList.contains('show');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            mobileMenuBtn.innerHTML = isExpanded ?
                '<i class="fas fa-times"></i>' :
                '<i class="fas fa-bars"></i>';
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navList.classList.remove('show');
                mobileMenuBtn.setAttribute('aria-expanded', false);
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    };

    // Only create mobile menu for smaller screens
    if (window.innerWidth < 768) {
        createMobileMenu();
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth < 768) {
            if (!document.querySelector('.mobile-menu-btn')) {
                createMobileMenu();
            }
        }
    });
});
