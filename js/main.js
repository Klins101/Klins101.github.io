// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navigation highlight on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.remove('active');
        }
    });
});

// Theme toggle functionality
let isDark = true;
const themeToggle = document.createElement('button');
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
document.body.appendChild(themeToggle);

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    document.body.classList.toggle('light-theme');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
});

// Add loading animation
const loader = document.createElement('div');
loader.className = 'loader';
document.body.appendChild(loader);

window.addEventListener('load', () => {
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
});

// Mobile menu handling
const mobileMenuBtn = document.querySelector('.navbar-toggler');
const navbarLinks = document.querySelector('.navbar-collapse');

if (mobileMenuBtn && navbarLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navbarLinks.classList.toggle('show');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbarLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navbarLinks.classList.remove('show');
        }
    });
}

// Form validation and submission
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Add your form submission logic here
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';
            
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            alert('Message sent successfully!');
            contactForm.reset();
        } catch (error) {
            alert('Failed to send message. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
        }
    });
}

// Project filter functionality
const projectFilters = document.querySelectorAll('.project-filter');
const projectCards = document.querySelectorAll('.project-card');

if (projectFilters.length && projectCards.length) {
    projectFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const category = filter.getAttribute('data-filter');
            
            projectFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            projectCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Animate education items when they come into view
const animateEducation = () => {
    const educationItems = document.querySelectorAll('.education-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    educationItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease-out';
        observer.observe(item);
    });
};

// Initialize animations when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateEducation();
});

// Filter research papers by year
const initializeResearchFilters = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const papers = document.querySelectorAll('.research-paper');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter papers
            const filterValue = button.getAttribute('data-filter');
            
            papers.forEach(paper => {
                const paperYear = paper.getAttribute('data-year');
                if (filterValue === 'all' || filterValue === paperYear) {
                    paper.style.display = 'block';
                    paper.style.opacity = '0';
                    setTimeout(() => {
                        paper.style.opacity = '1';
                    }, 100);
                } else {
                    paper.style.display = 'none';
                }
            });
        });
    });
};

// Animate research papers when they come into view
const animateResearchPapers = () => {
    const papers = document.querySelectorAll('.research-paper');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    papers.forEach(paper => {
        paper.style.opacity = '0';
        paper.style.transform = 'translateY(20px)';
        paper.style.transition = 'all 0.6s ease-out';
        observer.observe(paper);
    });
};

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeResearchFilters();
    animateResearchPapers();
});

// Citation Modal Functionality
const initializeCitationSystem = () => {
    const modal = document.getElementById('citationModal');
    const citeLinks = document.querySelectorAll('.cite-link');
    const closeBtn = document.querySelector('.close-modal');
    const copyBtn = document.querySelector('.copy-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const citationText = document.getElementById('citationText');
    let currentCitation = null;

    // Open modal with citation
    citeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentCitation = {
                bibtex: link.getAttribute('data-bibtex'),
                apa: link.getAttribute('data-apa')
            };
            citationText.textContent = currentCitation.bibtex;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        copyBtn.textContent = 'Copy to Clipboard';
        copyBtn.classList.remove('copied');
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const format = btn.getAttribute('data-format');
            citationText.textContent = currentCitation[format];
        });
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(citationText.textContent);
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy to Clipboard';
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
};

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCitationSystem();
});



// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const offset = 100; // Adjust for fixed navbar
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu after clicking
        navLinks.classList.remove('active');
    });
});

// Typing effect for hero section
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.innerHTML = '';
    
    const type = () => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Initialize typing effect
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        typeWriter(heroTitle, 'Robotics & AI Researcher', 100);
    }
});


// Particles background configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 50,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#2563eb'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#2563eb',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'bounce',
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// Scroll reveal animations
const scrollReveal = () => {
    const elements = document.querySelectorAll('.reveal');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', scrollReveal);

// Hero section parallax effect
const heroParallax = () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    
    if (hero) {
        const limit = hero.offsetTop + hero.offsetHeight;
        if (scrolled > hero.offsetTop && scrolled <= limit) {
            hero.style.backgroundPositionY = `${(scrolled - hero.offsetTop) * 0.5}px`;
        }
    }
};

window.addEventListener('scroll', heroParallax);

// Active nav link highlight
const highlightNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', highlightNavLink);

// Profile image hover effect
const profileImg = document.querySelector('.profile-img');
if (profileImg) {
    profileImg.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = profileImg.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        profileImg.style.transform = `
            perspective(1000px)
            rotateY(${x * 10}deg)
            rotateX(${-y * 10}deg)
            translateZ(20px)
        `;
    });
    
    profileImg.addEventListener('mouseleave', () => {
        profileImg.style.transform = 'none';
    });
}

// Tech badges animation
const animateTechBadges = () => {
    const badges = document.querySelectorAll('.tech-badges .badge');
    
    badges.forEach((badge, index) => {
        badge.style.animationDelay = `${index * 0.2}s`;
    });
};

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial scroll reveal
    scrollReveal();
    
    // Initialize tech badges animation
    animateTechBadges();
    
    // Add animation classes to elements
    document.querySelectorAll('.hero-content > *').forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.2}s`;
    });
});

// Add required keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .reveal.active {
        opacity: 1;
        transform: translateY(0);
    }
    
    .tech-badges .badge {
        animation: float 3s ease-in-out infinite;
    }
`;

document.head.appendChild(style);

// Profile image hover effect
const profileImgContainer = document.querySelector('.profile-img-container');
if (profileImgContainer) {
    profileImgContainer.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = profileImgContainer.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        profileImgContainer.style.transform = `
            perspective(1000px)
            rotateY(${x * 10}deg)
            rotateX(${-y * 10}deg)
            scale(1.02)
        `;
    });
    
    profileImgContainer.addEventListener('mouseleave', () => {
        profileImgContainer.style.transform = 'none';
    });
}

// Smooth reveal for about section content
const aboutContent = document.querySelector('.about-content');
if (aboutContent) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Initial setup
    aboutContent.style.opacity = '0';
    aboutContent.style.transform = 'translateY(20px)';
    aboutContent.style.transition = 'all 0.6s ease-out';
    
    observer.observe(aboutContent);
}