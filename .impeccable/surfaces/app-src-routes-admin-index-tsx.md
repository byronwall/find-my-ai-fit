---
version: 1
slug: "app-src-routes-admin-index-tsx"
primary_target: "app/src/routes/admin/index.tsx"
related_targets: ["app/src/features/admin-analytics/AnalyticsDashboard.tsx","app/src/features/admin-analytics/AdminLogin.tsx"]
---

## Scope and mode

- Route: `/admin`
- Mode: Operate
- Audience: the product owner checking real adoption and diagnosing activity
- Job: authenticate once, understand traffic and people, then inspect captured events

## Content and constraints

- Use only persisted request and event data; do not imply real-time behavior or benchmarks.
- Keep the event ledger and usage timeline primary.
- Keep admin authentication state and sign-out visible.
- Inherit the cool strategy-workspace visual system and work well on narrow screens.

## Direction

An event-led operations desk: a compact metric strip feeds into one wide shared-scale timeline, followed by the event ledger and ranked paths, events, and visitors. The memorable moment is seeing product events and request traffic share one timeline.

## Open decisions

- Whether longer-term storage should move from the file store to an external analytics database.
- Whether later versions need event filtering, export, or pagination beyond the retained window.
