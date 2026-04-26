const strategyCards = document.querySelectorAll(".strategy-card");
const savedIndex = localStorage.getItem("selectedCardIndex") || 0;

let isActive = false;

function setCardState(selectedIndex) {
  strategyCards.forEach((card, i) => {
    // Eğer index'ler eşleşiyorsa isActive true olur, eşleşmiyorsa false (Uzun if/else'e gerek kalmadı)
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
    statusText.textContent = isActive ? "ACTIVE" : "ALTERNATIVE";

    // -----------------------------------------------------
    // YENİ EKLENEN KISIM: AKTİF STRATEJİNİN İSMİNİ KAYDET
    // -----------------------------------------------------
    if (isActive) {
      // DİKKAT: Burada strateji isminin yazdığı elementi seçiyoruz.
      // Eğer sende başlık <h3> değilse veya ".strategy-title" gibi bir class'ı varsa burayı ona göre değiştir!
      const strategyName = card
        .querySelector(".card__title")
        .textContent.trim();

      // Ana sayfanın okuması için veritabanına kaydet
      localStorage.setItem("activeStrategy", strategyName);
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

localStorage.setItem("activeStrategy", savedIndex);
