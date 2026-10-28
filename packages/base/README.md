# Domain base classes

`domain/command-domain.ts` owns the shared command-selection behavior used by
ordinary/civilization research and the remaining legacy city command domains.
It declares the command list and implements exact string membership. Concrete
domains retain their activity methods, queue types and business rules.

This is the confirmed domain-base responsibility implemented for real consumers
in #643. The command matcher has no runtime dependencies, database access or
catalog loading. Existing workflow tests and the research command-contract test
exercise the inherited behavior. Run `bun run --cwd packages/base check-types`.

Training, hospital and fortification domains in `troops` also inherit command
matching after #645. Their completion collaborators are injected by the realm.

After #649, `domain/activity-domain.ts` declares the generic prepare/apply lifecycle
and queue types used by Building and the remaining `CityCommandDomain` subclasses.
`contracts/activity.ts` owns the unchanged `TimedActivity`, `PreparedActivity` and
`ActivityAction` declarations. Messages and Enums are direct type dependencies;
Base loads no transport or gameplay catalog. Shared Contracts re-exports these
three types temporarily; the caller inventory and retirement criteria live in
[the migration register](../MIGRATION.md#construction-workflows-649).

Equipment and Workshop also specialize `ActivityDomain` after #651, preserving
Workshop's additional next/acceleration hooks through its concrete class.
