# opera — FindThemAll examination portal

Next.js frontend for the UnRAR examination vertical slice.

## Run

Create the shared network once if it does not already exist:

```sh
docker network create findthemall
```

The API URL is compiled into the Next.js browser bundle at build time:

```sh
docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000 -t findthemall-opera .
docker run -d --name findthemall-web --network findthemall -p 3000:3000 findthemall-opera
```

Start PostgreSQL (`arepo`), then FastAPI (`rotas`), then this UI. The API must be published on host port 8000 for the browser to reach it. Local development: `npm install && npm run dev`.

## Examination threads

- **Root cause**: Target → Candidate location → Annotations. The target artifact panel remains independently accessible after target validation and displays the patch-base/fix function diff as one artifact. The single patch-base candidate can be accepted/rejected with reviewer notes and creation/last-edited timestamps. Its qualifier and operation annotations have confidence sliders and independent submission timestamps.
- **Manifestation**: Target → Reproduction → Object locations → Annotations. The existing reproduction record, execution-context artifact and AddressSanitizer runner log can be reviewed with a persisted decision.

Target validation collapses only the validation form into a saved review summary; target artifact inspection remains independently available. The next checkpoint becomes active. The review summary exposes the saved note and an Edit action. Candidate and reproduction reviews are persisted independently. The registry is not activated, and no vulnerability is created by validating an individual checkpoint.
