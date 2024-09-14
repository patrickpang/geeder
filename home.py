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
    html_tag,
    img,
    link,
    main,
    meta,
    option,
    p,
    script,
    select,
    span,
    style,
    textarea,
)
from dominate.util import raw
from fastapi import APIRouter
from fastapi.responses import HTMLResponse

import llm
from anki import deck_input_name, get_decks
from anki_connect import anki_connect_health_check

router = APIRouter()
home_endpoint = "/"


def render_head() -> html_tag:
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
            type="text/css",
        )
        script(src="https://cdn.tailwindcss.com")
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


def render_form(deck_names: list[str]) -> html_tag:
    with form(
        **{"hx-post": llm.generate_endpoint, "hx-target": "#card-editors"}
    ) as tag:
        textarea(
            name="excerpt",
            placeholder="Enter excerpt from textbook here",
            _class="textarea textarea-bordered block w-full mb-4",
            rows=5,
            required=True,
            minlength=10,
        )

        with div(_class="flex items-center justify-between"):
            with div():
                with select(name=deck_input_name, _class="select select-bordered"):
                    for deck_name in deck_names:
                        option(deck_name, value=deck_name)

            with div(_class="flex items-center"):
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
                    span(_class="loading loading-dots loading-md loading-indicator")
                    span("Submit")
    return tag


def render_anki_disconnect() -> html_tag:
    with div(role="alert", _class="alert alert-error text-base-100") as tag:
        span("⚠️ Disconnected from Anki!")
    return tag


def render_footer() -> html_tag:
    with footer(_class="mt-8 flex justify-between items-center") as tag:
        p("Made with ❤️ by Patrick", _class="text-sm")
        p("Version: 2024.09.14", _class="text-sm")
    return tag


def add_deck_preference_script() -> html_tag:
    js = """
    document.addEventListener('DOMContentLoaded', (e) => {
        const deckSelector = document.querySelector('select[name="%s"]');

        // Load deck name from local storage if it exists
        const deckName = localStorage.getItem("geeder/deckName");
        if (deckName) {
            deckSelector.value = deckName;
        }

        // Update local storage when the deck selector changes
        deckSelector.addEventListener('change', (e) => {
            const deckName = deckSelector.value;
            localStorage.setItem("geeder/deckName", deckName);
        });
    });
    """ % (deck_input_name)
    return script(raw(js))


@router.get(home_endpoint, response_class=HTMLResponse)
async def homepage() -> str:
    is_connected = await anki_connect_health_check()
    deck_names = await get_decks()

    doc = dominate.document(title="Geeder")

    with doc:
        render_head()

        with body(_class="mx-16 lg:mx-64 mt-16"):
            render_header()

            with main():
                if is_connected:
                    render_form(deck_names)
                    # TODO: handle error
                    div(id="card-editors", _class="mt-8")
                else:
                    render_anki_disconnect()

            render_footer()

            script(src="https://unpkg.com/htmx.org@1.9.12")
            if is_connected:
                add_deck_preference_script()

    return doc.render()
