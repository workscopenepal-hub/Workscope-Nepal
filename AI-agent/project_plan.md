# Workscope Project Plan

## Purpose

This document is the canonical product plan for Workscope Nepal. It defines the intended product direction, the major phases, and the distinction between what exists today and what is planned.

It is intentionally separate from implementation-specific code and from the AI agent operating guide in `AI-agent/index.md`.

## Product principles

- Build a trusted directory for Nepal's technology ecosystem.
- Start with reliable, discoverable information rather than speculative breadth.
- Treat contributor-submitted information as untrusted until review and approval.
- Keep the product useful to both individuals and the wider ecosystem.
- Prefer clear data structures and reviewable workflows over premature complexity.
- Distinguish current implementation from intended future product scope.

## Current state

The repository currently contains foundational infrastructure for:

- a React + Vite frontend
- a Node.js + Express backend
- Supabase-backed configuration and schema setup
- public reads for companies, opportunities, events, and communities
- authenticated profile and submission flows
- admin review-oriented submission patterns

This means the project has a solid foundation for an information platform, but it is not yet a fully developed directory system with all planned product domains in place.

## Status model

Use the following status labels for plan items:

- Current: implemented and present in the codebase
- Planned: intended future scope
- In Progress: actively being built
- Blocked: requires product or implementation decision
- Deferred: intentionally postponed
- Completed: verified in repository implementation and not merely described in planning docs

Do not mark planned work as completed unless the repository supports it.

## Phase 1 — Company directory foundation

### Objective

Build the largest possible trustworthy directory of Nepal's technology and IT companies.

### Scope

- company identity and basic metadata
- company listing and discovery
- company directory browsing
- alphabetical or searchable organization of company records
- public company API access
- maintainable company data model
- deduplication and normalization discipline
- contributor submission flow for company records
- maintainer review and approval

### Data requirements

The company model should support:

- name
- country or operating location
- address or working location info when relevant
- website links
- source and review status when available

### Trust requirements

Company data must remain subject to review and verification. A broad directory is valuable only if it is credible.

### API requirements

The API should support public reads for directory data and future filtering/searching when needed.

### Completion criteria

This phase is complete only when the repository clearly contains the implemented directory behavior and supporting schema and routes, not merely a conceptual product note.

Status: Current foundation is in place, with future expansion to be driven by implementation requirements.

## Phase 2 — Communities directory

### Objective

Create a discoverable directory of technology communities and relevant groups in Nepal.

### Scope

- communities and interest groups
- public browse and discoverability
- community metadata
- contributor submissions
- maintainer review and approval

### Notes

This is a natural follow-up to the company directory. The initial model should remain simple and useful rather than over-engineered.

Status: Planned

## Phase 3 — Opportunities directory

### Objective

Add opportunity discovery as a core part of the platform.

### Scope

- jobs
- internships
- fellowships
- scholarships
- programs
- competitions
- other career or ecosystem opportunities

### Trust requirements

Opportunity records should include clear provenance when possible and should not be published as authoritative without a review process.

### Additional considerations

- source verification
- expiry or time-sensitive status
- contributor submissions
- maintainer approval
- authoritativeness and public visibility rules

Status: Planned

## Phase 4 — Events directory

### Objective

Support discoverable technology events and community activities.

### Scope

- event titles and descriptions
- organizer information where appropriate
- event metadata
- event discovery
- event submission workflow
- maintainer verification for important event listings

### Notes

Keep the implementation simple and extendable. Event listings should support community discoverability without assuming a complex event system from day one.

Status: Planned

## Phase 5 — Contribution and maintainer review system

### Objective

Make contributor-to-maintainer review a core product capability rather than a side feature.

### Purpose

This is one of the crucial differentiators of the project: the platform should not treat all contributor-submitted information as trusted or final. It should provide a clear editorial and review pipeline.

### Intended flow

```text
Contributor submits information
  -> pending review
  -> maintainer validates
  -> corrections requested if needed
  -> approved or rejected
  -> published canonical data
```

### Core concerns

- contributor identity and permissions
- maintainers as quality gate
- approval status tracking
- re-review and update workflows
- moderation and correction paths
- auditability and trust

Status: Current foundation exists in the schema and routes, but broader product governance should continue to evolve.

## Phase 6 — Company discussion and thread system

### Objective

Support company-specific discussion, feedback, and community conversation.

### Status

Design Required

### Scope under review

- company-specific threads
- replies and comments
- moderation
- reporting and abuse prevention
- contributor identity and anonymous participation
- public vs restricted discussion
- edit history and moderation lifecycle
- trust and reputation concerns

### Rule

This system should not be implemented by assumption. It requires explicit product/design decisions before building.

Status: Deferred until product design is clarified.

## Phase 7 — Education directory

### Objective

Add a technology-education directory for Nepal.

### Overview

This phase should help answer questions like:

- which degrees and programs exist?
- which institutions offer them?
- what do they cover?
- what is the curriculum focus?
- which universities or colleges are involved?

### Phase 7A — Programs and curriculum discovery

#### Scope

- degree and program directory
- university and institutional affiliation
- program type and subject area
- curriculum and course metadata
- technology-related educational pathways

Status: Planned

### Phase 7B — Course fee data

#### Objective

Add fee information for relevant programs.

#### Required trust controls

Fee information is time-sensitive and should only be represented with explicit verification metadata.

The plan should require:

- academic year
- fee source
- last verified date
- status as current or historical
- distinction between official published and estimated values
- maintainer review before publication

Status: Planned, but intentionally later than program/curriculum discovery.

## Future scope

Additional areas may be explored later, but only when the current product foundation is stable and the product decision is clear. Examples may include:

- richer user profiles
- deeper contributor reputation systems
- event calendars and filters
- advanced search and discovery
- more metadata for company and opportunity records
- stronger moderation and reporting capabilities

These remain future possibility areas, not active requirements unless the project plan is updated with clear evidence.

## Explicitly deferred items

The project should explicitly defer work that is not yet supported by the repository or a validated product decision. This includes:

- large-scale feature expansion before the directory foundation is mature
- broad opinion or review systems without governance design
- fabricated data entry or mass seeding without verification
- assumptions about private or sensitive data being public
- sweeping architectural rewrites without task-level evidence

## Completion and status rules

The plan should follow these rules:

1. Do not mark a planned item as completed without repository evidence.
2. Do not silently remove scope from the plan.
3. Do not turn assumptions into project requirements.
4. Keep current, planned, blocked, and deferred work clearly separate.
5. Keep the plan aligned with the actual repository state.
6. Keep coding details out of the product plan.
7. Keep architecture details out of the product plan.
8. Preserve unresolved product decisions as explicit design questions.

## Summary

The central project direction is clear: establish a trustworthy directory platform for Nepal's technology ecosystem, with companies as the initial major domain, followed by communities, opportunities, events, trust mechanisms, and later education discovery. The project plan intentionally distinguishes current implementation from future product scope so AI agents and contributors can work without confusing assumptions with real state.
