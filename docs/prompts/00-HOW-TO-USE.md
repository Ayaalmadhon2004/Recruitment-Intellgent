# How to use these prompts (كيف تستخدمينها)

1. Create an empty project folder. Copy into it: `CLAUDE.md`, the `docs/` folder, and the `VRI-UI` folder renamed to `design-reference/`.
2. Open Claude Code in that folder. Paste prompts one at a time, in order. Start a fresh session (or /clear) between prompts; CLAUDE.md reloads automatically.
3. Do not move to the next prompt until the "Done when" list is true and `pnpm check` passes.
4. Prompts marked GATED need answers from the client. Skip them until the answer exists (see docs/DOMAIN-AND-OPEN-ITEMS.md). Prompts 01 to 05 have no gate and can start now.
5. If Claude Code asks about something unknown, answer "use a placeholder and add it to open items".

ترتيب التنفيذ: 01 إلى 05 بدون أي اعتماد على العميل. 06 و07 جزئياً، 08 و09 تنتظران ردود العميل.
