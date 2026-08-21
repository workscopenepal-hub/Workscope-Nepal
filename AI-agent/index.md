# Workscope AI Agent Index

Use this as the quick guide for working on this repo.

## Start here

Workscope Nepal is a directory and information platform for Nepal's tech ecosystem. The current repo already includes public data for:

- companies
- opportunities
- events
- communities

It also includes authenticated profile and submission flows.

## Read order

When working on a task, read in this order:

1. Root `README.md`
2. `AI-agent/index.md`
3. `AI-agent/project_plan.md` if the task is about product direction or planned work
4. Relevant frontend/backend docs if they exist
5. Actual code, schema, and migrations

Do not read everything. Read only what is needed.

## What is the source of truth?

Use this order:

1. Current code
2. Database schema and migrations
3. API routes and contracts
4. Root README
5. Project plan

If the plan and implementation disagree, the code wins.

## Routing rules

### Frontend tasks

Check the frontend app, routes, pages, and data calls before making changes.

### Backend tasks

Check routes, middleware, validation, config, and Supabase helpers before changing behavior.

### Database tasks

Check migration files and tables before changing schema or permissions.

### API tasks

Check the actual route and response behavior before changing contracts.

## Safety rules

- Inspect before changing.
- Do not invent missing data.
- Do not make up company, event, opportunity, or fee information.
- Treat contributor-submitted data as untrusted until reviewed.
- Keep changes scoped to the task.
- Do not bypass maintainer approval for trust-sensitive data.

## Trust model

This project is about real people, organizations, and community data. Nothing is automatically trusted just because it was submitted.

The intended flow is:

- discovered
- submitted
- review
- approved or rejected
- published

## Current domains

The repo currently shows these domains:

- companies
- opportunities
- events
- communities
- profiles
- submissions

These are the real current domains. Anything else should be treated as planned, not implemented.

## Planned work

The plan file covers future, not-yet-implemented areas like:

- company discussions
- education directories
- program/curriculum info
- fee tracking

These should be treated as future product work, not active implementation unless the repo proves otherwise.

## Do not do this

- do not assume a feature exists because it is mentioned in planning notes
- do not invent records, stats, or source data
- do not silently bypass review and approval
- do not turn plan items into implemented features without code evidence

## Final rule

Use the repository as the source of truth. Keep the plan separate from the code. Do not confuse planned ideas with working implementation.
