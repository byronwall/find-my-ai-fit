import { Title } from "@solidjs/meta";
import { A, useParams } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";
import { createResource, Show, Suspense } from "solid-js";
import { Box, Container, Stack } from "styled-system/jsx";
import { GenerationDetail } from "~/features/admin-generations/GenerationDetail";
import { getGenerationById } from "~/features/admin-generations/data";
import { Heading, Text } from "~/components/ui";

export default function GenerationDetailRoute() {
  const params = useParams();
  const [generation] = createResource(() => params.id, getGenerationById);

  return (
    <>
      <Title>{generation.latest ? `${generation.latest.kind} — LLM Generation` : "LLM Generation"}</Title>
      <Suspense fallback={<Box p="8">Loading generation…</Box>}>
        <Show
          when={generation.latest}
          fallback={
            <Container maxW="3xl" py="16">
              <HttpStatusCode code={404} />
              <Stack gap="3">
                <Heading as="h1" textStyle="3xl">Generation not found</Heading>
                <Text color="fg.muted">No saved generation matches this UUID.</Text>
                <A href="/admin/generations">Back to all generations</A>
              </Stack>
            </Container>
          }
        >
          {(record) => <GenerationDetail generation={record()} />}
        </Show>
      </Suspense>
    </>
  );
}

