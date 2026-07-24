import { For, Show } from "solid-js";
import { styles } from "./styles";

const labeledParagraph = /^(Context|The use case|Expected benefit|Start with this experiment|Task|Required output|Constraints and stop rules):\s*/;

type BriefPromptPreviewProps = {
  text: string;
};

export function BriefPromptPreview(props: BriefPromptPreviewProps) {
  const paragraphs = () => props.text.split(/\n{2,}/).filter((paragraph) => paragraph.trim());

  return (
    <div class={styles.prompt} aria-label="Ready-to-use prompt">
      <For each={paragraphs()}>
        {(paragraph, index) => {
          const label = paragraph.match(labeledParagraph)?.[1];
          const body = label ? paragraph.replace(labeledParagraph, "") : paragraph;
          return (
            <p
              class={styles.promptParagraph}
              classList={{ [styles.promptLead]: index() === 0 }}
            >
              <Show when={label}>
                {(value) => <strong class={styles.promptLabel}>{value()}:</strong>}
              </Show>
              {body}
            </p>
          );
        }}
      </For>
    </div>
  );
}
