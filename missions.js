// VARIABLES

const activeButton = document.getElementById("activeButton");
const completedButton = document.getElementById("completedButton");
const activeMissions = document.getElementById("activeMissions");
const completedMissions = document.getElementById("completedMissions");
const missionMainTitle = document.getElementById("missionMainTitle");
const titleError = document.getElementById("titleError");
const missionTypes = document.getElementsByName("missionType");
const missionTypeError = document.getElementById("missionTypeError");
const stepsError = document.getElementById("stepsError");
const formElement = document.getElementById("formElement");
const focusToggleButton = document.getElementById("focusToggleButton");
const toggleStatus = document.getElementById("toggleStatus");
const missionCard = document.getElementById("missionCard");
const focusList = document.getElementById("focusList");
const addStepButton = document.getElementById("addStepButton");
const stepList = document.getElementById("stepList");
const stepTemplate = document.getElementById("stepTemplate");
const breakdownList = document.querySelector(".breakdown__list");
const stagesHeader = document.getElementById("stagesHeader");
const calibrationContainer = document.getElementById("calibrationContainer");
const hourUpButton = document.getElementById("hourUpButton");
const hourDownButton = document.getElementById("hourDownButton");
const minuteUpButton = document.getElementById("minuteUpButton");
const minuteDownButton = document.getElementById("minuteDownButton");
const displayHour = document.getElementById("displayHour");
const displayMinute = document.getElementById("displayMinute");
const timePickerButton = document.getElementById("timePickerButton");
const errorMessage = document.getElementById("errorMessage");
const allCloseButtons = document.querySelectorAll(".close__button");
const mainInitiateLink = document.getElementById("mainInitiateLink");

let targetButton = null;
let currentHour = 0;
let currentMinute = 0;
let finalTime = null;
let formCorrect = true;
let quotesData = [];
let currentIndex = 0;

// FUNCTIONS

const formatNumber = (num) => (num < 10 ? "0" + num : num);
const calibrateTime = (value, step, max) => (value + step + max) % max;
const updateInterval = 5 * 60 * 1000;

function toggleFocusMode() {
  const isChecked = focusToggleButton.getAttribute("aria-checked") === "true";

  const newState = !isChecked;

  focusToggleButton.setAttribute("aria-checked", newState);

  if (newState) {
    toggleStatus.textContent = "ON";
    focusToggleButton.classList.add("toggle__button--active");
  } else {
    focusToggleButton.classList.remove("toggle__button--active");
  }
}

function updateTimeDisplay() {
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

    updateTimeDisplay();

    calibrationContainer.classList.remove("hidden");
    formElement.classList.add("hidden");
  }
}

function adjustTime(type, step) {
  if (type === "hour") {
    currentHour = calibrateTime(currentHour, step, 24);
  } else if (type === "minute") {
    currentMinute = calibrateTime(currentMinute, step, 60);
  }
  updateTimeDisplay();
}

function formatTimeText(hours, minutes) {
  if (hours === 0) return `${minutes}M`;
  if (minutes === 0) return `${hours}H`;
  return `${hours}H ${minutes}M`;
}

function timePicker() {
  if (currentHour === 0 && currentMinute === 0) {
    errorMessage.classList.remove("hidden");
    return;
  }

  finalTime = formatTimeText(currentHour, currentMinute);

  if (targetButton) {
    targetButton.textContent = finalTime;
  }

  calibrationContainer.classList.add("hidden");
  formElement.classList.remove("hidden");
}

function closeBox() {
  const parentBox = this.closest(".close-box");

  if (parentBox) {
    parentBox.classList.add("hidden");
    if (parentBox === calibrationContainer) {
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
      stagesHeader.textContent = `STAGES 01—${formatNumber(totalCount)}`;
    }
  }
}

