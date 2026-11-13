import { ExaminationWorkspace } from "../../examination-workspace";

export default async function ExaminationPage({
  params,
}: {
  params: Promise<{ examination_id: string }>;
}) {
  const { examination_id } = await params;
  return <ExaminationWorkspace mode="overview" examinationId={examination_id} />;
}
