const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

$$('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = $(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    $('.nav-links')?.classList.remove('is-open');
  });
});

$('.burger')?.addEventListener('click', () => {
  const nav = $('.nav-links');
  nav?.classList.toggle('is-open');
});

$$('.service-card').forEach((card) => {
  card.addEventListener('click', () => {
    const selected = $('#selected-service');
    if (selected) selected.value = card.dataset.service || '';
  });
});

$$('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    $$('.faq-item').forEach((faq) => faq !== item && faq.classList.remove('is-open'));
    item.classList.toggle('is-open');
  });
});

const modals = {
  appointment: $('#appointment-modal'),
  callback: $('#callback-modal')
};

function openModal(name) {
  const modal = modals[name];
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModals() {
  Object.values(modals).forEach((modal) => {
    modal?.classList.remove('is-open');
    modal?.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';
}

$$('[data-open-modal]').forEach((button) => button.addEventListener('click', () => openModal(button.dataset.openModal)));
$$('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModals));
document.addEventListener('keydown', (event) => event.key === 'Escape' && closeModals());

const demoSlots = [
  { date: 'Пн, 10 июня', time: '10:00', available: true },
  { date: 'Пн, 10 июня', time: '12:30', available: true },
  { date: 'Пн, 10 июня', time: '16:00', available: false },
  { date: 'Вт, 11 июня', time: '11:00', available: true },
  { date: 'Вт, 11 июня', time: '14:30', available: true },
  { date: 'Ср, 12 июня', time: '17:00', available: true }
];

function renderSlots(slots = demoSlots) {
  const grid = $('#slot-grid');
  if (!grid) return;
  grid.innerHTML = slots.map((slot, index) => `
    <button class="slot-btn" type="button" data-index="${index}" ${slot.available ? '' : 'disabled'}>
      ${slot.date}<br>${slot.time}
    </button>
  `).join('');
  $$('.slot-btn', grid).forEach((button) => {
    button.addEventListener('click', () => {
      $$('.slot-btn', grid).forEach((b) => b.classList.remove('is-selected'));
      button.classList.add('is-selected');
    });
  });
}
renderSlots();

// Пример будущей подгрузки из SQL через API:
// fetch('/api/appointment-slots?service_id=1')
//   .then(response => response.json())
//   .then(renderSlots);

$$('form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Демо-форма: здесь будет отправка заявки на сервер.');
    closeModals();
  });
});

const upload = $('.upload-wide');
const fileInput = $('#docs-input');
if (upload && fileInput) {
  ['dragenter', 'dragover'].forEach((name) => upload.addEventListener(name, (event) => {
    event.preventDefault(); upload.classList.add('is-dragover');
  }));
  ['dragleave', 'drop'].forEach((name) => upload.addEventListener(name, (event) => {
    event.preventDefault(); upload.classList.remove('is-dragover');
  }));
  upload.addEventListener('drop', (event) => {
    fileInput.files = event.dataTransfer.files;
    const strong = $('strong', upload);
    if (strong) strong.textContent = `Выбрано файлов: ${fileInput.files.length}`;
  });
  fileInput.addEventListener('change', () => {
    const strong = $('strong', upload);
    if (strong) strong.textContent = fileInput.files.length ? `Выбрано файлов: ${fileInput.files.length}` : 'Перетащите файлы сюда или выберите на компьютере';
  });
}

function fallbackReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });
  $$('.reveal, .reveal-group > *').forEach((el) => observer.observe(el));
}

if (window.gsap) {
  gsap.registerPlugin(window.ScrollTrigger);
  gsap.to('.reveal', { opacity: 1, y: 0, duration: .85, ease: 'power3.out', stagger: .08, scrollTrigger: { trigger: 'body', start: 'top top' } });
  $$('.reveal-group').forEach((group) => {
    gsap.to($$(':scope > *', group), { opacity: 1, y: 0, duration: .75, ease: 'power3.out', stagger: .08, scrollTrigger: { trigger: group, start: 'top 82%' } });
  });
} else {
  fallbackReveal();
}
