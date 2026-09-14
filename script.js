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
