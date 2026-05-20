# Project Workflow

This document outlines the general workflow for developing within this project.

## 1. Understand the Request
Carefully read and understand the user's request. Identify the core task, any constraints, and desired outcomes.

## 2. Research and Plan
- **Investigate:** Use tools like `list_directory`, `read_file`, `grep_search`, and `glob` to understand the existing codebase, file structure, and conventions.
- **Formulate a Plan:** Based on the investigation, create a clear, step-by-step plan for how to approach the task. This includes identifying files to modify, new files to create, and potential challenges.
- **Confirm (if ambiguous):** If the request is ambiguous or a significant change is implied, ask the user for clarification or confirmation before proceeding.

## 3. Implement Changes
- **Adhere to Conventions:** Follow the existing coding style, structure, and architectural patterns of the project.
- **Use Idiomatic Code:** Ensure changes integrate naturally with the surrounding code.
- **Tool Usage:** Utilize `read_file`, `replace`, `write_file`, and `run_shell_command` as appropriate. Explain critical shell commands before execution.
- **Iterative Development:** Break down complex tasks into smaller, manageable sub-tasks.

## 4. Test and Verify
- **Unit/Integration Tests:** If applicable, write or update tests to cover the new or modified functionality.
- **Run Existing Tests:** Execute the project's existing test suite to ensure no regressions.
- **Linting & Type Checking:** Run project-specific linting and type-checking commands (e.g., `npm run lint`, `tsc`) to maintain code quality.
- **Build:** Perform a project build if necessary to ensure compilation without errors.

## 5. Document (as needed)
- Update `WORKFLOW.MD`, `RULES.MD`, `CONTEXT.MD`, or `STATUS.MD` if there are significant changes to processes, rules, project context, or status.
- **Working State:** When the user explicitly says "note this current state as working", update `STATUS.MD` with the current commit hash and a summary of what's working. This becomes the revert checkpoint.

## 6. Finalize
- Once all steps are complete and verified, consider the task done and await further instructions.
