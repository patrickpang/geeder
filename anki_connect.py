from pathlib import Path
from typing import Any

import structlog
from aiohttp import ClientSession

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


def get_client_session() -> ClientSession:
    return ClientSession(raise_for_status=True)


async def anki_connect_health_check() -> bool:
    async with get_client_session() as session:
        response = await session.get(api_url, raise_for_status=False)
        await response.text()
    is_connected = response.status == 200
    log.info("anki_connect_health_check", is_connected=is_connected)
    return is_connected


async def anki_connect_call(action: str, **kwargs) -> Any:
    payload = {
        "action": action,
        "params": kwargs,
        "version": 6,
    }
    log.info("anki_connect_call", action=action)

    async with get_client_session() as session:
        response = await session.post(api_url, json=payload)
        data = await response.json()
    if data["error"]:
        raise RuntimeError(data["error"])

    return data["result"]
