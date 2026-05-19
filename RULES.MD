# Token Saver Rules for CLI Agent Interaction

To ensure efficient and cost-effective interactions, adhere to the following token-saving rules:

## 1. Be Concise and Direct
- **Minimal Output:** Aim for fewer than 3 lines of text output per response when practical, excluding tool use/code generation.
- **No Chitchat:** Avoid conversational filler, preambles, or postambles unless part of a `update_topic` summary.
- **Focus Strictly on Query:** Address only the user's query directly.

## 2. Optimize Tool Usage
- **Prefer Quiet Flags:** When using `run_shell_command`, always use silent or quiet flags (e.g., `npm install --silent`, `git --no-pager`) to reduce verbose output.
- **Limit Output:** Use `max_matches_per_file` and `total_max_matches` with `grep_search` and `lines` with `read_background_output` to limit output volume.
- **Parallelize:** Execute multiple independent tool calls in parallel when feasible (e.g., multiple `grep_search` or `read_file` calls).
- **Consolidate `read_file`:** If reading multiple files, make a single turn with parallel `read_file` calls rather than sequential calls across turns.
- **Explain Critical Commands Briefly:** Before `run_shell_command` that modifies state, provide a brief, single-sentence explanation.

## 3. Context Management
- **Leverage Existing MD Files:** Before writing long explanations, check `WORKFLOW.MD`, `RULES.MD`, `CONTEXT.MD`, and `STATUS.MD`. If information is already there, refer to it or update it concisely.
- **Avoid Redundancy:** Do not repeat information already provided in the prompt, previous turns, or in the project's `.md` files.
- **Strategic `update_topic`:** Use `update_topic` only for significant phase changes (e.g., research -> implementation -> testing) or unexpected events. Keep summaries concise.

## 4. Code Modifications
- **Exact Replacements:** For `replace` tool, provide `old_string` and `new_string` as exact literal text, including surrounding context, to minimize ambiguity and re-processing.
- **Atomic Changes:** Break down large code changes into smaller, atomic `replace` operations.
- **No Commenting for Agent:** Do not add comments solely for the agent's benefit within code.

## 5. Error Handling
- **Concise Error Reporting:** When reporting errors, be direct and provide only essential information for diagnosis.

By following these rules, we can maintain an efficient and token-optimized interaction flow.