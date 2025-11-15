// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading').classList.add('hide');
    }, 1000);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(46, 139, 87, 0.98)';
        header.style.backdropFilter = 'blur(20px)';
    } else {
        header.style.background = 'rgba(46, 139, 87, 0.95)';
        header.style.backdropFilter = 'blur(20px)';
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const dataCount = counter.getAttribute('data-count');
        const hasPlus = dataCount.endsWith('+');
        const target = parseInt(dataCount);
        let count = 0;
        const increment = target / 100;
        const updateCounter = () => {
            if (count < target) {
                count += increment;
                counter.textContent = Math.floor(count);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = hasPlus ? target + '+' : target;
            }
        };
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Form submissions
document.addEventListener('DOMContentLoaded', function() {
    // Contact form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Get form data
            const formData = new FormData(contactForm);
            const name = contactForm.querySelector('input[type="text"]').value;
            const phone = contactForm.querySelector('input[type="tel"]').value;
            const product = contactForm.querySelector('select').value;
            const message = contactForm.querySelector('textarea').value;
            // Basic validation
            if (!name || !phone) {
                alert('Please fill in all required fields.');
                return;
            }
            // Success message
            alert(`Thank you ${name}! Your inquiry about ${product} has been received. Sunil Rai will contact you at ${phone} within 24 hours.`);
            // Reset form
            contactForm.reset();
            // Here you would typically send the data to a server
            console.log('Form submitted:', { name, phone, product, message });
        });
    }

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'rgba(46, 139, 87, 0.98)';
                navLinks.style.padding = '1rem';
                navLinks.style.borderRadius = '0 0 15px 15px';
            }
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        });
    });
});

// Add stagger animation to grid items
document.addEventListener('DOMContentLoaded', function() {
    // Stagger animations for reason cards
    document.querySelectorAll('.reasons-grid .reason-card').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    // Stagger animations for benefit items
    document.querySelectorAll('.benefits-grid .benefit-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    // Stagger animations for product cards
    document.querySelectorAll('.products-grid .product-card').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    // Stagger animations for testimonial cards
    document.querySelectorAll('.testimonials-grid .testimonial-card').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth > 768) {
        const rate = scrolled * -0.5;
        hero.style.backgroundPosition = `center ${rate}px`;
    }
});

// Enhanced hover effects for cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.reason-card, .benefit-item, .product-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.4s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.4s ease';
        });
    });
});

// Smooth reveal animations
function revealOnScroll() {
    const reveals = document.querySelectorAll('.animate-on-scroll');
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animated');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Initialize AOS-like animations
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        const animatedElements = section.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach((element, elementIndex) => {
            element.style.animationDelay = `${elementIndex * 0.1}s`;
        });
    });
});

// Add floating animation to certain elements
document.addEventListener('DOMContentLoaded', function() {
    const floatingElements = document.querySelectorAll('.floating-benefit, .image-badge');
    floatingElements.forEach(element => {
        element.style.animation = 'float 3s ease-in-out infinite';
    });
});

// Enhanced form interactions
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.transform = 'scale(1.02)';
            input.style.boxShadow = '0 0 0 3px rgba(255,215,0,0.3)';
        });
        input.addEventListener('blur', () => {
            input.style.transform = 'scale(1)';
            input.style.boxShadow = 'none';
        });
    });
});

// Add click-to-call functionality
document.addEventListener('DOMContentLoaded', function() {
    const phoneNumbers = document.querySelectorAll('p, span, div');
    phoneNumbers.forEach(element => {
        if (element.textContent.includes('+91 8811013758')) {
            element.style.cursor = 'pointer';
            element.style.color = '#FFD700';
            element.addEventListener('click', () => {
                window.open('tel:+918811013758', '_self');
            });
        }
    });
});

// Add email click functionality
document.addEventListener('DOMContentLoaded', function() {
    const emailElements = document.querySelectorAll('p, span, div');
    emailElements.forEach(element => {
        if (element.textContent.includes('drsunilkrai1975@gmail.com')) {
            element.style.cursor = 'pointer';
            element.style.color = '#FFD700';
            element.addEventListener('click', () => {
                window.open('mailto:drsunilkrai1975@gmail.com?subject=Inquiry about Angel Organics A2 Milk', '_self');
            });
        }
    });
});

