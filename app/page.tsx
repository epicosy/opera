"use client";
import {useEffect,useState} from "react";
type Artifact={artifact_id:string;role:string;revision:string;artifact_type:string;file_path?:string;function_name?:string;start_line?:number;end_line?:number;source?:string;report_id?:string;content:string};
type Target={target_id:string;thread:"root_cause"|"manifestation";schema_version:string;strategy:string;project_id:string;anchor_revision:string;review_status:"pending"|"accepted"|"rejected";artifacts:Artifact[]};
type Data={examination:{examination_id:string;title:string;project_id:string;external_identifiers:{value:string;uri:string}[]};targets:Target[]};
const API=process.env.NEXT_PUBLIC_API_URL||"http://localhost:8000";
function Thread({target,onSaved}:{target:Target;onSaved:()=>void}){
 const root=target.thread==="root_cause";
 const steps=root?["Target","Candidate location","Annotations"]:["Target","Reproduction","Object locations","Annotations"];
 const [open,setOpen]=useState(true),[note,setNote]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function validate(status:"accepted"|"rejected"){
  setBusy(true);setError("");
  try{const r=await fetch(API+"/api/targets/"+target.target_id+"/review",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({status,reviewer_id:"reviewer-01",note})});if(!r.ok)throw new Error("API returned "+r.status);onSaved();}
  catch(e){setError(e instanceof Error?e.message:"Request failed");}finally{setBusy(false);}
 }
 return <section className="thread">
  <button className="heading" onClick={()=>setOpen(!open)}><b>{root?"Root cause":"Manifestation"}</b><span className={"pill "+target.review_status}>{target.review_status}</span><span>{open?"−":"+"}</span></button>
  {open&&<div className="body">
   <div className="steps">{steps.map((s,i)=><div className={i===0?"active":"future"} key={s}><strong>{i+1}</strong><span>{s}</span></div>)}</div>
   <div className="panel"><small>SEEDED TARGET · {target.strategy}</small><h2>{root?"Patch-based root-cause localization":"Crash/report manifestation"}</h2>
    <div className="facts"><div><label>Project</label><b>{target.project_id}</b></div><div><label>Target ID</label><code>{target.target_id}</code></div><div><label>Schema</label><b>{target.schema_version}</b></div><div><label>Anchor revision</label><code>{target.anchor_revision}</code></div></div>
    <h3>Associated artifacts</h3>
    {target.artifacts.map(a=><article className="artifact" key={a.artifact_id}><header><b>{a.role.replace("_"," ")}</b><code>{a.artifact_id}</code></header><p>{a.artifact_type}{a.function_name?" · "+a.function_name:""}{a.file_path?" · "+a.file_path:""}{a.source?" · "+a.source:""}{a.report_id?" · "+a.report_id:""}</p><p>Revision: <code>{a.revision}</code></p>{a.start_line&&<p>Source coordinates: {a.start_line}–{a.end_line}</p>}<details><summary>Inspect content</summary><pre>{a.content}</pre></details></article>)}
   </div>
   <div className="validate"><div><b>Validate this target</b><p>Check the project, strategy, revision references and artifact associations.</p></div><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Reviewer note (optional)"/><div className="buttons"><button className="reject" disabled={busy} onClick={()=>validate("rejected")}>Reject</button><button className="accept" disabled={busy} onClick={()=>validate("accepted")}>{busy?"Saving…":"Validate target"}</button></div>{error&&<p className="error">{error}</p>}</div>
   {steps.slice(1).map(s=><div className="checkpoint" key={s}><span>○</span><b>{s}</b><small>Next checkpoint · not implemented yet</small></div>)}
  </div>}
 </section>;
}
export default function Page(){
 const [data,setData]=useState<Data|null>(null),[error,setError]=useState(""),[busy,setBusy]=useState(true);
 async function load(){setBusy(true);try{const r=await fetch(API+"/api/examinations/examination-unrar-osv-2017-104",{cache:"no-store"});if(!r.ok)throw new Error("API returned "+r.status);setData(await r.json());setError("");}catch(e){setError(e instanceof Error?e.message:"API unavailable");}finally{setBusy(false);}}
 useEffect(()=>{load();},[]);
 if(busy)return <main className="shell">Loading examination…</main>;
 if(!data)return <main className="shell"><header>FindThemAll / Examination</header><h1>API unavailable</h1><p>{error}</p><button onClick={load}>Retry</button><p>Start arepo, then rotas, then opera.</p></main>;
 const root=data.targets.find(x=>x.thread==="root_cause")!,manifest=data.targets.find(x=>x.thread==="manifestation")!;
 const count=[root,manifest].filter(x=>x.review_status==="accepted").length;
 return <main className="shell"><header><b>FindThemAll <i>/ Examination</i></b><span>REVIEWER 01</span></header><section className="intro"><small>EXAMINATION · {data.examination.examination_id}</small><h1>{data.examination.title}</h1><div className="ids">{data.examination.external_identifiers.map(x=><a href={x.uri} target="_blank" rel="noreferrer" key={x.value}>{x.value} ↗</a>)}</div><div className="stats"><div><label>PROJECT</label><b>{data.examination.project_id}</b></div><div><label>VALIDATED TARGETS</label><b>{count} / 2</b></div><div><label>EXAMINATION</label><b>{count===2?"Ready for next checkpoints":"In review"}</b></div></div></section><div className="section"><div><small>INDEPENDENT REVIEW THREADS</small><h2>Examination workspace</h2></div><span>2 targets · 7 checkpoints</span></div><Thread target={root} onSaved={load}/><Thread target={manifest} onSaved={load}/><footer>Targets are not vulnerability records. A vulnerability is only produced after end-to-end validation and future promotion.</footer></main>;
}
