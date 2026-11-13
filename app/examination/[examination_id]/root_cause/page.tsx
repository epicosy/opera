import { ExaminationWorkspace } from "../../../examination-workspace";

export default async function RootCausePage({
  params,
}: {
  params: Promise<{ examination_id: string }>;
}) {
  const { examination_id } = await params;
  return <ExaminationWorkspace mode="root_cause" examinationId={examination_id} />;
}
