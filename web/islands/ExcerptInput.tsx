import { Signal, useSignal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { Card } from "../lib/model.ts";

interface Payload {
  excerpt: string;
}

interface Props {
  cardsSignal: Signal<Card[]>;
}

async function generateCards(payload: Payload): Promise<Card[] | null> {
  try {
    const response = await fetch("/llm/ask", {
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

    const data = await response.json();
    const cards = data["cards"];
    return cards;
  } catch (error) {
    console.error({ error });
    return null;
  }
}

export default function ExcerptInput({ cardsSignal }: Props) {
  const stateSignal = useSignal<"editing" | "submitting">("editing");

  const onSubmit: JSX.SubmitEventHandler<HTMLFormElement> = async (
    e,
  ) => {
    stateSignal.value = "submitting";

    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = (Object.fromEntries(formData) as object) as Payload;
    const cards = await generateCards(payload);
    if (cards !== null) {
      cardsSignal.value = cards;
    }

    stateSignal.value = "editing";
  };

  const onReset: JSX.GenericEventHandler<HTMLFormElement> = (_e) => {
    cardsSignal.value = [];
  };

  return (
    <form onSubmit={onSubmit} onReset={onReset}>
      <textarea
        name="excerpt"
        placeholder="Enter excerpt from textbook here"
        class="textarea textarea-bordered block w-full mb-4"
        rows={5}
        required
        minLength={10}
      />

      <div class="flex items-center justify-between">
        {
          /* <div>
          <select
            name={deckInputName}
            class="select select-bordered max-w-sm"
          >
            {deckNames.map((deckName) => (
              <option key={deckName} value={deckName}>
                {deckName}
              </option>
            ))}
          </select>
        </div> */
        }
        <div></div>

        <div class="flex items-center">
          <button
            type="reset"
            class="btn btn-ghost mr-2"
          >
            Clear
          </button>

          <button
            type="submit"
            class="btn"
            disabled={stateSignal.value === "submitting"}
          >
            {stateSignal.value === "submitting" && (
              <span class="loading loading-dots loading-md loading-indicator" />
            )}
            <span>Submit</span>
          </button>
        </div>
      </div>
    </form>
    // TODO: show error message here
  );
}
