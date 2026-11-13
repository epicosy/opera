import { ExaminationWorkspace } from "../../../examination-workspace";

export default async function ManifestationPage({
  params,
}: {
  params: Promise<{ examination_id: string }>;
}) {
  const { examination_id } = await params;
  return <ExaminationWorkspace mode="manifestation" examinationId={examination_id} />;
}
