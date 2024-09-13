import yaml
from dotenv import load_dotenv
from groq import AsyncGroq

from anki.anki import Card

load_dotenv()  # load groq api key
client = AsyncGroq()

MODEL = "llama-3.1-70b-versatile"
PROMPT = "You are a robot that takes excerpt from textbook as input, and return multiple Anki cards. Card schema is 'question: str, answer: str'. Just return list of cards in YAML. No quotes."


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
