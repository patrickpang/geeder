from fastapi import APIRouter

router = APIRouter()

dummy_delete_endpoint = "/dummy-delete"


@router.delete(dummy_delete_endpoint)
async def dummy_delete() -> dict[str, bool]:
    """Dummy delete endpoint for htmx to remove element."""
    return {"success": True}
