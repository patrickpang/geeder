document.addEventListener("DOMContentLoaded", (e) => {
  const deckSelector = document.querySelector(
    `select[name="${deckInputName}"]`
  );

  // Load deck name from local storage if it exists
  const deckName = localStorage.getItem("geeder/deckName");
  if (deckName) {
    deckSelector.value = deckName;
  }

  // Update local storage when the deck selector changes
  deckSelector.addEventListener("change", (e) => {
    const deckName = deckSelector.value;
    localStorage.setItem("geeder/deckName", deckName);
  });
});