function deleteStep(e) {
  const deleteButton = e.target.closest(".delete__button");

  if (deleteButton) {
    const listItem = deleteButton.closest(".breakdown__list-item");
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
  const selectedType = document.querySelector(
    'input[name="missionType"]:checked',
  );
  const stepInputs = document.querySelectorAll(".list-item__input");
  const timeButtons = document.querySelectorAll(".set-time__button span");

  if (!missionMainTitle.value.trim()) {
    titleError.textContent = "Please enter a main title for your mission.";
    missionMainTitle.setAttribute("aria-invalid", "true");
    formCorrect = false;
  } else {
    titleError.textContent = "";
    missionMainTitle.setAttribute("aria-invalid", "false");
  }

  if (!selectedType) {
    missionTypeError.textContent = "Please select a mission type.";
    missionTypes[0].setAttribute("aria-invalid", "true");
    formCorrect = false;
  } else {
    missionTypeError.textContent = "";
    missionTypes[0].setAttribute("aria-invalid", "false");
  }

  if (stepInputs.length === 0) {
    stepsError.textContent = "Please add at least one atomic step.";
    formCorrect = false;
    return;
  } else {
    stepsError.textContent = "";
    stepsError.setAttribute("aria-invalid", "false");
  }

  for (let input of stepInputs) {
    if (!input.value.trim()) {
      stepsError.textContent = "Please fill in all atomic step descriptions.";
      input.setAttribute("aria-invalid", "true");
      formCorrect = false;
      return;
    } else {
      stepsError.textContent = "";
      input.setAttribute("aria-invalid", "false");
    }
  }

  for (let span of timeButtons) {
    if (span.textContent.trim() === "SET TIME") {
      stepsError.textContent = "Please set a time for all atomic steps.";
      formCorrect = false;
      return;
    } else {
      stepsError.textContent = "";
      span.setAttribute("aria-invalid", "false");
    }
  }
}

function switchTab(tab) {
  const isActivePage = tab === "active";

  activeMissions.classList.toggle("hidden", !isActivePage);
  completedMissions.classList.toggle("hidden", isActivePage);

  const activeClasses = ["nav__list-item--active", "btn--active"];

  activeClasses.forEach((cls) => {
    activeButton.classList.toggle(cls, isActivePage);
    completedButton.classList.toggle(cls, !isActivePage);
  });
}

function showStatusMessage(message) {
  const statusMessage = document.getElementById("statusMessage");

  if (!statusMessage || !message) return;

  statusMessage.textContent = message;
  statusMessage.classList.remove("hidden");

  window.toastTimeout = setTimeout(() => {
    statusMessage.classList.add("hidden");
  }, 3000);
}

function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;

  const matchHour = timeStr.match(/(\d+)\s*H/i);
  const matchMinute = timeStr.match(/(\d+)\s*M/i);

  const hours = matchHour ? parseInt(matchHour[1]) : 0;
  const minutes = matchMinute ? parseInt(matchMinute[1]) : 0;

  return hours * 60 + minutes;
}

function calculateRemainingTime(steps) {
  let remainingMinutes = 0;

  steps.forEach((step) => {
    if (!step.completed) {
      remainingMinutes += parseTimeToMinutes(step.time);
    }
  });

  const finalHours = Math.floor(remainingMinutes / 60);
  const finalMinutes = remainingMinutes % 60;

  return formatTimeText(finalHours, finalMinutes);
}

function updateTimeProgress() {
  const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];
  const timeValueElement = document.getElementById("timeValue");
  const progressFillElement = document.getElementById("progressFill");
  let assignedMissionMins = 0;
  let remainingMissionMins = 0;
  const timeProgressPercentage =
    assignedMissionMins > 0
      ? (remainingMissionMins / assignedMissionMins) * 100
      : 0;

  allMissions.forEach((mission) => {
    if (mission.steps && mission.steps.length > 0) {
      mission.steps.forEach((step) => {
        const stepTotalMins = parseTimeToMinutes(step.time);

        assignedMissionMins += stepTotalMins;

        if (!step.completed) {
          remainingMissionMins += stepTotalMins;
        }
      });
    }
  });

  if (timeValueElement) {
    const hour = Math.floor(remainingMissionMins / 60);
    const minute = remainingMissionMins % 60;
    timeValueElement.textContent = `${formatTimeText(hour, minute)} LEFT`;
  }

  if (progressFillElement) {
    progressFillElement.style.width = timeProgressPercentage + "%";
  }
}

