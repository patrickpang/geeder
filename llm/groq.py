from typing import AsyncIterator
from groq import AsyncGroq

client = AsyncGroq()

MODEL = "llama3-70b-8192"
PROMPT = "Create multiple Anki cards from below text. Return front and back on separate lines."


async def get_cards(excerpt: str) -> str:
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

    return response.choices[0].message.content

async def get_cards_streaming(excerpt: str) -> AsyncIterator[str]:
    async for chunk in await client.chat.completions.create(
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
        stream=True,
    ):
        yield chunk.choices[0].delta.content