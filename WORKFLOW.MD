# Project Workflow

## 1. Understand the Request
Read and identify the core task, constraints, and desired outcomes.

## 2. Research and Plan
- Investigate codebase with `Glob`, `Grep`, `ReadFile`.
- Formulate a clear plan: files to modify, new files to create.
- Confirm if ambiguous or significant change is implied.

## 3. Implement Changes
- Follow existing coding style and **semantic CSS conventions** (see `RULES.MD`).
- Use `WriteFile`, `StrReplaceFile`, `Shell` as appropriate.
- Break complex tasks into smaller sub-tasks.

## 4. Test and Verify
- Run `npm run build` to ensure compilation.
- Check for regressions.

## 5. Document
- Update `STATUS.MD` when user says "note this current state as working".
- Update `CONTEXT.MD` or `RULES.MD` if processes/rules change.

## 6. Finalize
- Commit with descriptive message.
- Push to GitHub (`git push origin main` — exit code 1 is a false positive, check for `main -> main`).
- Await further instructions.
