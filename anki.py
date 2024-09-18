from typing import Annotated

import structlog
from dominate.tags import button, div, form, html_tag, input_, span, textarea
from fastapi import APIRouter, Form
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

from anki_connect import anki_connect_call


class Card(BaseModel):
    question: str
    answer: str


router = APIRouter()
add_card_endpoint = "/cards/add"
deck_input_name = "deck"

log = structlog.get_logger()


def render_card_editor(card: Card) -> html_tag:
    with div(_class="card card-bordered	mb-4") as card_editor:
        with div(_class="card-body"):
            with form(
                **{
                    "hx-post": add_card_endpoint,
                    "hx-include": f"[name='{deck_input_name}']",
                    "hx-target": "closest .card",
                    "hx-swap": "outerHTML",
                }
            ):
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


def render_new_card_editor() -> html_tag:
    with div() as new_card_editor:
        div(id="new-card-status")
        with div(_class="card card-bordered	mb-4"):
            with div(_class="card-body"):
                with form(
                    **{
                        "hx-post": add_card_endpoint,
                        "hx-include": f"[name='{deck_input_name}']",
                        # unlike card editors, we don't want new card editor to disappear after submit
                        "hx-target": "#new-card-status",
                        # but we want the form to reset after success
                        "hx-on::after-request": "if(event.detail.successful) this.reset()",
                    }
                ):
                    input_(
                        type="text",
                        name="question",
                        placeholder="Question",
                        _class="input input-bordered block w-full mb-2",
                    )
                    textarea(
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
    return new_card_editor


def render_card_editors(cards: list[Card]) -> html_tag:
    with div() as card_editors:
        for card in cards:
            render_card_editor(card)
    return card_editors


def render_success_message() -> html_tag:
    with div(
        role="alert",
        _class="alert alert-success text-base-100",
        **{
            "hx-trigger": "load delay:1s",
            "hx-delete": "data:text/html,",
            "hx-swap": "outerHTML",
        },
    ) as tag:
        span("✔ Added into Anki successfully!")
    return tag


async def get_decks() -> list[str]:
    deck_names = await anki_connect_call("deckNames")
    return deck_names


@router.post(add_card_endpoint, response_class=HTMLResponse)
async def add_card(
    deck: Annotated[str, Form()],
    question: Annotated[str, Form()],
    answer: Annotated[str, Form()],
) -> str:
    # Ref: https://foosoft.net/projects/anki-connect/index.html#note-actions
    note = {
        "deckName": deck,
        "modelName": "Basic",
        "fields": {"Front": question, "Back": answer},
        "tags": ["geeder"],
    }
    log.info("add_card start")
    response = await anki_connect_call("addNotes", notes=[note])
    log.info("add_card end", response=response)
    return render_success_message().render()
