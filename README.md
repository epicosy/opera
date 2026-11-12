# opera — FindThemAll examination portal

Next.js frontend for the initial UnRAR examination slice.

## Run

```sh
docker build -t findthemall-opera .
docker run -d --name findthemall-web -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8000 findthemall-opera
```

Start PostgreSQL (`arepo`), then FastAPI (`rotas`), then this UI. Local development: `npm install && npm run dev`.

Two independent expandable threads:
- Root cause: target → candidate location → annotations.
- Manifestation: target → reproduction → object locations → annotations.

Only target validation is interactive in this slice; later checkpoints are placeholders. Validating targets does not create a vulnerability. The registry is not activated.
