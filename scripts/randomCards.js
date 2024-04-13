document.addEventListener("DOMContentLoaded", function () {
  const randomizeButton = document.getElementById("randomiseButton");
  randomizeButton.addEventListener("click", handleRandomizeClick);
});

async function handleRandomizeClick() {
  try {
    // Mission Cards
    const missionData = await fetchData("../assets/cards-db/mission.json");
    const selectedMissionCards = selectRandomCards(missionData, 3);
    displayCards(
      selectedMissionCards,
      ".card-container.mission-cards",
      "super-mission-card"
    );

    // Assessment Cards
    const assessmentData = await fetchData(
      "../assets/cards-db/assessment.json"
    );
    const categories = [
      "Who is assessed",
      "The assessor",
      "Assessment artefact",
      "Assessment format",
      "Context",
      "Assessment timing",
    ];
    const selectedAssessmentCards = categories.map((category) =>
      selectCardByCategory(assessmentData, category)
    );
    displayCards(
      selectedAssessmentCards,
      ".card-container.assessment-cards",
      "super-assessment-card"
    );
  } catch (error) {
    console.error("Error loading card data:", error);
    displayErrorMessage(
      "An error occurred while loading card data. Please try again."
    );
  }
}

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

function selectRandomCards(cards, count) {
  const shuffled = shuffleArray([...cards]); // Create a shallow copy and shuffle
  return shuffled.slice(0, count);
}

function selectCardByCategory(cards, category) {
  const filteredCards = cards.filter(
    (card) => card["card-category"] === category
  );
  return selectRandomCards(filteredCards, 1)[0];
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function displayCards(cards, containerSelector, elementTagName) {
  const container = document.querySelector(containerSelector);
  container.innerHTML = "";
  cards.forEach((card) => {
    if (card) {
      const cardElement = createCardElement(card, elementTagName);
      container.appendChild(cardElement);
    }
  });
}

function createCardElement(card, elementTagName) {
  const cardElement = document.createElement(elementTagName);
  Object.keys(card).forEach((key) => {
    cardElement.setAttribute(key, card[key]);
  });
  return cardElement;
}

function displayErrorMessage(message) {
  alert(message);
}
