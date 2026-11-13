import { ExaminationWorkspace } from "../../../examination-workspace";

export default function ManifestationPage({ params }: { params: { examination_id: string } }) {
  return <ExaminationWorkspace mode="manifestation" examinationId={params.examination_id} />;
}
