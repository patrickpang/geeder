import { IS_BROWSER } from "$fresh/runtime.ts";
import { Signal, useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import type Quill from "quill";
import { Card } from "../lib/model.ts";

interface CardEditorProps {
  card: Card;
}

async function createCards(payload: Card): Promise<void | null> {
  try {
    const response = await fetch("/cards/create", {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "same-origin",
    });
    if (!response.ok) {
      console.error({
        statusCode: response.status,
        error: await response.text(),
      });
      return null;
    }

    await response.json();
    return;
  } catch (error) {
    console.error({ error });
    return null;
  }
}

function CardEditor({ card }: CardEditorProps) {
  if (!IS_BROWSER) {
    return null;
  }

  const state = useSignal<
    "editing" | "submitting" | "success" | "error"
  >(
    "editing",
  );

  const quillContainerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill>();

  useEffect(async () => {
    if (!quillContainerRef.current) return;

    const Quill = (await import("quill")).default;

    quillRef.current = new Quill(quillContainerRef.current, {
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

  const onSubmit: JSX.SubmitEventHandler<HTMLFormElement> = async (
    e,
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const answer = quillRef.current ? quillRef.current.getSemanticHTML() : "";
    const payload = {
      ...(Object.fromEntries(formData) as object),
      id: card.id,
      answer,
    } as Card;
    const result = await createCards(payload);
    if (result !== null) {
      state.value = "success";
    }
  };

  switch (state.value) {
    case "editing":
      return (
        <div class="card card-bordered mb-4">
          <div class="card-body">
            <form onSubmit={onSubmit}>
              <input
                type="text"
                name="question"
                placeholder="Question"
                value={card.question}
                class="input input-bordered block w-full mb-2"
              />

              <div ref={quillContainerRef}>{card.answer}</div>

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

    case "success":
      return (
        <div
          role="alert"
          class="alert alert-success text-base-100"
        >
          <span>✔ Uploaded card successfully!</span>
        </div>
      );

    default:
      return null;
  }
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
