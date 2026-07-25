import { useParams } from "@solidjs/router";
import { SessionWorkflowRoute } from "~/features/use-case-grid/SessionWorkflowRoute";

export default function BriefRoute() {
  const params = useParams();
  return <SessionWorkflowRoute sessionId={params.id ?? ""} view="brief" />;
}
