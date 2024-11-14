import { JSX } from "preact/jsx-runtime";

interface Payload {
  excerpt: string;
}

interface Card {
  question: string;
  answer: string;
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

export default function ExcerptInput() {
  const onSubmit: JSX.SubmitEventHandler<HTMLFormElement> = async (
    e,
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = (Object.fromEntries(formData) as object) as Payload;
    const cards = await generateCards(payload);
    console.log({ cards });
  };

  return (
    <form onSubmit={onSubmit}>
      <textarea
        name="excerpt"
        placeholder="Enter excerpt from textbook here"
        className="textarea textarea-bordered block w-full mb-4"
        rows={5}
        required
        minLength={10}
      />

      <div className="flex items-center justify-between">
        {
          /* <div>
          <select
            name={deckInputName}
            className="select select-bordered max-w-sm"
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

        <div className="flex items-center">
          <button
            type="reset"
            className="btn btn-ghost mr-2"
          >
            Clear
          </button>

          <button
            type="submit"
            className="btn"
          >
            <span className="loading loading-dots loading-md loading-indicator" />
            <span>Submit</span>
          </button>
        </div>
      </div>
    </form>
    // TODO: show error message here
  );
}
