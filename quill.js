document.addEventListener("DOMContentLoaded", (e) => {
  const forms = document.querySelectorAll(`.${cardEditorClass} form`);
  for (const form of forms) {
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
        "blockquote",
        "indent",
        "list",
        "align",
        "image",
      ],
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "image", "clean"],
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
});
