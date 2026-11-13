import { ExaminationWorkspace } from "../../examination-workspace";

export default function ExaminationPage({ params }: { params: { examination_id: string } }) {
  return <ExaminationWorkspace mode="overview" examinationId={params.examination_id} />;
}
