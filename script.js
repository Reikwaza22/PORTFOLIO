// Function to load pages dynamically into iframe
function loadPage(pageUrl) {
    const iframe = document.getElementById('main-content');
    if (!iframe) {
        console.error('CRITICAL ERROR: iframe dependency missing - page cannot function');
        return;
    }
    iframe.src = pageUrl;
}

// Initialize page-specific events
function initializePageEvents() {
    // Handle form submission
    const iframe = document.getElementById('main-content');
    if (!iframe || !iframe.contentDocument) {
        return;
    }
    
    try {
        const form = iframe.contentDocument.querySelector('form');
        if (form) {
            form.addEventListener('submit', handleContactSubmit);
        }

        // Handle progress bars animation
        const progressBars = iframe.contentDocument.querySelectorAll('.progress-fill');
        if (progressBars.length > 0) {
            animateProgressBars(iframe.contentDocument);
        }
    } catch (e) {
        // Silently handle - some pages may not have these elements
    }
}

// Handle contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    const iframe = document.getElementById('main-content');
    if (!iframe || !iframe.contentDocument) return;
    
    const iframeDoc = iframe.contentDocument;
    
    const nameInput = iframeDoc.querySelector('input[type="text"]');
    const emailInput = iframeDoc.querySelector('input[type="email"]');
    const messageInput = iframeDoc.querySelector('textarea');
    
    const name = nameInput?.value;
    const email = emailInput?.value;
    const message = messageInput?.value;
    
    if (name && email && message) {
        console.log('Form submitted:', { name, email, message });
        alert('Thank you! Your message has been sent successfully.');
        event.target.reset();
    }
}

// Animate progress bars
function animateProgressBars(doc = document) {
    const progressBars = doc.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Load home page on initial load
document.addEventListener('DOMContentLoaded', function() {
    // Wait a moment for DOM to be fully ready, then load initial page
    setTimeout(() => {
        const iframe = document.getElementById('main-content');
        if (iframe) {
            // Attach load listener BEFORE setting src
            iframe.addEventListener('load', function() {
                // Small delay to ensure content is fully loaded
                setTimeout(() => {
                    initializePageEvents();
                    try {
                        if (this.contentDocument && this.contentDocument.body) {
                            this.style.height = (this.contentDocument.body.scrollHeight + 20) + 'px';
                        }
                    } catch (e) {
                        // Height adjustment may fail with same-origin issues
                    }
                }, 100);
            });
            
            // Now load the initial page
            loadPage('home.html');
        }
    }, 0);
});

// Smooth scroll for any anchor links (must work within iframe context)
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});