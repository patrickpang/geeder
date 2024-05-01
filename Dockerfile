FROM python:3.12.3-bookworm

RUN curl -fsSL https://code-server.dev/install.sh | sh

COPY requirements.txt /workspace/requirements.txt

RUN pip install -r /workspace/requirements.txt

WORKDIR /workspace

CMD ["code-server", "--port", "8080"]