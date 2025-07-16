# Rule: Generating a PRD for a Minimum Viable Product (MVP)

## Goal

To guide an AI assistant in creating a lean, actionable Product Requirements Document (PRD) for a **Minimum Viable Product (MVP)**. The PRD must define the smallest possible version of a feature that can be built to solve a core problem, deliver value to initial users, and gather crucial feedback.

## Process

1.  **Receive Initial Prompt:** The user provides a brief description or request for a new feature or functionality.
2.  **Ask MVP-Focused Clarifying Questions:** Before writing the PRD, the AI _must_ ask clarifying questions to identify the absolute minimum scope. The goal is to strip the feature down to its essential components. Provide options in letter/number lists for easy selection.
3.  **Generate MVP PRD:** Based on the user's answers, generate a PRD using the lean structure outlined below.
4.  **Save PRD:** Save the generated document as `prd-mvp-[feature-name].md` inside the `/tasks` directory.

## Clarifying Questions for an MVP (Examples)

The AI should adapt its questions based on the prompt, but the focus must be on defining the minimum viable scope.

- **Core Problem:** "What is the single most important problem this MVP must solve for the user?"
- **Core Functionality:** "To solve that one problem, what is the absolute minimum set of actions a user must be able to perform?"
- **Value Proposition:** "What is the primary value a user will get from _only_ this minimum functionality?"
- **Defining "Out of Scope":** "What features, while useful, can we explicitly postpone to a future version? (e.g., advanced settings, reporting, social sharing, etc.)"

## MVP PRD Structure

1.  **MVP Feature Name/Title:** A clear, descriptive name for the core feature.
2.  **Core Problem to Solve:** A concise, one or two-sentence description of the single user problem this MVP addresses.
3.  **MVP User Story:** A simple narrative from the user's perspective, focused on the core task. (e.g., "As a [user type], I want to [perform the core action], so that I can [achieve the core benefit].")
4.  **Core Functional Requirements (MVP Scope):** A numbered list of the essential functionalities. These should be non-negotiable for the MVP to work. All other potential requirements should be excluded.
5.  **Non-Goals (What's Explicitly Out of Scope):** A crucial section listing all features and functionalities that are intentionally being deferred. This prevents scope creep.
6.  **Lean UI/UX Considerations (Optional):** High-level notes on the user interface. Links to simple wireframes are preferred over detailed mockups.
7.  **MVP Success Metrics:** How will we know if this MVP is successful? Focus on 1-2 key metrics. (e.g., "At least 20% of new users successfully complete the core action within their first session.")
8.  **Open Questions:** List any critical questions that still need answers before development can begin.

## Target Audience

Assume the primary reader of the PRD is a **junior developer**. Therefore, requirements should be explicit, unambiguous, and focused on the core logic of the MVP.

## Final instructions

1.  Do NOT start implementing the PRD.
2.  Make sure to ask the user clarifying questions focused on defining the MVP.
3.  Take the user's answers to the clarifying questions and use them to build the MVP PRD.
