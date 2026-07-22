import { ArrowRight, FileText, LockKeyhole, Sparkles, Upload } from "lucide-solid";
import { For, Show } from "solid-js";
import { Box, HStack, VStack } from "styled-system/jsx";
import {
  Button,
  FileUpload,
  Field,
  SimpleSelect,
  Text,
  Textarea,
} from "~/components/ui";
import { useUseCaseGrid } from "./context";
import { styles } from "./styles";

const previewIdeas = [
  "Policy answer prep",
  "Case pattern review",
  "Personal HR playbook",
  "Manager conversation prep",
  "Manager issue triage",
  "Practice simulator",
  "Workforce update drafting",
  "Grievance theme analysis",
  "Agreement navigator",
];

const goalItems = [
  { label: "Improve my current role", value: "Improve my current role" },
  { label: "Prepare for another role", value: "Prepare for another role" },
  { label: "Support a job search", value: "Support a job search" },
  { label: "Learn and experiment", value: "Learn and experiment" },
  { label: "Explore something else", value: "Explore something else" },
];

const horizonItems = [
  { label: "This week", value: "week" },
  { label: "This quarter", value: "quarter" },
  { label: "Longer term", value: "longer-term" },
];

export function LandingScreen() {
  const grid = useUseCaseGrid();
  const fileLabel = () => grid.file()?.name ?? "Drop your LinkedIn PDF here";

  return (
    <main class={styles.landing}>
      <section>
        <span class={styles.eyebrow}>
          <Sparkles size={16} /> Personalized, practical, structured
        </span>
        <h1 class={styles.heroTitle}>Find the AI use cases hiding in your work</h1>
        <p class={styles.heroCopy}>
          Upload your LinkedIn profile and get a map of practical AI opportunities tailored to
          your role, responsibilities, and goals—not another generic list.
        </p>

        <div class={styles.actionStack}>
          <Button size="xl" variant="solid" onClick={grid.startExample}>
            <Sparkles size={18} />
            Try the HR example
            <ArrowRight size={18} />
          </Button>

          <div class={styles.divider}>or use your own profile</div>

          <FileUpload.Root
            class={styles.upload}
            maxFiles={1}
            maxFileSize={10_000_000}
            accept={{ "application/pdf": [".pdf"] }}
            onFileChange={(details) => grid.setFile(details.acceptedFiles[0] ?? null)}
          >
            <FileUpload.HiddenInput />
            <FileUpload.Dropzone class={styles.dropzone} aria-label="Upload LinkedIn profile PDF">
              <VStack gap="2">
                <Box color="brand.green"><Upload size={28} /></Box>
                <Text fontWeight="semibold">{fileLabel()}</Text>
                <Text color="brand.muted" textStyle="sm">PDF only · up to 10 MB · click or drag and drop</Text>
              </VStack>
            </FileUpload.Dropzone>
          </FileUpload.Root>

          <Show when={grid.file()}>
            <Box class={styles.panel}>
              <VStack alignItems="stretch" gap="4">
                <HStack gap="2" color="brand.green">
                  <FileText size={17} />
                  <Text fontWeight="semibold">Add direction the profile cannot reveal</Text>
                </HStack>
                <SimpleSelect
                  label="What are you trying to do?"
                  items={goalItems}
                  value={grid.state.intent.goal}
                  onChange={(goal) => grid.setIntent({ goal })}
                  placeholder="Choose a goal"
                  skipPortal
                />
                <SimpleSelect
                  label="Time horizon"
                  items={horizonItems}
                  value={grid.state.intent.timeHorizon}
                  onChange={(value) => grid.setIntent({ timeHorizon: value as "week" | "quarter" | "longer-term" })}
                  placeholder="Choose a horizon"
                  skipPortal
                />
                <Field.Root>
                  <Field.Label>Anything else that would change the result?</Field.Label>
                  <Textarea
                    rows={3}
                    value={grid.state.intent.notes ?? ""}
                    onInput={(event) => grid.setIntent({ notes: event.currentTarget.value })}
                    placeholder="For example: I want ideas I can test without access to production systems."
                  />
                </Field.Root>
                <Button
                  size="lg"
                  variant="solid"
                  loading={grid.state.pending === "grid"}
                  loadingText="Reading your profile and building the grid…"
                  onClick={() => void grid.generatePersonalGrid()}
                >
                  Generate my grid <ArrowRight size={17} />
                </Button>
              </VStack>
            </Box>
          </Show>

          <Show when={grid.state.error}>
            {(error) => <div class={styles.error} role="alert">{error()}</div>}
          </Show>

          <div class={styles.privacy}>
            <LockKeyhole size={17} />
            <span>Your PDF is sent securely for this generation and is not saved by this site.</span>
          </div>
        </div>
      </section>

      <aside class={styles.previewFrame} aria-label="Example opportunity grid preview">
        <HStack justifyContent="space-between" alignItems="start" gap="4">
          <VStack alignItems="start" gap="1">
            <Text fontFamily="Georgia, serif" fontSize="2xl" fontWeight="bold">A map, not a chat log</Text>
            <Text color="brand.muted">Scan the space. Pick a direction. Zoom into useful work.</Text>
          </VStack>
          <Box class={styles.chip} bg="brand.sageStrong" color="brand.green">18 ideas</Box>
        </HStack>
        <Box mt="5" display="grid" gridTemplateColumns="90px repeat(3, minmax(0, 1fr))" gap="2" fontSize="xs" color="brand.muted">
          <span />
          <span>Faster</span>
          <span>Decisions</span>
          <span>New capability</span>
        </Box>
        <div class={styles.previewGrid}>
          <For each={previewIdeas}>
            {(idea, index) => (
              <div class={styles.previewCell} style={{ background: index() === 4 ? "#dcebdc" : undefined }}>
                <Text fontWeight="semibold">{idea}</Text>
                <Text mt="2" color="brand.muted">{index() === 4 ? "Selected for deeper exploration" : "Practical use case"}</Text>
              </div>
            )}
          </For>
        </div>
      </aside>
    </main>
  );
}
