# Project Title: Interactive Business Unit Performance (BUP) Web Application

## 1. Introduction & Project Goal

The goal is to create a Product Requirements Document (PRD) for a new, interactive web application designed for financial performance analysis. This application will replace an existing, limited Tableau dashboard, providing a more intuitive, powerful, and less overwhelming user experience for key financial stakeholders.

## 2. Background: The Current System

- **Current Tool:** A Tableau dashboard built on a flattened CSV data source (see `q4_2024_financial_data.csv`).
- **Dashboard Structure:** The dashboard is split into two main sections:
  - **Top Half (Static Summary):** Displays key summary statistics (e.g., Net Trading Income, Operating Expense, Profit Before Tax). These figures are created as **calculated fields** within Tableau.
  - **Bottom Half (Interactive Details):** Contains detailed expense information and other granular data visualizations that can be filtered and explored.
- **Global Filters:** The entire dashboard view can be toggled between a "Profit Center" and a "Country" view, which successfully updates all visuals.

## 3. The Core Problem & User Frustrations

The primary issue is the **complete lack of interactivity between the top and bottom halves of the dashboard**.

- **Technical Limitation:** The summary statistics in the top half are Tableau-calculated fields. Due to how Tableau handles these calculations (often resulting in blank values for non-applicable rows), they cannot be used as interactive filters for the rest of the dashboard.
- **Poor User Experience (UX):**
  - **No Drill-Down:** Stakeholders (Finance Analysts, Head of Trading) find the summary overview valuable but are frustrated they cannot click on a key metric like "Profit Before Tax" to see what constitutes that number in the detailed visuals below. This breaks their analytical workflow.
  - **Clunky & Inefficient:** The inability to connect high-level summaries with underlying details makes the tool feel clunky and inefficient for deep analysis.
  - **Information Overload:** Presenting all detailed visuals simultaneously makes the dashboard feel overwhelming and difficult to navigate.

## 4. Vision for the New Web Application

The new web application should provide a sophisticated and informative experience that empowers users to explore financial data seamlessly.

- **Overview First:** The application should lead with a clean, front-and-center overview of the key summary statistics, similar to the top half of the current dashboard.
- **Interactive Drill-Down:** This is the most critical requirement. Clicking on any summary metric (e.g., "Non-Operating Income") must trigger an interactive event, such as a **slide-over panel, modal, or dedicated view**.
- **Rich Detailed Views:** This new interactive view should provide a wealth of detailed information that is currently impossible to display, including:
  - Time-series analysis of the selected metric.
  - Detailed breakdowns of income and expenses.
  - Allocation and cost center details.
  - Profit center performance numbers.
  - Relevant FTE (Full-Time Equivalent) figures.
- **Advanced Filtering:** The application must support a dual-layer filtering system. Users should have the ability to apply **global filters** (like currency and accounting period) that affect the entire application, as well as apply **local filters** within a specific drill-down view to further refine their analysis without altering the main dashboard.

## 5. Task: Define the PRD

Based on the context above, the next step is to generate the specific requirements for the PRD, with a strong focus on defining the **User Experience (UX)** and **User Interface (UI)**. The PRD should detail how a user will interact with the application to move from the high-level summary to detailed analysis in an intuitive way.