function updateCardContent(cardElement, mission) {
  const statusTime = cardElement.querySelector(".status__time");
  const completeAllButton = cardElement.querySelector(".complete-all__button");
  const isCompleted = mission.status === "completed";
  const remainingTime = calculateRemainingTime(mission.steps);

  if (isCompleted) {
    statusTime.textContent = "Completed";
    completeAllButton.textContent = "MARK ALL AS INCOMPLETE";
  } else {
    statusTime.textContent = `${remainingTime} LEFT`;
    completeAllButton.textContent = "MARK ALL AS COMPLETE";
  }
}

function updateMissionCompletionRate() {
  const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];
  const totalMissions = allMissions.length;
  const totalCompletedMissions = allMissions.filter(
    (m) => m.status === "completed",
  ).length;
  const missionCompletionPercentage =
    totalMissions === 0
      ? 0
      : Math.round((totalCompletedMissions / totalMissions) * 100);
  const progressCircle = document.querySelector(".progress-circle--lg");
  const progressValue = document.querySelector(".progress-value--lg");
  const progressText = document.querySelector(".progress__text");

  if (!progressCircle && !progressValue && !progressText) return;

  progressCircle.style.setProperty(
    "--percent",
    `${missionCompletionPercentage}%`,
  );

  progressValue.innerHTML = `${missionCompletionPercentage}<span class="percentage-symbol">%</span>`;

  progressText.textContent = `You've completed ${totalCompletedMissions}/${totalMissions} missions.`;
}

function checkGeneralEmptyState() {
  const emptyState = document.getElementById("emptyState");
  const emptyStateTitle = document.getElementById("emptyStateTitle");
  const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];
  const focusList = document.getElementById("focusList");
  const focusListTitle = document.getElementById("focusListTitle");
  const focusMissions = allMissions.filter(
    (m) => m.focusMode === true && m.status === "active",
  );
  const activeMissionList = allMissions.filter((m) => m.status === "active");

  if (!emptyState || !emptyStateTitle) return;

  if (focusList) {
    if (focusMissions.length !== 0) {
      emptyState.classList.add("hidden");
      focusList.classList.remove("hidden");
    } else {
      emptyState.classList.remove("hidden");
      focusListTitle.classList.add("hidden");
      emptyStateTitle.textContent = "Your focus radar is currently empty.";
    }
    return;
  }

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

function updateProgress(cardElement) {
  const cardCheckboxes = cardElement.querySelectorAll(".list-item__checkbox");
  const totalTasks = cardCheckboxes.length;

  const completedTasks = Array.from(cardCheckboxes).filter(
    (checkbox) => checkbox.checked,
  ).length;

  const cardProgressPercentage = Math.round(
    (completedTasks / totalTasks) * 100,
  );
  const progressCircle = cardElement.querySelector(".progress-circle--sm");
  const progressValue = cardElement.querySelector(".progress-value--sm");
  const focusList = document.getElementById("focusList");

  if (progressCircle)
    progressCircle.style.setProperty("--percent", `${cardProgressPercentage}%`);
  if (progressValue) progressValue.textContent = `${cardProgressPercentage}%`;

  const missionId = cardElement.id.replace("missionCard-", "");
  const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];
  const missionIndex = allMissions.findIndex((m) => m.id === missionId);

  if (missionIndex !== -1) {
    allMissions[missionIndex].steps.forEach((step, index) => {
      step.completed = cardCheckboxes[index].checked;
    });

    const currentStatus = allMissions[missionIndex].status;

    if (cardProgressPercentage === 100 && currentStatus !== "completed") {
      allMissions[missionIndex].status = "completed";
      updateCardContent(cardElement, allMissions[missionIndex]);
      if (focusList) {
        cardElement.remove();
        checkGeneralEmptyState();
      } else if (completedMissions) {
        completedMissions.appendChild(cardElement);
      }
      showStatusMessage("Mission completed successfully!");
    } else if (cardProgressPercentage < 100 && currentStatus === "completed") {
      allMissions[missionIndex].status = "active";
      updateCardContent(cardElement, allMissions[missionIndex]);
      activeMissions.appendChild(cardElement);
      showStatusMessage("Mission moved back to active missions.");
    } else if (cardProgressPercentage < 100) {
      updateCardContent(cardElement, allMissions[missionIndex]);
    }

    localStorage.setItem("allMissions", JSON.stringify(allMissions));

    checkGeneralEmptyState();
    updateMissionCompletionRate();
    updateTimeProgress();
  }
}

