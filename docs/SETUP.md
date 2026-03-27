# Setup Guide

1. Copy `config/env/.env.example` to `.env`.
2. Run `npm install`.
3. Start local infrastructure with `docker compose -f config/docker-compose.dev.yml up -d`.
4. Start the app with `npm run dev`.
5. Use `npx naveencodes-ai deploy` and `npx naveencodes-ai preview` for deployment checklists.
