# Token Saver Rules for CLI Agent Interaction

## 1. Be Concise and Direct
- Minimal output. No chitchat, preambles, or postambles.
- Focus strictly on the query.

## 2. Optimize Tool Usage
- Use silent/quiet flags where possible.
- Parallelize independent tool calls.
- Consolidate `read_file` calls into single turns.
- Explain critical shell commands briefly before execution.

## 3. Context Management
- Check `WORKFLOW.MD`, `RULES.MD`, `CONTEXT.MD`, `STATUS.MD` before writing long explanations.
- Avoid redundancy. Refer to existing docs.
- Update `STATUS.MD` when user says "note this current state as working".

## 4. Code Modifications
- Use exact replacements with `StrReplaceFile` or `WriteFile`.
- Atomic changes. No comments solely for the agent.
- Follow existing coding style and semantic CSS conventions.

## 5. Semantic CSS Conventions
- **All visual styles** (colors, borders, shadows, fonts, hover states) go in `src/routes/layout.css` as named semantic classes.
- **Tailwind is for layout only** — `flex`, `grid`, `gap-*`, `max-w-*`, responsive prefixes.
- When adding new UI elements, create a semantic class. Don't dump 10 utility classes inline.
- Example: `.toast`, `.login-btn`, `.prompt-card` — not `bg-[#0a0c12] border border-[#6366f1]/60 ...`

## 6. Error Handling
- Concise error reporting. Essential info only.
