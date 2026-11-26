# Review rubric

Reviewers check the PR against the linked issue's Definition of Done and DESIGN.md, then against the categories below. Every comment starts with a severity and a category tag:

`[BLOCKER][regression] src/rules/enemy.js:42 - what is wrong - suggested fix`

## Severities
| Severity | Meaning | Blocks approval |
|---|---|---|
| BLOCKER | Breaks the game, breaks existing behavior, or can throw on a reachable path | yes |
| MAJOR | Real problem that will cost us later, or violates the task scope | yes |
| MINOR | Improvement worth mentioning | no |

## Categories, in priority order
1. **breaking-change**: changes a public function signature, state shape, or file contract other modules rely on without updating all callers.
2. **regression**: previously working behavior stops working, or an existing test fails or was weakened/removed.
3. **exception**: unhandled error on a reachable path (undefined access, bad index, NaN, missing null check at a boundary). Include the input that triggers it.
4. **performance**: work in a hot path that grows badly (AI search, per-frame allocations, repeated full-board scans). MINOR unless it visibly hurts at the target depth/size.
5. **readability**: unclear names, files doing more than one job, hidden coupling, dead code. MAJOR only if it blocks understanding; otherwise MINOR.
6. **scope**: changes files outside the issue's "Files owned" or adds unrequested features (MAJOR).

## Rules for reviewers
- Review only what the PR changes. Do not ask for redesigns of untouched code.
- Every BLOCKER/MAJOR must name the file and line, say why, and propose a fix.
- No style nitpicks that a formatter would settle. MINOR comments are capped at 3 per round.
- Approve when no BLOCKER or MAJOR remains. MINOR comments never prevent approval.
- Round limit: 3. In round 3, if BLOCKER/MAJOR items remain, do not request another round: label the PR `pr:escalated` and summarize the disagreement for the owner.
- A reviewer must never edit the PR's code.

## Rules for authors addressing comments
- Fix every BLOCKER and MAJOR, or reply with a reason if you disagree.
- Answer in the comment thread, then push, then set the label back to `pr:needs-review`.
- Do not widen the scope while fixing.
