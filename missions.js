// VARIABLES

const navItems = document.querySelectorAll(".nav__list-item");
const activeButton = document.getElementById("activeButton");
const completedButton = document.getElementById("completedButton");
const activeMissions = document.getElementById("activeMissions");
const completedMissions = document.getElementById("completedMissions");
const missionCardTemplate = document.getElementById("missionCardTemplate");
const cardStepTemplate = document.getElementById("cardStepTemplate");
const emptyState = document.getElementById("emptyState");
const missionMainTitle = document.getElementById("missionMainTitle");
const titleError = document.getElementById("titleError");
const missionTypes = document.getElementsByName("missionType");
const missionTypeError = document.getElementById("missionTypeError");
const atomicStepsError = document.getElementById("atomicStepsError");

const formElement = document.getElementById("formElement");
const toggleButton = document.getElementById("focusToggleButton");
const toggleLabel = document.getElementById("toggleLabel");
const toggleStatus = document.getElementById("toggleStatus");

const statusCard = document.querySelector(".card__status span");
const updateButton = document.getElementById("updateButton");

const missionCard = document.getElementById("missionCard");
const completedMissionCard = document.getElementById("completedMissionCard");
const focusList = document.getElementById("focusList");

const addStepButton = document.getElementById("addStepButton");
const stepList = document.getElementById("stepList");
const stepTemplate = document.getElementById("stepTemplate");
const breakdownList = document.querySelector(".breakdown__list");
const stagesHeader = document.getElementById("stagesHeader");
const fieldsetContainer = document.getElementById("fieldsetContainer");
const calibrationBox = document.getElementById("calibrationBox");
const hourUpButton = document.getElementById("hourUpButton");
const displayHour = document.getElementById("displayHour");
const displayMinute = document.getElementById("displayMinute");
const hourDownButton = document.getElementById("hourDownButton");
const minuteUpButton = document.getElementById("minuteUpButton");
const minuteDownButton = document.getElementById("minuteDownButton");
const timePickerButton = document.getElementById("timePickerButton");
const errorMessage = document.getElementById("errorMessage");
const errorOverlay = document.getElementById("errorOverlay");
const errorText = document.getElementById("errorText");
const allCloseButtons = document.querySelectorAll(".close__button");

let targetButton = null;
let currentHour = 0;
let currentMinute = 0;
let finalTime = null;
let formCorrect = true;

// FUNCTIONS

function toggleFocusMode() {
  const isChecked = toggleButton.getAttribute("aria-checked") === "true";

  const newState = !isChecked;

  toggleButton.setAttribute("aria-checked", newState);

  if (newState) {
    toggleStatus.textContent = "ON";
    toggleButton.classList.add("toggle-btn--active");
  } else {
    toggleButton.classList.remove("toggle-btn--active");
  }
}

const formatNumber = (num) => (num < 10 ? "0" + num : num);

function updateDisplay() {
  let textHour = formatNumber(currentHour);
  let textMinute = formatNumber(currentMinute);
  displayHour.textContent = textHour;
  displayMinute.textContent = textMinute;
}

function timeSelection(e) {
  const clickedButton = e.target.closest(".set-time__button");

  if (clickedButton) {
    targetButton = clickedButton;

    currentHour = 0;
    currentMinute = 0;

    updateDisplay();

    calibrationBox.classList.remove("hidden");
    formElement.classList.add("hidden");
  }
}

const calibrateTime = (value, step, max) => (value + step + max) % max;

function calibrateHour(step) {
  currentHour = calibrateTime(currentHour, step, 24);
  updateDisplay();
}

function calibrateMinute(step) {
  currentMinute = calibrateTime(currentMinute, step, 60);
  updateDisplay();
}

function showError() {
  errorMessage.classList.remove("hidden");
}

function formatTimeText(hours, minutes) {
  if (hours === 0) return `${minutes}M`;
  if (minutes === 0) return `${hours}H`;
  return `${hours}H ${minutes}M`;
}

function timePicker() {
  if (currentHour === 0 && currentMinute === 0) {
    showError();
    return;
  }

  finalTime = formatTimeText(currentHour, currentMinute);

  if (targetButton) {
    targetButton.textContent = finalTime;
  }

  calibrationBox.classList.add("hidden");
  formElement.classList.remove("hidden");
}
function closeBox() {
  const parentBox = this.closest(".close-box");

  if (parentBox) {
    parentBox.classList.add("hidden");
    if (parentBox === calibrationBox) {
      formElement.classList.remove("hidden");
    }
  }
}

