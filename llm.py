from typing import Annotated

import structlog
import yaml
from dotenv import load_dotenv
from fastapi import APIRouter, Form
from fastapi.responses import HTMLResponse
from groq import AsyncGroq

from anki import Card, render_card_editors

load_dotenv()  # load groq api key
client = AsyncGroq()

MODEL = "llama-3.1-70b-versatile"
PROMPT = "You are a robot that takes excerpt from textbook as input, and return multiple Anki cards. Card schema is 'question: str, answer: str'. Just return list of cards in YAML. No quotes."

router = APIRouter()
generate_endpoint = "/generate"

log = structlog.get_logger()


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
