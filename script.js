let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    header.classList.remove('hidden');
    return;
  }

  if (currentScroll > lastScroll) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }

  lastScroll = currentScroll;
});

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

const carousel = document.querySelector('.carousel');
const cards = Array.from(carousel.children);
const btnLeft = document.querySelector('.carousel-btn.left');
const btnRight = document.querySelector('.carousel-btn.right');

const gap = 40;
const cardWidth = cards[0].offsetWidth + gap;
const total = cards.length;
const clonesCount = 4;

const clonesBefore = cards.slice(-clonesCount).map(c => c.cloneNode(true));
const clonesAfter = cards.slice(0, clonesCount).map(c => c.cloneNode(true));
for (let i = clonesBefore.length - 1; i >= 0; i--) {
  carousel.insertBefore(clonesBefore[i], carousel.firstChild);
}
clonesAfter.forEach(c => carousel.appendChild(c));

const allCards = Array.from(carousel.children);
let index = clonesCount;
let isAnimating = false;

function updateCarousel(animate = true) {
  const offset = (carousel.parentElement.offsetWidth - cardWidth) / 2;
  carousel.style.transition = animate ? 'transform 0.5s ease' : 'none';
  carousel.style.transform = `translateX(${-cardWidth * index + offset}px)`;

  allCards.forEach(c => c.classList.remove('active'));
  allCards[index]?.classList.add('active');
}

function move(step) {
  if (isAnimating) return;
  isAnimating = true;

  index += step;
  updateCarousel(true);

  carousel.addEventListener('transitionend', handleLoop, { once: true });
}

function handleLoop() {
  if (index >= total + clonesCount) {
    carousel.classList.add('no-card-transition');

    index -= total;
    updateCarousel(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        carousel.classList.remove('no-card-transition');
        isAnimating = false;
      });
    });
    return;
  }

  if (index < clonesCount) {
    carousel.classList.add('no-card-transition');

    index += total;
    updateCarousel(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        carousel.classList.remove('no-card-transition');
        isAnimating = false;
      });
    });
    return;
  }

  isAnimating = false;
}

btnLeft.addEventListener('click', () => move(-1));
btnRight.addEventListener('click', () => move(1));

window.addEventListener('resize', () => updateCarousel(false));

updateCarousel(false);

const openModalBtn = document.querySelector('.btn.primary[href="#booking"]');
const modal = document.getElementById('bookingModal');
const closeModalBtn = document.getElementById('closeModal');

const masterSelect = document.getElementById('master-choose');
const servicesCheckboxes = document.getElementById('servicesCheckboxes');

openModalBtn.addEventListener('click', (e) => {
  e.preventDefault();
  modal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});

const barberServices = ['Стрижка', 'Стрижка машинкой', 'Детская стрижка', 'Стрижка + борода', 'Оформление бороды', 'Опасное бритье', 'Отец + сын', 'Стрижка машинкой + борода', 'Тонирование волос', 'Уход за лицом от MEN\'S PRIORITY', 'SPA-Уход за кожей головы', 'Коррекция воском', 'Укладка и окантовка']
const manicureServices = ['Мужской маникюр']
const yanaKoltunovaServices = [...barberServices, 'Массаж лица', 'Окрашивание волос']
const artemPluzhnikovSerives = [...barberServices, 'Окрашивание волос']

const servicesByMaster = {
  '1': barberServices,
  '2': artemPluzhnikovSerives,
  '3': barberServices,
  '4': yanaKoltunovaServices,
  '5': barberServices,
  '6': barberServices,
  '7': barberServices,
  '8': manicureServices,
  '9': manicureServices
};

masterSelect.addEventListener('change', () => {
  const masterId = masterSelect.value;

  servicesCheckboxes.innerHTML = '';

  if (servicesByMaster[masterId]) {
    servicesByMaster[masterId].forEach((service, index) => {
      const id = `service_${masterId}_${index}`;

      const checkboxWrapper = document.createElement('div');
      checkboxWrapper.style.marginBottom = '6px';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = id;
      checkbox.name = 'services';
      checkbox.value = service;

      const label = document.createElement('label');
      label.htmlFor = id;
      label.textContent = service;
      label.style.marginLeft = '8px';
      label.style.color = 'white';

      checkboxWrapper.appendChild(checkbox);
      checkboxWrapper.appendChild(label);
      servicesCheckboxes.appendChild(checkboxWrapper);
    });
  }
});

const bookingForm = document.querySelector('.booking-form');
const servicesContainer = document.querySelector('#servicesContainer');
const consentCheckbox = document.getElementById('consent');

bookingForm.addEventListener('submit', (e) => {
    const nameField = document.querySelector('#client-name');
    const phoneField = document.querySelector('#client-phone');
    const checkedServices = servicesContainer.querySelectorAll('input[type="checkbox"]:checked');

    if (nameField.value.trim().length < 2) {
        e.preventDefault();
        alert('Пожалуйста, введите корректное имя');
        return;
    }

    const phone = phoneField.value.trim();
    const phoneRegex = /^(\+7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;

    if (!phoneRegex.test(phone)) {
        e.preventDefault();
        alert('Введите корректный номер телефона');
        return;
    }

    if (checkedServices.length === 0) {
        e.preventDefault();
        alert('Пожалуйста, выберите хотя бы одну услугу');
        return;
    }

    if (!consentCheckbox.checked) {
        e.preventDefault();
        alert('Необходимо согласие на обработку персональных данных');
        return;
    }
});

const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});