import { A } from "@solidjs/router";
import { ExternalLink, LogOut, RefreshCw } from "lucide-solid";
import { For, Show, createMemo, createSignal } from "solid-js";
import { Box, Container, Grid, HStack, Stack } from "styled-system/jsx";
import { css } from "styled-system/css";
import { Button, Heading, Table, Text } from "~/components/ui";
import type {
  AnalyticsEventRecord,
  AnalyticsMetric,
  AnalyticsSnapshot,
  AnalyticsView,
} from "~/lib/admin/analytics";
import { AnalyticsTrend } from "./AnalyticsTrend";

type AnalyticsDashboardProps = {
  snapshot: AnalyticsSnapshot;
};

type Period = keyof AnalyticsSnapshot["views"];

const periods: { id: Period; label: string }[] = [
  { id: "day", label: "24 hours" },
  { id: "week", label: "7 days" },
  { id: "month", label: "30 days" },
  { id: "all", label: "All time" },
];

const navigationLink = css({
  color: "brand.muted",
  textStyle: "sm",
  _hover: { color: "brand.ink" },
  _focusVisible: { outline: "2px solid token(colors.brand.green)", outlineOffset: "3px" },
});

const formatNumber = (value: number) => value.toLocaleString("en-US");

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));

const formatDetails = (event: AnalyticsEventRecord) => {
  const details = Object.entries(event.detail);
  return details.length
    ? details.map(([key, value]) => `${key}: ${value}`).join(" · ")
    : "No details";
};

const MetricStrip = (props: { view: AnalyticsView }) => {
  const metrics = () => [
    {
      label: "Visitors",
      value: formatNumber(props.view.totals.visitors),
      note: `${formatNumber(props.view.totals.identifiedUsers)} signed in`,
    },
    {
      label: "Requests",
      value: formatNumber(props.view.totals.requests),
      note: `${props.view.totals.averageDurationMs} ms average`,
    },
    {
      label: "Captured events",
      value: formatNumber(props.view.totals.events),
      note: `${formatNumber(props.view.topEvents.length)} event types shown`,
    },
    {
      label: "Errors",
      value: formatNumber(props.view.totals.errors),
      note: `${props.view.totals.successRate.toFixed(2)}% request success`,
    },
  ];

  return (
    <Grid
      columns={{ base: 2, lg: 4 }}
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
            borderRightWidth={{ base: index() % 2 === 0 ? "1px" : "0", lg: index() < 3 ? "1px" : "0" }}
            borderBottomWidth={{ base: index() < 2 ? "1px" : "0", lg: "0" }}
            borderColor="brand.border"
          >
            <Text textStyle="sm" color="brand.muted" fontWeight="semibold">
              {metric.label}
            </Text>
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              lineHeight="1"
              fontWeight="800"
              letterSpacing="-0.035em"
              color={metric.label === "Errors" && props.view.totals.errors > 0 ? "red.10" : "brand.ink"}
            >
              {metric.value}
            </Text>
            <Text textStyle="xs" color="brand.muted">
              {metric.note}
            </Text>
          </Stack>
        )}
      </For>
    </Grid>
  );
};

const Ranking = (props: {
  title: string;
  empty: string;
  metrics: AnalyticsMetric[];
}) => {
  const max = () => props.metrics[0]?.value ?? 1;
  return (
    <Stack gap="3">
      <Heading as="h3" textStyle="md">{props.title}</Heading>
      <Show
        when={props.metrics.length > 0}
        fallback={<Text color="brand.muted" textStyle="sm">{props.empty}</Text>}
      >
        <Stack gap="3">
          <For each={props.metrics}>
            {(metric) => (
              <Stack gap="1">
                <HStack justifyContent="space-between" gap="3" alignItems="baseline">
                  <Text textStyle="sm" overflowWrap="anywhere">{metric.label}</Text>
                  <Text textStyle="sm" fontWeight="semibold">{formatNumber(metric.value)}</Text>
                </HStack>
                <Box h="1.5" bg="brand.sage" borderRadius="full" overflow="hidden">
                  <Box
                    h="full"
                    bg="brand.green"
                    borderRadius="full"
                    style={{ width: `${Math.max(4, (metric.value / max()) * 100)}%` }}
                  />
                </Box>
              </Stack>
            )}
          </For>
        </Stack>
      </Show>
    </Stack>
  );
};

