/**
 * Angel Organics - Amazing Visual Enhancements
 * Advanced animations and interactions
 */

(function() {
    'use strict';

    // Smooth reveal on scroll
    const revealElements = () => {
        const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(reveal => observer.observe(reveal));
    };

    // Add floating animation to icons
    const addFloatingAnimation = () => {
        const icons = document.querySelectorAll('.fa-cow, .fa-leaf, .fa-heart, .fa-star');
        icons.forEach((icon, index) => {
            icon.classList.add('float-animation');
            icon.style.animationDelay = `${index * 0.2}s`;
        });
    };

    // Parallax effect on mouse move
    const initParallax = () => {
        document.addEventListener('mousemove', (e) => {
            const layers = document.querySelectorAll('.parallax-layer');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            layers.forEach((layer, index) => {
                const speed = (index + 1) * 2;
                const x = (window.innerWidth - e.pageX * speed) / 100;
                const y = (window.innerHeight - e.pageY * speed) / 100;
                
                layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        });
    };

    // Add gradient text to headings
    const enhanceHeadings = () => {
        const headings = document.querySelectorAll('h1, h2, h3');
        headings.forEach(heading => {
            if (!heading.classList.contains('gradient-text')) {
                heading.classList.add('gradient-text');
            }
        });
    };

    // Add glow effect to buttons
    const enhanceButtons = () => {
        const buttons = document.querySelectorAll('.btn, button');
        buttons.forEach(btn => {
            btn.classList.add('ripple-effect', 'gpu-accelerated');
            
            // Add icon pulse animation if button has icon
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.add('icon-pulse');
            }
        });
    };

    // Card hover enhancements
    const enhanceCards = () => {
        const cards = document.querySelectorAll('.card, .product-card, .feature-card');
        cards.forEach((card, index) => {
            card.classList.add('reveal', 'stagger-item', 'gpu-accelerated');
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    };

    // Add shimmer effect to loading elements
    const addShimmerEffect = () => {
        const shimmerElements = document.querySelectorAll('img[loading="lazy"]');
        shimmerElements.forEach(img => {
            const wrapper = document.createElement('div');
            wrapper.className = 'shimmer';
            wrapper.style.cssText = 'position: relative; overflow: hidden; background: #f0f0f0;';
            
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
            
            img.onload = () => {
                wrapper.classList.remove('shimmer');
            };
        });
    };

    // Add glow border to important sections
    const enhanceSections = () => {
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            if (index % 2 === 0) {
                section.classList.add('pattern-bg');
            }
        });
    };

    // Smooth number counting animation
    const animateNumbers = () => {
        const numbers = document.querySelectorAll('[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const target = parseFloat(entry.target.getAttribute('data-count'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            entry.target.textContent = target;
                            clearInterval(timer);
                        } else {
                            entry.target.textContent = Math.floor(current);
                        }
                    }, 16);
                }
            });
        });

        numbers.forEach(num => observer.observe(num));
    };

    // Add neon glow to CTA buttons
    const addNeonGlow = () => {
        const ctaButtons = document.querySelectorAll('.btn-primary, .btn-success');
        ctaButtons.forEach(btn => {
            btn.classList.add('neon-glow');
        });
    };

    // Image lazy load with fade effect
    const enhanceImages = () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.6s ease-in-out';
            
            if (img.complete) {
                img.style.opacity = '1';
            } else {
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
            }
        });
    };

    // Add scroll progress indicator
    const addScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #28a745, #FFD700, #20c997);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    };

    // Add particle effects on hover
    const addParticleEffects = () => {
        const specialElements = document.querySelectorAll('.btn-primary, h1');
        
        specialElements.forEach(element => {
            element.addEventListener('mouseenter', function(e) {
                for (let i = 0; i < 3; i++) {
                    const particle = document.createElement('span');
                    particle.style.cssText = `
                        position: absolute;
                        width: 4px;
                        height: 4px;
                        background: #FFD700;
                        border-radius: 50%;
                        pointer-events: none;
                        animation: particleFly 1s ease-out forwards;
                    `;
                    
                    const style = document.createElement('style');
                    style.textContent = `
                        @keyframes particleFly {
                            to {
                                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                    
                    this.style.position = 'relative';
                    this.appendChild(particle);
                    
                    setTimeout(() => particle.remove(), 1000);
                }
            });
        });
    };

    // Add gradient border animation to featured items
    const addGradientBorders = () => {
        const featured = document.querySelectorAll('.featured, .highlight');
        featured.forEach(item => {
            item.classList.add('gradient-border-animated');
        });
    };

    // Smooth scroll to anchor links
    const smoothScrollLinks = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    };

    // Initialize all enhancements
    const init = () => {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Apply all enhancements
        setTimeout(() => {
            revealElements();
            addFloatingAnimation();
            enhanceHeadings();
            enhanceButtons();
            enhanceCards();
            enhanceSections();
            animateNumbers();
            addNeonGlow();
            enhanceImages();
            addScrollProgress();
            addGradientBorders();
            smoothScrollLinks();
            
            // Optional: only on desktop
            if (window.innerWidth > 768) {
                initParallax();
                addParticleEffects();
            }
            
            console.log('✨ Angel Organics visual enhancements loaded!');
        }, 100);
    };

    // Start initialization
    init();

})();
