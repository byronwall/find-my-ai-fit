import { A } from "@solidjs/router";
import { For } from "solid-js";
import { Box, Container, Grid, HStack, Stack } from "styled-system/jsx";
import { css } from "styled-system/css";
import { Heading, Text } from "~/components/ui";
import type { GenerationRecord } from "~/lib/ai/generation-store";
import { GenerationOutputSummary } from "./GenerationOutputSummary";
import { GenerationPayloadExplorer } from "./GenerationPayloadExplorer";
import { GenerationRequestSummary } from "./GenerationRequestSummary";
import { GenerationStatusBadge } from "./GenerationStatusBadge";
import {
  formatCount,
  formatDuration,
  formatTimestamp,
  getResponse,
  getUsage,
  kindLabels,
  readNumber,
  readString,
} from "./presentation";

type GenerationDetailProps = {
  generation: GenerationRecord;
};

const navigationLink = css({
  color: "brand.muted",
  textStyle: "sm",
  _hover: { color: "brand.ink" },
  _focusVisible: { outline: "2px solid token(colors.brand.green)", outlineOffset: "3px" },
});

export function GenerationDetail(props: GenerationDetailProps) {
  const usage = () => getUsage(props.generation);
  const response = () => getResponse(props.generation);
  const metrics = () => [
    {
      label: "Duration",
      value: formatDuration(props.generation.durationMs),
      note: props.generation.completedAt
        ? `Ended ${formatTimestamp(props.generation.completedAt)}`
        : "Provider call active",
    },
    {
      label: "Total tokens",
      value: formatCount(readNumber(usage(), "totalTokens")),
      note: `${formatCount(readNumber(usage(), "inputTokens"))} in · ${formatCount(readNumber(usage(), "outputTokens"))} out`,
    },
    {
      label: "Finish reason",
      value: readString(response(), "finishReason")
        ?? (props.generation.status === "pending" ? "Pending" : "Not recorded"),
      note: `${formatCount(readNumber(usage(), "reasoningTokens"))} reasoning tokens`,
    },
    {
      label: "Started",
      value: formatTimestamp(props.generation.startedAt),
      note: props.generation.model,
    },
  ];

  return (
    <Box minH="100vh" bg="brand.canvas" color="brand.ink">
      <Container maxW="8xl" py={{ base: "5", md: "8" }} px={{ base: "4", md: "6" }}>
        <Stack gap="5">
          <Stack gap="3">
            <A href="/admin/generations" class={navigationLink}>← All generations</A>
            <HStack gap="3" flexWrap="wrap" alignItems="center">
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl" }}
                letterSpacing="-0.04em"
              >
                {kindLabels[props.generation.kind]}
              </Heading>
              <GenerationStatusBadge status={props.generation.status} />
            </HStack>
            <HStack gap="3" flexWrap="wrap">
              <Text color="brand.muted">Generation record</Text>
              <Box fontFamily="mono" textStyle="xs" color="brand.muted" overflowWrap="anywhere">
                {props.generation.id}
              </Box>
            </HStack>
          </Stack>

          <Grid
            columns={{ base: 1, sm: 2, lg: 4 }}
            bg="brand.panel"
            borderWidth="1px"
            borderColor="brand.border"
            borderRadius="l3"
            overflow="hidden"
          >
            <For each={metrics()}>
              {(metric, index) => (
              <Stack
                gap="1"
                p={{ base: "4", md: "5" }}
                borderRightWidth={{ lg: index() < 3 ? "1px" : "0" }}
                borderBottomWidth={{
                  base: index() < 3 ? "1px" : "0",
                  sm: index() < 2 ? "1px" : "0",
                  lg: "0",
                }}
                borderColor="brand.border"
              >
                <Text textStyle="xs" color="brand.muted" fontWeight="bold">{metric.label}</Text>
                <Text fontSize="lg" lineHeight="tight" fontWeight="800">{metric.value}</Text>
                <Text textStyle="xs" color="brand.muted">{metric.note}</Text>
              </Stack>
              )}
            </For>
          </Grid>

          <GenerationOutputSummary generation={props.generation} />
          <GenerationRequestSummary generation={props.generation} />
          <GenerationPayloadExplorer generation={props.generation} />
        </Stack>
      </Container>
    </Box>
  );
}
