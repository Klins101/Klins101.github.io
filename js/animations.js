function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 2-6px
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    
    // Set lighter color for particles
    particle.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
    
    document.body.appendChild(particle);
    
    // Animate particle
    const animation = particle.animate([
        { transform: 'translate(0, 0)' },
        { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)` }
    ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'ease-out'
    });
    
    animation.onfinish = () => {
        particle.remove();
        createParticle();
    };
}


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

// Animate news items when they come into view
const animateNewsItems = () => {
    const newsItems = document.querySelectorAll('.news-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    newsItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.6s ease-out';
        observer.observe(item);
    });
};

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateNewsItems();
});


// Add scroll-triggered animations for skill items
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

// Smooth reveal for timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.5s ease';
    item.style.transitionDelay = `${index * 0.2}s`;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(item);
});







// Parallax effect for hero section
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Typing animation for hero section
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

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        mirror: false
    });
    
    // Initialize typing animation for hero title
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        typeWriter(heroTitle, 'Klinsmann Agyei', 150);
    }
    
    // Create initial particles
    for (let i = 0; i < 30; i++) {
        createParticle();
    }
});

// Cursor trailer effect
const cursor = document.createElement('div');
cursor.className = 'cursor-trailer';
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

const animateCursor = () => {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.1;
    cursorY += dy * 0.1;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
};

animateCursor();

// Add styles for cursor trailer
const style = document.createElement('style');
style.textContent = `
    .cursor-trailer {
        width: 20px;
        height: 20px;
        background: rgba(100, 255, 218, 0.3);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: width 0.3s, height 0.3s;
        mix-blend-mode: screen;
    }
    
    a:hover ~ .cursor-trailer,
    button:hover ~ .cursor-trailer {
        width: 40px;
        height: 40px;
    }
`;
document.head.appendChild(style);

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
