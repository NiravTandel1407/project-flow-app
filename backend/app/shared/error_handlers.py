from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.shared.exceptions import BusinessRuleError, NotFoundError


def register_exception_handlers(app: FastAPI) -> None:
    """Call once in main.py. Same {"detail": "..."} shape as FastAPI's HTTPException."""

    @app.exception_handler(NotFoundError)
    async def not_found_handler(request: Request, exc: NotFoundError):
        return JSONResponse(status_code=404, content={"detail": exc.message})

    @app.exception_handler(BusinessRuleError)
    async def business_rule_handler(request: Request, exc: BusinessRuleError):
        return JSONResponse(status_code=422, content={"detail": exc.message})