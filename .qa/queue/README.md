# ECC Runner queue state

## Modes

| Command | Behavior |
|---------|----------|
| `@ecc-runner` | **Batch** — full pipeline per issue, entire queue, one final report |
| `ecc-runner continue` | Resume batch |
| `ecc-runner step` | One phase only (debug) |
| `ecc-runner status` | Snapshot only |

## Files

| File | Purpose |
|------|---------|
| `state.json` | `runMode`, queue, phase, `activeIssue` |
| `runs/issue-<N>.md` | Batch progress log (quiet chat) |
| `SHARED_TASK_NOTES.md` | Cross-issue notes |

## Scripts

`build-queue.sh`, `sync-queue-to-state.sh`, `bootstrap-labels.sh`, `issue-survey.sh`, `stale-lock-check.sh`, `seed-acceptance-from-issue.sh`

Skill: `.cursor/skills/ecc-runner/SKILL.md`
