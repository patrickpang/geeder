function initQuill(form) {
  const container = form.querySelector(`.${quillContainerClass}`);
  // init quill editor
  const quill = new Quill(container, {
    theme: "snow",
    placeholder: "Answer",
    formats: ["bold", "italic", "underline", "script", "list", "image"],
    modules: {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image", "clean"],
      ],
    },
  });
  // append quill content on form submit
  form.addEventListener("formdata", (event) => {
    const answer = quill.getSemanticHTML();
    event.formData.append("answer", answer);
  });
}

// init quill for new card editor
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#new-card-editor form");
  initQuill(form);
});

// init quill for generated card editor
htmx.on("htmx:afterSettle", (e) => {
  const targetContainer = e.detail.target;
  const forms = targetContainer.querySelectorAll(`.${cardEditorClass} form`);
  for (const form of forms) {
    initQuill(form);
  }
});
