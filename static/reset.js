function newCardEditorFormAfterRequest(event) {
  if (event.detail.successful) clearNewCardEditor();
}

function llmFormReset() {
  // put us next in the event loop after form submit
  setTimeout(() => {
    loadDeckPreference();
    clearCardEditors();
    clearNewCardEditor();
  }, 0);
}

function clearCardEditors() {
  const container = document.querySelector("#card-editors");
  container.innerHTML = "";
}

function clearNewCardEditor() {
  const form = document.querySelector("#new-card-editor form");
  form.reset();

  const container = form.querySelector(`.${quillContainerClass}`);
  const quill = new Quill(container);
  quill.setText("");
}
