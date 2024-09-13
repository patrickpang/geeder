import os
import webbrowser
from typing import Annotated

import dominate
import uvicorn
from dominate.tags import (
    body,
    button,
    div,
    footer,
    form,
    h1,
    head,
    header,
    img,
    link,
    main,
    meta,
    p,
    script,
    span,
    style,
    textarea,
)
from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from anki.anki import Card
from llm.groq import get_cards

app = FastAPI()
app.mount(
    "/static",
    StaticFiles(
        directory=os.path.join(os.path.dirname(__file__), "static")
    ),  # works with embedded resources
    name="static",
)


@app.get("/", response_class=HTMLResponse)
async def home_page() -> str:
    doc = dominate.document(title="Geeder")

    with doc:
        with head():
            # favicons
            # Ref: https://realfavicongenerator.net/
            link(
                rel="apple-touch-icon",
                sizes="180x180",
                href="/static/apple-touch-icon.png",
            )
            link(
                rel="icon",
                type="image/png",
                sizes="32x32",
                href="/static/favicon-32x32.png",
            )
            link(
                rel="icon",
                type="image/png",
                sizes="16x16",
                href="/static/favicon-16x16.png",
            )
            link(rel="manifest", href="/static/site.webmanifest")
            link(rel="shortcut icon", href="/static/favicon.ico")
            link(rel="mask-icon", href="/static/safari-pinned-tab.svg", color="#5bbad5")
            meta(name="msapplication-TileColor", content="#da532c")
            meta(name="theme-color", content="#ffffff")

            # tailwind + daisyUI
            link(
                href="https://cdn.jsdelivr.net/npm/daisyui@4.10.5/dist/full.min.css",
                rel="stylesheet",
                type="text/css",
            )
            script(src="https://cdn.tailwindcss.com")

        with body(_class="mx-16 lg:mx-64 mt-16"):
            with header(_class="mb-8"):
                with div(_class="flex items-center mb-2"):
                    img(
                        src="/static/android-chrome-512x512.png",
                        alt="Geeder logo",
                        _class="w-12 mr-2",
                    )
                    h1("Geeder", _class="text-4xl font-bold")
                p("Your study copilot with Anki cards")

            with main():
                # TODO: handle error
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
                        button("Clear", _class="btn btn-ghost mr-2", type="reset")

                        with button(type="submit", _class="btn"):
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

            with footer(_class="mt-8 flex justify-between items-center"):
                p("Made with ❤️ by Patrick", _class="text-sm")
                p("Version: 2024.09.13", _class="text-sm")

            script(src="https://unpkg.com/htmx.org@1.9.12")

    return doc.render()


@app.post("/generate")
async def generate_text(excerpt: Annotated[str, Form()]) -> list[Card]:
    cards = await get_cards(excerpt)
    return cards


if __name__ == "__main__":
    webbrowser.open_new("http://localhost:20245/")
    uvicorn.run(app, host="localhost", port=20245)
