# opera — FindThemAll examination portal

Next.js frontend for the UnRAR examination vertical slice.

## Run

```sh
docker build -t findthemall-opera .
docker run -d --name findthemall-web --network findthemall -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 findthemall-opera
```

Start PostgreSQL (`arepo`), then FastAPI (`rotas`), then this UI. The API must be published on host port 8000 for the browser to reach it. Local development: `npm install && npm run dev`.

## Examination threads

- **Root cause**: Target → Candidate location → Annotations. The two seeded candidate-location proposals can each be accepted/rejected with reviewer notes.
- **Manifestation**: Target → Reproduction → Object locations → Annotations. The existing reproduction record, execution-context artifact and AddressSanitizer runner log can be reviewed with a persisted decision.

Target validation collapses its details into a saved review summary and moves focus to the next checkpoint in that thread. The review summary exposes the saved note and an Edit action. Candidate and reproduction reviews are persisted independently. The registry is not activated, and no vulnerability is created by validating an individual checkpoint.
