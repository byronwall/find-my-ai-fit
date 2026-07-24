import { Title } from "@solidjs/meta";
import { createResource, Suspense } from "solid-js";
import { Box } from "styled-system/jsx";
import { GenerationList } from "~/features/admin-generations/GenerationList";
import { getGenerationList } from "~/features/admin-generations/data";

export default function GenerationsRoute() {
  const [generations] = createResource(() => getGenerationList());

  return (
    <>
      <Title>LLM Generations — Admin</Title>
      <Suspense fallback={<Box p="8">Loading generations…</Box>}>
        <GenerationList generations={generations.latest ?? []} />
      </Suspense>
    </>
  );
}

