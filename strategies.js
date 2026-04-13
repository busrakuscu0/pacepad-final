const strategyCards = document.querySelectorAll(".strategy-card");
const savedIndex = localStorage.getItem("selectedCardIndex") || 0;

let isActive = false;

function setCardState(selectedIndex) {
  strategyCards.forEach((card, i) => {
    if (i == selectedIndex) {
      isActive = true;
    } else {
      isActive = false;
    }

    card.classList.toggle("card--active", isActive);
    card
      .querySelector(".card-icon")
      .classList.toggle("card-icon--active", isActive);

    card.querySelector(".card-badge").classList.toggle("hidden", !isActive);
    card
      .querySelector(".status-dot")
      .classList.toggle("status-dot--active", isActive);

    const statusText = card.querySelector(".status-text");
    statusText.textContent = isActive ? "ACTIVE" : "ALTERNATIVE";
  });
}

setCardState(savedIndex);

strategyCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    setCardState(index);
    localStorage.setItem("selectedCardIndex", index);
  });
});
