// ====== شاشة التحميل ======
window.addEventListener('load', function() {
    setTimeout(function() {
        var loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }, 800);
});

// ====== تبديل الثيم (الفاتح/الداكن) ======
function toggleTheme() {
    var body = document.body;
    var btn = document.getElementById('themeToggle');
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        btn.innerHTML = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        btn.innerHTML = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// استرجاع الثيم المحفوظ عند فتح الموقع
window.addEventListener('DOMContentLoaded', function() {
    var savedTheme = localStorage.getItem('theme');
    var btn = document.getElementById('themeToggle');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (btn) btn.innerHTML = '☀️';
    }
});

// ====== التاريخ والساعة ======
function updateDateTime() {
    var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var dateStr = today.toLocaleDateString('ar-EG', options);
    
    var hours = today.getHours().toString().padStart(2, '0');
    var minutes = today.getMinutes().toString().padStart(2, '0');
    var timeStr = hours + ':' + minutes;
    
    var topDate = document.getElementById('topDate');
    if (topDate) topDate.textContent = '📅 ' + dateStr;
    
    var navClock = document.getElementById('navClock');
    if (navClock) navClock.textContent = '🕐 ' + timeStr;
    
    document.querySelectorAll('.auto-date').forEach(function(el) {
        el.textContent = dateStr;
    });
}
updateDateTime();
setInterval(updateDateTime, 60000);

// ====== شريط تقدم القراءة + زر العودة للأعلى ======
window.addEventListener('scroll', function() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    
    var progressBar = document.getElementById('readingProgress');
    if (progressBar) progressBar.style.width = scrolled + '%';
    
    var backBtn = document.getElementById('backToTop');
    if (backBtn) {
        if (winScroll > 400) backBtn.classList.add('visible');
        else backBtn.classList.remove('visible');
    }
});

function scrollToTop() { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
}

// ====== حركات الدخول عند التمرير ======
var revealElements = document.querySelectorAll('.reveal');
var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });
revealElements.forEach(function(el) { revealObserver.observe(el); });

// ====== نافذة عرض الصور ======
function openLightbox(src) {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    if (lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}
function closeLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ====== مشاركة الموقع ======
function shareWebsite() {
    var shareData = {
        title: 'بلاد الصدارة التاريخية',
        text: 'شاهد موقع بلاد الصدارة التاريخية - صور، مقاطع، وأخبار',
        url: window.location.href
    };
    if (navigator.share) {
        navigator.share(shareData).catch(function() {});
    } else {
        navigator.clipboard.writeText(window.location.href).then(function() {
            alert('✅ تم نسخ رابط الموقع! يمكنك مشاركته الآن.');
        });
    }
}

// ====== تحديد القسم النشط في التنقل ======
var sections = document.querySelectorAll('.container[id]');
var navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', function() {
    var current = '';
    sections.forEach(function(section) {
        var sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ====== Hero Slider ======
var slides = document.querySelectorAll('.hero-slide');
var dots = document.querySelectorAll('.hero-dot');
var currentSlide = 0;

function showSlide(index) {
    slides.forEach(function(s, i) {
        s.classList.toggle('active', i === index);
    });
    dots.forEach(function(d, i) {
        d.classList.toggle('active', i === index);
    });
    currentSlide = index;
}

if (slides.length > 0) {
    setInterval(function() {
        var next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }, 4000);
}

function goToSlide(index) { showSlide(index); }

// ====== عداد الإحصائيات المتحرك ======
function animateCounter(element, target, duration) {
    var start = 0;
    var increment = target / (duration / 16);
    var current = start;
    var timer = setInterval(function() {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

var statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            var numberEl = entry.target;
            var target = parseInt(numberEl.getAttribute('data-target'));
            animateCounter(numberEl, target, 2000);
            statsObserver.unobserve(numberEl);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(function(el) {
    if (!el.id) {
        statsObserver.observe(el);
    }
});

// ====== عداد الزوار الحقيقي ======
(function() {
    var visitorEl = document.getElementById('visitorCount');
    if (!visitorEl) return;
    
    // استرجاع أو إنشاء معرّف فريد لهذا الجهاز
    var deviceId = localStorage.getItem('visitorDeviceId');
    if (!deviceId) {
        deviceId = 'user_' + Math.random().toString(36).substring(2, 15) + Date.now();
        localStorage.setItem('visitorDeviceId', deviceId);
    }
    
    // جلب العدد الحالي وزيادته بمقدار 1
    fetch('https://api.counterapi.dev/v1/blad-alsadara-website/visits/up')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            var count = data.count || data.value || 1;
            // تحريك الرقم من 0 إلى العدد الحقيقي
            var start = 0;
            var duration = 1500;
            var increment = count / (duration / 16);
            var timer = setInterval(function() {
                start += increment;
                if (start >= count) {
                    visitorEl.textContent = count;
                    clearInterval(timer);
                } else {
                    visitorEl.textContent = Math.floor(start);
                }
            }, 16);
        })
        .catch(function() {
            // في حالة فشل الاتصال، نعرض رقماً تجميلياً
            visitorEl.textContent = '500';
        });
})();

// ====== نافذة الترحيب ======
window.addEventListener('load', function() {
    setTimeout(function() {
        var welcomeShown = localStorage.getItem('welcomeShown');
        var today = new Date().toDateString();
        if (welcomeShown !== today) {
            var popup = document.getElementById('welcomePopup');
            if (popup) popup.classList.add('active');
        }
    }, 2000);
});

function closeWelcome() {
    var popup = document.getElementById('welcomePopup');
    if (popup) popup.classList.remove('active');
    var today = new Date().toDateString();
    localStorage.setItem('welcomeShown', today);
}

// ====== نموذج التواصل عبر واتساب ======
function sendWhatsApp(event) {
    event.preventDefault();
    var name = document.getElementById('formName').value.trim();
    var message = document.getElementById('formMessage').value.trim();
    
    if (!name || !message) {
        alert('الرجاء إدخال الاسم والرسالة');
        return false;
    }
    
    var text = 'السلام عليكم، أنا ' + name + '\n\n' + message;
    var url = 'https://wa.me/967782953692?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
    return false;
    }
