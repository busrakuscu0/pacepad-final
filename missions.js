// VARIABLES

const navItems = document.querySelectorAll(".nav__list-item");
const activeButton = document.getElementById("activeButton");
const completedButton = document.getElementById("completedButton");
const activeMissions = document.getElementById("activeMissions");
const completedMissions = document.getElementById("completedMissions");
const missionCardTemplate = document.getElementById("missionCardTemplate");
const cardStepTemplate = document.getElementById("cardStepTemplate");

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

const ulElement = document.getElementById("ulElement");

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

function timePicker() {
  if (currentHour === 0 && currentMinute === 0) {
    showError();
    return;
  } else if (currentHour === 0) {
    finalTime = `${currentMinute}M`;
  } else if (currentMinute === 0) {
    finalTime = `${currentHour}H`;
  } else {
    finalTime = `${currentHour}H ${currentMinute}M`;
  }

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

  const currentInputs = stepList.querySelectorAll('input[type="text"]');

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

document.addEventListener("DOMContentLoaded", renderMissions);

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

    const stepInputs = document.querySelectorAll(".list-item__input");

    stepInputs.forEach((input) => {
      const stepName = input.value.trim();

      if (stepName !== "") {
        const parentRow = input.closest(".breakdown__list-item");
        const timeBtn = parentRow.querySelector(".set-time__button");
        let selectedTime = timeBtn.textContent.trim();
      }

      atomicStepsArray.push({
        name: stepName,
        time: selectedTime,
        completed: false,
      });
    });

    const missionData = {
      id: Date.now().toString(),
      title: missionMainTitle.value.trim(),
      focusMode: toggleButton?.getAttribute("aria-checked") === "true",
      type: selectedType.value,
      steps: atomicStepsArray,
      status: "active",
    };

    const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];
    allMissions.push(missionData);
    localStorage.setItem("allMissions", JSON.stringify(allMissions));

    window.location.href = "missions.html";
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

function toggleMissionStatus(
  targetContainer,
  statusText,
  buttonText,
  message,
  card,
) {
  if (targetContainer && card) {
    targetContainer.appendChild(card);
  }

  const cardStatus = card.querySelector(".mission-card__status");
  const completeAllButton = card.querySelector(".complete-all__button");

  if (cardStatus) cardStatus.textContent = statusText;
  if (completeAllButton) completeAllButton.textContent = buttonText;

  if (message) {
    showStatusMessage(message);
  }
}

function updateProgress(cardElement) {
  const cardCheckboxes = cardElement.querySelectorAll(".task-check");
  const totalTasks = cardCheckboxes.length;

  const completedTasks = Array.from(cardCheckboxes).filter(
    (checkbox) => checkbox.checked,
  ).length;

  const percentage = Math.round((completedTasks / totalTasks) * 100);
  const progressRing = cardElement.querySelector(".progress-circular");
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
      toggleMissionStatus(
        completedMissions,
        "Completed",
        "MARK ALL AS INCOMPLETE",
        "Mission completed successfully!",
        cardElement,
      );
    } else if (percentage < 100 && currentStatus === "completed") {
      allMissions[missionIndex].status = "active";
      toggleMissionStatus(
        activeMissions,
        "2H LEFT",
        "MARK ALL AS COMPLETE",
        "Mission moved back to active missions.",
        cardElement,
      );
    }
    localStorage.setItem("allMissions", JSON.stringify(allMissions));
  }
}

function renderMissions() {
  if (!activeMissions || !completedMissions || !missionCardTemplate) return;

  const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];

  allMissions.forEach((mission) => {
    const cardClone = missionCardTemplate.content.cloneNode(true);
    const cardElement = cardClone.querySelector(".mission-card");
    const ulElement = cardClone.querySelector(".mission-card__list");

    cardElement.id = `missionCard-${mission.id}`;
    cardClone.querySelector(".mission-title").textContent = mission.title;
    cardClone.querySelector(".mission-card__type").textContent = mission.type;

    mission.steps.forEach((step) => {
      const stepClone = cardStepTemplate.content.cloneNode(true);
      const checkbox = cardElement.querySelector(".task-check");

      stepClone.querySelector(".task-text").textContent = step.name;
      stepClone.querySelector(".list-item__time").textContent = step.time;
      checkbox.checked = step.completed;

      ulElement.appendChild(stepClone);
    });

    const isCompleted = mission.status === "completed";
    const targetContainer = isCompleted ? completedMissions : activeMissions;

    if (isCompleted) {
      cardClone.querySelector(".mission-card__status").textContent =
        "Completed";
      cardClone.querySelector(".complete-all__button").textContent =
        "MARK ALL AS INCOMPLETE";
    }

    targetContainer.appendChild(cardClone);

    const cardHeader = cardClone.querySelector(".mission-card__header");
    const chevronIcon = cardClone.querySelector(".chevron-icon");
    const cardBody = cardClone.querySelector(".mission-card__body");
    const cardCheckboxes = cardElement.querySelectorAll(".task-check");
    const completeAllButton = cardClone.querySelector(".complete-all__button"); // Kendi class'ını yaz
    const removeButton = cardClone.querySelector(".remove-card__button");

    cardHeader?.addEventListener("click", () => {
      chevronIcon.classList.toggle("rotate");
      cardBody.classList.toggle("hidden");
    });

    cardCheckboxes?.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        updateProgress(cardElement);
      });
    });

    completeAllButton?.addEventListener("click", () => {
      const isCurrentlyCompleted = completedMissions.contains(cardElement);

      if (isCurrentlyCompleted) {
        cardCheckboxes.forEach((cb) => (cb.checked = false));
      } else {
        cardCheckboxes.forEach((cb) => (cb.checked = true));
      }
      updateProgress(cardElement);
    });

    removeBtn?.addEventListener("click", () => {
      cardElement.remove();

      let updatedMissions =
        JSON.parse(localStorage.getItem("allMissions")) || [];
      updatedMissions = updatedMissions.filter((m) => m.id !== mission.id);
      localStorage.setItem("allMissions", JSON.stringify(updatedMissions));
      showStatusMessage("Mission removed successfully.");
    });
    updateProgress(cardElement);
  });
}