// Product card interaction enhancements
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productName = card.querySelector('h3').textContent;
            const productPrice = card.querySelector('.product-price') ? card.querySelector('.product-price').textContent : '';
            const message = `Hi Sunil Rai, I'm interested in ordering ${productName} at ${productPrice}. Please provide more details.`;
            const whatsappUrl = `https://wa.me/918811013758?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
        card.style.cursor = 'pointer';
    });
});

// Add WhatsApp integration
function openWhatsApp(message = '') {
    const defaultMessage = message || 'Hi Sunil Rai, I\'m interested in Angel Organics A2 milk products. Please provide more information.';
    const whatsappUrl = `https://wa.me/918811013758?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
}

// Gallery Lightbox
document.addEventListener('DOMContentLoaded', function() {
    const galleryPhotos = document.querySelectorAll('.gallery-photo');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    if (galleryPhotos && lightbox && lightboxImg && lightboxCaption && lightboxClose) {
        galleryPhotos.forEach(photo => {
            photo.addEventListener('click', function() {
                lightbox.classList.add('show');
                lightboxImg.src = this.src;
                lightboxCaption.textContent = this.alt;
            });
        });
        lightboxClose.addEventListener('click', function() {
            lightbox.classList.remove('show');
        });
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('show');
            }
        });
    }
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Fade-in Animation for Sections
document.addEventListener('DOMContentLoaded', function() {
    const fadeSections = document.querySelectorAll('section');
    fadeSections.forEach(section => {
        section.classList.add('fade-in-section');
    });
    function revealSections() {
        fadeSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                section.classList.add('visible');
            }
        });
    }
    window.addEventListener('scroll', revealSections);
    revealSections();
});

// WhatsApp Button with Logo
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButton = document.querySelector('div[style*="background: #25D366"]');
    if (whatsappButton) {
        whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
        whatsappButton.style.fontSize = '2.2rem';
        whatsappButton.style.display = 'flex';
        whatsappButton.style.alignItems = 'center';
        whatsappButton.style.justifyContent = 'center';
    }
});

// Testimonials Slider/Carousel
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('testimonialsSlider');
    const cards = slider ? slider.querySelectorAll('.testimonial-card') : [];
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    let current = 0;
    function showSlide(idx) {
        cards.forEach((card, i) => {
            card.classList.remove('active');
            card.style.transform = `translateX(${(i-idx)*100}%)`;
        });
        if (cards[idx]) cards[idx].classList.add('active');
    }
    if (cards.length) {
        showSlide(current);
        if (prevBtn && nextBtn) {
            prevBtn.onclick = () => {
                current = (current - 1 + cards.length) % cards.length;
                showSlide(current);
            };
            nextBtn.onclick = () => {
                current = (current + 1) % cards.length;
                showSlide(current);
            };
        }
    }
});

// Add quick order functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create floating WhatsApp button
    const whatsappButton = document.createElement('div');
    whatsappButton.innerHTML = '';
    whatsappButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: #25D366;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
        transition: all 0.3s ease;
    `;
    whatsappButton.addEventListener('click', () => openWhatsApp());
    whatsappButton.addEventListener('mouseenter', () => {
        whatsappButton.style.transform = 'scale(1.1)';
    });
    whatsappButton.addEventListener('mouseleave', () => {
        whatsappButton.style.transform = 'scale(1)';
    });
    document.body.appendChild(whatsappButton);
});

console.log('Angel Organics website loaded successfully! 🐄🥛');

// Video functionality
function toggleVideo() {
    const video = document.querySelector('.farm-video-player');
    const playIcon = document.getElementById('playIcon');
    if (video.paused) {
        video.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    } else {
        video.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    }
}

// Video event listeners
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.farm-video-player');
    const playIcon = document.getElementById('playIcon');
    if (video && playIcon) {
        video.addEventListener('play', () => {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
        });
        video.addEventListener('pause', () => {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
        });
        video.addEventListener('ended', () => {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
        });
        video.addEventListener('click', toggleVideo);
    }
});
window.toggleVideo = toggleVideo;

// Easter egg: Cow sound on logo click
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            console.log('Moo! 🐄 Welcome to Angel Organics!');
            // Add cow sound if desired
        });
    }
});
