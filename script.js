// ====== شاشة التحميل ======
window.addEventListener('load', function() {
    setTimeout(function() {
        var loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }, 800);
});

// ====== تبديل الثيم ======
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

// ====== شريط التقدم ======
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

function scrollToSection(id) {
    var section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ====== حركات الدخول ======
var revealElements = document.querySelectorAll('.reveal');
var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });
revealElements.forEach(function(el) { revealObserver.observe(el); });

// ====== نافذة الصور ======
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
var lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
    lightboxEl.addEventListener('click', function(e) {
        if (e.target.id === 'lightbox') closeLightbox();
    });
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

// ====== القسم النشط ======
var sections = document.querySelectorAll('.container[id]');
var navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', function() {
    var current = '';
    sections.forEach(function(section) {
        var sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
});

// ====== Hero Slider ======
var slides = document.querySelectorAll('.hero-slide');
var dots = document.querySelectorAll('.hero-dot');
var currentSlide = 0;

function showSlide(index) {
    slides.forEach(function(s, i) { s.classList.toggle('active', i === index); });
    dots.forEach(function(d, i) { d.classList.toggle('active', i === index); });
    currentSlide = index;
}

if (slides.length > 0) {
    setInterval(function() {
        var next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }, 4000);
}
function goToSlide(index) { showSlide(index); }

// ====== عداد الإحصائيات ======
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
    if (!el.id) statsObserver.observe(el);
});

// ====== عداد الزوار الحقيقي ======
(function() {
    var visitorEl = document.getElementById('visitorCount');
    if (!visitorEl) return;
    
    fetch('https://api.counterapi.dev/v1/blad-alsadara-website/visits/up')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            var count = data.count || data.value || 1;
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

// ====== نموذج واتساب ======
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

// ====== مشغل القرآن ======
var quranPlaying = false;
function toggleQuran() {
    var player = document.getElementById('quranPlayer');
    var icon = document.getElementById('quranIcon');
    if (!player) return;
    
    if (quranPlaying) {
        player.pause();
        quranPlaying = false;
        if (icon) icon.textContent = '🎵';
    } else {
        player.play().then(function() {
            quranPlaying = true;
            if (icon) icon.textContent = '⏸️';
        }).catch(function() {
            alert('تعذر تشغيل الصوت، تحقق من اتصالك بالإنترنت.');
        });
    }
}

// ====== أوقات الصلاة ======
function showPrayerTimes() {
    var popup = document.getElementById('prayerPopup');
    var list = document.getElementById('prayerTimesList');
    if (!popup || !list) return;
    
    popup.classList.add('active');
    
    var today = new Date();
    var dateStr = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    var apiUrl = 'https://api.aladhan.com/v1/timings/' + dateStr + '?latitude=15.3694&longitude=44.1910&method=4';
    
    fetch(apiUrl)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.code === 200) {
                var timings = data.data.timings;
                var prayers = [
                    { name: 'الفجر', key: 'Fajr', icon: '🌅' },
                    { name: 'الشروق', key: 'Sunrise', icon: '☀️' },
                    { name: 'الظهر', key: 'Dhuhr', icon: '🌞' },
                    { name: 'العصر', key: 'Asr', icon: '🌤️' },
                    { name: 'المغرب', key: 'Maghrib', icon: '🌆' },
                    { name: 'العشاء', key: 'Isha', icon: '🌙' }
                ];
                var html = '';
                prayers.forEach(function(p) {
                    html += '<div class="prayer-row"><span class="prayer-name">' + p.icon + ' ' + p.name + '</span><span class="prayer-time">' + timings[p.key] + '</span></div>';
                });
                list.innerHTML = html;
            } else {
                list.innerHTML = '<p style="color:#888;">تعذر جلب أوقات الصلاة</p>';
            }
        })
        .catch(function() {
            list.innerHTML = '<p style="color:#888;">تعذر الاتصال بالخدمة، حاول لاحقاً</p>';
        });
}

// ====== حكمة اليوم ======
var quotes = [
    '«اليمن بلد الحكمة والإيمان، من عرفها عشقها»',
    '«من لا يعرف تاريخه لا يستطيع بناء مستقبله»',
    '«في كل زاوية من بلادنا قصة، وفي كل حجر تاريخ»',
    '«اليمن السعيد... حيث يلتقي الجمال بالأصالة»',
    '«الحفاظ على التراث واجب كل جيل»',
    '«الأرض تحكي، والحجر يشهد، والإنسان يحفظ»',
    '«بلادي وإن جارت عليّ عزيزة، وأهلي وإن ضنوا عليّ كرام»',
    '«من عمق التاريخ نستلهم قوة الحاضر»'
];

function showDailyQuote() {
    var popup = document.getElementById('quotePopup');
    var content = document.getElementById('dailyQuoteContent');
    if (!popup || !content) return;
    
    var dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    var quote = quotes[dayOfYear % quotes.length];
    
    content.innerHTML = '<p>' + quote + '</p>';
    popup.classList.add('active');
}

