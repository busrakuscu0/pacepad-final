// VARIABLES

const hamburgerButton = document.getElementById("hamburgerButton");
const navListContainer = document.getElementById("navListContainer");
const strategyCards = document.querySelectorAll(".strategy-card");
const savedIndex = localStorage.getItem("selectedCardIndex") || 0;

function setCardState(selectedIndex) {
  strategyCards.forEach((card, i) => {
    const isActive = i == selectedIndex;

    card.classList.toggle("card--active", isActive);

    card
      .querySelector(".card__icon")
      .classList.toggle("card__icon--active", isActive);
    card.querySelector(".card__badge").classList.toggle("hidden", !isActive);
    card
      .querySelector(".status__dot")
      .classList.toggle("status__dot--active", isActive);

    const statusText = card.querySelector(".status__text");
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

hamburgerButton?.addEventListener("click", () => {
  navListContainer.classList.toggle("nav__container--open");
});

strategyCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    setCardState(index);
    localStorage.setItem("selectedCardIndex", index);
  });
});
