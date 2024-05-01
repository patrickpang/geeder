import dominate
from dominate.tags import body, footer, form, h1, header, input_, main, p, textarea
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()


@app.get("/", response_class=HTMLResponse)
async def home_route():
    doc = dominate.document(title="Geeder")

    with doc:
        with body():
            with header():
                h1("Geeder")
                p("Your study copilot with Anki cards")
            with main():
                with form():
                    textarea(
                        name="excerpt", placeholder="Enter excerpt from textbook here"
                    )
                    input_(type="submit", value="Submit")
            with footer():
                p("Made with ❤️ by Patrick")

    return doc.render()
