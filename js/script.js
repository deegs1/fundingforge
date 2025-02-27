/**
 * FundingForge - Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, you would send the form data to a server
            // For now, we'll just show a success message
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

    // Mobile menu toggle (for smaller screens)
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