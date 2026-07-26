import { A } from "@solidjs/router";
import { ArrowUpRight } from "lucide-solid";
import { For, Show, createMemo } from "solid-js";
import { Box, Grid, HStack, Stack } from "styled-system/jsx";
import { css } from "styled-system/css";
import { Heading, Text } from "~/components/ui";
import { GenerationStatusBadge } from "~/features/admin-generations/GenerationStatusBadge";
import {
  formatDuration,
  formatTimestamp,
  kindLabels,
} from "~/features/admin-generations/presentation";
import type { GenerationSummary } from "~/lib/ai/generation-store";

type RecentGenerationsProps = {
  generations: GenerationSummary[];
  from?: string;
};

const generationLink = css({
  display: "block",
  color: "brand.ink",
  borderBottomWidth: "1px",
  borderColor: "brand.border",
  transition: "background 120ms ease",
  _hover: { bg: "brand.sage" },
  _focusVisible: {
    outline: "2px solid token(colors.brand.green)",
    outlineOffset: "-2px",
  },
});

const allGenerationsLink = css({
  color: "brand.green",
  textStyle: "sm",
  fontWeight: "semibold",
  _hover: { color: "brand.ink" },
  _focusVisible: {
    outline: "2px solid token(colors.brand.green)",
    outlineOffset: "3px",
  },
});

const shortId = (value: string | undefined) =>
  value ? value.slice(0, 8) : "unlinked";

export function RecentGenerations(props: RecentGenerationsProps) {
  const visibleGenerations = createMemo(() => {
    const from = props.from ? new Date(props.from).getTime() : undefined;
    return props.generations
      .filter((generation) =>
        from === undefined || new Date(generation.startedAt).getTime() >= from)
      .slice(0, 8);
  });

  return (
    <Box
      bg="brand.panel"
      borderWidth="1px"
      borderColor="brand.border"
      borderRadius="l3"
      overflow="hidden"
    >
      <HStack
        justifyContent="space-between"
        alignItems="baseline"
        gap="4"
        px={{ base: "4", md: "5" }}
        py="4"
        borderBottomWidth="1px"
        borderColor="brand.border"
        flexWrap="wrap"
      >
        <Stack gap="1">
          <Heading as="h2" textStyle="xl">Recent generated results</Heading>
          <Text textStyle="sm" color="brand.muted">
            Open a run to see what the person provided and what the tool returned.
          </Text>
        </Stack>
        <A href="/admin/generations" class={allGenerationsLink}>
          <HStack as="span" gap="1">
            View all <ArrowUpRight size={14} aria-hidden="true" />
          </HStack>
        </A>
      </HStack>

      <Show
        when={visibleGenerations().length > 0}
        fallback={
          <Box px={{ base: "4", md: "5" }} py="8">
            <Heading as="h3" textStyle="md">No generated results in this period</Heading>
            <Text color="brand.muted" mt="1">
              Completed and failed provider runs will appear here as people use the tool.
            </Text>
          </Box>
        }
      >
        <For each={visibleGenerations()}>
          {(generation) => (
            <A
              href={`/admin/generations/${generation.id}`}
              class={generationLink}
              aria-label={`Open ${kindLabels[generation.kind]} generated result`}
            >
              <Grid
                columns={{ base: 1, md: 12 }}
                gap={{ base: "3", md: "4" }}
                alignItems="center"
                px={{ base: "4", md: "5" }}
                py="4"
              >
                <Stack gap="1" gridColumn={{ md: "span 4" }}>
                  <HStack gap="2" flexWrap="wrap">
                    <Text fontWeight="bold">{kindLabels[generation.kind]}</Text>
                    <GenerationStatusBadge status={generation.status} />
                  </HStack>
                  <Text textStyle="xs" color="brand.muted">
                    Session {shortId(generation.sessionId)}
                    {generation.roundId ? ` · Round ${shortId(generation.roundId)}` : ""}
                  </Text>
                </Stack>
                <Stack gap="1" gridColumn={{ md: "span 3" }}>
                  <Text textStyle="xs" color="brand.muted" fontWeight="bold">
                    Started
                  </Text>
                  <Text textStyle="sm">{formatTimestamp(generation.startedAt)}</Text>
                </Stack>
                <Stack gap="1" gridColumn={{ md: "span 3" }}>
                  <Text textStyle="xs" color="brand.muted" fontWeight="bold">
                    Runtime
                  </Text>
                  <Text textStyle="sm">
                    {formatDuration(generation.durationMs)} · {generation.model}
                  </Text>
                </Stack>
                <HStack
                  gridColumn={{ md: "span 2" }}
                  justifyContent={{ md: "flex-end" }}
                  gap="1"
                  color="brand.green"
                  fontWeight="semibold"
                  textStyle="sm"
                >
                  View result <ArrowUpRight size={15} aria-hidden="true" />
                </HStack>
              </Grid>
            </A>
          )}
        </For>
      </Show>
    </Box>
  );
}
