import { A } from "@solidjs/router";
import { Box, Container, Grid, HStack, Stack, VStack } from "styled-system/jsx";
import { css } from "styled-system/css";
import { Heading, Text } from "~/components/ui";
import type { GenerationRecord } from "~/lib/ai/generation-store";
import { GenerationStatusBadge } from "./GenerationStatusBadge";

type GenerationDetailProps = {
  generation: GenerationRecord;
};

const navigationLink = css({
  color: "fg.muted",
  textStyle: "sm",
  _hover: { color: "fg.default" },
});

const prettyJson = (value: unknown) =>
  JSON.stringify(
    value,
    (key, item) => {
      if (key === "base64" && typeof item === "string") {
        return item.startsWith("[redacted PDF:")
          ? item
          : `[legacy base64 payload; ${item.length.toLocaleString("en-US")} characters omitted from this page]`;
      }
      return item;
    },
    2,
  );

const formatTimestamp = (value: string) => value.replace("T", " ").replace(".000Z", " UTC");

export function GenerationDetail(props: GenerationDetailProps) {
  return (
    <Container maxW="7xl" py={{ base: "6", md: "10" }}>
      <Stack gap="6">
        <VStack alignItems="start" gap="2">
          <A href="/admin/generations" class={navigationLink}>← All generations</A>
          <HStack gap="3" flexWrap="wrap">
            <Heading as="h1" textStyle="3xl">{props.generation.kind}</Heading>
            <GenerationStatusBadge status={props.generation.status} />
          </HStack>
          <Box fontFamily="mono" textStyle="sm" color="fg.muted" overflowWrap="anywhere">
            {props.generation.id}
          </Box>
        </VStack>

        <Grid columns={{ base: 1, md: 3 }} gap="4">
          <Box borderWidth="1px" borderRadius="l3" p="4">
            <Text textStyle="sm" color="fg.muted">Model</Text>
            <Text fontWeight="medium" mt="1">{props.generation.model}</Text>
          </Box>
          <Box borderWidth="1px" borderRadius="l3" p="4">
            <Text textStyle="sm" color="fg.muted">Started</Text>
            <Text fontWeight="medium" mt="1">{formatTimestamp(props.generation.startedAt)}</Text>
          </Box>
          <Box borderWidth="1px" borderRadius="l3" p="4">
            <Text textStyle="sm" color="fg.muted">Duration</Text>
            <Text fontWeight="medium" mt="1">
              {props.generation.durationMs === undefined ? "Still pending" : `${props.generation.durationMs} ms`}
            </Text>
          </Box>
        </Grid>

        <Stack gap="3">
          <Heading as="h2" textStyle="xl">Request</Heading>
          <Box
            as="pre"
            borderWidth="1px"
            borderRadius="l3"
            bg="bg.subtle"
            p="4"
            maxH="32rem"
            overflow="auto"
            fontFamily="mono"
            textStyle="xs"
            whiteSpace="pre-wrap"
            overflowWrap="anywhere"
          >
            {prettyJson(props.generation.request)}
          </Box>
        </Stack>

        <Stack gap="3">
          <Heading as="h2" textStyle="xl">Response</Heading>
          <Box
            as="pre"
            borderWidth="1px"
            borderRadius="l3"
            bg="bg.subtle"
            p="4"
            maxH="48rem"
            overflow="auto"
            fontFamily="mono"
            textStyle="xs"
            whiteSpace="pre-wrap"
            overflowWrap="anywhere"
          >
            {prettyJson(props.generation.response ?? null)}
          </Box>
        </Stack>

        <Stack gap="3">
          <Heading as="h2" textStyle="xl">Error</Heading>
          <Box
            as="pre"
            borderWidth="1px"
            borderRadius="l3"
            bg="bg.subtle"
            p="4"
            overflow="auto"
            fontFamily="mono"
            textStyle="xs"
            whiteSpace="pre-wrap"
            overflowWrap="anywhere"
          >
            {prettyJson(props.generation.error ?? null)}
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}
