from pathlib import Path
from typing import Any

import structlog
from aiohttp import ClientSession
from dominate.tags import button, div, form, html_tag, input_, textarea
from pydantic import BaseModel


class Card(BaseModel):
    question: str
    answer: str


log = structlog.get_logger()


def get_api_url() -> str:
    is_inside_docker = Path("/.dockerenv").exists()
    if is_inside_docker:
        api_url = "http://host.docker.internal:8765"
    else:
        api_url = "http://localhost:8765"

    log.info("get_api_url", is_inside_docker=is_inside_docker, api_url=api_url)
    return api_url


api_url = get_api_url()


async def anki_connect_health_check(session: ClientSession) -> bool:
    response = await session.get(api_url, raise_for_status=False)
    await response.text()
    is_healthy = response.status == 200
    return is_healthy


async def anki_connect_call(session: ClientSession, action: str, **kwargs) -> Any:
    payload = {
        "action": action,
        "params": kwargs,
        "version": 6,
    }
    log.info("anki_connect_call", action=action, params=kwargs)

    response = await session.post(api_url, json=payload)
    data = await response.json()
    if data["error"]:
        raise RuntimeError(data["error"])

    return data["result"]


def render_card_editor(card: Card) -> html_tag:
    with div(_class="card card-bordered	mb-4") as card_editor:
        with div(_class="card-body"):
            with form():
                input_(
                    type="text",
                    name="question",
                    placeholder="Question",
                    value=card.question,
                    _class="input input-bordered block w-full mb-2",
                )
                textarea(
                    card.answer,
                    name="answer",
                    placeholder="Answer",
                    _class="textarea textarea-bordered block w-full mb-2",
                )
                with div(_class="card-actions justify-end"):
                    button(
                        "Delete",
                        _class="btn btn-ghost mr-2",
                        **{
                            "hx-delete": "data:text/html,",
                            "hx-target": "closest .card",
                            "hx-swap": "outerHTML",
                        },
                    )
                    input_(type="submit", value="Add", _class="btn")
    return card_editor


def render_card_editors(cards: list[Card]) -> html_tag:
    with div() as card_editors:
        for card in cards:
            render_card_editor(card)
    return card_editors
