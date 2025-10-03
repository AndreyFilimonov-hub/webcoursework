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

const gap = 40;
const cardWidth = cards[0].offsetWidth + gap;
const total = cards.length;
const clonesCount = 3;

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
