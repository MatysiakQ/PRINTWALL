document.addEventListener('DOMContentLoaded', function () {
  const header = document.getElementById('main-header');
  const slider = document.getElementById('slider');
  const sliderHeight = slider.offsetHeight;

  window.addEventListener('scroll', function () {
    // Dodajemy/usuwa klasę "scrolled" dla zmiany wysokości headera
    header.classList.toggle('scrolled', window.scrollY > 0);

    // Zmiana przezroczystości headera, gdy jest nad sliderem
    if (window.scrollY < sliderHeight) {
      header.style.backgroundColor = "rgba(255,255,255,0.8)";
    } else {
      header.style.backgroundColor = "#fff";
    }
  });

  /* Slider – automatyczna zmiana slajdów oraz obsługa strzałek */
  const slides = document.querySelectorAll('.slide');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideInterval = setInterval(nextSlide, 5000);

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  }

  rightArrow?.addEventListener('click', function () {
    nextSlide();
    resetInterval();
  });

  leftArrow?.addEventListener('click', function () {
    prevSlide();
    resetInterval();
  });

  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  }

  /* --------------------------- */
  /* Animacja napisu "PRINTWALL" */
  /* --------------------------- */
  const printWall = document.querySelector('.printwall');
  if (printWall) {
    const printText = printWall.textContent.trim();
    printWall.innerHTML = '';
    printText.split('').forEach(letter => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.color = '#fff';
      printWall.appendChild(span);
    });

    function randomColor() {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 100%, 60%)`;
    }

    const delay = 200;
    const pauseBeforeWhitening = 1000;
    const pauseBeforeColoring = 1000;

    function coloringWave() {
      const letters = printWall.querySelectorAll('span');
      letters.forEach(letter => letter.style.color = '#fff');
      let index = 0;
      letters[index].style.color = randomColor();

      function propagate() {
        if (index < letters.length - 1) {
          let currentColor = letters[index].style.color;
          index++;
          letters[index].style.color = currentColor;
          letters[index - 1].style.color = randomColor();
          setTimeout(propagate, delay);
        } else {
          setTimeout(whiteningWave, pauseBeforeWhitening);
        }
      }
      setTimeout(propagate, delay);
    }

    function whiteningWave() {
      const letters = printWall.querySelectorAll('span');
      let index = 0;
      function whiten() {
        if (index < letters.length) {
          letters[index].style.color = '#fff';
          index++;
          setTimeout(whiten, delay);
        } else {
          setTimeout(coloringWave, pauseBeforeColoring);
        }
      }
      whiten();
    }

    coloringWave();
  } else {
    console.warn('Nie znaleziono elementu .printwall');
  }

  /* FAQ – rozwijanie/zwijanie odpowiedzi z przełączaniem strzałki */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function () {
      this.parentElement.classList.toggle('active');
    });
  });
});
