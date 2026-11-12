"use client";

import { useEffect, useState } from "react";

type ReviewStatus = "pending" | "accepted" | "rejected";
type Artifact = {
  artifact_id: string;
  role: string;
  revision: string;
  artifact_type: string;
  file_path?: string | null;
  function_name?: string | null;
  start_line?: number | null;
  end_line?: number | null;
  source?: string | null;
  report_id?: string | null;
  source_uri?: string | null;
  media_type?: string | null;
  content: string;
};
type Candidate = {
  candidate_id: string;
  project_id: string;
  revision_id: string;
  target_id: string;
  artifact_id: string;
  line: number;
  proposed_by: string;
  notes: string[];
  review_status: ReviewStatus;
  reviewed_by?: string | null;
  review_note?: string | null;
  artifact_revision: string;
  artifact_type: string;
  file_path: string;
  function_name: string;
  start_line: number;
  end_line: number;
  media_type: string;
  content: string;
};
type Reproduction = {
  reproduction_id: string;
  target_id: string;
  source_payload: unknown;
  review_status: ReviewStatus;
  review_note?: string | null;
  reviewed_by?: string | null;
  artifacts: Artifact[];
};
type Target = {
  target_id: string;
  thread: "root_cause" | "manifestation";
  strategy: string;
  project_id: string;
  anchor_revision: string;
  review_status: ReviewStatus;
  review_note?: string | null;
  reviewer_id?: string | null;
  artifacts: Artifact[];
  candidate_locations?: Candidate[];
  reproduction?: Reproduction | null;
};
type Data = {
  examination: {
    examination_id: string;
    title: string;
    project_id: string;
    external_identifiers: { value: string; uri: string }[];
  };
  targets: Target[];
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const REVIEWER_ID = "reviewer-01";

function shortId(value: string) {
  return value.length > 24 ? value.slice(0, 12) + "…" + value.slice(-7) : value;
}

function tokenClass(token: string): string {
  if (/^\/\//.test(token)) return "tok-comment";
  if (/^#/.test(token)) return "tok-preprocessor";
  if (/^("|')/.test(token)) return "tok-string";
  if (/^\d/.test(token)) return "tok-number";
  if (/^(if|else|while|for|return|switch|case|break|continue|const|static|inline|void|size_t|uint|byte|bool|true|false|struct|class|public|private|unsigned|int|char|long|auto)$/.test(token)) {
    return "tok-keyword";
  }
  return "";
}

function HighlightedCode({
  artifact,
  projectId,
  linkRevision,
  highlightLines = [],
}: {
  artifact: Artifact;
  projectId: string;
  linkRevision?: string;
  highlightLines?: number[];
}) {
  const startLine = artifact.start_line ?? 1;
  const revision = linkRevision ?? artifact.revision;
  const filePath = artifact.file_path ?? "";
  const githubUrl = filePath
    ? `https://github.com/${projectId}/blob/${revision}/${filePath}#L${startLine}-L${artifact.end_line ?? startLine}`
    : undefined;
  const functionLabel = artifact.function_name ?? "source";
  const tokens = /\/\/.*$|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|#\s*[A-Za-z_]+|[A-Za-z_][A-Za-z0-9_]*|\d+|./g;

  return (
    <div className="source-card">
      <div className="source-heading">
        <b>Function Source: {functionLabel}</b>
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noreferrer">
            {projectId}/{revision}/{filePath}#L{startLine}-L{artifact.end_line ?? startLine} ↗
          </a>
        )}
      </div>
      <div className="code-scroll">
        <pre className="source-code"><code>
          {artifact.content.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n").map((line, index) => {
            const lineNumber = startLine + index;
            const pieces = line.match(tokens) ?? [line];
            return (
              <span className={highlightLines.includes(lineNumber) ? "source-line highlighted" : "source-line"} key={lineNumber}>
                <span className="line-number">{lineNumber}</span>
                <span className="line-code">{pieces.map((token, part) => (
                  <span className={tokenClass(token)} key={part}>{token}</span>
                ))}</span>
              </span>
            );
          })}
        </code></pre>
      </div>
    </div>
  );
}

function ArtifactCard({
  artifact,
  projectId,
  title,
}: {
  artifact: Artifact;
  projectId: string;
  title?: string;
}) {
  if (artifact.artifact_type === "function_source") {
    return (
      <article className="artifact function-artifact">
        <div className="artifact-top">
          <b>{title ?? artifact.role.replaceAll("_", " ")}</b>
          <code>{shortId(artifact.artifact_id)}</code>
        </div>
        <div className="artifact-meta">
          {artifact.file_path} · lines {artifact.start_line}–{artifact.end_line} · {artifact.revision}
        </div>
        <HighlightedCode artifact={artifact} projectId={projectId} />
      </article>
    );
  }

  return (
    <article className="artifact">
      <div className="artifact-top">
        <b>{title ?? artifact.role.replaceAll("_", " ")}</b>
        <code>{shortId(artifact.artifact_id)}</code>
      </div>
      <div className="artifact-meta">
        {artifact.artifact_type} · {artifact.revision}
        {artifact.source ? ` · ${artifact.source}` : ""}
        {artifact.report_id ? ` · ${artifact.report_id}` : ""}
      </div>
      {artifact.source_uri && (
        <a className="source-link" href={artifact.source_uri} target="_blank" rel="noreferrer">
          Open original source ↗
        </a>
      )}
      <details>
        <summary>Inspect artifact content</summary>
        <pre className="text-artifact">{artifact.content.replace(/\\n/g, "\n")}</pre>
      </details>
    </article>
  );
}

function ReviewForm({
  note,
  setNote,
  busy,
  error,
  onSubmit,
  acceptLabel,
  onReject,
}: {
  note: string;
  setNote: (value: string) => void;
  busy: boolean;
  error: string;
  onSubmit: () => void;
  acceptLabel: string;
  onReject: () => void;
}) {
  return (
    <div className="review-form">
      <textarea value={note} onChange={event => setNote(event.target.value)} placeholder="Reviewer note (optional)" />
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button className="reject" disabled={busy} onClick={onReject}>Reject</button>
        <button className="accept" disabled={busy} onClick={onSubmit}>{busy ? "Saving…" : acceptLabel}</button>
      </div>
    </div>
  );
}

function ReviewSummary({
  status,
  note,
  onEdit,
  label,
}: {
  status: ReviewStatus;
  note?: string | null;
  onEdit: () => void;
  label: string;
}) {
  return (
    <div className={"review-summary " + status}>
      <div className="summary-main">
        <span className="checkmark">{status === "accepted" ? "✓" : status === "rejected" ? "×" : "○"}</span>
        <div>
          <b>{label} {status === "accepted" ? "validated" : status === "rejected" ? "rejected" : "pending"}</b>
          <p>{note?.trim() ? note : "No reviewer note."}</p>
        </div>
      </div>
      <button className="edit-button" onClick={onEdit}>Edit</button>
    </div>
  );
}

function TargetCheckpoint({
  target,
  onSaved,
}: {
  target: Target;
  onSaved: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(target.review_status === "pending");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [note, setNote] = useState(target.review_note ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setNote(target.review_note ?? "");
    setEditing(target.review_status === "pending");
  }, [target.review_status, target.review_note]);

  async function save(status: "accepted" | "rejected") {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${API}/api/targets/${target.target_id}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewer_id: REVIEWER_ID, note }),
      });
      if (!response.ok) throw new Error(`API returned ${response.status}: ${await response.text()}`);
      setEditing(false);
      await onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save target review");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="checkpoint-section">
      <div className="checkpoint-title">
        <span className="step-number">1</span>
        <div><b>Target</b><small>Immutable task input and artifact associations</small></div>
      </div>
      {target.review_status !== "pending" && !editing ? (
        <ReviewSummary status="accepted" note={target.review_note} label="Target" onEdit={() => setEditing(true)} />
      ) : (
        <div className="checkpoint-content">
          <div className="target-facts">
            <div><label>Project</label><b>{target.project_id}</b></div>
            <div><label>Target ID</label><code>{target.target_id}</code></div>
            <div><label>Strategy</label><b>{target.strategy}</b></div>
            <div><label>Anchor revision</label><code>{target.anchor_revision}</code></div>
          </div>
          <button className="text-toggle" onClick={() => setDetailsOpen(!detailsOpen)}>
            {detailsOpen ? "Hide target artifacts" : `Inspect target artifacts (${target.artifacts.length})`}
          </button>
          {detailsOpen && <div className="artifact-list">
            {target.artifacts.map(artifact => (
              <ArtifactCard key={artifact.artifact_id} artifact={artifact} projectId={target.project_id} />
            ))}
          </div>}
          <div className="review-box">
            <div><b>{target.review_status === "rejected" ? "Revise target review" : "Validate this target"}</b>
              <p>Confirm the project, strategy, revisions and artifact associations.</p>
            </div>
            <ReviewForm
              note={note} setNote={setNote} busy={busy} error={error}
              onSubmit={() => save("accepted")} onReject={() => save("rejected")}
              acceptLabel="Validate target"
            />
          </div>
        </div>
      )}
    </section>
  );
}

function CandidateCard({
  candidate,
  onSaved,
}: {
  candidate: Candidate;
  onSaved: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(candidate.review_status === "pending");
  const [note, setNote] = useState(candidate.review_note ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setNote(candidate.review_note ?? "");
    setEditing(candidate.review_status === "pending");
  }, [candidate.review_status, candidate.review_note]);

  async function save(status: "accepted" | "rejected") {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${API}/api/candidates/${candidate.candidate_id}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewer_id: REVIEWER_ID, note }),
      });
      if (!response.ok) throw new Error(`API returned ${response.status}: ${await response.text()}`);
      setEditing(false);
      await onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save candidate review");
    } finally {
      setBusy(false);
    }
  }

  const artifact: Artifact = {
    artifact_id: candidate.artifact_id,
    role: "candidate_source",
    revision: candidate.revision_id,
    artifact_type: candidate.artifact_type,
    file_path: candidate.file_path,
    function_name: candidate.function_name,
    start_line: candidate.start_line,
    end_line: candidate.end_line,
    media_type: candidate.media_type,
    content: candidate.content,
  };

  return (
    <article className="candidate-card">
      <div className="candidate-heading">
        <div><b>Candidate location</b><small>{candidate.candidate_id}</small></div>
        <span className={"pill " + candidate.review_status}>{candidate.review_status}</span>
      </div>
      <div className="candidate-facts">
        <div><label>Source revision</label><a href={`https://github.com/${candidate.project_id}/blob/${candidate.revision_id}/${candidate.file_path}#L${candidate.line}`} target="_blank" rel="noreferrer">
          {candidate.project_id}/{candidate.revision_id}/{candidate.file_path}#L{candidate.line} ↗
        </a></div>
        <div><label>Candidate line</label><b>{candidate.line}</b></div>
        <div><label>Proposed by</label><b>Reviewer {candidate.proposed_by}</b></div>
      </div>
      <details className="candidate-source">
        <summary>Inspect source at candidate line</summary>
        <HighlightedCode artifact={artifact} projectId={candidate.project_id} linkRevision={candidate.revision_id} highlightLines={[candidate.line]} />
      </details>
      {candidate.review_status !== "pending" && !editing ? (
        <ReviewSummary status={candidate.review_status} note={candidate.review_note} label="Candidate" onEdit={() => setEditing(true)} />
      ) : (
        <ReviewForm
          note={note} setNote={setNote} busy={busy} error={error}
          onSubmit={() => save("accepted")} onReject={() => save("rejected")}
          acceptLabel="Accept candidate"
        />
      )}
    </article>
  );
}

