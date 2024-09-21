function loadDeckPreference() {
  const deckSelector = document.querySelector(
    `select[name="${deckInputName}"]`
  );
  const deckName = localStorage.getItem("geeder/deckName");
  if (deckName) {
    deckSelector.value = deckName;
  }
}

function listenDeckPreference() {
  const deckSelector = document.querySelector(
    `select[name="${deckInputName}"]`
  );
  deckSelector.addEventListener("change", () => {
    const deckName = deckSelector.value;
    localStorage.setItem("geeder/deckName", deckName);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadDeckPreference();
  listenDeckPreference();
});
