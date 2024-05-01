from typing import Annotated

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
    pre,
    script,
    textarea,
)
from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse

from llm.groq import get_cards

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
async def generate_segment(excerpt: Annotated[str, Form()]) -> str:
    response = await get_cards(excerpt)

    segment = pre()
    with segment:
        p(response)
    return segment.render()