function updateStepNumbers() {
  const allNumbers = stepList.querySelectorAll(".list-item__number");
  allNumbers.forEach((span, index) => {
    span.textContent = formatNumber(index + 1);
  });
  let totalCount = allNumbers.length;
  if (stagesHeader) {
    if (totalCount === 0) {
      stagesHeader.textContent = "NO STAGES";
    } else if (totalCount === 1) {
      stagesHeader.textContent = "STAGES 01";
    } else {
      // Örn: STAGES 01—05
      stagesHeader.textContent = `STAGES 01—${formatNumber(totalCount)}`;
    }
  }
}

function deleteListItem(e) {
  const deleteBtn = e.target.closest(".delete__button");

  if (deleteBtn) {
    const listItem = deleteBtn.closest(".breakdown__list-item");
    listItem.remove();
    updateStepNumbers();
  }
}

function addNewStep() {
  const clone = stepTemplate.content.cloneNode(true);
  stepList.insertBefore(clone, addStepButton);

  updateStepNumbers();
}

const selectedType = document.querySelector(
  'input[name="missionType"]:checked',
);

function validateForm() {
  if (!missionMainTitle.value.trim()) {
    titleError.textContent = "Please enter a main title for your mission.";
    missionMainTitle.setAttribute("aria-invalid", "true");
    formCorrect = false;
  } else {
    titleError.textContent = "";
    missionMainTitle.setAttribute("aria-invalid", "false");
  }

  const selectedType = document.querySelector(
    'input[name="missionType"]:checked',
  );

  if (!selectedType) {
    missionTypeError.textContent = "Please select a mission type.";
    if (missionTypes[0]) {
      missionTypes[0].setAttribute("aria-invalid", "true");
    }
    formCorrect = false;
  } else {
    missionTypeError.textContent = "";
    if (missionTypes[0]) {
      missionTypes[0].setAttribute("aria-invalid", "false");
    }
  }

  const currentInputs = document.querySelectorAll(".list-item__input");

  if (currentInputs.length === 0) {
    atomicStepsError.textContent = "Please add at least one atomic step.";
    formCorrect = false;
    return;
  } else {
    atomicStepsError.textContent = "";
    atomicStepsError.setAttribute("aria-invalid", "false");
  }

  for (let input of currentInputs) {
    if (!input.value.trim()) {
      atomicStepsError.textContent =
        "Please fill in all atomic step descriptions.";
      input.setAttribute("aria-invalid", "true");
      formCorrect = false;
      return;
    } else {
      atomicStepsError.textContent = "";
      input.setAttribute("aria-invalid", "false");
    }
  }

  const timeButtons = document.querySelectorAll(".set-time__button span");

  for (let span of timeButtons) {
    if (span.textContent.trim() === "SET TIME") {
      atomicStepsError.textContent = "Please set a time for all atomic steps.";
      formCorrect = false;
      return;
    } else {
      atomicStepsError.textContent = "";
    }
  }
}

