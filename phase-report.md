# Phantom Audit — Phase Plan & Project Progress Context

**Project:** Phantom Audit
**Project type:** Final-year college project / resume project
**Team size:** 4–5 students
**Architecture:** MERN-based full-stack application with Playwright and local Vision AI

---

# 1. How to Use This Document

Each phase contains:

* Goal
* Deliverables
* Technical work
* Acceptance criteria
* Dependencies
* What comes next

A team member can begin a new chat with:

> We are working on Phantom Audit Phase X. Read `architecture.md` and `phase-report.md` and help us implement this phase.

The assistant should:

1. Read `architecture.md`.
2. Read this phase document.
3. Inspect the current repository.
4. Determine which tasks are actually completed.
5. Distinguish implemented, in progress, and not started work.
6. Avoid implementing later-phase features unless explicitly requested.
7. Preserve earlier interfaces and architecture.

---

# 2. Project Phase Overview

```text
PHASE 0
Project Foundation
        ↓
PHASE 1
Node.js + Express + MongoDB Foundation
        ↓
PHASE 2
Playwright Browser Automation
        ↓
PHASE 3
Checkout Funnel + Evidence Capture
        ↓
PHASE 4
Dark Pattern Detection Engine
        ↓
PHASE 5
Vision AI Integration
        ↓
PHASE 6
Scoring + Bounding Boxes + Results
        ↓
PHASE 7
React Dashboard
        ↓
PHASE 8
Integration + Testing + Evaluation
        ↓
PHASE 9
Historical Price Analysis + Fine-Tuning
OPTIONAL
        ↓
FINAL
Deployment + Documentation + Demo
```

---

# 3. Phase Status

Planning defaults:

| Phase                              | Status               |
| ---------------------------------- | -------------------- |
| 0 — Project Foundation             | COMPLETE/VERIFY      |
| 1 — Node.js + Express + MongoDB    | NOT STARTED / VERIFY |
| 2 — Playwright Browser Automation  | NOT STARTED / VERIFY |
| 3 — Checkout Funnel + Evidence     | NOT STARTED / VERIFY |
| 4 — Dark Pattern Detection         | NOT STARTED / VERIFY |
| 5 — Vision AI                      | NOT STARTED / VERIFY |
| 6 — Scoring + Bounding Boxes       | NOT STARTED / VERIFY |
| 7 — React Dashboard                | NOT STARTED / VERIFY |
| 8 — Integration + Testing          | NOT STARTED / VERIFY |
| 9 — Historical Price + Fine-Tuning | OPTIONAL             |
| Final — Deployment + Documentation | FINAL                |

These statuses are planning defaults and must not be treated as proof of implementation.

---

# 4. Phase 0 — Project Foundation

## Goal

Create the project structure, development environment, Git workflow, and basic documentation.

## Deliverables

* Repository initialized
* GitHub repository created
* Main branch established
* Member branches established
* Frontend project foundation
* Node.js backend foundation
* Basic Playwright project/module
* MongoDB configuration prepared
* Environment configuration prepared
* README
* architecture.md
* phase-report.md
* Basic Git workflow

## Suggested structure

```text
phantom-audit/
├── frontend/
├── backend/
├── automation/
├── data/
│   └── scans/
├── docs/
├── README.md
├── architecture.md
├── phase-report.md
├── .env.example
├── .gitignore
└── docker-compose.yml
```

## Technology setup

### Frontend

* React
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express.js
* TypeScript

### Automation

* Playwright
* Chromium

### Database

* MongoDB

### AI

* Ollama
* Vision model selected later

## Acceptance criteria

Phase 0 is complete when:

* All members can clone the repository.
* Frontend starts successfully.
* Backend starts successfully.
* Playwright can launch Chromium.
* MongoDB can be connected.
* Environment configuration is documented.
* Git workflow is agreed upon.

## Do not do yet

Do not implement:

