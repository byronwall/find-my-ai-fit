import { ArrowLeft, Check, Clipboard, Download, ExternalLink, Sparkles, Wrench } from "lucide-solid";
import { createMemo, createSignal, Show } from "solid-js";
import { Box, HStack, VStack } from "styled-system/jsx";
import { Button, Link, Text } from "~/components/ui";
import { BriefPromptPreview } from "./BriefPromptPreview";
import { BriefTaskWorkbench } from "./BriefTaskWorkbench";
import { useUseCaseGrid } from "./context";
import { track } from "./client-utils";
import { styles } from "./styles";

const toMarkdown = (
  theme: string,
  recommendation: string,
  experiment: string,
  prompt: string,
  selectedTitles: string[],
) => `# My AI use case brief

## Selected use cases

${selectedTitles.map((title) => `- ${title}`).join("\n")}

## What these choices suggest

${theme}

## Recommended starting point

${recommendation}

## Smallest experiment

${experiment}

## Ready-to-use prompt

\`\`\`text
${prompt}
\`\`\`
`;

export function BriefScreen() {
  const grid = useUseCaseGrid();
  const [copied, setCopied] = createSignal(false);
  const brief = () => grid.state.brief;
  const selected = () => grid.selectedUseCases();
  const recommended = () => selected().find((item) => item.id === brief()?.recommendedUseCaseId) ?? selected()[0];
  const [activeId, setActiveId] = createSignal(recommended()?.id ?? selected()[0]?.id);
  const activeItem = () =>
    selected().find((item) => item.id === activeId()) ?? recommended() ?? selected()[0];
  const readablePrompt = () => brief()?.prompt.replaceAll("\\n", "\n") ?? "";

  const copyPrompt = async () => {
    if (!brief()) return;
    await navigator.clipboard.writeText(brief()!.prompt);
    track("brief_prompt_copied", { selected: selected().length });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const downloadHref = createMemo(() => {
    if (!brief()) return undefined;
    const markdown = toMarkdown(
      brief()!.theme,
      `${recommended()?.title ?? "Starting use case"}: ${brief()!.recommendationReason}`,
      brief()!.experiment,
      brief()!.prompt,
      selected().map((item) => item.title),
    );
    return `data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`;
  });

  const removeFromPlan = async () => {
    const current = activeItem();
    if (!current || selected().length <= 1) return;
    const next = selected().find((item) => item.id !== current.id);
    if (!next) return;
    setActiveId(next.id);
    grid.toggleSelected(current.id);
    await grid.buildBrief();
  };

  return (
    <main class={styles.page}>
      <section class={styles.briefLayout}>
        <VStack alignItems="start" gap="3">
          <span class={styles.eyebrow}><Sparkles size={16} /> Exploration complete</span>
          <Box as="h1" fontSize={{ base: "4xl", md: "5xl" }} fontWeight="850" letterSpacing="-0.035em" lineHeight="1.02">
            Your next-step brief
          </Box>
          <Text color="brand.muted" fontSize="lg">
            A practical stopping point: what caught your attention, what it suggests, and the smallest useful move.
          </Text>
          <p class={styles.briefDisclosure}>
            AI-generated from your reviewed profile summary and selected ideas. Treat it as a working draft and verify it against your policies and context.
          </p>
        </VStack>

        <Show when={grid.state.notice}>{(notice) => <div class={styles.notice} role="status">{notice()}</div>}</Show>

        <section class={styles.planSummary} aria-labelledby="plan-heading">
          <div>
            <Text color="brand.green" fontWeight="semibold" mb="2">Your practical plan</Text>
            <Box id="plan-heading" as="h2" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="850" letterSpacing="-0.03em" lineHeight="1.08">
              Begin with one contained win, then build only on what works.
            </Box>
          </div>
          <Text class={styles.planCopy} color="brand.muted" fontSize="lg" lineHeight="1.7">{brief()?.theme}</Text>
          <div class={styles.planStart}>
            <span class={styles.planStartIcon}><Sparkles size={18} /></span>
            <div>
              <Text fontWeight="800">Start with {recommended()?.title}</Text>
              <Text class={styles.planStartReason} mt="1">{brief()?.recommendationReason}</Text>
            </div>
          </div>
        </section>

        <Show when={activeItem()}>
          {(item) => (
            <BriefTaskWorkbench
              items={selected()}
              active={item()}
              recommendedId={recommended()?.id}
              updating={grid.state.pending === "brief"}
              onSelect={setActiveId}
              onRemove={() => void removeFromPlan()}
            />
          )}
        </Show>

        <Box class={styles.panel}>
          <HStack justifyContent="space-between" alignItems="center" gap="3" mb="3" flexWrap="wrap">
            <VStack alignItems="start" gap="1">
              <Text fontSize="2xl" fontWeight="800" letterSpacing="tight">Prompt preview</Text>
              <Text color="brand.muted">Read it here, then copy the original prompt into the AI tool you already use.</Text>
            </VStack>
            <Button variant="outline" onClick={() => void copyPrompt()}>
              <Show when={copied()} fallback={<><Clipboard size={16} /> Copy prompt</>}><Check size={16} /> Copied</Show>
            </Button>
          </HStack>
          <BriefPromptPreview text={readablePrompt()} />
        </Box>

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
              <Text color="brand.muted">Copy the prompt above or download the full brief and run the first experiment in the AI tool you already use.</Text>
              <Button variant="outline" onClick={() => void copyPrompt()}>
                <Show when={copied()} fallback={<><Clipboard size={16} /> Copy prompt and start</>}><Check size={16} /> Prompt copied</Show>
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