function switchTab(tab) {
  const isActive = tab === "active";

  activeMissions.classList.toggle("hidden", !isActive);
  completedMissions.classList.toggle("hidden", isActive);

  const activeClasses = ["nav__list-item--active", "btn--active"];

  activeClasses.forEach((cls) => {
    activeButton.classList.toggle(cls, isActive);
    completedButton.classList.toggle(cls, !isActive);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // ANA SAYFA KONTROLÜ: Sayfada 'focusList' diye bir kutu var mı?
  const focusList = document.getElementById("focusList");
  if (focusList) {
    renderFocusMissions();
    renderCurrentStrategy();

    updateOverallProgress(); // Varsa sadece focus olanları bas
  }
  const isMainPage = activeMissions;
  // MISSIONS SAYFASI KONTROLÜ: Sayfada 'activeMissions' kutusu var mı?
  if (isMainPage) {
    renderMissions();
  }

  // FORM SAYFASI KONTROLÜ: Sayfada form başlığı inputu var mı?
  const isFormPage = missionMainTitle;
  if (isFormPage) {
    initFormPage(); // Varsa formu başlat
  }
});

activeButton?.addEventListener("click", () => switchTab("active"));
completedButton?.addEventListener("click", () => switchTab("completed"));

toggleButton?.addEventListener("click", toggleFocusMode);

hourUpButton?.addEventListener("click", () => calibrateHour(1));

hourDownButton?.addEventListener("click", () => calibrateHour(-1));

minuteUpButton?.addEventListener("click", () => calibrateMinute(5));

minuteDownButton?.addEventListener("click", () => calibrateMinute(-5));

breakdownList?.addEventListener("click", (e) => timeSelection(e));

timePickerButton?.addEventListener("click", timePicker);

stepList?.addEventListener("click", (e) => deleteListItem(e));

addStepButton?.addEventListener("click", addNewStep);

allCloseButtons?.forEach((button) => {
  button.addEventListener("click", closeBox);
});

missionTypes?.forEach((radio) => {
  radio.addEventListener("change", () => {
    missionTypes.forEach((r) =>
      r.parentElement.classList.remove("mission-types--active"),
    );
    radio.parentNode.classList.add("mission-types--active");
  });
});

formElement?.addEventListener("submit", function (event) {
  event.preventDefault();

  formCorrect = true;
  validateForm();

  if (formCorrect) {
    const atomicStepsArray = [];
    const selectedType = document.querySelector(
      'input[name="missionType"]:checked',
    );

    const currentInputs = document.querySelectorAll(".list-item__input");

    currentInputs.forEach((input) => {
      const stepName = input.value.trim();

      const parentRow = input.closest(".breakdown__list-item");
      const timeBtn = parentRow.querySelector(".set-time__button");
      let selectedTime = timeBtn.textContent.trim();

      atomicStepsArray.push({
        name: stepName,
        time: selectedTime,
        completed: false,
      });
    });

    const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];
    const editingMissionId = localStorage.getItem("editingMissionId");

    if (editingMissionId) {
      const missionIndex = allMissions.findIndex(
        (m) => String(m.id) === String(editingMissionId),
      );

      if (missionIndex !== -1) {
        // Zekice bir dokunuş: Eğer eski adımlarda işaretlenmiş (completed: true)
        // olanlar varsa, güncellerken onların check durumunu sıfırlamayalım, koruyalım!
        const oldSteps = allMissions[missionIndex].steps || [];
        atomicStepsArray.forEach((newStep, index) => {
          if (oldSteps[index]) {
            newStep.completed = oldSteps[index].completed;
          }
        });

        // Mevcut görevin verilerini yenileriyle değiştir
        allMissions[missionIndex].title = missionMainTitle.value.trim();
        allMissions[missionIndex].focusMode =
          toggleButton?.getAttribute("aria-checked") === "true";
        allMissions[missionIndex].type = selectedType.value;
        allMissions[missionIndex].steps = atomicStepsArray;
      }

      // Güncelleme bitti, notu çöpe at ki bir sonraki sefer form boş açılsın
      localStorage.removeItem("editingMissionId");
      window.location.href = "missions.html?updated=true";
    } else {
      const missionData = {
        id: Date.now().toString(),
        title: missionMainTitle.value.trim(),
        focusMode: toggleButton?.getAttribute("aria-checked") === "true",
        type: selectedType.value,
        steps: atomicStepsArray,
        status: "active",
      };
      allMissions.push(missionData);
      window.location.href = "missions.html?created=true";
    }

    localStorage.setItem("allMissions", JSON.stringify(allMissions));
  }
});

function showStatusMessage(message) {
  const statusMessage = document.getElementById("statusMessage");

  if (!statusMessage || !message) return;

  statusMessage.textContent = message;
  statusMessage.classList.remove("hidden");

  window.toastTimeout = setTimeout(() => {
    statusMessage.classList.add("hidden");
  }, 3000);
}

function calculateRemainingTime(steps) {
  let remainingMinutes = 0;

  steps.forEach((step) => {
    if (!step.completed && step.time) {
      const matchHours = step.time.match(/(\d+)H/i);
      const matchMinutes = step.time.match(/(\d+)M/i);

      const hours = matchHours ? parseInt(matchHours[1]) : 0;
      const minutes = matchMinutes ? parseInt(matchMinutes[1]) : 0;

      remainingMinutes += hours * 60 + minutes;
    }
  });

  const finalHours = Math.floor(remainingMinutes / 60);
  const finalMinutes = remainingMinutes % 60;

  return formatTimeText(finalHours, finalMinutes);
}