function initFormPage() {
  const editingMissionId = localStorage.getItem("editingMissionId");
  const tempMissionTitle = localStorage.getItem("tempMissionTitle");
  const missionMainTitle = document.getElementById("missionMainTitle");
  const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];
  const submitButton = document.querySelector(".submit__button");

  if (editingMissionId) {
    const missionToEdit = allMissions.find(
      (m) => String(m.id) === String(editingMissionId),
    );

    if (missionToEdit) {
      const targetRadio = document.querySelector(
        `input[name="missionType"][value="${missionToEdit.type}"]`,
      );

      if (focusToggleButton) {
        const isFocus = missionToEdit.focusMode === true;
        focusToggleButton.setAttribute("aria-checked", isFocus);
        if (isFocus) {
          focusToggleButton.classList.add("toggle__button--active");
        } else {
          focusToggleButton.classList.remove("toggle__button--active");
        }
      }

      if (missionMainTitle) {
        missionMainTitle.value = missionToEdit.title;
      }

      if (targetRadio) {
        targetRadio.checked = true;
        targetRadio.parentElement.classList.add("mission-types--active");
      }

      let stepListInputs = document.querySelectorAll(".list-item__input");
      let setTimeButtons = document.querySelectorAll(".set-time__button");

      missionToEdit.steps.forEach((step, index) => {
        if (!stepListInputs[index]) {
          const stepList = document.getElementById("stepList");
          const addStepButton = document.getElementById("addStepButton");
          const firstRow = stepListInputs[0].closest(".breakdown__list-item");
          const clonedRow = firstRow.cloneNode(true);

          clonedRow.querySelector(".list-item__input").value = "";

          const timeSpan =
            clonedRow.querySelector(".set-time__button span") ||
            clonedRow.querySelector(".set-time__button");
          if (timeSpan) timeSpan.textContent = "SET TIME";

          const numberSpan = clonedRow.querySelector(".list-item__number");
          if (numberSpan) {
            numberSpan.textContent = String(index + 1).padStart(2, "0");
          }

          stepList.insertBefore(clonedRow, addStepButton);

          stepListInputs = document.querySelectorAll(".list-item__input");
          setTimeButtons = document.querySelectorAll(".set-time__button");
        }

        // HATA 3 ÇÖZÜMÜ: stepInputs yerine doğru isim olan stepListInputs kullanıldı.
        if (stepListInputs[index]) {
          stepListInputs[index].value = step.name;
        }

        if (setTimeButtons[index]) {
          // Bazen span içindedir, bazen butonun kendisidir. Fail-safe (güvenli) yaklaşım:
          const timeSpan =
            setTimeButtons[index].querySelector("span") ||
            setTimeButtons[index];
          if (timeSpan) {
            timeSpan.textContent = step.time;
          }
        }
      });
      updateStepNumbers();
    }

    if (submitButton) submitButton.textContent = "UPDATE MISSION";
  } else if (tempMissionTitle) {
    if (missionMainTitle) {
      missionMainTitle.value = tempMissionTitle;
    }
    localStorage.removeItem("tempMissionTitle");
  }
  updateStepNumbers();
}

