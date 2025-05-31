/**
 * स्मार्ट गाव वेबसाईट जावास्क्रिप्ट
 * ======================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // मेनू टॉगल फंक्शनॅलिटी
    initMobileMenu();
    
    // लेझी लोडिंग इमेजेस
    initLazyLoading();
    
    // अधिक माहिती टॉगल
    initInfoToggles();
    
    // फिल्टर फंक्शनॅलिटी
    initFilters();
    
    // सर्च फंक्शनॅलिटी
    initSearch();
    
    // फॉर्म व्हॅलिडेशन
    initFormValidation();
    
    // गावाचे नाव प्लेसहोल्डर रिप्लेसमेंट
    replaceVillageName();
});

/**
 * मोबाईल मेनू इनिशियलायझेशन
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (!menuToggle || !navList) return;
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navList.classList.toggle('active');
        
        // स्क्रोलिंग प्रिव्हेंट करा जेव्हा मेनू ओपन असेल
        document.body.classList.toggle('menu-open');
    });
    
    // मेनू बंद करा जेव्हा लिंक क्लिक केली जाते
    const navLinks = navList.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // बाहेर क्लिक केल्यावर मेनू बंद करा
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.main-nav') && navList.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

/**
 * लेझी लोडिंग इमेजेस इनिशियलायझेशन
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if (!lazyImages.length) return;
    
    // इंटरसेक्शन ऑब्झर्व्हर सेटअप
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('src');
                    const dataSrc = img.getAttribute('data-src');
                    
                    // फक्त तेव्हाच लोड करा जेव्हा डेटा-सोर्स आहे आणि सोर्स प्लेसहोल्डर आहे
                    if (dataSrc && (!src || src.includes('unsplash.com'))) {
                        img.src = dataSrc;
                    }
                    
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // फॉलबॅक फॉर ओल्डर ब्राउझर्स
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src') || img.src;
            img.classList.add('loaded');
        });
    }
}

/**
 * अधिक माहिती टॉगल इनिशियलायझेशन
 */
function initInfoToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-more-info');
    
    if (!toggleButtons.length) return;
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.classList.toggle('active');
                
                // बटण टेक्स्ट बदला
                if (targetElement.classList.contains('active')) {
                    this.textContent = 'कमी माहिती';
                } else {
                    this.textContent = 'अधिक माहिती';
                }
            }
        });
    });
}

/**
 * फिल्टर फंक्शनॅलिटी इनिशियलायझेशन
 */
function initFilters() {
    // महत्त्वाची ठिकाणे फिल्टर
    initPlacesFilter();
    
    // कार्यक्रम फिल्टर
    initEventsFilter();
    
    // बातम्या फिल्टर
    initNewsFilter();
    
    // व्यावसायिक फिल्टर
    initBusinessFilter();
}

/**
 * महत्त्वाची ठिकाणे फिल्टर
 */
function initPlacesFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
    const placeCards = document.querySelectorAll('.place-card[data-category]');
    
    if (!filterButtons.length || !placeCards.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // अॅक्टिव्ह क्लास टॉगल
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // फिल्टर अप्लाय करा
            placeCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * कार्यक्रम फिल्टर
 */
function initEventsFilter() {
    const eventSearch = document.getElementById('event-search');
    const eventMonth = document.getElementById('event-month');
    const eventCategory = document.getElementById('event-category');
    const eventCards = document.querySelectorAll('.event-card');
    
    if (!eventCards.length) return;
    
    // सर्च आणि फिल्टर फंक्शन
    function filterEvents() {
        const searchTerm = eventSearch ? eventSearch.value.toLowerCase() : '';
        const monthFilter = eventMonth ? eventMonth.value : 'all';
        const categoryFilter = eventCategory ? eventCategory.value : 'all';
        
        eventCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const month = card.getAttribute('data-month');
            const category = card.getAttribute('data-category');
            
            const matchesSearch = !searchTerm || title.includes(searchTerm);
            const matchesMonth = monthFilter === 'all' || month === monthFilter;
            const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
            
            if (matchesSearch && matchesMonth && matchesCategory) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // इव्हेंट लिसनर्स
    if (eventSearch) {
        eventSearch.addEventListener('input', filterEvents);
    }
    
    if (eventMonth) {
        eventMonth.addEventListener('change', filterEvents);
    }
    
    if (eventCategory) {
        eventCategory.addEventListener('change', filterEvents);
    }
}

/**
 * बातम्या फिल्टर
 */
function initNewsFilter() {
    const newsSearch = document.getElementById('news-search');
    const newsCategory = document.getElementById('news-category');
    const newsTiles = document.querySelectorAll('.news-tile');
    
    if (!newsTiles.length) return;
    
    // सर्च आणि फिल्टर फंक्शन
    function filterNews() {
        const searchTerm = newsSearch ? newsSearch.value.toLowerCase() : '';
        const categoryFilter = newsCategory ? newsCategory.value : 'all';
        
        newsTiles.forEach(tile => {
            const title = tile.querySelector('h3').textContent.toLowerCase();
            const category = tile.getAttribute('data-category');
            
            const matchesSearch = !searchTerm || title.includes(searchTerm);
            const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
            
            if (matchesSearch && matchesCategory) {
                tile.style.display = '';
            } else {
                tile.style.display = 'none';
            }
        });
    }
    
    // इव्हेंट लिसनर्स
    if (newsSearch) {
        newsSearch.addEventListener('input', filterNews);
    }
    
    if (newsCategory) {
        newsCategory.addEventListener('change', filterNews);
    }
}

/**
 * व्यावसायिक फिल्टर
 */
function initBusinessFilter() {
    const businessSearch = document.getElementById('business-search');
    const businessCategory = document.getElementById('business-category');
    const businessCards = document.querySelectorAll('.business-card');
    
    if (!businessCards.length) return;
    
    // सर्च आणि फिल्टर फंक्शन
    function filterBusinesses() {
        const searchTerm = businessSearch ? businessSearch.value.toLowerCase() : '';
        const categoryFilter = businessCategory ? businessCategory.value : 'all';
        
        businessCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const category = card.getAttribute('data-category');
            
            const matchesSearch = !searchTerm || title.includes(searchTerm);
            const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
            
            if (matchesSearch && matchesCategory) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // इव्हेंट लिसनर्स
    if (businessSearch) {
        businessSearch.addEventListener('input', filterBusinesses);
    }
    
    if (businessCategory) {
        businessCategory.addEventListener('change', filterBusinesses);
    }
}

/**
 * फॉर्म व्हॅलिडेशन
 */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // फॉर्म व्हॅलिडेशन
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // ईमेल व्हॅलिडेशन
        const emailField = contactForm.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
            }
        }
        
        // फॉर्म सबमिट
        if (isValid) {
            // स्टॅटिक वेबसाईट असल्याने, फक्त सक्सेस मेसेज दाखवा
            alert('आपला संदेश यशस्वीरित्या पाठवला गेला आहे. आम्ही लवकरच आपल्याशी संपर्क साधू.');
            contactForm.reset();
        } else {
            alert('कृपया सर्व आवश्यक फील्ड भरा आणि वैध माहिती प्रविष्ट करा.');
        }
    });
    
    // फील्ड फोकस इव्हेंट
    const formFields = contactForm.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    });
}

/**
 * गावाचे नाव प्लेसहोल्डर रिप्लेसमेंट
 * नोट: वास्तविक वापरात, हे सर्व्हर-साईड प्रोसेसिंगद्वारे केले जाईल
 */
function replaceVillageName() {
    // गावाचे नाव सेट करा - वास्तविक वापरात हे डेटाबेसमधून येईल
    const villageName = "वडनेर भैरव"; // उदाहरण गावाचे नाव
    
    // सर्व प्लेसहोल्डर रिप्लेस करा
    const villageNameElements = document.querySelectorAll('.village-name');
    villageNameElements.forEach(element => {
        element.textContent = villageName;
    });
    
    // पेज टायटल अपडेट करा
    const pageTitle = document.title;
    if (pageTitle.includes('स्मार्ट गाव')) {
        document.title = pageTitle.replace('स्मार्ट गाव', `स्मार्ट ${villageName}`);
    }
}

/**
 * अॅनिमेशन इफेक्ट्स
 */
function initAnimations() {
    // स्क्रोल अॅनिमेशन
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (!animatedElements.length) return;
    
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        });
        
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    } else {
        // फॉलबॅक फॉर ओल्डर ब्राउझर्स
        animatedElements.forEach(element => {
            element.classList.add('fade-in');
        });
    }
}

// अॅनिमेशन इनिशियलायझ करा
initAnimations();
