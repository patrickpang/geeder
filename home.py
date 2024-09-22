from pathlib import Path

import dominate
from dominate.tags import (
    body,
    div,
    footer,
    h1,
    head,
    header,
    html_tag,
    img,
    link,
    main,
    meta,
    p,
    script,
    span,
    style,
)
from dominate.util import raw
from fastapi import APIRouter
from fastapi.responses import HTMLResponse

from anki import (
    add_quill_init_script,
    deck_input_name,
    get_decks,
    render_new_card_editor,
)
from anki_connect import anki_connect_health_check
from llm import render_form

router = APIRouter()
home_endpoint = "/"


def render_head(is_connected: bool) -> html_tag:
    with head() as tag:
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
            href="https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css",
            rel="stylesheet",
        )
        script(src="https://cdn.tailwindcss.com")

        if is_connected:
            # quill
            link(
                href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css",
                rel="stylesheet",
            )
            style(
                """
                .ql-editor {
                  font-size: 0.875rem;
                }
                """
            )

    return tag


def render_header() -> html_tag:
    with header(_class="mb-8") as tag:
        with div(_class="flex items-center mb-2"):
            img(
                src="/static/android-chrome-512x512.png",
                alt="Geeder logo",
                _class="w-12 mr-2",
            )
            h1("Geeder", _class="text-4xl font-bold")
        p("Your study copilot with Anki cards")
    return tag


def render_anki_disconnect() -> html_tag:
    with div(role="alert", _class="alert alert-error text-base-100") as tag:
        span("⚠️ Disconnected from Anki!")
    return tag


def render_footer() -> html_tag:
    with footer(_class="mt-8 flex justify-between items-center") as tag:
        p("Made with ❤️ by Patrick", _class="text-sm")
        p("Version: 2024.09.22", _class="text-sm")
    return tag


def add_deck_preference_script() -> html_tag:
    vars = f"const deckInputName = {repr(deck_input_name)};"
    js = (Path(__file__).parent / "resources" / "deck_preference.js").read_text()
    return script(raw(vars + js))


@router.get(home_endpoint, response_class=HTMLResponse)
async def homepage() -> str:
    is_connected = await anki_connect_health_check()
    deck_names = await get_decks()

    doc = dominate.document(title="Geeder")

    with doc:
        render_head(is_connected)

        with body(_class="mx-16 lg:mx-64 mt-16"):
            render_header()

            with main():
                if is_connected:
                    render_form(deck_names)
                    # TODO: handle error
                    div(id="card-editors", _class="mt-8")
                    render_new_card_editor()
                else:
                    render_anki_disconnect()

            render_footer()

            script(src="https://unpkg.com/htmx.org@2.0.2")
            if is_connected:
                script(src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js")
                add_deck_preference_script()
                add_quill_init_script()
                script(src="/static/reset.js")

    return doc.render()
