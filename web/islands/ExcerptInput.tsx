export default function ExcerptInput() {
  return (
    <form>
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
  );
}
