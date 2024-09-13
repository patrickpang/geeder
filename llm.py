from typing import Annotated

import yaml
from dotenv import load_dotenv
from fastapi import APIRouter, Form
from groq import AsyncGroq

from anki import Card

load_dotenv()  # load groq api key
client = AsyncGroq()

MODEL = "llama-3.1-70b-versatile"
PROMPT = "You are a robot that takes excerpt from textbook as input, and return multiple Anki cards. Card schema is 'question: str, answer: str'. Just return list of cards in YAML. No quotes."

router = APIRouter()
generate_endpoint = "/generate"


async def get_cards(excerpt: str) -> list[Card]:
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
    records = yaml.safe_load(payload)
    cards = [Card.model_validate(record) for record in records]
    return cards


@router.post(generate_endpoint)
async def generate_text(excerpt: Annotated[str, Form()]) -> list[Card]:
    cards = await get_cards(excerpt)
    return cards