* Full dark-pattern detection
* Fine-tuning
* Complex dashboard
* Advanced scoring
* Production deployment

---

# 5. Phase 1 — Node.js + Express + MongoDB Foundation

## Goal

Build the backend foundation and minimum data model required to represent scans.

## Main components

```text
Node.js
│
├── Express API
├── Scan Service
├── MongoDB
└── Basic error handling
```

## Core collections/models

### Scan

```text
id
url
status
score
createdAt
startedAt
completedAt
errorMessage
```

### Finding

```text
id
scanId
patternType
severity
confidence
description
pageType
screenshotId
boundingBox
evidence
```

### Screenshot

```text
id
scanId
pageType
filePath
capturedAt
```

## Initial API

```text
POST /api/scans

GET /api/scans/{scanId}

GET /api/scans/{scanId}/findings
```

The architecture also targets:

```text
GET /api/scans/{scanId}/screenshots/{screenshotId}

GET /api/scans/{scanId}/progress
```

## Acceptance criteria

A request such as:

```json
{
  "url": "https://example.com"
}
```

creates a scan record.

The API can:

* Create a scan
* Retrieve a scan
* Return scan status
* Return findings when available

## Testing

Add tests for:

* Scan creation
* Invalid URL
* Scan lookup
* MongoDB persistence

## Dependency

Phase 0 must be complete.

---

# 6. Phase 2 — Playwright Browser Automation

## Goal

Make Phantom Audit capable of opening an authorized e-commerce URL and interacting with the page.

## Tasks

Implement:

* Browser launch
* Page navigation
* Page loading detection
* Element discovery
* Clicking
* Scrolling
* Typing
* Basic waits
* Navigation logging
* Failure handling

## Human-like interaction

Use controlled:

* Bounded randomized delays
* Smooth mouse movement
* Realistic typing intervals
* Scroll behavior
* UI transition waits

Do not build anti-bot bypassing.

## Acceptance criteria

Given an authorized controlled e-commerce page:

```text
URL
 ↓
Browser opens
 ↓
Page loads
 ↓
Product page detected
 ↓
Add-to-cart interaction succeeds
```

Use controlled local/demo websites where possible.

## Do not do yet

* AI detection
* Fine-tuning
* Complete dark-pattern classifier

---

# 7. Phase 3 — Checkout Funnel + Evidence Capture

## Goal

Navigate from product page through the shopping funnel and capture evidence at critical points.

## Target flow

```text
Product
 ↓
Cart
 ↓
Checkout
 ↓
Shipping/information
 ↓
Order Review / Payment Summary
```

## Tasks

Implement:

* Page-type identification
* Add-to-cart handling
* Cart detection
* Checkout detection
* Form interaction where appropriate
* Order-review detection
* Navigation state tracking

## Evidence capture

Capture screenshots at:

* PRODUCT
* CART
* CHECKOUT
* ORDER_REVIEW

Collect:

* Visible text
* Buttons
* Checkboxes
* Radio buttons
* Inputs
* Labels
* Prices
* Fees
* Selected states
* Element coordinates

## Acceptance criteria

A controlled test site can be navigated through:

```text
Product → Cart → Checkout → Review
```

and screenshots are stored for each reachable stage.

## Safety boundary

Never:

* Submit a real payment
* Complete a real purchase
* Enter real payment credentials
* Bypass authentication
* Defeat CAPTCHA/security controls

---

# 8. Phase 4 — Dark Pattern Detection Engine

## Goal

Build the deterministic/structural detection layer.

## Initial patterns

* HIDDEN_FEE
* PRECHECKED_OPTION
* MISLEADING_BUTTON
* FAKE_COUNTDOWN
* INVOICE_INCONSISTENCY
* VISUAL_MANIPULATION

Additional architecture-supported patterns may include:

* FORCED_CONTINUITY
* DISGUISED_AD
* CONFIRM_SHAMING
* TRICK_QUESTION

