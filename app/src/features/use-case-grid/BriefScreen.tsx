import { ArrowLeft, Check, Clipboard, Download, ExternalLink, Sparkles } from "lucide-solid";
import { createMemo, createSignal, For, Show } from "solid-js";
import { Box, HStack, VStack } from "styled-system/jsx";
import { Button, Link, Text } from "~/components/ui";
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

  return (
    <main class={styles.page}>
      <section class={styles.briefLayout}>
        <VStack alignItems="start" gap="3">
          <span class={styles.eyebrow}><Sparkles size={16} /> Exploration complete</span>
          <Box as="h1" fontFamily="Georgia, serif" fontSize={{ base: "4xl", md: "5xl" }} lineHeight="1.05">
            Your next-step brief
          </Box>
          <Text color="brand.muted" fontSize="lg">
            A practical stopping point: what caught your attention, what it suggests, and the smallest useful move.
          </Text>
        </VStack>

        <Show when={grid.state.notice}>{(notice) => <div class={styles.notice} role="status">{notice()}</div>}</Show>

        <Box class={styles.panel}>
          <Text fontFamily="Georgia, serif" fontSize="2xl" fontWeight="bold" mb="3">Your selected use cases</Text>
          <VStack alignItems="stretch" gap="2">
            <For each={selected()}>
              {(item) => <HStack gap="2"><Check size={16} color="var(--colors-brand-green)" /><Text>{item.title}</Text></HStack>}
            </For>
          </VStack>
        </Box>

        <Box class={styles.panel}>
          <Text fontFamily="Georgia, serif" fontSize="2xl" fontWeight="bold" mb="3">What these choices suggest</Text>
          <Text color="brand.muted" fontSize="lg" lineHeight="1.7">{brief()?.theme}</Text>
        </Box>

        <Box class={styles.panel} borderColor="brand.green" boxShadow="0 0 0 1px var(--colors-brand-green)">
          <Text color="brand.green" fontWeight="semibold" mb="2">Recommended starting point</Text>
          <Text fontFamily="Georgia, serif" fontSize="3xl" fontWeight="bold">{recommended()?.title}</Text>
          <Text mt="3" color="brand.muted" lineHeight="1.7">{brief()?.recommendationReason}</Text>
          <Box mt="5" p="4" bg="brand.sage" borderRadius="l2">
            <Text fontWeight="semibold" mb="1">Smallest experiment</Text>
            <Text color="brand.muted">{brief()?.experiment}</Text>
          </Box>
        </Box>

        <Box class={styles.panel}>
          <HStack justifyContent="space-between" alignItems="center" gap="3" mb="3" flexWrap="wrap">
            <VStack alignItems="start" gap="1">
              <Text fontFamily="Georgia, serif" fontSize="2xl" fontWeight="bold">Ready-to-use prompt</Text>
              <Text color="brand.muted">Take this into the AI tool you already use.</Text>
            </VStack>
            <Button variant="outline" onClick={() => void copyPrompt()}>
              <Show when={copied()} fallback={<><Clipboard size={16} /> Copy prompt</>}><Check size={16} /> Copied</Show>
            </Button>
          </HStack>
          <pre class={styles.prompt}>{brief()?.prompt}</pre>
        </Box>

        <HStack justifyContent="space-between" gap="3" flexWrap="wrap">
          <Button variant="plain" onClick={grid.backFromBrief}><ArrowLeft size={16} /> Back to my grid</Button>
          <HStack gap="2" flexWrap="wrap">
            <a class={styles.downloadLink} href={downloadHref()} download="my-ai-use-case-brief.md" onClick={() => track("brief_downloaded", { selected: selected().length })}>
              <Download size={16} /> Download Markdown
            </a>
            <Link
              href={`mailto:?subject=${encodeURIComponent("AI use case implementation brief")}&body=${encodeURIComponent(brief()?.prompt ?? "")}`}
              onClick={() => track("implementation_handoff_started", { selected: selected().length })}
              display="inline-flex"
              alignItems="center"
              gap="2"
              px="4"
              minH="10"
              borderRadius="l2"
              bg="brand.green"
              color="white"
              fontWeight="semibold"
              _hover={{ bg: "brand.greenHover" }}
            >
              Discuss implementation <ExternalLink size={16} />
            </Link>
          </HStack>
        </HStack>
      </section>
    </main>
  );
}
