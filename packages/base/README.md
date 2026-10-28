# Domain base classes

`domain/command-domain.ts` owns the shared command-selection behavior used by
ordinary/civilization research and the remaining legacy city command domains.
It declares the command list and implements exact string membership. Concrete
domains retain their activity methods, queue types and business rules.

This is the confirmed domain-base responsibility implemented for real consumers
in #643. The package has no runtime dependencies, imports, database access or
catalog loading. Existing workflow tests and the research command-contract test
exercise the inherited behavior. Run `bun run --cwd packages/base check-types`.