function updateGlobalTime() {
  const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];

  let totalWorkAssigned = 0;
  let totalWorkRemaining = 0;

  console.log("--- HESAPLAMA BAŞLADI ---");
  console.log("Toplam Görev Sayısı:", allMissions.length);

  allMissions.forEach((mission, index) => {
    if (mission.steps && mission.steps.length > 0) {
      mission.steps.forEach((step) => {
        // ZAMAN AYIKLAMA (Çok daha güvenli hale getirdik)
        const timeStr = step.time || "0M"; // Eğer süre boşsa 0 say
        const matchHours = timeStr.match(/(\d+)\s*H/i);
        const matchMinutes = timeStr.match(/(\d+)\s*M/i);

        const h = matchHours ? parseInt(matchHours[1]) : 0;
        const m = matchMinutes ? parseInt(matchMinutes[1]) : 0;
        const stepTotalMins = h * 60 + m;

        // Payda: Her şeyi topla
        totalWorkAssigned += stepTotalMins;

        // Pay: Sadece bitmemişleri topla
        if (!step.completed) {
          totalWorkRemaining += stepTotalMins;
        }
      });
    }
  });

  // KONSOLDA DEĞERLERİ KONTROL ET (F12'ye basınca burayı oku)
  console.log("Sistemdeki Toplam Dakika (Payda):", totalWorkAssigned);
  console.log("Kalan Dakika (Pay):", totalWorkRemaining);

  const percentage =
    totalWorkAssigned > 0 ? (totalWorkRemaining / totalWorkAssigned) * 100 : 0;
  console.log("Hesaplanan Yüzde:", percentage.toFixed(2) + "%");

  // DOM GÜNCELLEME
  const timeValueElement = document.getElementById("timeValue");
  const progressFillElement = document.getElementById("progressFill");

  if (timeValueElement) {
    const h = Math.floor(totalWorkRemaining / 60);
    const m = totalWorkRemaining % 60;
    // Senin format fonksiyonun:
    timeValueElement.textContent = formatTimeText(h, m);
  }

  if (progressFillElement) {
    // BARIN GENİŞLİĞİNİ BASIYORUZ
    progressFillElement.style.width = percentage + "%";
  }
}
function updateCardVisuals(cardElement, mission) {
  const statusTime = cardElement.querySelector(".status__time");
  const completeAllButton = cardElement.querySelector(".complete-all__button");
  const isCompleted = mission.status === "completed";

  if (isCompleted) {
    statusTime.textContent = "Completed";
    completeAllButton.textContent = "MARK ALL AS INCOMPLETE";
  } else {
    const remainingTime = calculateRemainingTime(mission.steps);
    statusTime.textContent = `${remainingTime} LEFT`;
    completeAllButton.textContent = "MARK ALL AS COMPLETE";
  }
}

function updateOverallProgress() {
  const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];

  // 1. Toplam ve Tamamlanan görevleri say
  const totalMissions = allMissions.length;
  const completedMissions = allMissions.filter(
    (m) => m.status === "completed",
  ).length;

  // 2. Senin örneğindeki %25 hesabını yap (4 görevden 1'i bittiyse %25 olur)
  const percentage = Math.round((completedMissions / totalMissions) * 100);

  // 3. Halka Elementlerini Bul ve Güncelle
  const progressRing = document.querySelector(".progress-circle--lg");
  const progressValue = document.querySelector(".progress-value--lg");
  const progressText = document.querySelector(".progress__text");
  if (!progressRing && !progressValue && !progressText) return;

  progressRing.style.setProperty("--percent", `${percentage}%`);

  progressValue.innerHTML = `${percentage}<span class="percentage-symbol">%</span>`;

  progressText.textContent = `You've completed ${completedMissions}/${totalMissions} missions.`;
}

