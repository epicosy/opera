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

## Examination routes and analysis/annotation pairs

- `/examination/{examination_id}` is the overview. It presents three Kanban-style workstream cards: Reproduction Analysis → Manifestation Annotation; Patch Analysis → Root-Cause Annotation; and a placeholder for Propagation Analysis → Chain Annotation.
- `/examination/{examination_id}/manifestation` presents Reproduction Analysis (NVD, OSS-Fuzz and OSV reports plus reproduction outputs and confirmation) followed by Manifestation Annotation (crash-site function source at line 65 on the left; final chain weakness, CWE-787, `Dest[2]`, and resource kind/state annotations on the right).
- `/examination/{examination_id}/root_cause` presents Patch Analysis (patch-base/fix function diff, patched-run log placeholder and confirmation) followed by Root-Cause Annotation (candidate source at line 16 and candidate validation on the left; root-cause annotations on the right).

The Propagation Analysis → Chain Annotation card is intentionally a placeholder. The patched-run log is also a placeholder until the expected successful `unrar_fuzzer` output is provided. The two dynamic route pages await Next.js 15 `params` Promises before reading `examination_id`. Annotation confidence and reviewer notes are persisted for both candidate-location and object-location annotations. The registry is not activated, and no vulnerability is created by validating an individual checkpoint.
