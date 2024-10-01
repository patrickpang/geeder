function loadPersistentInput(inputName) {
  const selectInput = document.querySelector(`select[name="${inputName}"]`);
  const value = localStorage.getItem(`geeder/${inputName}`);
  if (value) {
    selectInput.value = value;
  }
}

function listentPersistentInput(inputName) {
  const selectInput = document.querySelector(`select[name="${inputName}"]`);
  selectInput.addEventListener("change", () => {
    const value = selectInput.value;
    localStorage.setItem(`geeder/${inputName}`, value);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadPersistentInput(deckInputName);
  loadPersistentInput(platformInputName);
  listentPersistentInput(deckInputName);
  listentPersistentInput(platformInputName);
});
