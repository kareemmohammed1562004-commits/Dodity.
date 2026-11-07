/* =========================================================
   حبيبتي الجميلة — script.js
   ========================================================= */

/* =========================================================
   ⚙️ الإعدادات — غيّري هنا فقط
   ========================================================= */

/* روابط الصور الخارجية (لازم رابط مباشر ينتهي بـ .jpg أو .png أو .webp) */
const IMAGES = {
  hero:   'roses.jpg',   // صورة الورد الكبيرة في أعلى الصفحة
  roses2: 'roses2.jpg',   // صورة الورد الصغيرة في ركن "رسالة من قلبي" (اختياري)
  photos: [     // صور سلايدر "لحظات جميلة" — حطي أي عدد
    'photo1.jpg',
    'photo2.jpg',
    'photo3.png',
    'photo4.png',
  ]
};

/* التعليقات اللي تظهر تحت الصور بالترتيب */
const captions = [
  'معكِ ... دائماً',
  'أجمل لحظاتي معكِ',
  'ذكرياتنا الأجمل',
  'كل يوم معكِ عيد',
  'أنتِ سعادتي'
];

/* ملف الأغنية: اسم ملف بجانب index.html أو رابط خارجي */
const SONG_URL = '02.We_Maloh_1.mp3';

/* بداية العدّاد (بصيغة ثابتة مش بتتأثر بالتوقيت الصيفي) */
const START_DATE = new Date('2026-06-04T22:10:00Z');

/* ========================================================= */

/* ---------- تركيب الصور الخارجية ---------- */
const heroEl = document.getElementById('heroImg');
if (IMAGES.hero) heroEl.style.backgroundImage = `url("${IMAGES.hero}")`;

const roses2El = document.getElementById('roses2Img');
if (IMAGES.roses2) { roses2El.src = IMAGES.roses2; roses2El.hidden = false; }

/* ---------- عدّاد الوقت ---------- */
function tick() {
  let diff = Math.max(0, Math.floor((Date.now() - START_DATE.getTime()) / 1000));
  const days = Math.floor(diff / 86400); diff %= 86400;
  const hours = Math.floor(diff / 3600); diff %= 3600;
  const mins = Math.floor(diff / 60);
  const secs = diff % 60;
  document.getElementById('cDays').textContent = days;
  document.getElementById('cHours').textContent = hours;
  document.getElementById('cMins').textContent = mins;
  document.getElementById('cSecs').textContent = secs;
}
tick();
setInterval(tick, 1000);

/* ---------- سلايدر الصور ---------- */
const PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'><rect width='400' height='240' fill='#3a1633'/>" +
  "<path fill='#ff5c93' d='M200 175c-48-36-70-62-70-88 0-20 15-35 34-35 14 0 29 8 36 22 7-14 22-22 36-22 19 0 34 15 34 35 0 26-22 52-70 88z'/></svg>");

const slides = (IMAGES.photos.length ? IMAGES.photos : [PLACEHOLDER])
  .map((src, i) => ({ src, cap: captions[i % captions.length] }));

let cur = 0;
let timer = null;
const img = document.getElementById('slideImg');
const cap = document.getElementById('slideCap');
const dotsBox = document.getElementById('dots');

slides.forEach((_, i) => {
  const d = document.createElement('i');
  d.addEventListener('click', () => { show(i); restartAuto(); });
  dotsBox.appendChild(d);
});

function show(i) {
  cur = (i + slides.length) % slides.length;
  img.style.opacity = 0;
  setTimeout(() => {
    img.src = slides[cur].src;
    cap.textContent = slides[cur].cap;
    img.style.opacity = 1;
  }, 180);
  [...dotsBox.children].forEach((d, k) => d.classList.toggle('on', k === cur));
}
function restartAuto() {
  clearInterval(timer);
  if (slides.length > 1) timer = setInterval(() => show(cur + 1), 5000);
}
document.getElementById('next').addEventListener('click', () => { show(cur + 1); restartAuto(); });
document.getElementById('prev').addEventListener('click', () => { show(cur - 1); restartAuto(); });

/* سحب بالإصبع */
let sx = 0;
const stage = document.querySelector('.slider');
stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
stage.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 40) { show(dx < 0 ? cur + 1 : cur - 1); restartAuto(); }
});
show(0);
restartAuto();

/* ---------- المفاجأة ---------- */
const modal = document.getElementById('modal');
function openSurprise(e) {
  if (e) e.preventDefault();
  modal.classList.add('show');
  for (let i = 0; i < 28; i++) setTimeout(spawnHeart, i * 90);
}
document.getElementById('surpriseBtn').addEventListener('click', openSurprise);
document.getElementById('navSurprise').addEventListener('click', openSurprise);
document.getElementById('closeModal').addEventListener('click', () => modal.classList.remove('show'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('show'); });

/* ---------- قلوب طايرة ---------- */
const layer = document.getElementById('heartsLayer');
function spawnHeart() {
  const h = document.createElement('span');
  h.className = 'rise heart-s';
  const size = 18 + Math.random() * 28;
  h.style.width = h.style.height = size + 'px';
  h.style.left = Math.random() * 100 + '%';
  h.style.animationDuration = 3 + Math.random() * 3 + 's';
  layer.appendChild(h);
  setTimeout(() => h.remove(), 6500);
}

/* ---------- الأغنية ---------- */
const songCard = document.getElementById('songCard');
let audio = null;
songCard.addEventListener('click', e => {
  e.preventDefault();
  if (!audio) audio = new Audio(SONG_URL);
  if (audio.paused) audio.play().catch(() => alert('ملف الأغنية مش لاقيه. اتأكدي من SONG_URL في أول script.js'));
  else audio.pause();
});

/* ---------- تفعيل رابط القائمة أثناء التمرير ---------- */
const links = document.querySelectorAll('.nav-links a[href^="#"]:not([href="#"])');
window.addEventListener('scroll', () => {
  let current = 'home';
  document.querySelectorAll('section[id], .box[id]').forEach(s => {
    if (window.scrollY + 120 >= s.offsetTop) current = s.id;
  });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
});

/* ---------- تثبيت كتطبيق (PWA) ---------- */
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
