// VARIABLES

const strategyCards = document.querySelectorAll(".strategy-card");
const savedIndex = localStorage.getItem("selectedCardIndex") || 0;

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const btn = document.getElementById("menuBtn");
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");

    navbar.classList.remove("hidden");
  });
});

function setCardState(selectedIndex) {
  strategyCards.forEach((card, i) => {
    const isActive = i == selectedIndex;

    card.classList.toggle("card--active", isActive);

    card
      .querySelector(".card-icon")
      .classList.toggle("card-icon--active", isActive);
    card.querySelector(".card-badge").classList.toggle("hidden", !isActive);
    card
      .querySelector(".status-dot")
      .classList.toggle("status-dot--active", isActive);

    const statusText = card.querySelector(".status-text");
    if (statusText) {
      statusText.textContent = isActive ? "ACTIVE" : "ALTERNATIVE";
    }

    if (isActive) {
      const strategyTitle = card.querySelector(".card__title");
      if (strategyTitle) {
        const strategyName = strategyTitle.textContent.trim();
        localStorage.setItem("activeStrategy", strategyName);
      }
    }
  });
}

setCardState(savedIndex);

strategyCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    setCardState(index);
    localStorage.setItem("selectedCardIndex", index);
  });
});
