# Workflow state machine

GitHub labels are the state. Agents are stateless: each run reads the labels, does one unit of work, writes labels back and exits.

## Task (issue)
`status:proposed` -> (owner approves) -> `status:ready` -> `status:in-progress` -> `status:in-review` -> `status:awaiting-playtest` -> closed

## Pull request
`pr:needs-review` -> `pr:reviewing` -> `pr:changes-requested` -> (dev fixes) -> `pr:needs-review` ... -> `pr:approved`
After 3 rounds with BLOCKER/MAJOR left: `pr:escalated` (owner decides).

## Owner gates
- proposed -> ready: owner changes the label (or replies "approved" on the issue).
- playtest: owner opens the preview link on the PR, then adds `playtest-ok` (automation merges and closes the issue) or `playtest-rejected` plus a comment (a dev run takes the comment as its brief and the PR returns to `pr:needs-review` after the fix).

## Dispatcher priority (max 3 concurrent runs)
1. PRs with `playtest-rejected` (dev, FIX_PLAYTEST)
2. PRs with `smoke:failed` (dev, FIX_CI)
3. PRs with `pr:changes-requested` (dev, FIX_REVIEW)
4. PRs with `pr:needs-review` and no `smoke:failed` (reviewer)
5. Issues with `status:ready`, by priority then points (dev, NEW)
6. `status:proposed` issues where the owner commented after the last planner comment (planner, REVISE)
7. Nothing ready and no `status:proposed` issue waiting for the owner: planner run (PLAN)

## Task rules
- Atomic: one concern, at most 3 points, DOD checkable by a human in under a few minutes.
- A dev only touches the files listed in the issue.
- Each run appends events to the central log (see swarm-log).
