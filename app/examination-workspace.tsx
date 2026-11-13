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
type Annotation = {
  annotation_id: string;
  location_id?: string | null;
  field: string;
  taxonomy: string;
  value: string;
  confidence: number;
  notes: string[];
  created_at: string;
  updated_at: string;
  submitted_at?: string | null;
  submitted_by?: string | null;
  review_note?: string | null;
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
  created_at: string;
  updated_at: string;
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
  annotations: Annotation[];
};

type FunctionDiff = {
  function_name: string;
  file_path: string;
  old_artifact_id: string;
  new_artifact_id: string;
  old_revision: string;
  new_revision: string;
  old_start_line: number;
  old_end_line: number;
  new_start_line: number;
  new_end_line: number;
  old_source_url: string;
  new_source_url: string;
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
type ObjectLocation = {
  object_location_id: string; target_id: string; project_id: string;
  revision_id: string; artifact_id: string; chain_id: string; weakness_id: string;
  line: number; start_column?: number | null; end_column?: number | null;
  name: string; type: string; cwe_id: string; cwe_label: string;
  annotations: Annotation[];
};
type Target = {
  target_id: string;
  thread: "root_cause" | "manifestation";
  strategy: string;
  project_id: string;
  anchor_revision: string;
  created_at: string;
  updated_at: string;
  review_status: ReviewStatus;
  review_note?: string | null;
  reviewer_id?: string | null;
  patch_review_status: ReviewStatus;
  patch_review_note?: string | null;
  artifacts: Artifact[];
  function_diff?: FunctionDiff | null;
  candidate_locations?: Candidate[];
  reproduction?: Reproduction | null;
  object_locations?: ObjectLocation[];
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

function FunctionDiffCard({ diff }: { diff: FunctionDiff }) {
  return (
    <article className="artifact function-diff-artifact">
      <div className="artifact-top">
        <b>Function Diff: {diff.function_name}</b>
        <code>{diff.file_path}</code>
      </div>
      <div className="diff-revisions">
        <a href={diff.old_source_url} target="_blank" rel="noreferrer">
          Old · patch base · {diff.old_revision} · L{diff.old_start_line}–L{diff.old_end_line} ↗
        </a>
        <a href={diff.new_source_url} target="_blank" rel="noreferrer">
          New · fix · {diff.new_revision} · L{diff.new_start_line}–L{diff.new_end_line} ↗
        </a>
      </div>
      <pre className="diff-content"><code>
        {diff.content.split("\n").map((line, index) => {
          const style = line.startsWith("+++") || line.startsWith("---")
            ? "diff-file"
            : line.startsWith("+")
              ? "diff-add"
              : line.startsWith("-")
                ? "diff-remove"
                : line.startsWith("@@")
                  ? "diff-hunk"
                  : "diff-context";
          return <span className={"diff-line " + style} key={index}>{line || " "}</span>;
        })}
      </code></pre>
    </article>
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

function formatTimestamp(value?: string | null): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function TargetCheckpoint({
  target,
  onSaved,
}: {
  target: Target;
  onSaved: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(target.review_status === "pending");
  const [artifactsOpen, setArtifactsOpen] = useState(false);
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
      const response = await fetch(API + "/api/targets/" + target.target_id + "/review", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewer_id: REVIEWER_ID, note }),
      });
      if (!response.ok) throw new Error("API returned " + response.status + ": " + await response.text());
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
      <details className="checkpoint-disclosure" open>
      <summary className="checkpoint-title">
        <span className={target.review_status === "accepted" ? "step-number completed" : "step-number"}>1</span>
        <div><b>Target</b><small>Task definition and associated evidence</small></div>
      </summary>

      <div className="target-facts">
        <div className="target-id-inline"><label>Target ID</label><code>{target.target_id}</code></div>
        <div><label>Created at</label><b>{formatTimestamp(target.created_at)}</b></div>
        <div><label>Last edited at</label><b>{formatTimestamp(target.updated_at)}</b></div>
      </div>

      <section className="target-artifact-panel">
        <button className="text-toggle" onClick={() => setArtifactsOpen(!artifactsOpen)} aria-expanded={artifactsOpen}>
          {artifactsOpen ? "Hide target artifacts" : "Inspect target artifacts"} ({target.function_diff ? 1 : target.artifacts.length})
        </button>
        {artifactsOpen && (
          <div className="artifact-list">
            {target.function_diff ? (
              <FunctionDiffCard diff={target.function_diff} />
            ) : (
              target.artifacts.map(artifact => (
                <ArtifactCard key={artifact.artifact_id} artifact={artifact} projectId={target.project_id} />
              ))
            )}
          </div>
        )}
      </section>

      <section className="target-review-panel">
        {target.review_status !== "pending" && !editing ? (
          <ReviewSummary status={target.review_status} note={target.review_note} label="Target" onEdit={() => setEditing(true)} />
        ) : (
          <div className="review-box">
            <div>
              <b>{target.review_status === "rejected" ? "Revise target review" : "Validate this target"}</b>
              <p>Confirm the project, revision references and associated artifacts.</p>
            </div>
            <ReviewForm
              note={note}
              setNote={setNote}
              busy={busy}
              error={error}
              onSubmit={() => save("accepted")}
              onReject={() => save("rejected")}
              acceptLabel="Validate target"
            />
          </div>
        )}
      </section>
      </details>
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
      const response = await fetch(API + "/api/candidates/" + candidate.candidate_id + "/review", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewer_id: REVIEWER_ID, note }),
      });
      if (!response.ok) throw new Error("API returned " + response.status + ": " + await response.text());
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
    revision: candidate.artifact_revision,
    artifact_type: candidate.artifact_type,
    file_path: candidate.file_path,
    function_name: candidate.function_name,
    start_line: candidate.start_line,
    end_line: candidate.end_line,
    media_type: candidate.media_type,
    content: candidate.content,
  };

  const sourceUrl = "https://github.com/" + candidate.project_id + "/blob/" +
    candidate.revision_id + "/" + candidate.file_path + "#L" + candidate.line;

  return (
    <article className="candidate-card">
      <div className="candidate-heading">
        <div className="candidate-heading-main">
          <b>Candidate location</b>
          <small>{candidate.candidate_id}</small>
          <a className="candidate-source-link" href={sourceUrl} target="_blank" rel="noreferrer">
            Source revision · {candidate.project_id}/{candidate.revision_id}/{candidate.file_path}#L{candidate.line} ↗
          </a>
        </div>
        <span className={"pill " + candidate.review_status}>{candidate.review_status}</span>
      </div>

      <div className="candidate-facts">
        <div><label>Candidate line</label><b>{candidate.line}</b></div>
        <div><label>Proposed by</label><b>Reviewer {candidate.proposed_by}</b></div>
        <div><label>Created at</label><b>{formatTimestamp(candidate.created_at)}</b></div>
        <div><label>Last edited at</label><b>{formatTimestamp(candidate.updated_at)}</b></div>
      </div>

      <details className="candidate-source">
        <summary>Inspect source at candidate line</summary>
        <HighlightedCode
          artifact={artifact}
          projectId={candidate.project_id}
          linkRevision={candidate.revision_id}
          highlightLines={[candidate.line]}
        />
      </details>

      {candidate.review_status !== "pending" && !editing ? (
        <ReviewSummary status={candidate.review_status} note={candidate.review_note} label="Candidate" onEdit={() => setEditing(true)} />
      ) : (
        <ReviewForm
          note={note}
          setNote={setNote}
          busy={busy}
          error={error}
          onSubmit={() => save("accepted")}
          onReject={() => save("rejected")}
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
  const candidateAccepted = candidates.some(candidate => candidate.review_status === "accepted");
  const resolved = candidates.length > 0 && candidates.every(candidate => candidate.review_status !== "pending");

  return (
    <section className="checkpoint-section active-checkpoint">
      <details className="checkpoint-disclosure" open>
      <summary className="checkpoint-title">
        <span className={candidateAccepted ? "step-number completed" : "step-number"}>2</span>
        <div><b>Candidate location validation</b><small>Review the patch-base source location before annotation</small></div>
        <span className={"pill " + (candidateAccepted ? "accepted" : "pending")}>
          {candidateAccepted ? "accepted" : resolved ? "review needed" : "pending"}
        </span>
      </summary>
      <div className="checkpoint-content">
        {candidates.map(candidate => (
          <CandidateCard key={candidate.candidate_id} candidate={candidate} onSaved={onSaved} />
        ))}
        {candidates.length === 0 && <p className="empty-state">No candidate location is associated with the patch-base revision.</p>}
      </div>
      </details>
    </section>
  );
}

function AnnotationCard({
  annotation,
  onSaved,
}: {
  annotation: Annotation;
  onSaved: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(!annotation.submitted_at);
  const [confidence, setConfidence] = useState(Number(annotation.confidence));
  const [reviewNote, setReviewNote] = useState(annotation.review_note ?? annotation.notes.join("\n"));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setConfidence(Number(annotation.confidence));
    setReviewNote(annotation.review_note ?? annotation.notes.join("\n"));
    setEditing(!annotation.submitted_at);
  }, [annotation.confidence, annotation.review_note, annotation.submitted_at]);

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(API + "/api/annotations/" + annotation.annotation_id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confidence,
          reviewer_id: REVIEWER_ID,
          review_note: reviewNote,
        }),
      });
      if (!response.ok) throw new Error("API returned " + response.status + ": " + await response.text());
      setEditing(false);
      await onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to submit annotation");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="annotation-card">
      <div className="annotation-heading">
        <div>
          <b>{annotation.field.replace(/^resource\./, "").replaceAll("_", " ")}</b>
          <small>{annotation.annotation_id}</small>
        </div>
        <span className="annotation-value">{annotation.value}</span>
      </div>
      <div className="annotation-taxonomy">Taxonomy · {annotation.taxonomy}</div>
      <div className="annotation-timestamps">
        <span>Created at {formatTimestamp(annotation.created_at)}</span>
        {annotation.submitted_at && <span>Last edited at {formatTimestamp(annotation.updated_at)}</span>}
      </div>

      {annotation.submitted_at && !editing ? (
        <div className="annotation-summary">
          <div>
            <b>✓ Annotation submitted</b>
            <p>Confidence · {Number(annotation.confidence).toFixed(2)}</p>
            {annotation.review_note && <p>{annotation.review_note}</p>}
          </div>
          <button className="edit-button" onClick={() => setEditing(true)}>Edit</button>
        </div>
      ) : (
        <div className="annotation-editor">
          <label htmlFor={"confidence-" + annotation.annotation_id}>Confidence</label>
          <div className="confidence-row">
            <input
              id={"confidence-" + annotation.annotation_id}
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={confidence}
              onChange={event => setConfidence(Number(event.target.value))}
            />
            <output>{confidence.toFixed(2)}</output>
          </div>
          <textarea
            value={reviewNote}
            onChange={event => setReviewNote(event.target.value)}
            placeholder="Reviewer note"
          />
          {error && <p className="error">{error}</p>}
          <div className="actions">
            <button className="accept" disabled={busy} onClick={submit}>
              {busy ? "Submitting…" : "Submit annotation"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function AnnotationCheckpoint({
  candidate,
  onSaved,
}: {
  candidate: Candidate | undefined;
  onSaved: () => Promise<void>;
}) {
  const annotations = candidate?.annotations ?? [];
  const submitted = annotations.length > 0 && annotations.every(annotation => Boolean(annotation.submitted_at));
  const locationId = annotations.find(annotation => annotation.location_id)?.location_id;

  return (
    <section className="checkpoint-section active-checkpoint">
      <details className="checkpoint-disclosure" open>
      <summary className="checkpoint-title">
        <span className={submitted ? "step-number completed" : "step-number"}>3</span>
        <div><b>Annotations</b><small>Root-cause annotations linked to the validated candidate location</small></div>
        <span className={"pill " + (submitted ? "accepted" : "pending")}>
          {annotations.length === 0 ? "none" : annotations.filter(annotation => annotation.submitted_at).length + "/" + annotations.length + " submitted"}
        </span>
      </summary>
      <div className="checkpoint-content annotation-list">
        {locationId && <div className="annotation-location"><label>Location ID</label><code>{locationId}</code></div>}
        {annotations.map(annotation => (
          <AnnotationCard key={annotation.annotation_id} annotation={annotation} onSaved={onSaved} />
        ))}
        {annotations.length === 0 && <p className="empty-state">No annotations are associated with this candidate location.</p>}
      </div>
      </details>
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
    return (
      <section className="checkpoint-section active-checkpoint">
        <details className="checkpoint-disclosure" open>
          <summary className="checkpoint-title">
            <span className="step-number">2</span>
            <div><b>Reproduction</b><small>Existing reproduction record and execution outputs</small></div>
            <span className="future-label">Unavailable</span>
          </summary>
          <div className="checkpoint-content">
            <p className="empty-state">No reproduction record is associated with this manifestation target.</p>
          </div>
        </details>
      </section>
    );
  }

  async function save(status: "accepted" | "rejected") {
    setBusy(true);
    setError("");

    if (!reproduction?.reproduction_id) {
      setError("No reproduction selected.");
      return;
    }
    
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
      <details className="checkpoint-disclosure" open>
      <summary className="checkpoint-title">
        <span className={reproduction.review_status === "accepted" ? "step-number completed" : "step-number"}>2</span>
        <div><b>Reproduction</b><small>Existing reproduction record and execution outputs</small></div>
        <span className={"pill " + reproduction.review_status}>{reproduction.review_status}</span>
      </summary>
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
      </details>
    </section>
  );
}

function LaterCheckpoint({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <section className="checkpoint-section future-checkpoint">
      <details className="checkpoint-disclosure" open>
        <summary className="checkpoint-title">
          <span className="step-number">{number}</span>
          <div><b>{title}</b><small>{description}</small></div>
          <span className="future-label">Not implemented</span>
        </summary>
        <div className="checkpoint-content">
          <p className="empty-state">This checkpoint is visible in the thread plan but is not implemented in the current slice.</p>
        </div>
      </details>
    </section>
  );
}

function AnalysisReviewBox({
  entityId, endpoint, status, note, label, prompt, acceptLabel, onSaved,
}: {
  entityId: string; endpoint: string; status: ReviewStatus; note?: string | null;
  label: string; prompt: string; acceptLabel: string; onSaved: () => Promise<void>;
}) {
  const [editing,setEditing]=useState(status==="pending");
  const [reviewNote,setReviewNote]=useState(note??"");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{setReviewNote(note??"");setEditing(status==="pending");},[status,note]);
  async function save(nextStatus:"accepted"|"rejected"){
    setBusy(true);setError("");
    try{
      const response=await fetch(API+endpoint.replace("{id}",encodeURIComponent(entityId)),{
        method:"PUT",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({status:nextStatus,reviewer_id:REVIEWER_ID,note:reviewNote})
      });
      if(!response.ok)throw new Error("API returned "+response.status+": "+await response.text());
      setEditing(false);await onSaved();
    }catch(reason){setError(reason instanceof Error?reason.message:"Unable to save review");}
    finally{setBusy(false);}
  }
  return <div className="review-box analysis-review-box">
    {status!=="pending"&&!editing
      ? <ReviewSummary status={status} note={note} label={label} onEdit={()=>setEditing(true)}/>
      : <>
          <div><b>{status==="rejected"?"Revise review":prompt}</b><p>{label}</p></div>
          <ReviewForm note={reviewNote} setNote={setReviewNote} busy={busy} error={error}
            onSubmit={()=>save("accepted")} onReject={()=>save("rejected")} acceptLabel={acceptLabel}/>
        </>}
  </div>;
}

function ReportStrip({reports}:{reports:Artifact[]}){
  return <div className="report-strip" aria-label="Vulnerability reports">
    {reports.map((report,index)=><span className="report-item" key={report.artifact_id}>
      {report.source_uri?<a href={report.source_uri} target="_blank" rel="noreferrer">{report.source} · {report.report_id} ↗</a>:<span>{report.source} · {report.report_id}</span>}
      {index<reports.length-1&&<span className="report-separator">|</span>}
    </span>)}
  </div>;
}

function ReproductionAnalysis({target,onSaved}:{target:Target;onSaved:()=>Promise<void>}){
  const reproduction=target.reproduction;
  const reports=target.artifacts.filter(a=>a.artifact_type==="crash_report");
  return <section className="checkpoint-section workflow-checkpoint">
    <div className="workflow-checkpoint-heading">
      <span className={reproduction?.review_status==="accepted"?"step-number completed":"step-number"}>1</span>
      <div><b>Reproduction Analysis</b><small>Validate the original reports and reproduced crash evidence</small></div>
      <span className={"pill "+(reproduction?.review_status??"pending")}>{reproduction?.review_status??"unavailable"}</span>
    </div>
    <div className="analysis-stack">
      <div><h3>Vulnerability reports</h3><ReportStrip reports={reports}/></div>
      {reproduction?<>
        <div><h3>Reproduction outputs</h3><div className="artifact-list">
          {reproduction.artifacts.map(a=><ArtifactCard key={a.artifact_id} artifact={a} projectId={target.project_id}/>)}
        </div></div>
        <AnalysisReviewBox entityId={reproduction.reproduction_id} endpoint="/api/reproductions/{id}/review"
          status={reproduction.review_status} note={reproduction.review_note} label="Reproduction evidence"
          prompt="Confirm the reproduction" acceptLabel="Confirm reproduction" onSaved={onSaved}/>
      </>:<p className="empty-state">No reproduction record is associated with this manifestation target.</p>}
    </div>
  </section>;
}

function PatchAnalysis({target,onSaved}:{target:Target;onSaved:()=>Promise<void>}){
  return <section className="checkpoint-section workflow-checkpoint">
    <div className="workflow-checkpoint-heading">
      <span className={target.patch_review_status==="accepted"?"step-number completed":"step-number"}>1</span>
      <div><b>Patch Analysis</b><small>Review the patch and verify the patched build no longer reproduces the crash</small></div>
      <span className={"pill "+target.patch_review_status}>{target.patch_review_status}</span>
    </div>
    <div className="analysis-stack">
      <div><h3>Patch-base to fix</h3>{target.function_diff?<FunctionDiffCard diff={target.function_diff}/>:<p className="empty-state">No patch-base/fix function diff is available.</p>}</div>
      <div className="patched-log-placeholder">
        <div><b>Patched reproduction log</b><span className="future-label">Awaiting supplied log</span></div>
        <p>The patched-run output will be added here. It should show <code>unrar_fuzzer</code> completing without a crash or sanitizer report.</p>
      </div>
      <AnalysisReviewBox entityId={target.target_id} endpoint="/api/targets/{id}/patch-review"
        status={target.patch_review_status} note={target.patch_review_note} label="Patch review"
        prompt="Confirm the patch review" acceptLabel="Confirm patch" onSaved={onSaved}/>
    </div>
  </section>;
}

function CandidateValidation({candidate,onSaved}:{candidate:Candidate;onSaved:()=>Promise<void>}){
  const [editing,setEditing]=useState(candidate.review_status==="pending");
  const [note,setNote]=useState(candidate.review_note??"");
  const [busy,setBusy]=useState(false);const [error,setError]=useState("");
  useEffect(()=>{setNote(candidate.review_note??"");setEditing(candidate.review_status==="pending");},[candidate.review_status,candidate.review_note]);
  async function save(status:"accepted"|"rejected"){
    setBusy(true);setError("");
    try{
      const response=await fetch(API+"/api/candidates/"+encodeURIComponent(candidate.candidate_id)+"/review",{
        method:"PUT",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({status,reviewer_id:REVIEWER_ID,note})
      });
      if(!response.ok)throw new Error("API returned "+response.status+": "+await response.text());
      setEditing(false);await onSaved();
    }catch(reason){setError(reason instanceof Error?reason.message:"Unable to validate candidate location");}
    finally{setBusy(false);}
  }
  return candidate.review_status!=="pending"&&!editing
    ? <ReviewSummary status={candidate.review_status} note={candidate.review_note} label="Candidate location" onEdit={()=>setEditing(true)}/>
    : <div className="candidate-validation-box">
        <div><b>Validate candidate location</b><p>Confirm this source location captures the root cause before accepting its annotations.</p></div>
        <ReviewForm note={note} setNote={setNote} busy={busy} error={error}
          onSubmit={()=>save("accepted")} onReject={()=>save("rejected")} acceptLabel="Accept candidate"/>
      </div>;
}

function RootCauseAnnotation({target,onSaved}:{target:Target;onSaved:()=>Promise<void>}){
  const candidate=target.candidate_locations?.[0];
  if(!candidate)return <section className="checkpoint-section workflow-checkpoint">
    <div className="workflow-checkpoint-heading"><span className="step-number">2</span><div><b>Root-Cause Annotation</b><small>Candidate source and root-cause annotations</small></div></div>
    <p className="empty-state">No candidate location is associated with the patch-base revision.</p>
  </section>;
  const artifact:Artifact={
    artifact_id:candidate.artifact_id,role:"candidate_source",revision:candidate.artifact_revision,
    artifact_type:candidate.artifact_type,file_path:candidate.file_path,function_name:candidate.function_name,
    start_line:candidate.start_line,end_line:candidate.end_line,media_type:candidate.media_type,content:candidate.content
  };
  const accepted=candidate.review_status==="accepted";
  const annotations=candidate.annotations??[];
  const submitted=annotations.length>0&&annotations.every(a=>Boolean(a.submitted_at));
  return <section className="checkpoint-section workflow-checkpoint">
    <div className="workflow-checkpoint-heading">
      <span className={accepted&&submitted?"step-number completed":"step-number"}>2</span>
      <div><b>Root-Cause Annotation</b><small>Candidate source location and its cause annotations</small></div>
      <span className={"pill "+candidate.review_status}>{candidate.review_status}</span>
    </div>
    <div className="annotation-split">
      <div className="annotation-pane">
        <h3>Candidate source location</h3>
        <HighlightedCode artifact={artifact} projectId={candidate.project_id} linkRevision={candidate.revision_id} highlightLines={[candidate.line]}/>
        <div className="source-location-facts"><span>Line <b>{candidate.line}</b></span><span>Revision <code>{candidate.revision_id}</code></span></div>
        <CandidateValidation candidate={candidate} onSaved={onSaved}/>
      </div>
      <div className="annotation-pane">
        <h3>Root-cause annotations</h3>
        {accepted?<div className="annotation-list">
          {annotations.map(a=><AnnotationCard key={a.annotation_id} annotation={a} onSaved={onSaved}/>)}
          {!annotations.length&&<p className="empty-state">No annotations are associated with this candidate location.</p>}
        </div>:<p className="waiting-note">Accept the candidate location on the left to unlock its annotations.</p>}
      </div>
    </div>
  </section>;
}

function ManifestationAnnotation({target,sourceArtifact,onSaved}:{
  target:Target;sourceArtifact?:Artifact;onSaved:()=>Promise<void>;
}){
  const location=target.object_locations?.[0];
  if(!location)return <section className="checkpoint-section workflow-checkpoint">
    <div className="workflow-checkpoint-heading"><span className="step-number">2</span><div><b>Manifestation Annotation</b><small>Crash-site source and final weakness in the manifestation chain</small></div></div>
    <p className="empty-state">No object location is linked to the final manifestation weakness.</p>
  </section>;
  const annotations=location.annotations??[];
  const submitted=annotations.length>0&&annotations.every(a=>Boolean(a.submitted_at));
  return <section className="checkpoint-section workflow-checkpoint">
    <div className="workflow-checkpoint-heading">
      <span className={submitted?"step-number completed":"step-number"}>2</span>
      <div><b>Manifestation Annotation</b><small>Crash-site source and final weakness in the manifestation chain</small></div>
      <span className={"pill "+(submitted?"accepted":"pending")}>{annotations.filter(a=>a.submitted_at).length}/{annotations.length} submitted</span>
    </div>
    <div className="annotation-split">
      <div className="annotation-pane">
        <h3>Crash-site source location</h3>
        {sourceArtifact?<HighlightedCode artifact={sourceArtifact} projectId={location.project_id} linkRevision={location.revision_id} highlightLines={[location.line]}/>:<p className="empty-state">The source artifact is not available in the examination data.</p>}
        <div className="source-location-facts">
          <span>Line <b>{location.line}</b></span><span>Columns <b>{location.start_column??"?"}–{location.end_column??"?"}</b></span>
          <span>Object <b>{location.name}</b></span><span>Type <b>{location.type}</b></span>
        </div>
        <a className="candidate-source-link" href={`https://github.com/${location.project_id}/blob/${location.revision_id}/unpackinline.cpp#L${location.line}-L${location.line}`} target="_blank" rel="noreferrer">Open crash-site revision ↗</a>
      </div>
      <div className="annotation-pane">
        <h3>Final chain weakness</h3>
        <div className="chain-weakness-summary">
          <div className="chain-cwe">{location.cwe_id} · {location.cwe_label}</div>
          <div><label>Affected object</label><b>{location.name}</b></div>
          <div><label>Object type</label><b>{location.type}</b></div>
          <div><label>Chain</label><code>{location.chain_id}</code></div>
          <div><label>Weakness</label><code>{location.weakness_id}</code></div>
        </div>
        <div className="annotation-list">
          {annotations.map(a=><AnnotationCard key={a.annotation_id} annotation={a} onSaved={onSaved}/>)}
          {!annotations.length&&<p className="empty-state">No annotations are associated with this object location.</p>}
        </div>
      </div>
    </div>
  </section>;
}

function ThreadOverviewCard({target,examinationId}:{target:Target;examinationId:string}){
  const root=target.thread==="root_cause";
  const candidate=target.candidate_locations?.[0];
  const rootAnnotations=candidate?.annotations??[];
  const manifestAnnotations=(target.object_locations??[]).flatMap(l=>l.annotations??[]);
  const stages=root?[
    {label:"Patch Analysis",complete:target.patch_review_status==="accepted"},
    {label:"Root-Cause Annotation",complete:candidate?.review_status==="accepted"&&rootAnnotations.length>0&&rootAnnotations.every(a=>Boolean(a.submitted_at))}
  ]:[
    {label:"Reproduction Analysis",complete:target.reproduction?.review_status==="accepted"},
    {label:"Manifestation Annotation",complete:manifestAnnotations.length>0&&manifestAnnotations.every(a=>Boolean(a.submitted_at))}
  ];
  const done=stages.filter(s=>s.complete).length;
  const href=`/examination/${encodeURIComponent(examinationId)}/${target.thread}`;
  return <article className="thread-overview-card">
    <div className="thread-overview-heading"><div>
      <span className="thread-kind">{root?"PATCH → ROOT CAUSE":"REPRODUCTION → MANIFESTATION"}</span>
      <h2>{root?"Patch Analysis → Root-Cause Annotation":"Reproduction Analysis → Manifestation Annotation"}</h2>
      <p>{root?"Validate the patch and annotate the source location responsible for the defect.":"Confirm the crash reproduction and annotate the final weakness at its source location."}</p>
    </div><span className={"pill "+(done===2?"accepted":"pending")}>{done===2?"complete":"in progress"}</span></div>
    <div className="overview-stepper pair-stepper">{stages.map((stage,index)=><div className={stage.complete?"overview-step completed":"overview-step"} key={stage.label}>
      <span>{stage.complete?"✓":index+1}</span><small>{stage.label}</small>
    </div>)}</div>
    <div className="thread-card-footer"><span>{done} of 2 stages complete</span><a href={href}>Open workflow <span aria-hidden="true">→</span></a></div>
  </article>;
}

function PlaceholderOverviewCard(){
  return <article className="thread-overview-card placeholder-thread-card">
    <div className="thread-overview-heading"><div>
      <span className="thread-kind">EXPLORATORY WORKSTREAM</span>
      <h2>Propagation Analysis → Chain Annotation</h2>
      <p>Explore how the fault propagates through the program and annotate the resulting weakness chain.</p>
    </div><span className="future-label">Planned</span></div>
    <div className="overview-stepper pair-stepper">
      <div className="overview-step"><span>1</span><small>Propagation Analysis</small></div>
      <div className="overview-step"><span>2</span><small>Chain Annotation</small></div>
    </div>
    <div className="thread-card-footer"><span>Exploratory · not implemented</span><span className="future-label">Coming later</span></div>
  </article>;
}

export function ExaminationWorkspace({mode,examinationId}:{
  mode:"overview"|"root_cause"|"manifestation";examinationId:string;
}){
  const [data,setData]=useState<Data|null>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(true);
  async function load(showLoading=true):Promise<void>{
    if(showLoading)setBusy(true);
    try{
      const response=await fetch(`${API}/api/examinations/${encodeURIComponent(examinationId)}`,{cache:"no-store"});
      if(!response.ok)throw new Error(`API returned ${response.status}`);
      setData(await response.json());setError("");
    }catch(reason){setError(reason instanceof Error?reason.message:"API unavailable");}
    finally{if(showLoading)setBusy(false);}
  }
  useEffect(()=>{void load();},[examinationId]);
  if(busy)return <main className="shell"><p className="loading">Loading examination…</p></main>;
  if(!data)return <main className="shell"><header><b>FindThemAll <i>/ Examination</i></b></header>
    <div className="error-card"><h1>API unavailable</h1><p>{error}</p><button onClick={()=>void load()}>Retry</button><small>Start arepo, then rotas, then opera.</small></div></main>;
  const root=data.targets.find(t=>t.thread==="root_cause");
  const manifestation=data.targets.find(t=>t.thread==="manifestation");
  if(!root||!manifestation)return <main className="shell"><p>Examination target data is incomplete.</p></main>;
  const selected=mode==="root_cause"?root:mode==="manifestation"?manifestation:null;
  const sourceArtifact=root.artifacts.find(a=>a.artifact_id==="b4914966fec23c73b8ba9336fdaa62ea549a8ea6dba1d8c24ded22b3861d47dc");
  return <main className="shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">F</span><span>FindThemAll <i>/ Examination</i></span></div><span className="reviewer">REVIEWER 01</span></header>
    <section className="case-head">
      <div className="eyebrow">EXAMINATION · {data.examination.examination_id}</div><h1>{data.examination.title}</h1>
      <div className="identifiers">{data.examination.external_identifiers.map(i=><a href={i.uri} target="_blank" rel="noreferrer" key={i.value}>{i.value} ↗</a>)}</div>
      <div className="overview">
        <div><small>PROJECT</small><b>{data.examination.project_id}</b></div>
        <div><small>ROOT-CAUSE PATCH REVIEW</small><b>{root.patch_review_status}</b></div>
        <div><small>REPRODUCTION REVIEW</small><b>{manifestation.reproduction?.review_status??"unavailable"}</b></div>
      </div>
    </section>
    {mode==="overview"?<>
      <div className="overview-heading"><div><h2>Examination workstreams</h2><p>Each workstream pairs evidence analysis with annotation.</p></div><span>3 workstreams</span></div>
      <div className="thread-board">
        <ThreadOverviewCard target={manifestation} examinationId={data.examination.examination_id}/>
        <ThreadOverviewCard target={root} examinationId={data.examination.examination_id}/>
        <PlaceholderOverviewCard/>
      </div>
    </>:mode==="root_cause"?<>
      <div className="thread-page-intro"><a href={`/examination/${encodeURIComponent(data.examination.examination_id)}`}>← Examination overview</a>
        <div><h2>Patch Analysis → Root-Cause Annotation</h2><p>Review the patch evidence first, then annotate the candidate source location and its root cause.</p></div>
      </div>
      <PatchAnalysis target={root} onSaved={()=>load(false)}/>
      <RootCauseAnnotation target={root} onSaved={()=>load(false)}/>
    </>:<>
      <div className="thread-page-intro"><a href={`/examination/${encodeURIComponent(data.examination.examination_id)}`}>← Examination overview</a>
        <div><h2>Reproduction Analysis → Manifestation Annotation</h2><p>Confirm the original crash, then annotate the final weakness at the affected source object.</p></div>
      </div>
      <ReproductionAnalysis target={manifestation} onSaved={()=>load(false)}/>
      <ManifestationAnnotation target={manifestation} sourceArtifact={sourceArtifact} onSaved={()=>load(false)}/>
    </>}
    <footer>Analysis validates evidence. Annotation captures its structured interpretation. Propagation analysis and chain annotation remain exploratory placeholders in this slice.</footer>
  </main>;
}
