import "../lib/ssr.ts";
// ^ ssr has to be imported before quill
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Signal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import Quill from "quill";
import { Card } from "../lib/model.ts";

interface CardEditorProps {
  card: Card;
}

function CardEditor({ card }: CardEditorProps) {
  if (!IS_BROWSER) {
    return null;
  }

  const quillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!quillRef.current) return;

    const quill = new Quill(quillRef.current, {
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
  }, []);

  return (
    <div class="card card-bordered mb-4">
      <div class="card-body">
        <form>
          <input
            type="text"
            name="question"
            placeholder="Question"
            value={card.question}
            class="input input-bordered block w-full mb-2"
          />

          <div ref={quillRef}>{card.answer}</div>

          <div class="card-actions justify-end mt-2">
            <input
              type="submit"
              value="Add"
              class="btn"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

interface CardsEditorProps {
  cardsSignal: Signal<Card[]>;
}

export default function CardsEditor({ cardsSignal }: CardsEditorProps) {
  const cards = cardsSignal.value;

  return (
    <div class="mt-8">
      {cards.map((card) => <CardEditor card={card} />)}
    </div>
  );
}
