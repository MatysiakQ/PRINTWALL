document.addEventListener("DOMContentLoaded", function () {
  // Header scroll effect
  const header = document.getElementById("main-header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 0);
  });

  // Slider
  const slides = document.querySelectorAll(".slide");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");
  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideInterval = setInterval(nextSlide, 5000);

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
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

  rightArrow.addEventListener("click", function () {
    nextSlide();
    resetInterval();
  });

  leftArrow.addEventListener("click", function () {
    prevSlide();
    resetInterval();
  });

  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  }

  // Animacja "PRINTWALL" - efekt fali kolorów
  const printWall = document.querySelector(".printwall");
  if (printWall) {
    const printText = printWall.textContent.trim();
    printWall.innerHTML = "";
    printText.split("").forEach(letter => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.color = "#fff";
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
      const letters = printWall.querySelectorAll("span");
      letters.forEach(letter => letter.style.color = "#fff");
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
      const letters = printWall.querySelectorAll("span");
      let index = 0;
      function whiten() {
        if (index < letters.length) {
          letters[index].style.color = "#fff";
          index++;
          setTimeout(whiten, delay);
        } else {
          setTimeout(coloringWave, pauseBeforeColoring);
        }
      }
      whiten();
    }
    coloringWave();
  }

  // FAQ – rozwijanie odpowiedzi
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach(question => {
    question.addEventListener("click", function () {
      this.parentElement.classList.toggle("active");
    });
  });

  // Obsługa formularza kontaktowego z modalem
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = contactForm.querySelector('input[name="email"]').value;
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert("Podaj poprawny adres email!");
        return;
      }

      const formData = new FormData(contactForm);
      fetch("submit_form.php", {
        method: "POST",
        body: formData,
      })
        .then(response => response.text())
        .then(data => {
          // Wywołanie modalu – w zależności od odpowiedzi serwera
          if (data.trim() === "OK") {
            showModal({
              icon: "😊",
              iconColor: "green",
              text: "Udało się wysłać formularz",
              buttonText: "Super!",
              buttonColor: "green"
            });
            contactForm.reset();
          } else {
            showModal({
              icon: "☹️",
              iconColor: "red",
              text: "Niestety, nie udało się wysłać formularza, spróbuj ponownie :c",
              buttonText: "OK!",
              buttonColor: "red"
            });
          }
        })
        .catch(error => {
          console.error("Błąd:", error);
          showModal({
            icon: "☹️",
            iconColor: "red",
            text: "Niestety, nie udało się wysłać formularza, spróbuj ponownie :c",
            buttonText: "OK!",
            buttonColor: "red"
          });
        });
    });
  }

  // Funkcje modalu dla formularza
  const formModal = document.getElementById("form-modal");
  const modalIcon = document.getElementById("form-modal-icon");
  const modalText = document.getElementById("form-modal-text");
  const modalButton = document.getElementById("form-modal-button");

  function showModal({ icon, iconColor, text, buttonText, buttonColor }) {
    modalIcon.textContent = icon;
    modalIcon.style.color = iconColor;
    modalText.textContent = text;
    modalButton.textContent = buttonText;
    modalButton.style.backgroundColor = buttonColor;
    formModal.classList.add("show");
  }

  function hideModal() {
    formModal.classList.remove("show");
  }

  modalButton.addEventListener("click", hideModal);
});
