import { For, Show, createMemo } from "solid-js";
import { Box, HStack, Stack } from "styled-system/jsx";
import { Text } from "~/components/ui";
import type { AnalyticsTrendPoint } from "~/lib/admin/analytics";

type AnalyticsTrendProps = {
  points: AnalyticsTrendPoint[];
};

const width = 900;
const height = 220;
const chartLeft = 44;
const chartTop = 20;
const chartBottom = 184;

const formatTick = (value: string, hourly: boolean) =>
  new Intl.DateTimeFormat("en-US", hourly
    ? { hour: "numeric", timeZone: "UTC" }
    : { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(value));

export function AnalyticsTrend(props: AnalyticsTrendProps) {
  const geometry = createMemo(() => {
    const points = props.points;
    const maxValue = Math.max(
      1,
      ...points.flatMap((point) => [point.requests, point.events]),
    );
    const xFor = (index: number) =>
      points.length <= 1
        ? (chartLeft + width) / 2
        : chartLeft + (index / (points.length - 1)) * (width - chartLeft);
    const yFor = (value: number) =>
      chartBottom - (value / maxValue) * (chartBottom - chartTop);
    const line = (getValue: (point: AnalyticsTrendPoint) => number) =>
      points.map((point, index) => `${xFor(index)},${yFor(getValue(point))}`).join(" ");
    return {
      requests: line((point) => point.requests),
      events: line((point) => point.events),
      maxValue,
      requestPeak: Math.max(0, ...points.map((point) => point.requests)),
      eventPeak: Math.max(0, ...points.map((point) => point.events)),
    };
  });

  const labels = createMemo(() => {
    if (!props.points.length) return [];
    const candidates = [0, Math.floor((props.points.length - 1) / 2), props.points.length - 1];
    return [...new Set(candidates)].map((index) => ({
      index,
      point: props.points[index],
      left:
        props.points.length <= 1 ? 50 : (index / (props.points.length - 1)) * 100,
    }));
  });

  return (
    <Stack gap="3">
      <HStack gap="5" flexWrap="wrap">
        <HStack gap="2">
          <Box w="5" h="0.5" bg="brand.green" />
          <Text textStyle="sm">Requests</Text>
        </HStack>
        <HStack gap="2">
          <Box w="5" h="0.5" bg="teal.9" />
          <Text textStyle="sm">Events</Text>
        </HStack>
        <Text textStyle="xs" color="brand.muted" ml={{ base: "0", md: "auto" }}>
          UTC · shared scale · peak {geometry().maxValue.toLocaleString("en-US")}
        </Text>
      </HStack>
      <Show
        when={props.points.length > 0}
        fallback={
          <Box
            minH="13rem"
            display="grid"
            placeItems="center"
            borderTopWidth="1px"
            borderColor="brand.border"
          >
            <Text color="brand.muted">Activity will appear here after the first visit.</Text>
          </Box>
        }
      >
        <Box position="relative" pb="6">
          <Stack
            position="absolute"
            left="0"
            top="4"
            bottom="9"
            justifyContent="space-between"
            zIndex="1"
            pointerEvents="none"
          >
            <Text textStyle="xs" color="brand.muted">{formatNumber(geometry().maxValue)}</Text>
            <Text textStyle="xs" color="brand.muted">
              {formatNumber(Math.round(geometry().maxValue / 2))}
            </Text>
            <Text textStyle="xs" color="brand.muted">0</Text>
          </Stack>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            role="img"
            aria-label="Requests and captured events over time"
            style={{ width: "100%", height: "clamp(11rem, 24vw, 14rem)" }}
          >
            <desc>
              {`Requests peak at ${formatNumber(geometry().requestPeak)} and captured events peak at ${formatNumber(geometry().eventPeak)} in this period.`}
            </desc>
            <For each={[0, 1, 2, 3]}>
              {(line) => (
                <line
                  x1={chartLeft}
                  x2={width}
                  y1={chartTop + ((chartBottom - chartTop) / 3) * line}
                  y2={chartTop + ((chartBottom - chartTop) / 3) * line}
                  stroke="#cbd1e1"
                  stroke-width="1"
                  stroke-dasharray="4 5"
                />
              )}
            </For>
            <polyline
              points={geometry().requests}
              fill="none"
              stroke="#5757d9"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <polyline
              points={geometry().events}
              fill="none"
              stroke="#149b8f"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <For each={labels()}>
            {(label) => (
              <Text
                position="absolute"
                bottom="0"
                textStyle="xs"
                color="brand.muted"
                whiteSpace="nowrap"
                style={{
                  left: `${label.left}%`,
                  transform:
                    label.index === 0
                      ? "translateX(0)"
                      : label.index === props.points.length - 1
                        ? "translateX(-100%)"
                        : "translateX(-50%)",
                }}
              >
                {formatTick(label.point.startedAt, props.points.length <= 26)}
              </Text>
            )}
          </For>
        </Box>
      </Show>
    </Stack>
  );
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}
