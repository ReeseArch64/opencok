## Purpose and game behavior

Describe the player/operator problem, the affected game system, and the
observable behavior before and after this change.

## Related issue and stack

- Issue:
- Stack:
- Depends on:
- Scope:

## Compatibility and changes

- Client tracks:
- Tested setup:
- Components and contracts:
- Game rules:

Describe any effect on other client tracks and label untested combinations
explicitly. For client resources, list the numbered patches and the updated
installation artifact in `install/`; keep `extracted/` and `keys/` read-only.

## Validation

Describe the initial synthetic player/kingdom state, exact actions, and
expected/observed results. Include reconnect or restart checks when saved state
is affected. For documentation or tooling, describe the relevant verification.

| Scenario or command | Client/server setup | Result and evidence |
| ------------------- | ------------------- | ------------------- |
|                     |                     |                     |

List checks not run, why, and any known limitations. Attach sanitized logs,
screenshots, or a recording where they help verify the behavior.

## Deployment, player data, and recovery

Describe configuration changes, migrations, resource compatibility, downtime,
and effects on existing accounts, kingdoms, inventories, or queues. Include
backup and rollback steps and any irreversible effects. Write Not applicable
with a short reason if there is no operational or saved-state impact.

## Checklist

- [ ] This PR links an issue and is one small step in a `gh stack`.
- [ ] The branch and commits follow [CONTRIBUTING.md](https://github.com/ReeseArch64/opencok/blob/develop/.github/CONTRIBUTING.md).
- [ ] Relevant validation and untested compatibility combinations are recorded above.
- [ ] Required documentation, configuration examples, and migration guidance are updated.
- [ ] The diff contains no credentials, keys, player data, private Elex code, or unauthorized client artifacts.