export function AnalyticsDashboard(props: AnalyticsDashboardProps) {
  const [period, setPeriod] = createSignal<Period>("day");
  const view = createMemo(() => props.snapshot.views[period()]);

  const signOut = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.reload();
  };

  return (
    <Box minH="100vh" bg="brand.canvas" color="brand.ink">
      <Container maxW="8xl" py={{ base: "5", md: "8" }} px={{ base: "4", md: "6" }}>
        <Stack gap="5">
          <HStack
            justifyContent="space-between"
            alignItems={{ base: "start", md: "center" }}
            flexDirection={{ base: "column", md: "row" }}
            gap="4"
          >
            <Stack gap="1">
              <HStack gap="3" flexWrap="wrap">
                <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} letterSpacing="-0.04em">
                  Usage desk
                </Heading>
                <Box
                  bg="brand.signal"
                  color="brand.ink"
                  borderRadius="l1"
                  px="2.5"
                  py="1"
                  textStyle="xs"
                  fontWeight="bold"
                >
                  ADMIN
                </Box>
              </HStack>
              <Text color="brand.muted">
                Request traffic, visitors, and product events in one operational view.
              </Text>
              <HStack gap="4" mt="1">
                <A href="/" class={navigationLink}>Public app</A>
                <A href="/admin/generations" class={navigationLink}>
                  <HStack as="span" gap="1">
                    Generations <ExternalLink size={13} aria-hidden="true" />
                  </HStack>
                </A>
              </HStack>
            </Stack>
            <HStack gap="2">
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw size={16} aria-hidden="true" /> Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => void signOut()}>
                <LogOut size={16} aria-hidden="true" /> Sign out
              </Button>
            </HStack>
          </HStack>

          <HStack
            bg="brand.panel"
            borderWidth="1px"
            borderColor="brand.border"
            borderRadius="l2"
            p="1.5"
            gap="1"
            alignSelf="start"
            overflowX="auto"
            maxW="full"
            role="group"
            aria-label="Analytics period"
          >
            <For each={periods}>
              {(option) => (
                <Button
                  size="sm"
                  variant={period() === option.id ? "solid" : "plain"}
                  aria-pressed={period() === option.id}
                  onClick={() => setPeriod(option.id)}
                  flexShrink="0"
                >
                  {option.label}
                </Button>
              )}
            </For>
          </HStack>

          <MetricStrip view={view()} />

          <Box
            bg="brand.panel"
            borderWidth="1px"
            borderColor="brand.border"
            borderRadius="l3"
            p={{ base: "4", md: "6" }}
          >
            <Stack gap="5">
              <HStack justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
                <Heading as="h2" textStyle="xl">Usage trend</Heading>
                <Text textStyle="xs" color="brand.muted">
                  Updated {formatTimestamp(props.snapshot.generatedAt)} UTC
                </Text>
              </HStack>
              <AnalyticsTrend points={view().trend} />
            </Stack>
          </Box>

          <Grid columns={{ base: 1, lg: 12 }} gap="5" alignItems="start">
            <Box
              gridColumn={{ lg: "span 8" }}
              bg="brand.panel"
              borderWidth="1px"
              borderColor="brand.border"
              borderRadius="l3"
              overflow="hidden"
            >
              <Box px={{ base: "4", md: "5" }} py="4" borderBottomWidth="1px" borderColor="brand.border">
                <Heading as="h2" textStyle="xl">Recent event ledger</Heading>
                <Text textStyle="sm" color="brand.muted" mt="1">
                  Newest product events captured by <code>/api/events</code>.
                </Text>
              </Box>
              <Show
                when={view().recentEvents.length > 0}
                fallback={
                  <Box p="8">
                    <Heading as="h3" textStyle="md">No events in this period</Heading>
                    <Text color="brand.muted" mt="1">
                      Events will appear after the product sends its next analytics beacon.
                    </Text>
                  </Box>
                }
              >
                <Box overflowX="auto" display={{ base: "none", md: "block" }}>
                  <Table.Root variant="surface" width="full">
                    <Table.Head>
                      <Table.Row>
                        <Table.Header>Time (UTC)</Table.Header>
                        <Table.Header>Event</Table.Header>
                        <Table.Header>Visitor</Table.Header>
                        <Table.Header>Details</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      <For each={view().recentEvents}>
                        {(event) => (
                          <Table.Row>
                            <Table.Cell whiteSpace="nowrap">{formatTimestamp(event.occurredAt)}</Table.Cell>
                            <Table.Cell fontWeight="semibold" color="brand.green">{event.event}</Table.Cell>
                            <Table.Cell whiteSpace="nowrap">{event.userEmail ?? event.ip ?? "Unknown"}</Table.Cell>
                            <Table.Cell minW="18rem" color="brand.muted">{formatDetails(event)}</Table.Cell>
                          </Table.Row>
                        )}
                      </For>
                    </Table.Body>
                  </Table.Root>
                </Box>
                <Stack display={{ base: "flex", md: "none" }} gap="0">
                  <For each={view().recentEvents}>
                    {(event) => (
                      <Stack
                        gap="2"
                        px="4"
                        py="4"
                        borderBottomWidth="1px"
                        borderColor="brand.border"
                      >
                        <HStack justifyContent="space-between" gap="3" alignItems="baseline">
                          <Text fontWeight="semibold" color="brand.green" overflowWrap="anywhere">
                            {event.event}
                          </Text>
                          <Text textStyle="xs" color="brand.muted" whiteSpace="nowrap">
                            {formatTimestamp(event.occurredAt)}
                          </Text>
                        </HStack>
                        <Text textStyle="sm" color="brand.muted" overflowWrap="anywhere">
                          {formatDetails(event)}
                        </Text>
                        <Text textStyle="xs">
                          Visitor: {event.userEmail ?? event.ip ?? "Unknown"}
                        </Text>
                      </Stack>
                    )}
                  </For>
                </Stack>
              </Show>
            </Box>

            <Stack gridColumn={{ lg: "span 4" }} gap="5">
              <Box
                bg="brand.panel"
                borderWidth="1px"
                borderColor="brand.border"
                borderRadius="l3"
                p="5"
              >
                <Ranking
                  title="Event breakdown"
                  empty="No event types captured yet."
                  metrics={view().topEvents}
                />
              </Box>
              <Box
                bg="brand.panel"
                borderWidth="1px"
                borderColor="brand.border"
                borderRadius="l3"
                p="5"
              >
                <Ranking
                  title="Top paths"
                  empty="No paths visited in this period."
                  metrics={view().topPaths}
                />
              </Box>
              <Box
                bg="brand.panel"
                borderWidth="1px"
                borderColor="brand.border"
                borderRadius="l3"
                p="5"
              >
                <Ranking
                  title="People and visitors"
                  empty="No visitor identities recorded yet."
                  metrics={view().topVisitors}
                />
              </Box>
            </Stack>
          </Grid>

          <Text textStyle="xs" color="brand.muted" textAlign="right">
            Retaining the latest {formatNumber(props.snapshot.retainedRequestCount)} requests
            {" and "}{formatNumber(props.snapshot.retainedEventCount)} events.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
