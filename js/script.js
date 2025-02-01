// js/script.js

// Smooth scroll to section
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
  }
  
  // Intersection Observer for the reveal effect on sections
  window.addEventListener("load", () => {
    const sections = document.querySelectorAll(".section");
    const observerConfig = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };
  
    const onIntersection = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    };
  
    const observer = new IntersectionObserver(onIntersection, observerConfig);
  
    sections.forEach(section => {
      observer.observe(section);
    });
  
    // Preloader
    const preloader = document.getElementById("preloader");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 2000);
  });
  
  // Mobile nav toggle
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  navToggle.addEventListener("click", () => {
    navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
  });
  
  // js/script.js
// Initialize Particles.js
particlesJS('particles-js', {
    particles: {
      number: { value: 80 },
      color: { value: '#00d4ff' },
      shape: { type: 'circle' },
      opacity: { value: 0.5 },
      size: { value: 3 },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'repulse' },
        onclick: { enable: true, mode: 'push' },
        resize: true
      }
    }
  });
  
  // Project Card Hover Effects
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const x = e.pageX - card.offsetLeft;
      const y = e.pageY - card.offsetTop;
      card.style.transform = `perspective(1000px) rotateX(${-(y - card.offsetHeight/2)/10}deg) rotateY(${(x - card.offsetWidth/2)/10}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });
  
  // Initialize Research Carousel
  const carousel = document.querySelector('.research-carousel');
  let isDown = false;
  let startX;
  let scrollLeft;
  
  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  
  carousel.addEventListener('mouseleave', () => {
    isDown = false;
  });
  
  carousel.addEventListener('mouseup', () => {
    isDown = false;
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  });
  