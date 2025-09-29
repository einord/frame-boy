<!--
Sync Impact Report
Version change: n/a → 1.0.0
Modified principles: N/A (initial adoption)
Added sections: Core Principles; Engineering Guardrails; Delivery Workflow; Governance
Removed sections: None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
Follow-up TODOs: None
-->
# Frame Boy Constitution

## Core Principles

### Maintainable Code First
- Every contribution MUST reduce or hold steady the structural complexity of the codebase; if complexity rises, the merge MUST include a refactor that restores clarity.
- Linters, formatters, and static analysis tools MUST run locally and in CI with zero warnings before code is considered review-ready.
- Publicly consumed modules MUST ship with usage examples and behaviour notes in docs or docstrings kept in sync with the code.
- Architectural decisions that impact more than one module MUST be documented in `docs/adr/` before implementation begins.
- **Rationale**: Sustained readability and explicit design rationale make the system durable and reduce long-term maintenance cost.

### Test-Driven Reliability
- All functional changes MUST follow Red-Green-Refactor: write failing tests first, implement minimal code to pass, then clean up.
- Regression, integration, and performance tests MUST run in CI; merges are blocked on any failure.
- New features MUST add hardware-aware smoke tests that can execute on Raspberry Pi class devices (e.g., Pi 4 with 2GB RAM) or an emulator.
- Bug fixes MUST include a test that fails against the prior behaviour to prevent recurrence.
- **Rationale**: Test-first development provides executable specifications and guards reliability across environments.

### Human-Centred Experience
- Designs MUST be validated against real user journeys before implementation; acceptance criteria live alongside specs and tests.
- Interfaces MUST satisfy accessibility requirements (minimum WCAG 2.1 AA for UI, clear affordances and keyboard access for CLI/TTY flows).
- User-facing copy MUST be reviewed for clarity and localisation readiness before release.
- Features MUST degrade gracefully when optional capabilities (network, GPU, high-resolution displays) are unavailable.
- **Rationale**: Grounding decisions in user experience ensures adoption and reduces support overhead.

### Lean Hardware Footprint
- Baseline performance budgets: <150MB RSS and <40% CPU on Raspberry Pi 4 (2GB) under nominal workload; deviations require written justification and mitigation plan.
- Dependencies MUST be evaluated for footprint; prefer native or lightweight alternatives over heavyweight runtimes.
- Startup sequences MUST complete in <5 seconds on target hardware, or provide background initialisation without blocking critical interactions.
- Instrumentation MUST capture memory, CPU, and I/O metrics to detect regressions after deployment.
- **Rationale**: Resource discipline enables deployments on constrained devices without sacrificing reliability.

## Engineering Guardrails
- Source control MUST remain trunk-based with short-lived feature branches (<3 days) unless a risk review approves otherwise.
- Continuous Integration pipelines MUST finish within 10 minutes on reference hardware; parallelise steps to stay within the budget.
- Configuration defaults MUST optimise for constrained hardware; provide opt-in flags for high-resource features.
- Security updates and dependency patches MUST be evaluated and applied within one release cycle while re-validating resource budgets.

## Delivery Workflow
- Specifications MUST capture user journeys, acceptance tests, and hardware constraints before planning starts.
- Plans MUST articulate constitution compliance checkpoints (code quality, tests, UX, resource budgets) and name responsible owners.
- Implementation MUST proceed test-first; failing tests are required prior to code or documentation merges.
- Releases MUST include UX validation notes, performance metrics on target hardware, and confirmation that documentation matches shipped behaviour.

## Governance
- The constitution supersedes conflicting project processes; exceptions require written approval from the maintainers and MUST include rollback steps.
- Amendments MUST be proposed via pull request referencing the specific clauses affected and the justification; approvals require consensus from core maintainers.
- Versioning follows semantic rules: MAJOR for removals or breaking redefinitions, MINOR for new principles or guardrails, PATCH for clarifications.
- Compliance reviews MUST occur at the end of each release cycle, with findings recorded and triaged before the next cycle begins.

**Version**: 1.0.0 | **Ratified**: 2025-09-29 | **Last Amended**: 2025-09-29
