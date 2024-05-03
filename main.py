from typing import Annotated

import dominate
from dominate.tags import (
    body,
    button,
    div,
    footer,
    form,
    h1,
    head,
    header,
    link,
    main,
    p,
    script,
    span,
    style,
    textarea,
)
from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse, PlainTextResponse

from llm.groq import get_cards

app = FastAPI()


@app.get("/", response_class=HTMLResponse)
async def home_page() -> str:
    doc = dominate.document(title="Geeder")

    with doc:
        with head():
            link(
                href="https://cdn.jsdelivr.net/npm/daisyui@4.10.5/dist/full.min.css",
                rel="stylesheet",
                type="text/css",
            )
            script(src="https://cdn.tailwindcss.com")

        with body(_class="mx-16 lg:mx-64 mt-16"):
            with header(_class="mb-8"):
                h1("Geeder", _class="text-4xl font-bold mb-2")
                p("Your study copilot with Anki cards")

            with main():
                # input
                with form(**{"hx-post": "/generate", "hx-target": "#output-message"}):
                    textarea(
                        name="excerpt",
                        placeholder="Enter excerpt from textbook here",
                        _class="textarea textarea-bordered block w-full mb-4",
                        rows=5,
                        required=True,
                        minlength=10,
                    )
                    with div(_class="text-right"):
                        with button(type="submit", _class="btn block"):
                            style(
                                """
                                .loading-indicator{
                                    display:none;
                                }
                                .htmx-request .loading-indicator{
                                    display:inline;
                                }
                                .htmx-request.loading-indicator{
                                    display:inline;
                                }
                                """
                            )
                            span(
                                _class="loading loading-dots loading-md loading-indicator"
                            )
                            span("Submit")
                # output
                div(
                    "Response will appear here",
                    id="output-message",
                    _class="whitespace-pre-wrap alert mt-8",
                    style="padding: 1.5rem",  # override .alert from daisyUI
                )

            with footer(_class="mt-8"):
                p("Made with ❤️ by Patrick", _class="text-sm")

            script(src="https://unpkg.com/htmx.org@1.9.12")

    return doc.render()


@app.post("/generate", response_class=PlainTextResponse)
async def generate_text(excerpt: Annotated[str, Form()]) -> str:
    response = await get_cards(excerpt)
    return response
