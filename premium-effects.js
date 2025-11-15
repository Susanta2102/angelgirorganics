/**
 * Premium Effects Activator
 * Makes Angel Organics website STUNNING!
 */

(function() {
    'use strict';

    // Auto-apply premium effects to elements
    const initPremiumEffects = () => {
        // Add magnetic effect to all buttons
        document.querySelectorAll('.btn, button').forEach(btn => {
            btn.classList.add('magnetic-btn', 'btn-liquid', 'glow-pulse');
            
            // Magnetic mouse follow
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });

        // Add sparkle to important headings
        document.querySelectorAll('h1, h2').forEach((heading, index) => {
            if (index < 5) {
                heading.classList.add('sparkle', 'text-gradient-animated');
            }
        });

        // Add breathing animation to product cards
        document.querySelectorAll('.product-card, .glass-card').forEach(card => {
            card.classList.add('breathing', 'shadow-premium');
        });

        // Add wave effect to hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.classList.add('wave', 'spotlight');
        }

        // Add morphing background to sections
        document.querySelectorAll('.section').forEach((section, index) => {
            if (index % 2 === 0) {
                const morphBg = document.createElement('div');
                morphBg.className = 'morphing-bg';
                section.style.position = 'relative';
                section.insertBefore(morphBg, section.firstChild);
            }
        });

        // Add neon effect to special text
        document.querySelectorAll('.hero-title, .section-title').forEach(title => {
            const words = title.textContent.split(' ');
            if (words.length > 0) {
                title.classList.add('neon-text');
            }
        });

        // Add bounce effect to stats
        document.querySelectorAll('.stat-number').forEach((stat, index) => {
            stat.classList.add('bounce-in');
            stat.style.animationDelay = `${index * 0.2}s`;
        });

        // Add border light to featured elements
        document.querySelectorAll('.featured, .highlight, .live-counter').forEach(el => {
            el.classList.add('border-light');
        });

        // Add confetti to success buttons
        document.querySelectorAll('.btn-success, .btn-warning').forEach(btn => {
            btn.addEventListener('click', () => {
                createConfetti(btn);
            });
        });

        // Add rainbow border to product images
        document.querySelectorAll('.product-card img').forEach(img => {
            img.style.border = '3px solid transparent';
            img.classList.add('rainbow-border');
        });

        // Add holographic effect to prices
        document.querySelectorAll('.product-price, .stat-number').forEach(price => {
            price.classList.add('holographic');
        });
    };

    // Create confetti effect
    const createConfetti = (element) => {
        const colors = ['#28a745', '#FFD700', '#20c997', '#ff6b6b'];
        const confettiCount = 30;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${element.offsetLeft + element.offsetWidth / 2}px;
                top: ${element.offsetTop}px;
                opacity: 1;
                pointer-events: none;
                z-index: 10000;
                animation: confettiExplode 1s ease-out forwards;
            `;
            
            const angle = (Math.PI * 2 * i) / confettiCount;
            const velocity = 100 + Math.random() * 100;
            
            confetti.style.setProperty('--x', Math.cos(angle) * velocity + 'px');
            confetti.style.setProperty('--y', Math.sin(angle) * velocity + 'px');
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 1000);
        }
        
        // Add animation
        if (!document.getElementById('confetti-animation')) {
            const style = document.createElement('style');
            style.id = 'confetti-animation';
            style.textContent = `
                @keyframes confettiExplode {
                    to {
                        transform: translate(var(--x), var(--y)) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Add floating particles around cursor
    const addCursorMagic = () => {
        let particles = [];
        const maxParticles = 15;
        
        document.addEventListener('mousemove', (e) => {
            if (particles.length > maxParticles) {
                const old = particles.shift();
                old.remove();
            }
            
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: linear-gradient(45deg, #28a745, #FFD700);
                border-radius: 50%;
                pointer-events: none;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                z-index: 9999;
                animation: cursorParticle 1s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            particles.push(particle);
            
            setTimeout(() => particle.remove(), 1000);
        });
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes cursorParticle {
                to {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    };

    // Add scroll-triggered animations
    const addScrollMagic = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Alternate slide directions
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    if (index % 2 === 0) {
                        entry.target.classList.add('slide-in-left');
                    } else {
                        entry.target.classList.add('slide-in-right');
                    }
                    
                    // Add shake effect to icons
                    const icon = entry.target.querySelector('i');
                    if (icon) {
                        icon.classList.add('shake');
                        setTimeout(() => icon.classList.remove('shake'), 500);
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
        
        document.querySelectorAll('.card, .product-card, .testimonial-card, .contact-card').forEach(el => {
            observer.observe(el);
        });
    };

    // Add glowing trail effect
    const addGlowingTrail = () => {
        let trail = [];
        const maxTrail = 20;
        
        document.addEventListener('mousemove', (e) => {
            if (trail.length > maxTrail) {
                const old = trail.shift();
                old.remove();
            }
            
            const glow = document.createElement('div');
            glow.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, rgba(40, 167, 69, 0.6), transparent);
                border-radius: 50%;
                pointer-events: none;
                left: ${e.clientX - 10}px;
                top: ${e.clientY - 10}px;
                z-index: 9998;
                animation: glowFade 0.8s ease-out forwards;
            `;
            
            document.body.appendChild(glow);
            trail.push(glow);
        });
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glowFade {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    };

    // Add parallax depth effect
    const addParallaxDepth = () => {
        const layers = document.querySelectorAll('.hero, .section');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            layers.forEach((layer, index) => {
                const speed = (index + 1) * 0.5;
                layer.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
            });
        });
    };

    // Add typewriter effect to hero subtitle
    const addTypewriterEffect = () => {
        const subtitle = document.querySelector('.hero-description');
        if (subtitle) {
            const text = subtitle.textContent;
            subtitle.textContent = '';
            subtitle.style.borderRight = '3px solid #28a745';
            subtitle.style.display = 'inline-block';
            subtitle.style.whiteSpace = 'nowrap';
            subtitle.style.overflow = 'hidden';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    subtitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                } else {
                    subtitle.style.borderRight = 'none';
                }
            };
            
            setTimeout(typeWriter, 1000);
        }
    };

    // Add image hover zoom with tilt
    const enhanceImageHovers = () => {
        document.querySelectorAll('img').forEach(img => {
            img.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            img.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.15) rotate(2deg)';
                this.style.filter = 'brightness(1.1) contrast(1.1)';
                this.style.zIndex = '10';
            });
            
            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
                this.style.filter = 'brightness(1) contrast(1)';
                this.style.zIndex = '1';
            });
        });
    };

    // Add success pulse to form submissions
    const enhanceForms = () => {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const btn = form.querySelector('button[type="submit"]');
                if (btn) {
                    btn.classList.add('glow-pulse');
                    createConfetti(btn);
                }
            });
        });
    };

    // Add color shift on scroll
    const addColorShiftScroll = () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                const hue = Math.min(window.pageYOffset / 10, 100);
                navbar.style.filter = `hue-rotate(${hue}deg)`;
            });
        }
    };

    // Add floating icons
    const addFloatingIcons = () => {
        const icons = ['🐄', '🥛', '🌿', '⭐', '💚'];
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        
        icons.forEach((icon, index) => {
            const float = document.createElement('div');
            float.textContent = icon;
            float.style.cssText = `
                position: absolute;
                font-size: 30px;
                opacity: 0.3;
                animation: floatIcon ${10 + index * 2}s ease-in-out infinite;
                animation-delay: ${index * 2}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            container.appendChild(float);
        });
        
        document.body.appendChild(container);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatIcon {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                }
                25% {
                    transform: translate(50px, -50px) rotate(90deg);
                }
                50% {
                    transform: translate(100px, 0) rotate(180deg);
                }
                75% {
                    transform: translate(50px, 50px) rotate(270deg);
                }
            }
        `;
        document.head.appendChild(style);
    };

    // Initialize everything
    const init = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        setTimeout(() => {
            console.log('🎨 Activating PREMIUM effects...');
            
            initPremiumEffects();
            addScrollMagic();
            enhanceImageHovers();
            enhanceForms();
            
            // Optional effects (performance intensive)
            if (window.innerWidth > 768) {
                addCursorMagic();
                addGlowingTrail();
                addParallaxDepth();
                addFloatingIcons();
                addColorShiftScroll();
            }
            
            console.log('✨ Angel Organics is now STUNNING!');
        }, 500);
    };

    init();

})();