function updateProgress(cardElement) {
  const cardCheckboxes = cardElement.querySelectorAll(".task-check");
  const totalTasks = cardCheckboxes.length;

  const completedTasks = Array.from(cardCheckboxes).filter(
    (checkbox) => checkbox.checked,
  ).length;

  const percentage = Math.round((completedTasks / totalTasks) * 100);
  const progressRing = cardElement.querySelector(".progress-circle");
  const progressValue = cardElement.querySelector(".progress-value");

  if (progressRing)
    progressRing.style.setProperty("--percent", `${percentage}%`);
  if (progressValue) progressValue.textContent = `${percentage}%`;

  const missionId = cardElement.id.replace("missionCard-", "");
  const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];
  const missionIndex = allMissions.findIndex((m) => m.id === missionId);

  if (missionIndex !== -1) {
    allMissions[missionIndex].steps.forEach((step, index) => {
      step.completed = cardCheckboxes[index].checked;
    });

    const currentStatus = allMissions[missionIndex].status;

    if (percentage === 100 && currentStatus !== "completed") {
      allMissions[missionIndex].status = "completed";
      updateCardVisuals(cardElement, allMissions[missionIndex]);
      if (focusList) {
        cardElement.remove();
        checkGeneralEmptyState();
      } else if (completedMissions) {
        completedMissions.appendChild(cardElement);
      }
      showStatusMessage("Mission completed successfully!");
    } else if (percentage < 100 && currentStatus === "completed") {
      allMissions[missionIndex].status = "active";
      updateCardVisuals(cardElement, allMissions[missionIndex]);
      activeMissions.appendChild(cardElement);
      showStatusMessage("Mission moved back to active missions.");
    } else if (percentage < 100) {
      updateCardVisuals(cardElement, allMissions[missionIndex]);
    }

    localStorage.setItem("allMissions", JSON.stringify(allMissions));

    checkGeneralEmptyState();
    updateOverallProgress();
    updateGlobalTime();
  }
}

function initFormPage() {
  const editingMissionId = localStorage.getItem("editingMissionId");

  // Eğer güncelleme modundaysak (LocalStorage'da not varsa)
  if (editingMissionId) {
    const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];
    const missionToEdit = allMissions.find(
      (m) => String(m.id) === String(editingMissionId),
    );

    if (missionToEdit) {
      if (toggleButton) {
        const isFocus = missionToEdit.focusMode === true;
        toggleButton.setAttribute("aria-checked", isFocus);
        if (isFocus) {
          toggleButton.classList.toggle("toggle-btn--active");
        }
      }

      // 1. Durumu yansıt (true ise ON, false ise OFF)

      // 1. Temel bilgileri doldur
      const missionMainTitle = document.getElementById("missionMainTitle");
      if (missionMainTitle) missionMainTitle.value = missionToEdit.title;
      const targetRadio = document.querySelector(
        `input[name="missionType"][value="${missionToEdit.type}"]`,
      );

      if (targetRadio) {
        targetRadio.checked = true;

        targetRadio.parentElement.classList.add("mission-types--active");
      }

      missionToEdit.steps.forEach((step, index) => {
        let stepInputs = document.querySelectorAll(".list-item__input");
        let timeButtons = document.querySelectorAll(".set-time__button");

        // Eğer bu adım için satır yoksa:
        if (!stepInputs[index]) {
          const parentList = document.getElementById("stepList");
          const addStepButton = document.getElementById("addStepButton");

          // 1. Sadece İLK gerçek input'un bulunduğu satırı bul (butonları atlamak için)
          const firstRow = stepInputs[0].closest(".breakdown__list-item");
          const clonedRow = firstRow.cloneNode(true);

          // 2. Klonun içini temizle
          clonedRow.querySelector(".list-item__input").value = "";

          // İkonun silinmemesi için sadece span'in içindeki yazıyı değiştiriyoruz
          const timeSpan = clonedRow.querySelector(".set-time__button span");
          if (timeSpan) timeSpan.textContent = "SET TIME";

          // Sıra numarasını dinamik güncelle (02, 03, 04 şeklinde)
          const numberSpan = clonedRow.querySelector(".list-item__number");
          if (numberSpan) {
            numberSpan.textContent = String(index + 1).padStart(2, "0");
          }

          // 3. İŞTE BÜYÜ: Yeni satırı TAM OLARAK "Add Step" butonunun ÖNÜNE ekle!
          parentList.insertBefore(clonedRow, addStepButton);

          // 4. Ekledikten sonra listeyi tekrar güncelle
          stepInputs = document.querySelectorAll(".list-item__input");
          timeButtons = document.querySelectorAll(".set-time__button");
        }

        // VERİLERİ YAZDIRMA KISMI
        if (stepInputs[index]) {
          stepInputs[index].value = step.name;
        }

        if (timeButtons[index]) {
          // Yine ikonun silinmemesi için sadece span'i hedef alıyoruz
          const timeSpan = timeButtons[index];
          if (timeSpan) {
            timeSpan.textContent = step.time;
          }
        }
      });
    }
    const submitButton = document.querySelector(".submit__button");
    submitButton.textContent = "UPDATE MISSION";
  }
}

