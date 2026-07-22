import { ArrowRight, CheckCircle2, Lightbulb, ShieldCheck } from "lucide-solid";
import { For, Show } from "solid-js";
import { Box, HStack, VStack } from "styled-system/jsx";
import { Button, Field, Text, Textarea } from "~/components/ui";
import { useUseCaseGrid } from "./context";
import { styles } from "./styles";

export function ProfileReviewScreen() {
  const grid = useUseCaseGrid();

  return (
    <main class={styles.page}>
      <section class={styles.profileReview}>
        <VStack alignItems="start" gap="3">
          <span class={styles.eyebrow}><ShieldCheck size={16} /> Check our understanding</span>
          <Box as="h1" fontFamily="Georgia, serif" fontSize={{ base: "4xl", md: "5xl" }} lineHeight="1.05">
            What we understood from your profile
          </Box>
          <Text color="brand.muted" fontSize="lg">
            Correct the summary before you continue. Facts came from your PDF; inferences are labeled separately.
          </Text>
        </VStack>

        <Box class={styles.panel}>
          <Field.Root>
            <Field.Label>Editable profile summary</Field.Label>
            <Textarea
              rows={6}
              value={grid.state.profile?.summary ?? ""}
              onInput={(event) => grid.updateProfileSummary(event.currentTarget.value)}
            />
            <Field.HelperText>This edited summary stays in this session and guides the brief.</Field.HelperText>
          </Field.Root>
        </Box>

        <div class={styles.factGrid}>
          <Box class={styles.panel}>
            <HStack gap="2" mb="3"><CheckCircle2 size={18} color="var(--colors-brand-green)" /><Text fontWeight="semibold">Profile facts</Text></HStack>
            <VStack as="ul" alignItems="stretch" gap="2">
              <For each={grid.state.profile?.facts ?? []}>{(fact) => <Text as="li">• {fact}</Text>}</For>
            </VStack>
          </Box>
          <Box class={styles.panel}>
            <HStack gap="2" mb="3"><Lightbulb size={18} color="var(--colors-brand-amber-ink)" /><Text fontWeight="semibold">Cautious inferences</Text></HStack>
            <VStack as="ul" alignItems="stretch" gap="2">
              <For each={grid.state.profile?.inferences ?? []}>{(item) => <Text as="li">• {item}</Text>}</For>
            </VStack>
          </Box>
        </div>

        <Show when={grid.state.error}>
          {(error) => <div class={styles.error} role="alert">{error()}</div>}
        </Show>

        <HStack justifyContent="flex-end" gap="3" flexWrap="wrap">
          <Button variant="outline" onClick={grid.reset}>Use another profile</Button>
          <Button size="lg" variant="solid" onClick={grid.continueToGrid}>
            Show my opportunity grid <ArrowRight size={17} />
          </Button>
        </HStack>
      </section>
    </main>
  );
}