function CandidateCheckpoint({
  target,
  onSaved,
}: {
  target: Target;
  onSaved: () => Promise<void>;
}) {
  const candidates = target.candidate_locations ?? [];
  const resolved = candidates.length > 0 && candidates.every(candidate => candidate.review_status !== "pending");
  return (
    <section className="checkpoint-section active-checkpoint">
      <div className="checkpoint-title">
        <span className="step-number">2</span>
        <div><b>Candidate location</b><small>{candidates.length} source-location proposals for the root-cause target</small></div>
        <span className={"pill " + (resolved ? "accepted" : "pending")}>{resolved ? "reviewed" : `${candidates.filter(c => c.review_status !== "pending").length}/${candidates.length} reviewed`}</span>
      </div>
      <div className="checkpoint-content">
        {candidates.map(candidate => <CandidateCard key={candidate.candidate_id} candidate={candidate} onSaved={onSaved} />)}
        {candidates.length === 0 && <p className="empty-state">No candidate locations are associated with this target.</p>}
      </div>
    </section>
  );
}

function ReproductionCheckpoint({
  target,
  reproduction,
  onSaved,
}: {
  target: Target;
  reproduction: Reproduction | null | undefined;
  onSaved: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(reproduction?.review_status === "pending");
  const [note, setNote] = useState(reproduction?.review_note ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setNote(reproduction?.review_note ?? "");
    setEditing(reproduction?.review_status === "pending");
  }, [reproduction?.review_status, reproduction?.review_note]);

  if (!reproduction) {
    return <section className="checkpoint-section active-checkpoint"><p className="empty-state">No reproduction record is associated with this manifestation target.</p></section>;
  }

  async function save(status: "accepted" | "rejected") {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${API}/api/reproductions/${reproduction.reproduction_id}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewer_id: REVIEWER_ID, note }),
      });
      if (!response.ok) throw new Error(`API returned ${response.status}: ${await response.text()}`);
      setEditing(false);
      await onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save reproduction review");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="checkpoint-section active-checkpoint">
      <div className="checkpoint-title">
        <span className="step-number">2</span>
        <div><b>Reproduction</b><small>Existing reproduction record and execution outputs</small></div>
        <span className={"pill " + reproduction.review_status}>{reproduction.review_status}</span>
      </div>
      <div className="checkpoint-content">
        <div className="reproduction-facts">
          <div><label>Reproduction ID</label><code>{reproduction.reproduction_id}</code></div>
          <div><label>Manifestation target</label><code>{reproduction.target_id}</code></div>
          <div><label>Output artifacts</label><b>{reproduction.artifacts.length}</b></div>
        </div>
        <div className="artifact-list">
          {reproduction.artifacts.map(artifact => (
            <ArtifactCard key={artifact.artifact_id} artifact={artifact} projectId={target.project_id} />
          ))}
        </div>
        {reproduction.review_status !== "pending" && !editing ? (
          <ReviewSummary status={reproduction.review_status} note={reproduction.review_note} label="Reproduction evidence" onEdit={() => setEditing(true)} />
        ) : (
          <div className="review-box">
            <div><b>Review reproduction evidence</b><p>Confirm that the preserved execution context and runner log support the reported manifestation.</p></div>
            <ReviewForm
              note={note} setNote={setNote} busy={busy} error={error}
              onSubmit={() => save("accepted")} onReject={() => save("rejected")}
              acceptLabel="Confirm reproduction"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function LaterCheckpoint({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <section className="checkpoint-section future-checkpoint">
      <div className="checkpoint-title">
        <span className="step-number">{number}</span>
        <div><b>{title}</b><small>{description}</small></div>
        <span className="future-label">Not implemented</span>
      </div>
    </section>
  );
}

function Thread({ target, onSaved }: { target: Target; onSaved: () => Promise<void> }) {
  const root = target.thread === "root_cause";
  const candidates = target.candidate_locations ?? [];
  const candidateResolved = candidates.length > 0 && candidates.every(candidate => candidate.review_status !== "pending");
  const reproductionAccepted = target.reproduction?.review_status === "accepted";
  const activeStep = target.review_status !== "accepted"
    ? 0
    : root
      ? (candidateResolved ? 2 : 1)
      : (reproductionAccepted ? 2 : 1);
  const [expanded, setExpanded] = useState(true);

  const steps = root
    ? ["Target", "Candidate location", "Annotations"]
    : ["Target", "Reproduction", "Object locations", "Annotations"];

  return (
    <section className="thread">
      <button className="thread-heading" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
        <span className="thread-title">{root ? "Root cause" : "Manifestation"}</span>
        <span className={"pill " + target.review_status}>{target.review_status}</span>
        <span className="chevron">{expanded ? "−" : "+"}</span>
      </button>
      {expanded && <div className="thread-body">
        <div className="stepper">
          {steps.map((step, index) => (
            <div className={index < activeStep ? "step completed" : index === activeStep ? "step current" : "step"} key={step}>
              <span>{index < activeStep ? "✓" : index + 1}</span><small>{step}</small>
            </div>
          ))}
        </div>
        <TargetCheckpoint target={target} onSaved={onSaved} />
        {target.review_status === "accepted" ? (
          root ? (
            <>
              <CandidateCheckpoint target={target} onSaved={onSaved} />
              <LaterCheckpoint number={3} title="Annotations" description="Annotate the accepted root-cause location(s)" />
            </>
          ) : (
            <>
              <ReproductionCheckpoint target={target} reproduction={target.reproduction} onSaved={onSaved} />
              <LaterCheckpoint number={3} title="Object locations" description="Review the source locations extracted from the reproduction trace" />
              <LaterCheckpoint number={4} title="Annotations" description="Annotate manifestation object locations" />
            </>
          )
        ) : (
          <div className="waiting-note">Validate the target to unlock the next checkpoint in this thread.</div>
        )}
      </div>}
    </section>
  );
}

export default function Page() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);

  async function load(showLoading = true): Promise<void> {
    if (showLoading) setBusy(true);
    try {
      const response = await fetch(`${API}/api/examinations/examination-unrar-osv-2017-104`, { cache: "no-store" });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      setData(await response.json());
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "API unavailable");
    } finally {
      if (showLoading) setBusy(false);
    }
  }

  useEffect(() => { void load(); }, []);

  if (busy) return <main className="shell"><p className="loading">Loading examination…</p></main>;
  if (!data) return (
    <main className="shell">
      <header><b>FindThemAll <i>/ Examination</i></b></header>
      <div className="error-card"><h1>API unavailable</h1><p>{error}</p><button onClick={() => void load()}>Retry</button><small>Start arepo, then rotas, then opera.</small></div>
    </main>
  );

  const root = data.targets.find(target => target.thread === "root_cause");
  const manifestation = data.targets.find(target => target.thread === "manifestation");
  if (!root || !manifestation) return <main className="shell"><p>Examination target data is incomplete.</p></main>;
  const validatedTargets = [root, manifestation].filter(target => target.review_status === "accepted").length;

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">F</span><span>FindThemAll <i>/ Examination</i></span></div>
        <span className="reviewer">REVIEWER 01</span>
      </header>
      <section className="case-head">
        <div className="eyebrow">EXAMINATION · {data.examination.examination_id}</div>
        <h1>{data.examination.title}</h1>
        <div className="identifiers">
          {data.examination.external_identifiers.map(identifier => (
            <a href={identifier.uri} target="_blank" rel="noreferrer" key={identifier.value}>{identifier.value} ↗</a>
          ))}
        </div>
        <div className="overview">
          <div><small>PROJECT</small><b>{data.examination.project_id}</b></div>
          <div><small>VALIDATED TARGETS</small><b>{validatedTargets} / 2</b></div>
          <div><small>EXAMINATION STATUS</small><b>{validatedTargets === 2 ? "Targets validated" : "In review"}</b></div>
        </div>
      </section>
      <div className="section-title">
        <div><div className="eyebrow">INDEPENDENT REVIEW THREADS</div><h2>Examination workspace</h2></div>
        <span>2 targets · 7 checkpoints</span>
      </div>
      <Thread target={root} onSaved={() => load(false)} />
      <Thread target={manifestation} onSaved={() => load(false)} />
      <footer>Targets, candidate locations and reproductions remain independent records. A vulnerability is not created until both threads have completed end-to-end validation and promotion.</footer>
    </main>
  );
}
