import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Box, Container, HStack, Stack, VStack } from "styled-system/jsx";
import { css } from "styled-system/css";
import { Heading, Table, Text } from "~/components/ui";
import type { GenerationSummary } from "~/lib/ai/generation-store";
import { GenerationStatusBadge } from "./GenerationStatusBadge";

type GenerationListProps = {
  generations: GenerationSummary[];
};

const kindLabels: Record<GenerationSummary["kind"], string> = {
  "profile-directions": "Profile directions",
  "use-case-grid": "Use-case grid",
  "focused-cell": "Focused cell",
  "execution-brief": "Execution brief",
};

const formatTimestamp = (value: string) => value.replace("T", " ").replace(".000Z", " UTC");

const detailLink = css({
  color: "colorPalette.fg",
  fontWeight: "medium",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
});

const homeLink = css({
  color: "fg.muted",
  textStyle: "sm",
  _hover: { color: "fg.default" },
});

export function GenerationList(props: GenerationListProps) {
  return (
    <Container maxW="7xl" py={{ base: "6", md: "10" }}>
      <Stack gap="6">
        <VStack alignItems="start" gap="2">
          <A href="/" class={homeLink}>← Back to app</A>
          <Heading as="h1" textStyle="3xl">LLM generations</Heading>
          <Text color="fg.muted">
            Every provider attempt is stored as an individual JSON record and can be reopened by UUID.
          </Text>
        </VStack>

        <Show
          when={props.generations.length > 0}
          fallback={
            <Box borderWidth="1px" borderRadius="l3" p="8" textAlign="center">
              <Heading as="h2" textStyle="lg">No generations yet</Heading>
              <Text color="fg.muted" mt="2">Run a live grid, refinement, or brief generation to create the first record.</Text>
            </Box>
          }
        >
          <Box overflowX="auto" borderWidth="1px" borderRadius="l3">
            <Table.Root variant="surface" width="full">
              <Table.Head>
                <Table.Row>
                  <Table.Header>Generation</Table.Header>
                  <Table.Header>Status</Table.Header>
                  <Table.Header>Model</Table.Header>
                  <Table.Header>Started</Table.Header>
                  <Table.Header textAlign="right">Duration</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <For each={props.generations}>
                  {(generation) => (
                    <Table.Row>
                      <Table.Cell>
                        <VStack alignItems="start" gap="1">
                          <A href={`/admin/generations/${generation.id}`} class={detailLink}>
                            {kindLabels[generation.kind]}
                          </A>
                          <Box fontFamily="mono" textStyle="xs" color="fg.muted">
                            {generation.id}
                          </Box>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell>
                        <GenerationStatusBadge status={generation.status} />
                      </Table.Cell>
                      <Table.Cell>{generation.model}</Table.Cell>
                      <Table.Cell whiteSpace="nowrap">{formatTimestamp(generation.startedAt)}</Table.Cell>
                      <Table.Cell textAlign="right">
                        <HStack justifyContent="flex-end" whiteSpace="nowrap">
                          {generation.durationMs === undefined ? "—" : `${generation.durationMs} ms`}
                        </HStack>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </For>
              </Table.Body>
            </Table.Root>
          </Box>
        </Show>
      </Stack>
    </Container>
  );
}
