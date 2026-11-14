import { ExaminationWorkspace } from "../../../examination-workspace";

export default async function BugAnnotationPage({
  params,
}: {
  params: Promise<{ examination_id: string }>;
}) {
  const { examination_id } = await params;
  return <ExaminationWorkspace mode="bug_annotation" examinationId={examination_id} />;
}
