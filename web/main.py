import dominate
from dominate.tags import (
    body,
    div,
    footer,
    form,
    h1,
    header,
    input_,
    main,
    p,
    script,
    textarea,
)
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()


@app.get("/", response_class=HTMLResponse)
async def home_page() -> str:
    doc = dominate.document(title="Geeder")

    with doc:
        with body():
            with header():
                h1("Geeder")
                p("Your study copilot with Anki cards")

            with main():
                # input
                with form(**{"hx-post": "/generate", "hx-target": "#output-message"}):
                    textarea(
                        name="excerpt", placeholder="Enter excerpt from textbook here"
                    )
                    input_(type="submit", value="Submit")
                # output
                div(id="output-message")

            with footer():
                p("Made with ❤️ by Patrick")

            script(src="https://unpkg.com/htmx.org@1.9.12")

    return doc.render()


@app.post("/generate", response_class=HTMLResponse)
async def generate_segment() -> str:
    segment = div()
    with segment:
        p("Generating Anki cards...")
        p("Anki cards generated!")
    return segment.render()
