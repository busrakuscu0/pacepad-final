// VARIABLES

const navItems = document.querySelectorAll(".nav__list-item");
const activeButton = document.getElementById("activeButton");
const completedButton = document.getElementById("completedButton");
const activeMissions = document.getElementById("activeMissions");
const completedMissions = document.getElementById("completedMissions");

const missionMainTitle = document.getElementById("missionMainTitle");
const titleError = document.getElementById("titleError");
const missionTypes = document.getElementsByName("missionType");
const missionTypeError = document.getElementById("missionTypeError");
const atomicStepsError = document.getElementById("atomicStepsError");
const stepInputs = document.querySelectorAll(".list-item__input");

const formElement = document.getElementById("formElement");
const toggleButton = document.getElementById("focusToggleButton");
const toggleLabel = document.getElementById("toggleLabel");
const toggleStatus = document.getElementById("toggleStatus");

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
    finalTime = `${currentMinute}m`;
  } else if (currentMinute === 0) {
    finalTime = `${currentHour}h`;
  } else {
    finalTime = `${currentHour}h ${currentMinute}m`;
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
    const missionData = {
      title: document.querySelector(".mission-title__input").value,
      type: document.querySelector('input[name="missionType"]:checked').value,
      steps: [], // Adımları burada liste olarak tutacağız
    };

    // Tüm atomic step'leri ve saatlerini alalım
    const steps = document.querySelectorAll(".breakdown__list-item");
    steps.forEach((step) => {
      const text = step.querySelector(".list-item__input").value;
      const time = step.querySelector(".set-time__button span").textContent;

      missionData.steps.push({ text, time });
    });

    localStorage.setItem("currentMission", JSON.stringify(missionData));

    window.location.href = "missions.html";
  }
});
