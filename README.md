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

## Examination routes and threads

- `/examination/{examination_id}` is the overview. It presents root-cause and manifestation workstreams as separate Kanban-style cards, each with a checkpoint progress summary and a link to continue.
- `/examination/{examination_id}/root_cause` opens only the root-cause thread: Target → Candidate location validation → Annotations.
- `/examination/{examination_id}/manifestation` opens only the manifestation thread: Target → Reproduction → Object locations → Annotations.

Each checkpoint can be collapsed independently. Validated checkpoints receive a teal step marker. Target records expose their own creation and last-edited timestamps. The target artifact panel remains independently accessible after target validation and displays the patch-base/fix function diff as one artifact. Candidate location review must be accepted before its annotations are exposed; annotation records include their source location ID, and the operation rationale is prefilled as the reviewer note.

Target validation collapses only the validation form into a saved review summary; target artifact inspection remains independently available. Candidate and reproduction reviews are persisted independently. The registry is not activated, and no vulnerability is created by validating an individual checkpoint.
