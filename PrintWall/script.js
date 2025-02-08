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
  
    /* Animacja napisu "PRINTWALL" – efekt fali */
    const printWall = document.querySelector('.printwall'); // Wybieramy element .printwall
    if (printWall) {
      const colorPalette = ['#e74c3c', '#2ecc71', '#e67e22', '#9b59b6', '#f1c40f'];
      let currentColorIndex = 0;
  
      // Najpierw rozdzielamy tekst na litery
      const printText = printWall.textContent.trim();
      printWall.innerHTML = ''; // Czyścimy oryginalny tekst
      printText.split('').forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter; // Tworzymy element <span> dla każdej litery
        printWall.appendChild(span); // Dodajemy go do printwall
      });
  
      function waveEffect() {
        const printLetters = printWall.querySelectorAll('span'); // Wybieramy wszystkie litery w printwall
        const color = colorPalette[currentColorIndex];
  
        printLetters.forEach((letter, i) => {
          setTimeout(() => {
            letter.style.color = color;
          }, i * 200); // Opóźnienie zmiany koloru
        });
  
        setTimeout(() => {
          printLetters.forEach((letter, i) => {
            setTimeout(() => {
              letter.style.color = '#fff'; // Powrót do białego koloru
            }, i * 200);
          });
        }, printLetters.length * 200 + 1000); // Opóźnienie powrotu
  
        currentColorIndex = (currentColorIndex + 1) % colorPalette.length; // Zmiana koloru na następny z listy
      }
  
      setInterval(waveEffect, 4000); // Powtarzamy falę co 4 sekundy
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
  



//OPCJA SAMEGO PRINTA
// document.addEventListener('DOMContentLoaded', function() {
//     /* Header – dodajemy klasę "scrolled" gdy scrollY > 0 */
//     const header = document.getElementById('main-header');
//     window.addEventListener('scroll', function() {
//         header.classList.toggle('scrolled', window.scrollY > 0);
//     });

//     /* Slider – automatyczna zmiana slajdów oraz obsługa strzałek */
//     const slides = document.querySelectorAll('.slide');
//     const leftArrow = document.querySelector('.left-arrow');
//     const rightArrow = document.querySelector('.right-arrow');
//     let currentSlide = 0;
//     const totalSlides = slides.length;
//     let slideInterval = setInterval(nextSlide, 5000);

//     function showSlide(index) {
//         slides.forEach((slide, i) => {
//             slide.classList.toggle('active', i === index);
//         });
//     }

//     function nextSlide() {
//         currentSlide = (currentSlide + 1) % totalSlides;
//         showSlide(currentSlide);
//     }

//     function prevSlide() {
//         currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
//         showSlide(currentSlide);
//     }

//     rightArrow?.addEventListener('click', function() {
//         nextSlide();
//         resetInterval();
//     });

//     leftArrow?.addEventListener('click', function() {
//         prevSlide();
//         resetInterval();
//     });

//     function resetInterval() {
//         clearInterval(slideInterval);
//         slideInterval = setInterval(nextSlide, 5000);
//     }

//     /* Animacja napisu "PRINT" – efekt fali */
//     const printLetters = document.querySelectorAll('.print span');
//     if (printLetters.length > 0) {
//         const colorPalette = ['#e74c3c', '#2ecc71', '#e67e22', '#9b59b6', '#f1c40f'];
//         let currentColorIndex = 0;

//         function waveEffect() {
//             console.log("Efekt fali uruchomiony"); // Sprawdzenie czy funkcja działa
//             const color = colorPalette[currentColorIndex];

//             printLetters.forEach((letter, i) => {
//                 setTimeout(() => {
//                     letter.style.color = color;
//                 }, i * 200);
//             });

//             setTimeout(() => {
//                 printLetters.forEach((letter, i) => {
//                     setTimeout(() => {
//                         letter.style.color = '#fff';
//                     }, i * 200);
//                 });
//             }, printLetters.length * 200 + 1000);

//             currentColorIndex = (currentColorIndex + 1) % colorPalette.length;
//         }

//         setInterval(waveEffect, 4000);
//     } else {
//         console.warn("Nie znaleziono elementów '.print span'");
//     }

//     /* FAQ – rozwijanie/zwijanie odpowiedzi */
//     const faqQuestions = document.querySelectorAll('.faq-question');
//     faqQuestions.forEach(question => {
//         question.addEventListener('click', function() {
//             this.parentElement.classList.toggle('active');
//         });
//     });
// });
