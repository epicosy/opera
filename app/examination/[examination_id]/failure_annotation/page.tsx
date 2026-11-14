import { ExaminationWorkspace } from "../../../examination-workspace";

export default async function FailureAnnotationPage({
  params,
}: {
  params: Promise<{ examination_id: string }>;
}) {
  const { examination_id } = await params;
  return <ExaminationWorkspace mode="failure_annotation" examinationId={examination_id} />;
}
