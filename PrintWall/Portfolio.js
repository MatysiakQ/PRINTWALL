document.addEventListener("DOMContentLoaded", function () {
  // Header scroll effect
  const header = document.getElementById("main-header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 0);
  });
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
  }
  // Modal portfolio
  const tiles = document.querySelectorAll(".portfolio-tile");
  const modalOverlay = document.getElementById("work-modal");
  const modalImage = document.getElementById("modal-image");
  const closeBtn = document.getElementById("modal-close");

  tiles.forEach(tile => {
    tile.addEventListener("click", function () {
      const imgSrc = this.querySelector("img").src;
      const date = this.querySelector(".tile-date").textContent;
      const client = this.getAttribute("data-client") || "Brak informacji";
      const note = this.getAttribute("data-note") || "Brak notatki";

      modalImage.src = imgSrc;
      document.getElementById("modal-date").textContent = date;
      document.getElementById("modal-client").textContent = client;
      document.getElementById("modal-note").textContent = note;

      modalOverlay.classList.add("show");
    });
  });

  closeBtn.addEventListener("click", function () {
    modalOverlay.classList.remove("show");
  });

  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("show");
    }
  });

  // Formularz kontaktowy
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