## Detection sources

Use:

* DOM
* Page state
* Visible text
* Prices
* Selected states
* Structural relationships
* Basic rules

## Example

```text
Checkbox:
checked = true

Label:
"Add Premium Protection — ₹199"

↓

PRECHECKED_OPTION
HIGH
```

## Acceptance criteria

The engine detects the agreed initial patterns on controlled test pages.

Every finding contains:

* Pattern type
* Severity
* Confidence
* Description
* Page type
* Evidence

---

# 9. Phase 5 — Vision AI Integration

## Goal

Connect Phantom Audit to a multimodal vision model.

## Architecture

```text
Node.js
 ↓
Vision Client
 ↓
Ollama / Local API
 ↓
Qwen-2.5-VL / equivalent
 ↓
Structured Result
```

## First objective

Prove:

```text
Screenshot
 ↓
Vision model
 ↓
Dark-pattern classification
```

Do not begin with fine-tuning.

## Model responsibilities

The vision model can analyze:

* Visual hierarchy
* Misleading buttons
* Preselected options
* Countdown/urgency elements
* Disguised choices
* Hidden visual information
* Invoice layouts
* Other visual dark patterns

## Acceptance criteria

The backend can:

1. Send a screenshot to the vision model.
2. Receive a response.
3. Validate the response.
4. Convert it into Phantom Audit findings.
5. Handle model failure without crashing.

---

# 10. Phase 6 — Scoring + Bounding Boxes + Results

## Goal

Combine scanner findings and AI findings into a clear result.

## Pipeline

```text
Browser Evidence
 ↓
Detection
 ↓
Normalize
 ↓
Validate
 ↓
Confidence
 ↓
Severity
 ↓
Bounding Box
 ↓
Score
 ↓
Final Result
```

## Bounding boxes

Use:

```text
x
y
width
height
```

Origin:

```text
top-left of screenshot
```

## Annotated image

The system may generate:

```text
Original screenshot
+
Bounding box
 ↓
Annotated screenshot
```

The original must remain available.

## Compliance score

Use a simple 0–100 score:

```text
100
 ↓
Apply penalties
 ↓
High impact → larger penalty
Medium → moderate penalty
Low confidence → smaller penalty
 ↓
Clamp 0–100
```

The formula must be documented once finalized.

## Acceptance criteria

A completed scan returns:

* Compliance score
* Findings
* Confidence
* Severity
* Evidence
* Screenshots
* Bounding boxes

---

# 11. Phase 7 — React Dashboard

## Goal

Create the user-facing dashboard.

## Screens

### New Scan

* URL input
* Start Scan

### Scan Progress

Show:

* URL
* Current stage
* Progress/status

### Scan Result

Show:

* Compliance score
* Dark patterns found
* Severity breakdown
* Confidence

### Finding Detail

Show:

* Pattern
* Severity
* Confidence
* Explanation
* Evidence
* Screenshot
* Bounding box

## Acceptance criteria

A user can:

```text
Enter URL
 ↓
Start scan
 ↓
See progress
 ↓
See final score
 ↓
Inspect findings
 ↓
Inspect evidence
```

---

# 12. Phase 8 — Full Integration + Testing

## Goal

Connect every component and prove the complete workflow.

```text
React
 ↓
Express
 ↓
Playwright
 ↓
Product
 ↓
Cart
 ↓
Checkout
 ↓
Order Review
 ↓
Screenshots + UI state
 ↓
Detection
 ↓
Vision Model
 ↓
Findings
 ↓
Score
 ↓
Bounding Boxes
 ↓
MongoDB
 ↓
React Dashboard
```

## Integration testing

Test:

* Frontend → Backend
* Backend → Playwright
* Playwright → Evidence
* Backend → Vision model
* Vision model → Findings
* Findings → Score
* Backend → Frontend

## End-to-end test

