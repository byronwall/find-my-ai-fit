import { useParams } from "@solidjs/router";
import { SessionWorkflowRoute } from "~/features/use-case-grid/SessionWorkflowRoute";

export default function ProfileReviewRoute() {
  const params = useParams();
  return <SessionWorkflowRoute sessionId={params.id ?? ""} view="review" />;
}
