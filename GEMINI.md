# Frontpage — Product Challenge

Frontpage is a customizable content aggregator that pulls RSS and Atom feeds into a single, well-designed reading dashboard. This is a **Product Challenge** from [Frontend Mentor](https://www.frontendmentor.io), where the developer is responsible for design decisions, product thinking, and full-stack implementation.

## Directory Overview

This directory contains the specifications, design guidance, and starter assets for the Frontpage project. It is structured to provide both human developers and AI assistants with full context for building the application.

- **`spec/`**: Detailed product and technical requirements.
- **`guidance/`**: Design tokens, UI/UX patterns, and accessibility checklists.
- **`starter/`**: Initial CSS tokens and configuration.
- **`data/`**: Sample RSS feed data (JSON and OPML) for development and the "Guest Experience".
- **`AGENTS.md` / `CLAUDE.md`**: Context files specifically for AI collaboration.

## Key Files

- **`spec/product-definition.md`**: Defines the "What, Who, and Why" of the project.
- **`spec/core-requirements.md`**: Lists 18 features (12 core, 6 stretch) with clear acceptance criteria.
- **`spec/technical-requirements.md`**: Covers database needs, authentication flows, server-side feed fetching (CORS handling), and performance targets.
- **`guidance/brand-kit.md`**: The design source of truth, including color palettes (light/dark), typography, spacing, and mood.
- **`guidance/patterns.md`**: UI/UX do's and don'ts to guide design decisions without a Figma file.
- **`starter/tokens.css`**: CSS custom properties implementing the brand kit.

## Implementation Guide

### Approved Tech Stack
The project follows a modern, full-stack React architecture. See **`frontpage-feed-reader-main/ARCHITECTURE.md`** for the comprehensive technical breakdown (Next.js, Supabase, Drizzle, etc.).

### Project Type
This is a **Non-Code Project** (currently specifications and assets). The developer will create a new application based on the architecture and specs.

### Technical Constraints
- **CORS**: RSS feeds must be fetched server-side (API routes, Edge functions, or a standalone backend).
- **Database**: Requires a real database (Supabase, Firebase, etc.) for users, feeds, items, and read/unread states.
- **Auth**: Real authentication is required (Sign up, Sign in, Guest mode).
- **Guest Mode**: A critical feature where visitors can try the app with pre-loaded curated feeds without logging in.

### Design Principles
- **Clean, calm, content-focused**: The UI should get out of the way.
- **Information Density**: Aim for a balance between "Instapaper comfort" and "Linear density".
- **Responsive**: Mobile-first design is essential.

## Usage for AI
When assisting with this project, always refer to the `spec/` files for feature requirements and `guidance/` for design decisions. The `AGENTS.md` file contains specific instructions for AI collaboration.

- **Specified features**: Implement strictly to the acceptance criteria in `spec/core-requirements.md`.
- **Design decisions**: Use `guidance/brand-kit.md` and `guidance/patterns.md` as the foundation.
- **Technical help**: Follow the guidelines in `spec/technical-requirements.md` for architecture and performance.

## Developer Mandates & Workflow

### Coding Standards
- **Senior TypeScript Instruction**: Write code as a senior professional TypeScript instructor. Prioritize type safety (avoid `any`), clean abstractions, and self-documenting code. Use advanced features like generics, Discriminated Unions, and Utility Types where appropriate to reduce boilerplate and increase safety.
- **Tailwind Best Practices**: Adhere to industry-standard Tailwind practices. Use the `@theme` block in v4 for tokens, maintain a logical order for utility classes (e.g., layout -> box model -> typography -> visuals), and leverage CSS variables for the brand kit colors to keep the implementation clean and maintainable.
- **Readability**: Code must be exceptionally easy to read, follow, and understand. Use descriptive naming and provide concise JSDoc comments for complex logic.

### Phased Execution Workflow
All implementation must follow this iterative, safety-first process:
1.  **Phase Planning**: Break the project into logical phases (e.g., Setup, Auth, Core Data, UI Polish).
2.  **Step-by-Step implementation**: Execute one atomic sub-task at a time.
3.  **Validation**: After every code change, perform immediate testing to ensure there are no errors (linting, type-checking, and functional tests).
4.  **User Confirmation**: Present the completed step to the user for testing. **Do not proceed to the next step until the user explicitly confirms the current one is satisfactory.**
5.  **Commitment**: Once confirmed, stage the changes and commit them with a descriptive, conventional commit message (e.g., `feat(auth): implement anonymous guest login`).
