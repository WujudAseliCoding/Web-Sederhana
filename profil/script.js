// Gallery Lightbox Functionality
class GalleryLightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightbox-image');
        this.lightboxCaption = document.getElementById('lightbox-caption');
        this.closeBtn = document.getElementById('lightbox-close');
        this.prevBtn = document.getElementById('lightbox-prev');
        this.nextBtn = document.getElementById('lightbox-next');
        
        this.galleryImages = [];
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        // Collect all gallery images
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-caption');
            
            if (img) {
                this.galleryImages.push({
                    src: img.src,
                    alt: img.alt,
                    caption: caption ? caption.textContent : ''
                });
                
                // Add click event to gallery photo
                item.addEventListener('click', () => this.openLightbox(index));
            }
        });
        
        // Event listeners
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.prevBtn.addEventListener('click', () => this.prevImage());
        this.nextBtn.addEventListener('click', () => this.nextImage());
        
        // Close on background click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.prevImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });
    }
    
    openLightbox(index) {
        this.currentIndex = index;
        this.updateImage();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
        this.updateImage();
    }
    
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.galleryImages.length;
        this.updateImage();
    }
    
    updateImage() {
        const current = this.galleryImages[this.currentIndex];
        this.lightboxImage.src = current.src;
        this.lightboxImage.alt = current.alt;
        this.lightboxCaption.textContent = current.caption;
        
        // Hide nav buttons if only one image
        if (this.galleryImages.length <= 1) {
            this.prevBtn.style.display = 'none';
            this.nextBtn.style.display = 'none';
        } else {
            this.prevBtn.style.display = 'flex';
            this.nextBtn.style.display = 'flex';
        }
    }
}

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryLightbox();
    new Navbar();
});

// Navigation Bar Functionality
class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Mobile menu toggle
        this.mobileMenu.addEventListener('click', () => this.toggleMobileMenu());
        
        // Smooth scroll for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Update active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
        
        // Close mobile menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
    }
    
    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }
    
    closeMobileMenu() {
        this.mobileMenu.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
    
    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const navbarHeight = this.navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    updateActiveLink() {
        const navbarHeight = this.navbar.offsetHeight;
        const sections = ['home', 'about', 'gallery', 'schedule'];
        let currentSection = '';
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop - navbarHeight - 100;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            }
        });
        
        // Update active class
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}