function createMissionCard(mission) {
  const missionCardTemplate = document.getElementById("missionCardTemplate");
  const cardStepTemplate = document.getElementById("cardStepTemplate");
  const cardClone = missionCardTemplate.content.cloneNode(true);
  const cardElement = cardClone.querySelector(".mission-card");
  const cardHeader = cardElement.querySelector(".mission-card__header");
  const titleElement = cardElement.querySelector(".mission-card__title");
  const focusBadge = cardElement.querySelector(".focus__badge");
  const toggleIcon = cardElement.querySelector(".mission-card__toggle-icon");
  const typeElement = cardElement.querySelector(".mission-card__type");
  const cardBody = cardElement.querySelector(".mission-card__body");
  const ulElement = cardElement.querySelector(".mission-card__list");
  const updateButton = cardElement.querySelector(".update__button");
  const completeAllButton = cardElement.querySelector(".complete-all__button");
  const removeButton = cardElement.querySelector(".remove__button");

  cardElement.id = `missionCard-${mission.id}`;
  titleElement.textContent = mission.title;
  typeElement.textContent = mission.type;

  if (mission.focusMode === true) {
    focusBadge.classList.remove("hidden");
  }

  mission.steps.forEach((step) => {
    const stepClone = cardStepTemplate.content.cloneNode(true);
    const stepCheckbox = stepClone.querySelector(".list-item__checkbox");
    const stepText = stepClone.querySelector(".list-item__text");
    const stepTime = stepClone.querySelector(".list-item__time");

    stepText.textContent = step.name;
    stepTime.textContent = step.time;
    stepCheckbox.checked = step.completed;

    ulElement.appendChild(stepClone);
  });

  const cardCheckboxes = cardElement.querySelectorAll(".list-item__checkbox");

  updateCardContent(cardElement, mission);
  updateProgress(cardElement);

  cardHeader?.addEventListener("click", () => {
    toggleIcon.classList.toggle("rotate");
    cardBody.classList.toggle("hidden");
  });

  cardCheckboxes?.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateProgress(cardElement);
      if (typeof checkGeneralEmptyState === "function")
        checkGeneralEmptyState();
    });
  });

  updateButton?.addEventListener("click", () => {
    localStorage.setItem("editingMissionId", mission.id);
    window.location.href = "startmission.html";
  });

  completeAllButton?.addEventListener("click", () => {
    const isAllChecked = Array.from(cardCheckboxes).every(
      (cb) => cb.checked === true,
    );

    if (isAllChecked) {
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
    updatedMissions = updatedMissions.filter(
      (m) => String(m.id) !== String(mission.id),
    );
    localStorage.setItem("allMissions", JSON.stringify(updatedMissions));

    showStatusMessage("Mission removed successfully.");
    checkGeneralEmptyState();
  });

  return cardElement;
}

function renderMissions() {
  const activeMissions = document.getElementById("activeMissions");
  const completedMissions = document.getElementById("completedMissions");
  const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];

  if (!activeMissions || !completedMissions) return;

  allMissions.forEach((mission) => {
    const card = createMissionCard(mission);
    const targetContainer =
      mission.status === "completed" ? completedMissions : activeMissions;
    targetContainer.appendChild(card);
  });
  checkGeneralEmptyState();
}

function renderFocusMissions() {
  const focusList = document.getElementById("focusList");
  const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];
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

function renderCurrentStrategy() {
  const currentStrategy = document.getElementById("currentStrategy");
  const activeStrategy =
    localStorage.getItem("activeStrategy") || "NO STRATEGY SELECTED";
  if (!currentStrategy) return;

  currentStrategy.textContent = activeStrategy;
}

function renderQuote() {
  if (quotesData.length === 0) return;

  const currentQuote = quotesData[currentIndex];
  const textElement = document.getElementById("quoteText");
  const authorElement = document.getElementById("quoteAuthor");

  if (textElement && authorElement) {
    textElement.textContent = `"${currentQuote.q}"`;
    authorElement.textContent = `${currentQuote.a.toUpperCase()}`;
  }
}

function cycleQuote() {
  currentIndex++;

  if (currentIndex >= quotesData.length) {
    fetchQuotes();
  } else {
    renderQuote();
  }
}

async function fetchQuotes() {
  try {
    const proxy = "https://corsproxy.io/?";
    const apiUrl = "https://zenquotes.io/api/quotes/";

    const response = await fetch(proxy + encodeURIComponent(apiUrl));
    if (!response.ok) throw new Error("Fetching failed");

    quotesData = await response.json();
    currentIndex = 0;
    renderQuote();
  } catch (error) {
    console.error(
      "[FetchQuotes Error] Failed to load quotes from API:",
      error.message,
    );
  }
}

// EVENT LISTENERS

document.addEventListener("DOMContentLoaded", () => {
  const mainInitiateLink = document.getElementById("mainInitiateLink");
  const activeMissions = document.getElementById("activeMissions");
  const missionMainTitle = document.getElementById("missionMainTitle");
  const focusList = document.getElementById("focusList");
  const isMissionsPage = activeMissions;
  const isFormPage = missionMainTitle;
  const urlParams = window.location.search;

  if (mainInitiateLink) {
    fetchQuotes();
    setInterval(cycleQuote, updateInterval);
  }
  if (focusList) {
    renderFocusMissions();
    renderCurrentStrategy();
    updateMissionCompletionRate();
    updateTimeProgress();
  }
  if (isMissionsPage) {
    renderMissions();
  }
  if (isFormPage) {
    initFormPage();
  }
  if (urlParams.includes("updated=true")) {
    showStatusMessage("Mission updated successfully!");
  } else if (urlParams.includes("created=true")) {
    showStatusMessage("New mission initiated!");
  }
});

mainInitiateLink?.addEventListener("click", function (event) {
  event.preventDefault();
  const targetValue = document.getElementById("createMissionInput").value;
  localStorage.setItem("tempMissionTitle", targetValue);

  window.location.href = this.href;
});

activeButton?.addEventListener("click", () => switchTab("active"));

completedButton?.addEventListener("click", () => switchTab("completed"));

focusToggleButton?.addEventListener("click", toggleFocusMode);

breakdownList?.addEventListener("click", (e) => timeSelection(e));

hourUpButton?.addEventListener("click", () => adjustTime("hour", 1));

hourDownButton?.addEventListener("click", () => adjustTime("hour", -1));

minuteUpButton?.addEventListener("click", () => adjustTime("minute", 5));

minuteDownButton?.addEventListener("click", () => adjustTime("minute", -5));

timePickerButton?.addEventListener("click", timePicker);

stepList?.addEventListener("click", (e) => deleteStep(e));

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
    const selectedType = document.querySelector(
      'input[name="missionType"]:checked',
    );
    const atomicStepsArray = [];
    const stepInputs = document.querySelectorAll(".list-item__input");
    const allMissions = JSON.parse(localStorage.getItem("allMissions")) || [];
    const editingMissionId = localStorage.getItem("editingMissionId");

    stepInputs.forEach((input) => {
      const stepName = input.value.trim();
      const parentRow = input.closest(".breakdown__list-item");
      const timeButton = parentRow.querySelector(".set-time__button");
      let selectedTime = timeButton.textContent.trim();

      atomicStepsArray.push({
        name: stepName,
        time: selectedTime,
        completed: false,
      });
    });

    if (editingMissionId) {
      const missionIndex = allMissions.findIndex(
        (m) => String(m.id) === String(editingMissionId),
      );

      if (missionIndex !== -1) {
        const oldSteps = allMissions[missionIndex].steps || [];
        atomicStepsArray.forEach((newStep, index) => {
          if (oldSteps[index]) {
            newStep.completed = oldSteps[index].completed;
          }
        });
        allMissions[missionIndex].title = missionMainTitle.value.trim();
        allMissions[missionIndex].focusMode =
          focusToggleButton?.getAttribute("aria-checked") === "true";
        allMissions[missionIndex].type = selectedType.value;
        allMissions[missionIndex].steps = atomicStepsArray;
      }
      localStorage.removeItem("editingMissionId");
      window.location.href = "missions.html?updated=true";
    } else {
      const missionData = {
        id: Date.now().toString(),
        title: missionMainTitle.value.trim(),
        focusMode: focusToggleButton?.getAttribute("aria-checked") === "true",
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
