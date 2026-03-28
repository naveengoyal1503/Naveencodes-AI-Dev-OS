# NaveenCodes AI Dev OS Master System

This document defines what the product is, how it works, where Chrome DevTools MCP fits, and how the full user-to-release flow should be understood.

## Product Definition

NaveenCodes AI Dev OS is an AI-powered SaaS platform that helps users:

- build applications from ideas
- convert designs into code
- test websites in a real browser
- detect and fix errors
- optimize SEO, performance, and UI quality
- deploy applications

The product behaves like a coordinated software team inside one platform:

- developer
- designer
- QA tester
- DevOps operator

## Core Architecture

The system is not a browser tool. It is an AI operating system for software delivery.

High-level architecture:

```text
Frontend (Next.js)
        |
        v
Backend API (Fastify / Node.js)
        |
        v
AI Engines + Workflow Orchestration
        |
        v
MCP Integrations
        |
        v
Chrome Browser / Connected Services
```

Practical flow:

```text
AI (Codex / Cursor / platform assistant)
        |
        v
Backend orchestration
        |
        v
Chrome DevTools MCP
        |
        v
Real browser execution
```

## Critical Clarity

What we are building:

- our own SaaS product
- our own AI workflow system
- our own build, test, fix, and deploy experience

What we are not building:

- a Chrome replacement
- a generic DevTools wrapper product
- an MCP-only tool

Chrome DevTools MCP is used only as the browser control and browser testing layer.

## Where MCP Is Used

Chrome DevTools MCP is used in browser-dependent workflows only.

### 1. Website Analysis

- open site
- read DOM
- inspect rendered UI
- collect browser data

### 2. Error Detection

- console errors
- failed requests
- asset failures
- network regressions

### 3. UI Testing

- layout checks
- interaction checks
- responsiveness checks
- visibility and rendering validation

### 4. Performance Testing

- route-level performance signals
- render timing
- LCP and CLS observation
- blocking resource discovery

### 5. User Simulation

- clicks
- typing
- scroll
- navigation
- form input
- checkout and funnel testing

## Where MCP Is Not Used

MCP is not the main engine for:

- project generation
- UI design logic
- AI reasoning
- business analysis
- code planning
- content strategy

Those responsibilities belong to the AI layer and application logic.

## System Capabilities

The full platform includes:

- AI project generator
- Figma to code workflows
- real-time browser testing
- auto-fix engine
- SEO analyzer
- performance optimizer
- ecommerce testing
- GitHub integration
- deployment system
- reports and release health visibility

## User Flow

### Step 1: Login

The user signs into the dashboard and opens a workspace.

### Step 2: Choose Action

The user chooses a primary intent:

- build project
- analyze website
- fix issues
- deploy release

### Step 3A: Build Project

Example input:

`Build blog website`

System behavior:

- generates structure
- defines routes and pages
- proposes UI and content blocks
- prepares implementation outputs

Important:

MCP is not required for generation itself. MCP may be used after generation for browser validation and QA.

### Step 3B: Analyze Website

Example input:

`https://example.com`

System behavior:

- opens site via MCP
- runs browser-based audits
- collects DOM, network, and console signals
- detects UI, performance, and SEO issues

### Step 4: AI Processing

The AI layer:

- collects browser data
- analyzes failures and opportunities
- prioritizes issues
- creates structured reports

### Step 5: Results

The dashboard presents:

- errors
- performance findings
- SEO findings
- UI issues
- action recommendations

### Step 6: Fix

The user chooses `Fix Issues`.

System behavior:

- reads the relevant codebase context
- generates a safe patch plan
- updates code
- re-tests in browser
- confirms whether the fix resolved the issue

This build -> inspect -> patch -> retest loop is one of the product's strongest differentiators.

### Step 7: Deploy

The user chooses `Deploy`.

System behavior:

- builds the project
- prepares deployment output
- pushes preview or production release
- runs health checks and smoke checks
- returns the live URL and release status

Long-term production goal:

- deploy
- verify
- monitor
- rollback if required

## AI Command System

Users can operate the system through natural-language commands such as:

- `Fix UI`
- `Improve SEO`
- `Test checkout`
- `Build blog site`
- `Analyze this website`
- `Deploy preview`

The platform interprets intent, routes the work to the right engine, and returns actionable output.

## Prompting Guide

### Weak Prompt

`check code`

### Better Prompt

`Open site and analyze using browser`

### Best Practice

Prompts should include:

- target
- intent
- scope
- expected outcome

Example:

`Open the pricing page, inspect console and failed requests, then suggest fixes for layout and performance issues.`

## Prompt Templates

### Full Audit

`Open website and check performance, SEO, UI, console, and network issues.`

### Debug

`Open site and detect console errors, failed APIs, and missing assets.`

### UI Fix

`Check alignment, spacing, and responsiveness, then suggest or apply fixes.`

### Performance

`Find slow assets, blocking scripts, and routes that hurt rendering performance.`

### Ecommerce Test

`Simulate product, cart, and checkout flow and report blockers.`

### Auto Fix

`Detect issues, fix them, and re-test the affected flow.`

## Final Model

The product should always be understood as:

- AI brain for reasoning, generation, and orchestration
- MCP layer for real browser control and live validation

Together:

```text
AI + MCP = intelligent build, test, fix, and deploy system
```

## Final Goal

The long-term product goal is simple:

```text
User gives idea
AI builds
AI tests
AI fixes
AI deploys
```

## Simple Summary

MCP is used only for:

- browser testing
- browser data collection
- user simulation

Everything else is driven by the AI platform and application logic.

## Final Line

This is not just a tool.

It is an AI software engineer system.
