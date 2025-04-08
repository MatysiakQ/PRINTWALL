document.addEventListener("DOMContentLoaded", function () {
    // Header background change (jeśli slider istnieje)
    const header = document.getElementById("main-header");
    const slider = document.getElementById("slider");
    let sliderHeight = slider ? slider.offsetHeight : 0;
    
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 0);
      if (slider && window.scrollY < sliderHeight) {
        header.style.backgroundColor = "rgba(255,255,255,0.8)";
      } else {
        header.style.backgroundColor = "#fff";
      }
    });
    
    // Jeśli slider istnieje, obsługa slidera
    if (slider) {
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
    
      rightArrow?.addEventListener("click", function () {
        nextSlide();
        resetInterval();
      });
    
      leftArrow?.addEventListener("click", function () {
        prevSlide();
        resetInterval();
      });
    
      function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
      }
    }
    
    /* Animacja napisu "PRINTWALL" - efekt fali kolorów */
    const printWall = document.querySelector(".printwall");
    if (printWall) {
      const printText = printWall.textContent.trim();
      printWall.innerHTML = "";
      printText.split("").forEach((letter) => {
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
        letters.forEach((letter) => (letter.style.color = "#fff"));
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
    } else {
      console.warn("Nie znaleziono elementu .printwall");
    }
    
    /* FAQ – rozwijanie odpowiedzi (dla akordeonu) */
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach((question) => {
      question.addEventListener("click", function () {
        this.parentElement.classList.toggle("active");
      });
    });
    
    /* Obsługa formularza kontaktowego */
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
        .then((response) => response.text())
        .then((data) => {
          if (data.trim() === "OK") {
            document.getElementById("success-modal").classList.add("show");
            contactForm.reset();
          } else {
            alert("Błąd: " + data);
          }
        })
        .catch((error) => {
          console.error("Błąd:", error);
          alert("Nie udało się wysłać formularza, spróbuj ponownie później.");
        });
    });

    const modalButton = document.getElementById("modal-button");
    if (modalButton) {
      modalButton.addEventListener("click", function () {
        document.getElementById("success-modal").classList.remove("show");
      });
    }
  }
  });
  
