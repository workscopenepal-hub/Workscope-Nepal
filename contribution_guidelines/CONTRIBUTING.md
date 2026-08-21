# Contributing to Workscope Nepal

We welcome contributions, but all work should follow a predictable process.

## Before you start

- Read the project docs first: [README.md](../README.md), [AI-agent/README.md](../AI-agent/README.md), and the relevant backend/frontend AI-agent instructions.
- Follow the existing setup instructions in the README before making changes.
- Do not commit secrets, env files, keys, or credentials.

## Fork and branch workflow

1. Fork the repository.
2. Clone your fork locally.
3. Add the original repository as `upstream` and keep your fork as `origin`.
4. Sync with `upstream` before major work.
5. Create a descriptive branch.

Example:

```bash
git clone <your-fork-url>
cd Workscope-Nepal

git remote add upstream <original-repository-url>

git fetch upstream
git checkout main
git pull upstream main

git checkout -b feature/add-company-review-system
```

Use `origin` for your fork and `upstream` for the main project. Do not work directly against the upstream repo.

## AI and coding rules

- Read the relevant AI-agent instructions before editing.
- Follow root AI-agent rules for project-wide work.
- Follow backend AI-agent rules for backend changes.
- Follow frontend AI-agent rules for frontend changes.
- Review all AI-generated code and understand what you are submitting.
- Keep changes scoped to the issue or feature.
- Do not introduce unrelated refactors or formatting churn.
- Follow the repo's existing architecture, naming, API, and component patterns.
- Prefer DRY and simple, maintainable solutions; do not over-engineer.

## Commit and PR expectations

- Keep commits small and meaningful.
- Use descriptive branch names.
- Keep each Pull Request focused on one objective.
- Write a clear PR title and include:
  - What was done
  - What problem it solved
  - What was tested

Example PR checklist:

```text
Tests performed:
- local backend run
- local frontend run
- relevant regression checks
```

For UI changes, add a Jam.dev demo when helpful. For bug fixes, include a brief before/after explanation.

## Testing and review

Before opening a PR:

- run the relevant checks locally
- test the changed behavior
- test nearby regressions
- confirm the final diff is clean and intentional

PRs that ignore these expectations may be rejected without extended review.

## Security

Never commit:

- `.env` files
- API keys or tokens
- passwords or private keys
- database credentials
- cloud/service secrets

If a secret is accidentally exposed, notify maintainers immediately and rotate or revoke it.

## Final checklist

Before opening a PR, confirm:

- [ ] I forked and cloned the repo correctly
- [ ] I followed the README setup instructions
- [ ] I read the relevant AI-agent guidance
- [ ] I used a descriptive branch name
- [ ] My changes are scoped and focused
- [ ] I tested the relevant behavior
- [ ] I did not commit secrets or environment files
- [ ] My PR explains the problem and the fix clearly

That is the intended contribution process for Workscope Nepal: fork, branch, read the rules, build locally, test, keep scope tight, and submit a clear PR.
