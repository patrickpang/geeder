from typing import Annotated

import structlog
from dominate.tags import (
    button,
    div,
    form,
    html_tag,
    option,
    select,
    span,
    style,
    textarea,
)
from dotenv import load_dotenv
from fastapi import APIRouter, Form
from fastapi.responses import HTMLResponse
from groq import AsyncGroq

from anki import Card, deck_input_name, render_card_editors

load_dotenv()  # load groq api key
client = AsyncGroq()

MODEL = "llama-3.1-70b-versatile"

router = APIRouter()
generate_endpoint = "/generate"

log = structlog.get_logger()


def render_form(deck_names: list[str]) -> html_tag:
    with form(
        onreset="llmFormReset()",
        **{"hx-post": generate_endpoint, "hx-target": "#card-editors"},
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
                with select(
                    name=deck_input_name, _class="select select-bordered max-w-sm"
                ):
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


async def get_cards(excerpt: str) -> list[Card]:
    log.info("get_cards start", platform="groq", model=MODEL)

    prompt = """
    <task>Generate multiple anki cards based on <excerpt> from a textbook</task>
    <excerpt>
    %s
    </excerpt>
    <format>
        Only return valid ndjson. 
        One card per line.
        No markdown.
        No introduction.
    </format>
    <example>
    {"question": str, "answer": str}
    </example>
    """ % (excerpt)

    response = await client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            },
        ],
        model=MODEL,
    )

    payload = response.choices[0].message.content
    print(payload)
    cards = [
        Card.model_validate_json(line) for line in payload.splitlines() if line.strip()
    ]
    log.info("get_cards end", count=len(cards))
    return cards


@router.post(generate_endpoint, response_class=HTMLResponse)
async def generate_text(excerpt: Annotated[str, Form()]) -> str:
    cards = await get_cards(excerpt)
    card_editors = render_card_editors(cards)
    return card_editors.render()
