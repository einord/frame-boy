# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests, hardware smoke/perf suites
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → UX & Accessibility: validation against acceptance criteria
   → Hardware & Resource Validation: performance budgets, instrumentation, telemetry
   → Polish: unit tests, docs, final verification
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
   → Include UX validation and hardware budget verification tasks before release
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Contract test POST /api/users in tests/contract/test_users_post.py
- [ ] T005 [P] Contract test GET /api/users/{id} in tests/contract/test_users_get.py
- [ ] T006 [P] Integration test user registration in tests/integration/test_registration.py
- [ ] T007 [P] Integration test auth flow in tests/integration/test_auth.py
- [ ] T008 Hardware smoke/performance test on Raspberry Pi target in tests/perf/test_sbc_budget.py

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T009 [P] User model in src/models/user.py
- [ ] T010 [P] UserService CRUD in src/services/user_service.py
- [ ] T011 [P] CLI --create-user in src/cli/user_commands.py
- [ ] T012 POST /api/users endpoint
- [ ] T013 GET /api/users/{id} endpoint
- [ ] T014 Input validation
- [ ] T015 Error handling and logging

## Phase 3.4: Integration
- [ ] T016 Connect UserService to DB
- [ ] T017 Auth middleware
- [ ] T018 Request/response logging
- [ ] T019 CORS and security headers

## Phase 3.5: Polish & Validation
- [ ] T020 [P] Unit tests for validation in tests/unit/test_validation.py
- [ ] T021 Performance validation on Raspberry Pi target (<150MB RAM, <40% CPU)
- [ ] T022 [P] UX/accessibility validation against acceptance scenarios
- [ ] T023 [P] Update docs/api.md and user-facing guidance
- [ ] T024 Remove duplication
- [ ] T025 Run manual-testing.md

## Dependencies
- Tests (T004-T008) before implementation (T009-T015)
- T009 blocks T010 and T016
- T017 blocks T019
- Implementation before polish (T020-T025)
- Hardware validation (T021) depends on integration tasks (T016-T019) completing

## Parallel Example
```
# Launch T004-T008 together:
Task: "Contract test POST /api/users in tests/contract/test_users_post.py"
Task: "Contract test GET /api/users/{id} in tests/contract/test_users_get.py"
Task: "Integration test registration in tests/integration/test_registration.py"
Task: "Integration test auth in tests/integration/test_auth.py"
Task: "Hardware smoke/performance test on Raspberry Pi target in tests/perf/test_sbc_budget.py"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests (including hardware smoke/perf) fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts
- Capture resource metrics and UX sign-off evidence before release

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Hardware & UX Compliance**:
   - Performance/resource budgets → hardware validation + instrumentation tasks
   - Accessibility requirements → UX validation/audit tasks

5. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests (including hardware smoke/perf) come before implementation
- [ ] UX/accessibility validation tasks included
- [ ] Hardware/resource validation tasks included
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task