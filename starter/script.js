'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const message = document.createElement('div');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Create Cookie-message
message.classList.add('cookie-message');
message.innerHTML = 'We used cookies <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));
// header.before(message);
// header.after(message);

// Delete elements
document.querySelector('.btn--close-cookie').addEventListener('click', function() {
  message.remove();
  // message.parentElement.removeChild(message);
});

//  Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

// console.log(message.style.backgroundColor);
// console.log(getComputedStyle(message).color);
message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

btnScrollTo.addEventListener('click', function(e) {
  // const s1coords = section1.getBoundingClientRect();
  
  // Button scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset, 
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset, 
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' }); // only in the modern browsers
});

//////////////////////////////////////////////
// Page navigation
// document.querySelectorAll('.nav__link').forEach(function(el) {
//   el.addEventListener('click', function(e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// 1. Add event listener to common parent elenment
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  };
});

// Tabbed component
tabsContainer.addEventListener('click', function(e) {
  // e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // Guard clause
  if (!clicked) return;

  // Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Activate content area
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clicked.dataset.tab}`)
  .classList.add('operations__content--active');
});

// Menu fade animation
// const handlerHover = function(event) {
//   const opacityValue = (event === 'mouseover') ? 0.5 : 1;
//   nav.addEventListener(event, function(e) {
//     if (e.target.classList.contains('nav__link')) {
//       const link = e.target;
//       const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//       const logo = link.closest('.nav').querySelector('img');
//       siblings.forEach(el => {
//         if (el !== link) el.style.opacity = opacityValue;
//       });
//       logo.style.opacity = opacityValue;
//     };
//   });
// };

// handlerHover('mouseover');
// handlerHover('mouseout');

const handlerHover = function(e) {
  if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');
      siblings.forEach(el => {
        if (el !== link) el.style.opacity = this;
      });
      logo.style.opacity = this;
    };
  };

// nav.addEventListener('mouseover', function(e) {
//   handlerHover(e);
// });
// nav.addEventListener('mouseout', function(e) {
//   handlerHover(e);
// });

// Passing an argument into handler
nav.addEventListener('mouseover', handlerHover.bind(0.5));
nav.addEventListener('mouseout', handlerHover.bind(1));

// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function(e) {
//   console.log(this.window.scrollY);

//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// Sticky navigation: Intersection Observer API
// const obsCallback = function(entries, observer) {
//   entries.forEach(entry => {
//     console.log('entry', entry);
//   })
// };

// const obsOptions = {
//   root: null,
//   threshold: 0.1
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
// console.log(observer);

const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function(entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky')
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer){
  const [entry] = entries;
  // console.log(entry.target);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer){
  const [entry] = entries;
  // console.log(entry.target);

  if (!entry.isIntersecting) return;

  // Replace src attribute with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});

imgTargets.forEach(img => imgObserver.observe(img));

// Sliders
const slider = function() {
  const slides = document.querySelectorAll('.slide');
  const BtnLeft = document.querySelector('.slider__btn--left');
  const BtnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function(_, i) {
      dotContainer.insertAdjacentHTML('beforeend', 
      `<button class="dots__dot" data-slide="${i}"></button>`)
    });
  };

  const goToSlide = function(slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${((i - slide)* 100)}%)`);
  };

  const activateDot = function(slide) {
    dotContainer.childNodes.forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };

  const init = function (slide) {
    goToSlide(slide);
    activateDot(slide);
  };

  //  Next and prev slide
  const nextSlide = function() {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;
  init(curSlide);
  };

  const prevSlide = function() {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
  init(curSlide);
  };

  createDots();
  init(curSlide);

  // Event handlers
  BtnRight.addEventListener('click', nextSlide);
  BtnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft')  prevSlide();
    e.key === 'ArrowRight' &&  nextSlide();
  });

  dotContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('dots__dot')) {
      const {slide} = e.target.dataset;
      init(slide);
    };
  });
};

slider();

// nav.addEventListener('mouseover', function(e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');
//     console.log(siblings);
//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = 0.5;
//     });
//     logo.style.opacity = 0.5;
//   };
// });

// nav.addEventListener('mouseout', function(e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');
//     console.log(siblings);
//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = 1;
//     });
//     logo.style.opacity = 1;
//   };
// });


//////////////////////////////////////////////
// document.documentElement.style.setProperty('--color-primary', 'orange')

// Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);

// logo.alt = 'Super_logo'; // change attributes
// console.log(logo.alt);

// Non-standart attributes 
// console.log(logo.designer); // doesn't work
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');
// console.log(logo.getAttribute('company'));

// console.log(logo.src); // absolute path
// console.log(logo.getAttribute('src')); // relative path

// Data attributes
// console.log(logo.dataset.versionNumber);

// Classes
// logo.classList.add('c', 'd'); // we can add several classes in same time
// logo.classList.remove('c', 'd'); // we can remove several classes in same time
// logo.classList.toggle('c');
// logo.classList.contains('c');

// const h1 = document.querySelector('h1');
// h1.addEventListener('mouseenter', function(e) {
//   alert('addEventListener: Great!')

// });

// Old school method of listening of events
// h1.onmouseenter = function(e) {
//     alert('addEventListener: Great!')};

// const h1 = document.querySelector('h1');
// const alertH1 = function(e) {
//   alert('addEventListener: Great!');
//   h1.removeEventListener('mouseenter', alertH1);
// };

// h1.addEventListener('mouseenter', alertH1);

// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () => 
//   `rgb(${randomInt(0, 255)}, 
//   ${randomInt(0, 255)}, 
//   ${randomInt(0, 255)})`;

// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);

  // Stop prepogation
  // e.stopPropagation();
// }, true);

// document.querySelector('.nav__links').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// }, true);

// document.querySelector('.nav').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// }, true);

// const h1 = document.querySelector('h1');

// Going downwards: children
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.backgroundColor = 'var(--color-secondary)';

// Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);
// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });


