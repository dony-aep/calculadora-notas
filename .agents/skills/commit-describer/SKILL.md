---
name: commit-describer
description: Generate professional, context-aware commit titles and descriptions based on code changes. Use this skill whenever the user wants to: write a commit message, describe changes for a git commit, generate a commit title and body, summarize staged or unstaged changes, or create a conventional commit. Trigger on phrases like "describe my commit", "write commit message", "generate commit", "what should I write in my commit", "help me commit", "crear mensaje de commit", "describir commit", "mensaje para el commit". Always use this skill when the user mentions git changes, diffs, or asks for commit help — even indirectly.
---

# Commit Describer

Generate clear, concise, and well-structured commit messages that accurately reflect the changes made — automatically adapting to the language and style of the existing commit history.

---

## Step 1: Detect Available Tools

Check which tools are available for reading the repository. Try in this order:

### Option A — Git CLI
```bash
git status
git diff --staged
git diff
git log --oneline -20
```

### Option B — GitHub CLI
```bash
gh repo view
gh api repos/{owner}/{repo}/commits --jq '.[].commit.message' | head -20
```

### Option C — GitHub MCP
Use available MCP tools to:
- List recent commits from the default branch
- Get the diff of the latest changes or a specific PR

> **Priority**: Always prefer `git` if inside a local repo. Fall back to `gh` or MCP if only remote access is available.

---

## Step 2: Gather Context

### 2a. Get the Changes
Run the following to understand what changed:

```bash
# Staged changes (ready to commit)
git diff --staged --stat
git diff --staged

# Unstaged changes (if nothing staged)
git diff --stat
git diff
```

Focus on:
- Which **files** changed
- What was **added, removed, or modified**
- The **purpose** of the changes (look at function names, variable names, comments, config keys)

### 2b. Analyze Commit History (for language & style)
```bash
git log --oneline -30
git log --format="%s%n%b" -10
```

Look for:
- **Language**: Are messages in English, Spanish, Portuguese, French, etc.?
- **Style**: Imperative ("Add feature") vs. descriptive ("Added feature") vs. conventional commits (`feat:`, `fix:`, `chore:`)
- **Tone**: Formal vs. casual
- **Length**: Short one-liners vs. multi-line with body

> ⚠️ **Match the existing style.** If the project uses `feat: ...` conventional commits in English, follow that. If it uses descriptive Spanish messages, do the same. Never impose a foreign style.

---

## Step 3: Generate the Commit Message

### Structure

```
<title>

<description>
```

### Title Rules
- **Max 72 characters** (50 is ideal)
- Written in the **same language as the repo's history**
- Uses the **same style prefix** if conventional commits are detected (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`, `style:`, `perf:`)
- **Imperative mood** is preferred when the project uses it (e.g., "Add", not "Added" or "Adding")
- Summarizes **what changed**, not how

### Description Rules
- Optional but recommended when the change is non-trivial
- Blank line between title and body
- Explains **why** the change was made and **what impact** it has
- Focuses on the **most important or non-obvious** aspects
- Bullet points (`-`) are acceptable for listing multiple changes
- Max ~72 chars per line for terminal readability
- **Same language as the title**

### What to Highlight
Focus on changes that matter most:
1. New features or behaviors introduced
2. Bugs fixed (briefly describe the issue and the fix)
3. Breaking changes or API modifications
4. Config or dependency changes
5. Refactors that affect structure significantly

Ignore or briefly mention:
- Minor formatting/whitespace
- Trivial variable renames
- Auto-generated changes

---

## Step 4: Present the Result

Present the commit message in a clear code block so it's easy to copy:

```
feat: add user authentication with JWT tokens

Implements login and registration endpoints using JWT for session management.
Adds middleware to protect private routes and returns 401 on unauthorized access.

- POST /auth/login returns access token on success
- POST /auth/register validates email uniqueness
- authMiddleware applied to all /api/user/* routes
```

Then briefly explain:
- Why you chose that title and description
- If uncertain about the language or style, mention it and offer alternatives

---

## Examples by Style

### Conventional Commits (English)
```
fix: prevent crash when user list is empty

Adds a null check before mapping over the users array.
Previously, an undefined response from the API caused an unhandled error.
```

### Descriptive (Spanish)
```
Agrega validación de formulario en el registro de usuarios

Se incorporaron validaciones de longitud mínima y formato de correo electrónico
en el formulario de registro. Los mensajes de error se muestran debajo de cada campo.
```

### Short one-liner (Portuguese)
```
Corrige bug no cálculo de desconto para produtos em promoção
```

### Imperative no-prefix (English)
```
Refactor database connection to use connection pooling

Replaces direct connection instances with a shared pool to reduce overhead
and prevent connection limit errors under high load.
```

---

## Edge Cases

| Situation | Action |
|---|---|
| No commits yet (new repo) | Default to English conventional commits unless user specifies |
| Mixed languages in history | Ask the user which language to use |
| Only whitespace / formatting changes | Use `style:` prefix or equivalent; keep title very short |
| Large diff with many unrelated changes | Warn the user and suggest splitting into multiple commits |
| Commit history not accessible | Ask the user for their preferred language and style |
| Merge commits in history | Ignore them for style analysis |

---

## Quick Reference: Conventional Commit Types

| Type | Use for |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure without behavior change |
| `test` | Adding or fixing tests |
| `chore` | Build process, dependencies, tooling |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration |
| `revert` | Reverts a previous commit |