Use a controlled test e-commerce application containing known patterns.

Expected:

```text
Known pattern
 ↓
Crawler reaches page
 ↓
Evidence captured
 ↓
Pattern detected
 ↓
Correct category
 ↓
Bounding box
 ↓
Score changes
 ↓
Dashboard displays finding
```

## Acceptance criteria

The complete workflow works from URL submission to dashboard result.

---

# 13. Phase 9 — Historical Price / Discount Analysis + Fine-Tuning

**OPTIONAL ADVANCED PHASE**

This phase must not delay the MVP.

It contains:

1. Historical price/discount analysis
2. Vision-model evaluation
3. Optional fine-tuning

## Historical Price Analysis

Goal:

Compare current displayed prices with legitimate historical observations.

Example:

```text
Previous observation: ₹2,999
Current reference/MRP: ₹4,999
Current sale price: ₹2,999
Displayed discount: 40%
```

Possible finding:

```text
POTENTIAL_MISLEADING_DISCOUNT
```

Never fabricate historical prices.

Historical evidence must come from:

* Previous Phantom Audit scans
* Permitted price-history sources
* Controlled historical datasets

## Data model

PriceObservation:

```text
id
productReference
url
observedPrice
displayedReferencePrice
currency
observedAt
```

## Vision evaluation

Compare:

```text
Baseline model
VS
Prompt-optimized model
VS
Fine-tuned model
```

Possible metrics:

* Accuracy
* Precision
* Recall
* F1
* Bounding-box IoU

---

# 14. Final Phase — Deployment + Documentation + Demo

## Goal

Prepare Phantom Audit for final-year evaluation, resume use, and demonstration.

## Deployment

Recommended minimum:

```text
React
Node.js + Express
MongoDB
Playwright/Chromium
Ollama
```

Docker can simplify setup.

## Documentation

Prepare:

* README
* Architecture
* Phase report
* API documentation
* Setup instructions
* Testing documentation
* Model evaluation
* Known limitations

## Final demo

```text
1. Enter URL
 ↓
2. Start scan
 ↓
3. Browser navigates
 ↓
4. Show progress
 ↓
5. Reach order review
 ↓
6. Show detected dark pattern
 ↓
7. Show confidence
 ↓
8. Show bounding box
 ↓
9. Show compliance score
 ↓
10. Explain model-assisted detection
```

---

# 15. Phase Dependencies

```text
Phase 0
   ↓
Phase 1
   ↓
Phase 2
   ↓
Phase 3
   ↓
┌──────────────┐
↓              ↓
Phase 4       Phase 5
└──────┬───────┘
       ↓
    Phase 6
       ↓
    Phase 7
       ↓
    Phase 8
       ↓
    Phase 9
       ↓
    Final
```

Phase 4 and Phase 5 can be developed partly in parallel after Phase 3.

---

# 16. Recommended Team Parallelization

## Early project

### Member 1

Phase 0 → Phase 1

Node.js/Express/MongoDB foundation.

### Member 2

Phase 0 → Phase 2

Playwright foundation.

### Member 3

Phase 0 → Phase 4 preparation

Dark-pattern dataset/rules and AI preparation.

### Member 4

Phase 0 → Phase 7 preparation

React foundation.

### Member 5

Phase 0 → Testing/integration setup

Controlled test websites and integration environment.

## Middle project

```text
Backend → API + MongoDB
Automation → Checkout navigation
Detection → Dark-pattern rules
AI → Vision integration
Frontend → Dashboard
Testing → Controlled test websites
```

Regular integration is required.

---

# 17. Milestone Structure

### Milestone 1 — Foundation

Phase 0

Result:

> Repository and development foundations exist.

### Milestone 2 — Backend + Browser Agent

Phase 1–3

Result:

> Phantom Audit can accept a scan, navigate an authorized e-commerce flow, and collect evidence.

### Milestone 3 — Detection

Phase 4–5

