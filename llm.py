from typing import Annotated

import structlog
import yaml
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
PROMPT = "You are a robot that takes excerpt from textbook as input, and return multiple Anki cards. Card schema is 'question: str, answer: str'. Just return list of cards in YAML. No quotes."

router = APIRouter()
generate_endpoint = "/generate"

log = structlog.get_logger()


def render_form(deck_names: list[str]) -> html_tag:
    with form(**{"hx-post": generate_endpoint, "hx-target": "#card-editors"}) as tag:
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
                    name=deck_input_name, _class="select select-bordered max-w-md"
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
    response = await client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": PROMPT,
            },
            {
                "role": "user",
                "content": excerpt,
            },
        ],
        model=MODEL,
    )

    payload = response.choices[0].message.content
    print(payload)
    records = yaml.safe_load(payload)
    cards = [Card.model_validate(record) for record in records]
    log.info("get_cards end", count=len(cards))
    return cards


@router.post(generate_endpoint, response_class=HTMLResponse)
async def generate_text(excerpt: Annotated[str, Form()]) -> str:
    cards = await get_cards(excerpt)
    card_editors = render_card_editors(cards)
    return card_editors.render()
