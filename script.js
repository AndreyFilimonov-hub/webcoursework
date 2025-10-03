let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    header.classList.remove('hidden');
    return;
  }

  if (currentScroll > lastScroll) {
    // Скролл вниз — скрываем шапку
    header.classList.add('hidden');
  } else {
    // Скролл вверх — показываем шапку
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

const cardWidth = cards[0].offsetWidth + 40; // ширина + gap
let index = 0; // текущий активный элемент

// клонируем элементы для зацикливания
const clonesBefore = cards.map(c => c.cloneNode(true));
const clonesAfter = cards.map(c => c.cloneNode(true));

clonesBefore.forEach(c => carousel.insertBefore(c, carousel.firstChild));
clonesAfter.forEach(c => carousel.appendChild(c));

const allCards = Array.from(carousel.children);
const total = cards.length;

// стартовая позиция — первый оригинальный элемент в центре
index = total; 
updateCarousel();

// функция для обновления трансформации и активного класса
function updateCarousel() {
  const offset = (carousel.parentElement.offsetWidth - cardWidth) / 2;
  carousel.style.transform = `translateX(${-cardWidth * index + offset}px)`;
  allCards.forEach(c => c.classList.remove('active'));
  allCards[index].classList.add('active');
}

// переключение
function move(step){
  index += step;
  carousel.style.transition = 'transform 0.5s ease';
  updateCarousel();
  carousel.addEventListener('transitionend', handleLoop);
}

// корректное зацикливание
function handleLoop(){
  carousel.removeEventListener('transitionend', handleLoop);
  if(index >= total*2){
    index -= total;
    carousel.style.transition = 'none';
    updateCarousel();
  }
  if(index < total){
    index += total;
    carousel.style.transition = 'none';
    updateCarousel();
  }
}

btnLeft.addEventListener('click', () => move(-1));
btnRight.addEventListener('click', () => move(1));
