FROM denoland/deno:bin-2.0.5 AS deno
FROM mcr.microsoft.com/devcontainers/typescript-node:22-bookworm
COPY --from=deno /deno /usr/local/bin/deno
