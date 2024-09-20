function initQuill(form) {
  const container = form.querySelector(`.${quillContainerClass}`);
  // init quill editor
  const quill = new Quill(container, {
    theme: "snow",
    placeholder: "Answer",
    formats: [
      "bold",
      "italic",
      "underline",
      "strike",
      "script",
      "list",
      "image",
    ],
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image", "clean"],
      ],
    },
  });
  // append quill content on form submit
  form.addEventListener("formdata", (event) => {
    const answer = quill.getSemanticHTML();
    console.log(answer);
    event.formData.append("answer", answer);
  });
}

document.addEventListener("DOMContentLoaded", (e) => {
  const forms = document.querySelectorAll(`.${cardEditorClass} form`);
  for (const form of forms) {
    initQuill(form);
  }
});

htmx.on("htmx:afterSettle", (e) => {
  const targetContainer = e.target;
  const forms = targetContainer.querySelectorAll(`.${cardEditorClass} form`);
  for (const form of forms) {
    initQuill(form);
  }
});
