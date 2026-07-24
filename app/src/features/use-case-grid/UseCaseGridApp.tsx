import { Match, Switch } from "solid-js";
import { AppHeader } from "./AppHeader";
import { BriefScreen } from "./BriefScreen";
import { useUseCaseGrid } from "./context";
import { FocusScreen } from "./FocusScreen";
import { GridScreen } from "./GridScreen";
import { GenerationScreen } from "./GenerationScreen";
import { LandingScreen } from "./LandingScreen";
import { ProfileReviewScreen } from "./ProfileReviewScreen";
import { styles } from "./styles";

export function UseCaseGridApp() {
  const grid = useUseCaseGrid();

  return (
    <div class={styles.app}>
      <AppHeader />
      <Switch>
        <Match when={grid.state.pending === "profile" || grid.state.pending === "grid"}><GenerationScreen /></Match>
        <Match when={grid.state.screen === "landing"}><LandingScreen /></Match>
        <Match when={grid.state.screen === "profile-review"}><ProfileReviewScreen /></Match>
        <Match when={grid.state.screen === "grid"}><GridScreen /></Match>
        <Match when={grid.state.screen === "focus"}><FocusScreen /></Match>
        <Match when={grid.state.screen === "brief"}><BriefScreen /></Match>
      </Switch>
    </div>
  );
}