Result:

> Phantom Audit can detect dark patterns using deterministic rules and vision AI.

### Milestone 4 — Product

Phase 6–7

Result:

> Users can see score, findings, confidence, and visual evidence.

### Milestone 5 — Validation

Phase 8

Result:

> The entire workflow is tested end-to-end.

### Milestone 6 — Research / Differentiation

Phase 9

Result:

> Optional price-history analysis and model evaluation provide research depth.

### Milestone 7 — Final Submission

Final Phase

Result:

> Deployable, documented, demo-ready final-year project.

---

# 18. Phase Completion Rule

A phase is COMPLETE only when its acceptance criteria are satisfied.

Use:

```text
NOT STARTED
IN PROGRESS
BLOCKED
COMPLETE
```

Do not mark a phase complete because code exists.

A phase requires working evidence.

---

# 19. Phase Handoff Rule

Before moving to the next phase:

1. Commit working code.
2. Run relevant tests.
3. Update documentation if necessary.
4. Record known limitations.
5. Record important implementation decisions.
6. Confirm next-phase dependencies.

---

# 20. Starting a New Chat

Use:

```text
We are working on Phantom Audit.
Read:
1. architecture.md
2. phase-report.md

Current phase:
PHASE X

Repository state:
[describe or attach repository]

Task:
[what we need to build/fix]

Do not implement features from later phases unless required.
First inspect the existing implementation and identify what is already complete.
```

---

# 21. AI Context Rules

When an AI assistant receives a phase request:

First read:

```text
architecture.md
phase-report.md
```

Then inspect:

```text
repository
source code
tests
configuration
```

Then determine:

```text
CURRENT
PHASE STATUS
TASK
DEPENDENCIES
SCOPE
```

Never assume a planned component is implemented.

Repository evidence wins.

---

# 22. Change Management

If implementation changes the architecture:

```text
Code change
 ↓
Does architecture change?
 ├── NO → Continue
 └── YES
      ↓
Update architecture.md
      ↓
Update phase-report.md if needed
```

Do not silently introduce a major architectural change.

---

# 23. Out-of-Scope Protection

Flag the following as outside the project scope unless explicitly approved:

* Blockchain
* Crypto
* Microservice architecture
* Kafka
* Kubernetes
* Generic vulnerability scanning
* Autonomous purchasing
* Payment execution
* CAPTCHA bypass
* Authentication bypass
* Unrelated AI features
* Large infrastructure without a clear need

---

# 24. Core Success Criteria

At project completion:

* User enters e-commerce URL
* Browser automation starts
* Product page is visited
* Cart is reached
* Checkout/review is reached where supported
* Critical screenshots are captured
* UI evidence is collected
* Dark patterns are detected
* Confidence is reported
* Compliance score is calculated
* Bounding boxes identify visual evidence
* Vision model contributes to analysis
* Results are stored in MongoDB
* React dashboard presents results
* Complete workflow is tested

---

# 25. Final Project Story

> Phantom Audit is an AI-powered e-commerce auditing tool that autonomously browses an authorized shopping flow, detects deceptive dark patterns using browser evidence and computer vision, and presents confidence-scored findings with visual proof.

Technical story:

```text
AUTOMATION
+
COMPUTER VISION
+
AI
+
FULL-STACK TYPESCRIPT DEVELOPMENT
+
SECURITY / UX RESEARCH
```

The project should demonstrate these skills without becoming an unnecessarily large enterprise system.

---

# 26. Final Principle

Build the project vertically and keep the core workflow working at every major milestone.

```text
URL
 ↓
BROWSER
 ↓
CHECKOUT
 ↓
EVIDENCE
 ↓
DETECTION
 ↓
AI
 ↓
SCORE
 ↓
BOUNDING BOX
 ↓
DASHBOARD
```

If this pipeline works reliably, Phantom Audit is a successful project.

Everything else is secondary.