function checkGeneralEmptyState() {
  const emptyState = document.getElementById("emptyState");
  const emptyStateTitle = document.getElementById("emptyStateTitle");

  // 1. GÜVENLİK: Eğer HTML'de empty state yoksa hiç uğraşma, kodu bitir.
  if (!emptyState || !emptyStateTitle) return;

  const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];

  // Hangi sayfada olduğumuzu anlamak için focusList'i arıyoruz
  const focusList = document.getElementById("focusList");
  const focusListTitle = document.getElementById("focusListTitle");

  // ==========================================
  // DURUM 1: ANA SAYFADAYIZ (focusList var)
  // ==========================================
  if (focusList) {
    // Sadece focusMode açık ve aktif olanları sayıyoruz
    const focusMissions = allMissions.filter(
      (m) => m.focusMode === true && m.status === "active",
    );

    if (focusMissions.length !== 0) {
      emptyState.classList.add("hidden"); // Görev varsa kutuyu gizle
      focusList.classList.remove("hidden");
    } else {
      emptyState.classList.remove("hidden");
      focusListTitle.classList.add("hidden"); // Görev yoksa kutuyu göster
      emptyStateTitle.textContent = "Your focus radar is currently empty.";
    }

    return; // DİKKAT: Ana sayfadaysan işlemi burada BİTİR. Alt tarafa geçmesine izin verme!
  }

  // ==========================================
  // DURUM 2: MISSIONS SAYFASINDAYIZ
  // ==========================================
  const activeMissionList = allMissions.filter((m) => m.status === "active");

  if (activeMissionList.length !== 0) {
    emptyState.classList.add("hidden");
  } else {
    emptyState.classList.remove("hidden");

    if (allMissions.length !== 0) {
      emptyStateTitle.textContent = "All caught up! Ready for a new challenge?";
    } else {
      emptyStateTitle.textContent = "Ready to initiate your first mission?";
    }
  }
}

