import { ExaminationWorkspace } from "../../../examination-workspace";

export default function RootCausePage({ params }: { params: { examination_id: string } }) {
  return <ExaminationWorkspace mode="root_cause" examinationId={params.examination_id} />;
}
