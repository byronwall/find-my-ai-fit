import { Match, Switch } from "solid-js";
import { Badge } from "~/components/ui";
import type { GenerationSummary } from "~/lib/ai/generation-store";

type GenerationStatusBadgeProps = {
  status: GenerationSummary["status"];
};

export function GenerationStatusBadge(props: GenerationStatusBadgeProps) {
  return (
    <Switch>
      <Match when={props.status === "completed"}>
        <Badge variant="solid" colorPalette="green">completed</Badge>
      </Match>
      <Match when={props.status === "failed"}>
        <Badge variant="subtle" colorPalette="red">failed</Badge>
      </Match>
      <Match when={props.status === "pending"}>
        <Badge variant="subtle" colorPalette="gray">pending</Badge>
      </Match>
    </Switch>
  );
}