function closePopup(id) {
    var popup = document.getElementById(id);
    if (popup) popup.classList.remove('active');
}

function shareQuote() {
    var quoteText = document.querySelector('#dailyQuoteContent p');
    if (!quoteText) return;
    
    var text = quoteText.textContent + '\n\nمن موقع: بلاد الصدارة التاريخية';
    if (navigator.share) {
        navigator.share({ title: 'حكمة اليوم', text: text, url: window.location.href }).catch(function() {});
    } else {
        navigator.clipboard.writeText(text + '\n' + window.location.href).then(function() {
            alert('✅ تم نسخ الحكمة!');
        });
    }
}

// ====== النجمة الساقطة ======
function createShootingStar() {
    var star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.top = Math.random() * 200 + 'px';
    star.style.right = Math.random() * 300 + 'px';
    document.body.appendChild(star);
    setTimeout(function() { star.remove(); }, 2000);
}
setInterval(createShootingStar, 8000);
window.addEventListener('load', function() {
    setTimeout(createShootingStar, 1500);
});

// ====== إغلاق النوافذ خارجها ======
document.querySelectorAll('.popup-modal').forEach(function(modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.classList.remove('active');
    });
});

// ====== نظام الأخبار المباشرة من وكالة سبأ ======
var liveNews = [];
var currentNewsIndex = 0;
var NEWS_FEED = 'https://www.saba.ye/ar/rsscatfeed14.htm';
var RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';

function loadLiveNews() {
    var container = document.getElementById('liveNewsContainer');
    if (!container) return;
    
    fetch(RSS2JSON_API + encodeURIComponent(NEWS_FEED))
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                liveNews = data.items.slice(0, 6);
                currentNewsIndex = 0;
                renderNews(currentNewsIndex);
                updateNewsCounter();
            } else {
                showNewsError();
            }
        })
        .catch(function() { showNewsError(); });
}

function renderNews(index) {
    var container = document.getElementById('liveNewsContainer');
    if (!container || !liveNews[index]) return;
    
    var item = liveNews[index];
    var title = item.title || 'خبر بدون عنوان';
    var link = item.link || '#';
    var pubDate = item.pubDate || '';
    var description = item.description || '';
    var thumbnail = item.thumbnail || '';
    var author = item.author || 'وكالة سبأ';
    
    var formattedDate = '';
    if (pubDate) {
        try {
            var date = new Date(pubDate);
            formattedDate = date.toLocaleDateString('ar-EG', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
        } catch(e) { formattedDate = pubDate; }
    }
    
    var cleanDesc = description.replace(/<[^>]*>/g, '').substring(0, 200);
    
    var imageHtml = thumbnail 
        ? '<img class="news-image" src="' + thumbnail + '" alt="' + title + '" loading="lazy">'
        : '<div class="news-image">📰</div>';
    
    var newsHtml = 
        '<div class="live-news-card">' +
            imageHtml +
            '<div class="news-body">' +
                '<span class="news-category">🔴 عاجل</span>' +
                '<h3>' + title + '</h3>' +
                '<div class="news-meta">' +
                    '<span>📅 ' + formattedDate + '</span>' +
                    '<span>✍️ ' + author + '</span>' +
                '</div>' +
                '<p class="news-description">' + cleanDesc + '...</p>' +
                '<a href="' + link + '" target="_blank" class="read-more">📖 اقرأ التفاصيل كاملة</a>' +
            '</div>' +
        '</div>';
    
    container.innerHTML = newsHtml;
}

function nextNews() {
    if (currentNewsIndex < liveNews.length - 1) {
        currentNewsIndex++;
        renderNews(currentNewsIndex);
        updateNewsCounter();
    }
}

function prevNews() {
    if (currentNewsIndex > 0) {
        currentNewsIndex--;
        renderNews(currentNewsIndex);
        updateNewsCounter();
    }
}

function updateNewsCounter() {
    var counter = document.getElementById('newsCounter');
    var prevBtn = document.getElementById('prevNews');
    var nextBtn = document.getElementById('nextNews');
    
    if (counter) counter.textContent = (currentNewsIndex + 1) + ' / ' + liveNews.length;
    if (prevBtn) prevBtn.disabled = (currentNewsIndex === 0);
    if (nextBtn) nextBtn.disabled = (currentNewsIndex === liveNews.length - 1);
}

function showNewsError() {
    var container = document.getElementById('liveNewsContainer');
    if (!container) return;
    container.innerHTML = 
        '<div class="news-loading">' +
            '<div style="font-size: 3em; margin-bottom: 20px;">📡</div>' +
            '<p>تعذر تحميل الأخبار حالياً. يرجى تحديث الصفحة.</p>' +
        '</div>';
}

window.addEventListener('load', function() {
    setTimeout(loadLiveNews, 1500);
});
setInterval(loadLiveNews, 300000);