function createMissionCard(mission) {
  const missionCardTemplate = document.getElementById("missionCardTemplate");
  const cardStepTemplate = document.getElementById("cardStepTemplate");

  const cardClone = missionCardTemplate.content.cloneNode(true);
  const cardElement = cardClone.querySelector(".mission-card");
  const ulElement = cardElement.querySelector(".mission-card__list");
  const cardHeader = cardElement.querySelector(".mission-card__header");
  const titleElement = cardElement.querySelector(".mission-title");
  const typeElement = cardElement.querySelector(".mission-card__type");
  const chevronIcon = cardElement.querySelector(".chevron-icon");
  const cardBody = cardElement.querySelector(".mission-card__body");
  const updateButton = cardElement.querySelector(".update__button");
  const focusBadge = cardElement.querySelector(".focus-badge");
  const completeAllButton = cardElement.querySelector(".complete-all__button");
  const removeButton = cardElement.querySelector(".remove-card__button");

  // 1. TEMEL BİLGİLERİ DOLDUR
  cardElement.id = `missionCard-${mission.id}`;
  titleElement.textContent = mission.title;
  typeElement.textContent = mission.type;

  if (mission.focusMode === true) {
    focusBadge.classList.remove("hidden");
  }

  // 2. ADIMLARI (STEPS) DOLDUR
  mission.steps.forEach((step) => {
    const stepClone = cardStepTemplate.content.cloneNode(true);
    const stepCheckbox = stepClone.querySelector(".task-check");
    const stepText = stepClone.querySelector(".task-text");
    const stepTime = stepClone.querySelector(".list-item__time");

    stepText.textContent = step.name;
    stepTime.textContent = step.time;
    stepCheckbox.checked = step.completed;

    ulElement.appendChild(stepClone);
  });

  const cardCheckboxes = cardElement.querySelectorAll(".task-check");

  // 3. İLK GÖRSEL GÜNCELLEMELER
  updateCardVisuals(cardElement, mission);
  updateProgress(cardElement);

  // 4. ETKİLEŞİMLER (EVENT LISTENERS)
  cardHeader?.addEventListener("click", () => {
    chevronIcon.classList.toggle("rotate");
    cardBody.classList.toggle("hidden");
  });

  cardCheckboxes?.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateProgress(cardElement);
      // DÜZELTME: EmptyState kontrolü tıklama anında (burada) yapılmalı!

      checkGeneralEmptyState();
    });
  });

  updateButton?.addEventListener("click", () => {
    localStorage.setItem("editingMissionId", mission.id);
    window.location.href = "startmission.html";
  });

  completeAllButton?.addEventListener("click", () => {
    const completedMissions = document.getElementById("completedMissions");
    const isCurrentlyCompleted =
      completedMissions && completedMissions.contains(cardElement);

    if (isCurrentlyCompleted) {
      cardCheckboxes.forEach((cb) => (cb.checked = false));
    } else {
      cardCheckboxes.forEach((cb) => (cb.checked = true));
    }

    updateProgress(cardElement);

    checkGeneralEmptyState();
  });

  removeButton?.addEventListener("click", () => {
    cardElement.remove();

    let updatedMissions = JSON.parse(localStorage.getItem("allMissions")) || [];
    updatedMissions = updatedMissions.filter((m) => m.id !== mission.id);
    localStorage.setItem("allMissions", JSON.stringify(updatedMissions));

    showStatusMessage("Mission removed successfully.");
    checkGeneralEmptyState();
  });

  // KARTI HAZIRLA VE GERİ GÖNDER
  return cardElement;
}

function renderMissions() {
  const activeMissions = document.getElementById("activeMissions");
  const completedMissions = document.getElementById("completedMissions");

  // Eğer bu kutular sayfada yoksa, hiç başlama
  if (!activeMissions || !completedMissions) return;

  // Kutuları temizle (Sayfa yenilendiğinde kartlar üst üste binmesin)

  const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];

  // HER BİR GÖREV İÇİN DÖNGÜ
  allMissions.forEach((mission) => {
    // 1. Fabrikadan kartı al
    const card = createMissionCard(mission);

    // 2. Hedefi belirle (Tamamlanmış mı, Aktif mi?)
    const targetContainer =
      mission.status === "completed" ? completedMissions : activeMissions;

    // 3. Ekrana ekle
    targetContainer.appendChild(card);
  });

  // Tüm kartlar eklendikten sonra boş durum kontrolü yap

  checkGeneralEmptyState();
}

function renderFocusMissions() {
  console.log("1. renderFocusMissions ÇALIŞTI!");

  const focusList = document.getElementById("focusList");

  if (!focusList) {
    console.error("2. HATA: HTML'de 'focusList' id'li bir element YOK!");
    return;
  }

  const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];

  // Garantili Filtreleme
  const focusOnlyMissions = allMissions.filter(
    (mission) =>
      String(mission.focusMode) === "true" && mission.status !== "completed",
  );

  focusOnlyMissions.forEach((mission) => {
    const card = createMissionCard(mission);
    focusList.appendChild(card);
  });

  checkGeneralEmptyState();
}
const urlParams = window.location.search;

if (urlParams.includes("updated=true")) {
  showStatusMessage("Mission updated successfully!"); // Güncelleme mesajı
} else if (urlParams.includes("created=true")) {
  showStatusMessage("New mission initiated!"); // Yeni kayıt mesajı
}

function renderCurrentStrategy() {
  const currentStrategy = document.getElementById("currentStrategy");
  if (!currentStrategy) return;

  // LocalStorage'dan aktif stratejiyi çek. Eğer hiç seçilmediyse varsayılan bir yazı göster.
  const activeStrategy =
    localStorage.getItem("activeStrategy") || "NO STRATEGY SELECTED";

  // Ekrana yazdır
  currentStrategy.textContent = activeStrategy;
}
