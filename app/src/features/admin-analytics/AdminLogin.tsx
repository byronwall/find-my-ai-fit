import { LockKeyhole } from "lucide-solid";
import { createStore } from "solid-js/store";
import { Box, Container, HStack, Stack } from "styled-system/jsx";
import { Field, Button, Heading, Input, Text } from "~/components/ui";

type AdminLoginProps = {
  configured: boolean;
};

export function AdminLogin(props: AdminLoginProps) {
  const [state, setState] = createStore({
    password: "",
    pending: false,
    error: "",
  });

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!state.password || state.pending) return;
    setState({ pending: true, error: "" });
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: state.password }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(body.error || "Admin sign-in failed.");
      window.location.reload();
    } catch (error) {
      setState({
        pending: false,
        error: error instanceof Error ? error.message : "Admin sign-in failed.",
      });
    }
  };

  return (
    <Box minH="100vh" bg="brand.canvas" color="brand.ink" display="grid" placeItems="center">
      <Container maxW="md" width="full" py="12">
        <Box
          bg="brand.panel"
          borderWidth="1px"
          borderColor="brand.border"
          borderRadius="l3"
          boxShadow="5px 5px 0 token(colors.brand.sageStrong), 0 18px 50px rgba(21, 24, 39, 0.10)"
          p={{ base: "6", md: "9" }}
        >
          <Stack gap="7">
            <Stack gap="3">
              <HStack
                alignItems="center"
                justifyContent="center"
                bg="brand.ink"
                color="white"
                borderRadius="l2"
                w="10"
                h="10"
              >
                <LockKeyhole size={19} aria-hidden="true" />
              </HStack>
              <Heading as="h1" textStyle="3xl" letterSpacing="-0.03em">
                Admin access
              </Heading>
              <Text color="brand.muted">
                Enter the private admin password. This browser will stay signed in for
                30 days.
              </Text>
            </Stack>

            {props.configured ? (
              <Box as="form" onSubmit={submit}>
                <Stack gap="5">
                  <Field.Root invalid={Boolean(state.error)}>
                    <Field.Label>Admin password</Field.Label>
                    <Input
                      type="password"
                      value={state.password}
                      onInput={(event) => setState("password", event.currentTarget.value)}
                      autocomplete="current-password"
                      autofocus
                    />
                    {state.error ? <Field.ErrorText>{state.error}</Field.ErrorText> : null}
                  </Field.Root>
                  <Button
                    type="submit"
                    disabled={!state.password || state.pending}
                    width="full"
                  >
                    {state.pending ? "Checking password…" : "Open usage desk"}
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Box
                bg="brand.amber"
                color="brand.amberInk"
                borderWidth="1px"
                borderColor="brand.border"
                borderRadius="l2"
                p="4"
              >
                <Text fontWeight="semibold">Admin password is not configured</Text>
                <Text textStyle="sm" mt="1">
                  Set <code>ADMIN_PASSWORD</code> in the server environment, then restart
                  the app.
                </Text>
              </Box>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
