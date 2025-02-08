document.addEventListener('DOMContentLoaded', function () {
  /* Header – dodajemy klasę "scrolled" gdy scrollY > 0 */
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 0);
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
  const printWall = document.querySelector('.printwall'); // wybieramy element z napisem
  if (printWall) {
      // Rozdzielamy tekst na pojedyncze litery i opakowujemy je w <span>
      const printText = printWall.textContent.trim();
      printWall.innerHTML = '';
      printText.split('').forEach(letter => {
          const span = document.createElement('span');
          span.textContent = letter;
          span.style.color = '#fff'; // startujemy z białym kolorem
          printWall.appendChild(span);
      });

      // Funkcja generująca losowy, żywy kolor (HSL: pełne nasycenie, jaśniejszy odcień)
      function randomColor() {
          const hue = Math.floor(Math.random() * 360);
          return `hsl(${hue}, 100%, 60%)`;
      }

      const delay = 200; // opóźnienie między zmianami liter (w ms)
      const pauseBeforeWhitening = 1000; // pauza po zakończeniu fali kolorowania
      const pauseBeforeColoring = 1000; // pauza przed rozpoczęciem kolejnej fali kolorowania

      // Faza 1: Fala kolorowania (przejście z białego na kolorowy)
      function coloringWave() {
          const letters = printWall.querySelectorAll('span');
          // Upewniamy się, że wszystkie litery zaczynają od białego koloru
          letters.forEach(letter => letter.style.color = '#fff');

          // Na początku ustawiamy pierwszą literę na losowy kolor
          let index = 0;
          letters[index].style.color = randomColor();

          function propagate() {
              if (index < letters.length - 1) {
                  // Pobieramy aktualny kolor z poprzedniej litery
                  let currentColor = letters[index].style.color;
                  index++;
                  // Następna litera "dziedziczy" ten kolor
                  letters[index].style.color = currentColor;
                  // Poprzednia litera dostaje nowy losowy, żywy kolor
                  letters[index - 1].style.color = randomColor();
                  setTimeout(propagate, delay);
              } else {
                  // Gdy dotrzemy do ostatniej litery, całość jest już kolorowa – czekamy chwilę...
                  setTimeout(whiteningWave, pauseBeforeWhitening);
              }
          }
          setTimeout(propagate, delay);
      }

      // Faza 2: Fala przywracania do białego (kolorowy -> biały)
      function whiteningWave() {
          const letters = printWall.querySelectorAll('span');
          let index = 0;
          function whiten() {
              if (index < letters.length) {
                  letters[index].style.color = '#fff';
                  index++;
                  setTimeout(whiten, delay);
              } else {
                  // Po przywróceniu wszystkich liter do białego koloru, pauza i restart fali
                  setTimeout(coloringWave, pauseBeforeColoring);
              }
          }
          whiten();
      }

      // Uruchamiamy cyklicznie efekt fali
      coloringWave();
  } else {
      console.warn('Nie znaleziono elementu .printwall');
  }

  /* FAQ – rozwijanie/zwijanie odpowiedzi */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
      question.addEventListener('click', function () {
          this.parentElement.classList.toggle('active');
      });
  });
});
