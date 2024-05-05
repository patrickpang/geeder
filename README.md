# Geeder

## Motivation

You are reading a textbook for revision. You have an exam coming up. What would you do?

Anki! Of course it is great to have some flashcards to remember important facts. However, creating Anki cards alongside reading isn't smooth. You often have to switch context and think about what cards to create.

Try Geeder. We use LLM (Groq for its low latency LPU) to create Anki cards, and add to your existing Anki decks. Copy a section from the textbook, paste into Geeder, and your new cards are just one button away!

## Installation

1. Download from [GitHub Releases](https://github.com/patrickpang/geeder/releases). Currently only macOS app bundle is available for download.
2. Obtain an API token from [Groq](https://console.groq.com/) and persist it as environment variable `GROQ_API_KEY`. Using macOS as example:
```bash
$ cat ~/.zprofile
export GROQ_API_KEY=<YOUR_API_KEY_HERE>
```
3. Extract the archive and launch the app. Profit!

## Web

The web tech stack is a simple server-side rendered architecture with [FastAPI](https://fastapi.tiangolo.com/). [Htmx](https://htmx.org/) is used for client side interactivity without JavaScript. Python is used to develop the prototype of this app in Jupyter Notebook, so most of the code is adapted for the web app.

## LLM

The [prompt](https://github.com/patrickpang/geeder/blob/main/llm/groq.py#L10) we use is relatively simple. YAML has been chosen as the output format instead of plaintext or JSON, because experiments show that LLMs perform better in this particular setting. We also intend to parse the output and create Anki cards directly via AnkiConnect, so a structured output is preferred. Function calling in Groq is in beta and we intend to explore that in the future also.

### Groq

We use Groq for LLM inference API instead of OpenAPI / Claude / Gemini for its low latency response over custom-built LPU. The task is essentially relatively simple - text summarization and structured output. No deep domain knowledge or Internet browsing is required.

### Llama 3

Llama 3 is the state-of-the-art open source LLM as of 2024 May, and we chose the 70b model as experiments showed less hallucination compared to 8b model.

## Develop

VS Code is recommended for development, and we have devcontainer set up. To launch the dev server, find the corresponding task in VS Code.

## CI/CD

GitHub Actions is used for CI/CD. We mainly rely on Nuitka to build release bundle as it produces the small executable with static compilation. To mitigate the slow compilation speed for development and potential incompatibility, we also have a PyInstaller setup.
