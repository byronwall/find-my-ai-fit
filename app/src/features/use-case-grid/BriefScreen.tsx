import { ArrowLeft, Check, Clipboard, Download, ExternalLink, Sparkles, Wrench } from "lucide-solid";
import { createMemo, createSignal, Show } from "solid-js";
import { Box, HStack } from "styled-system/jsx";
import { Button, Link, Text } from "~/components/ui";
import { BriefTaskWorkbench } from "./BriefTaskWorkbench";
import { useUseCaseGrid } from "./context";
import { track } from "./client-utils";
import { styles } from "./styles";

const toMarkdown = (
  theme: string,
  recommendation: string,
  experiment: string,
  prompts: Array<{ title: string; prompt: string }>,
) => `# My AI use case brief

## Selected use cases

${prompts.map((item) => `- ${item.title}`).join("\n")}

## What these choices suggest

${theme}

## Recommended starting point

${recommendation}

## Smallest experiment

${experiment}

## Ready-to-use prompts

${prompts.map((item) => `### ${item.title}

\`\`\`text
${item.prompt}
\`\`\``).join("\n\n")}
`;

export function BriefScreen() {
  const grid = useUseCaseGrid();
  const [copiedPromptId, setCopiedPromptId] = createSignal<string>();
  const brief = () => grid.state.brief;
  const selected = () => grid.selectedUseCases();
  const recommended = () => selected().find((item) => item.id === brief()?.recommendedUseCaseId) ?? selected()[0];
  const [activeId, setActiveId] = createSignal(recommended()?.id ?? selected()[0]?.id);
  const activeItem = () =>
    selected().find((item) => item.id === activeId()) ?? recommended() ?? selected()[0];
  const activePrompt = () =>
    brief()?.prompts.find((item) => item.useCaseId === activeItem()?.id)?.prompt ?? "";
  const readablePrompt = () => activePrompt().replaceAll("\\n", "\n");

  const copyPrompt = async () => {
    const item = activeItem();
    const prompt = activePrompt();
    if (!item || !prompt) return;
    await navigator.clipboard.writeText(prompt);
    track("brief_prompt_copied", { selected: selected().length, useCaseId: item.id });
    setCopiedPromptId(item.id);
    window.setTimeout(() => setCopiedPromptId(undefined), 1800);
  };

  const downloadHref = createMemo(() => {
    if (!brief()) return undefined;
    const markdown = toMarkdown(
      brief()!.theme,
      `${recommended()?.title ?? "Starting use case"}: ${brief()!.recommendationReason}`,
      brief()!.experiment,
      selected().map((item) => ({
        title: item.title,
        prompt: brief()!.prompts.find((entry) => entry.useCaseId === item.id)?.prompt ?? "",
      })),
    );
    return `data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`;
  });

  return (
    <main class={styles.page}>
      <section class={styles.briefLayout}>
        <section class={styles.planSummary} aria-labelledby="plan-heading">
          <div class={styles.planLead}>
            <span class={styles.planKicker}><Sparkles size={16} /> Your practical plan</span>
            <Box id="plan-heading" as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="850" letterSpacing="-0.03em" lineHeight="1.08">
              Start with {recommended()?.title}
            </Box>
          </div>
          <div class={styles.planExperiment}>
            <Text class={styles.planLabel}>First experiment</Text>
            <Text fontSize={{ base: "md", md: "lg" }} lineHeight="1.6">{recommended()?.firstStep}</Text>
          </div>
          <Text class={styles.planStartReason}>
            <strong>Why this first:</strong> {brief()?.recommendationReason}
          </Text>
          <p class={styles.planDisclosure}>
            AI-generated working draft based on your reviewed profile and selected ideas. Verify it against your policies and context.
          </p>
        </section>

        <Show when={grid.state.notice}>{(notice) => <div class={styles.notice} role="status">{notice()}</div>}</Show>

        <Show when={activeItem()}>
          {(item) => (
            <BriefTaskWorkbench
              items={selected()}
              active={item()}
              prompt={readablePrompt()}
              copied={copiedPromptId() === item().id}
              recommendedId={recommended()?.id}
              onSelect={setActiveId}
              onCopyPrompt={() => void copyPrompt()}
            />
          )}
        </Show>

        <section class={styles.nextStepSection} aria-labelledby="next-step-heading">
          <div>
            <Text id="next-step-heading" fontSize="2xl" fontWeight="850" letterSpacing="tight">
              What do you want to do next?
            </Text>
            <Text mt="2" color="brand.muted">The result is yours either way.</Text>
          </div>
          <div class={styles.nextStepGrid}>
            <div class={styles.nextStepSelfServe}>
              <span class={styles.nextStepIcon}><Clipboard size={20} /></span>
              <Text fontSize="xl" fontWeight="850">Try it yourself</Text>
              <Text color="brand.muted">Copy the active task’s prompt or download every prompt in the full brief.</Text>
              <Button variant="outline" onClick={() => void copyPrompt()}>
                <Show when={copiedPromptId() === activeItem()?.id} fallback={<><Clipboard size={16} /> Copy this prompt and start</>}><Check size={16} /> Prompt copied</Show>
              </Button>
            </div>
            <div class={styles.nextStepHelp}>
              <span class={styles.nextStepIcon}><Wrench size={20} /></span>
              <Text fontSize="xl" fontWeight="850">Ask for implementation help</Text>
              <Text>Send the brief as the starting context for an AI support conversation. No obligation; the useful result stays ungated.</Text>
              <Link
                href={`mailto:?subject=${encodeURIComponent("Help implementing my AI use case")}&body=${encodeURIComponent(`I'd like help turning this AI use case brief into a working experiment.\n\nRecommended starting point: ${recommended()?.title ?? "Not selected"}\n\n${brief()?.recommendationReason ?? ""}\n\nSmallest experiment: ${brief()?.experiment ?? ""}`)}`}
                onClick={() => track("implementation_handoff_started", { selected: selected().length })}
                class={styles.helpLink}
              >
                Ask for help with this brief <ExternalLink size={16} />
              </Link>
            </div>
          </div>
        </section>

        <HStack justifyContent="space-between" gap="3" flexWrap="wrap">
          <Button variant="plain" onClick={grid.backFromBrief}><ArrowLeft size={16} /> Back to my grid</Button>
          <a class={styles.downloadLink} href={downloadHref()} download="my-ai-use-case-brief.md" onClick={() => track("brief_downloaded", { selected: selected().length })}>
            <Download size={16} /> Download full brief
          </a>
        </HStack>
      </section>
    </main>
  );
}
