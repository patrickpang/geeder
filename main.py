import os
import webbrowser

import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

import anki
import home
import llm

app = FastAPI()
app.mount(
    "/static",
    StaticFiles(
        directory=os.path.join(os.path.dirname(__file__), "static")
    ),  # works with embedded resources
    name="static",
)
app.include_router(home.router)
app.include_router(llm.router)
app.include_router(anki.router)

if __name__ == "__main__":
    webbrowser.open_new("http://localhost:20245/")
    uvicorn.run(app, host="localhost", port=20245)
