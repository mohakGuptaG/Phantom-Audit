# Phantom Audit — Architecture & Project Context

**Project type:** Final-year college project / resume project
**Team size:** 4–5 students
**Status:** Target architecture
**Architecture version:** MERN-based backend revision

---

# 1. Scope

Phantom Audit is focused on one core problem:

> Automatically identify deceptive or manipulative e-commerce UI patterns during the shopping and checkout journey.

Examples include:

* Sneaky handling/convenience fees
* Hidden or unexpected charges
* Pre-checked options
* Subverted or misleading buttons
* Fake/urgent countdown timers
* Manipulative wording
* Difficult-to-notice opt-ins
* Invoice/line-item inconsistencies
* Other visually detectable dark patterns approved by the project team

The project should remain focused on this workflow.

## Explicitly out of scope

Do not introduce these unless the team explicitly changes the project scope:

* Blockchain or crypto ledgers
* Enterprise microservice meshes
* Kubernetes
* Complex event-streaming infrastructure
* Generic vulnerability/SAST scanning
* Password/secret scanning
* Autonomous purchasing
* Payment execution
* Unrelated cybersecurity features
* Building an entire browser engine
* Training a foundation model from scratch
* Features unrelated to e-commerce dark-pattern auditing

---

# 2. Core User Journey

The complete product should support:

```text
1. URL INGESTION
        ↓
2. HUMAN-LIKE BROWSER NAVIGATION
        ↓
3. DARK-PATTERN ANALYSIS + SCORING
        ↓
4. VISUAL EVIDENCE + BOUNDING BOXES
        ↓
5. VISION MODEL ANALYSIS
        ↓
RESULTS IN DASHBOARD
```

More concretely:

```text
User enters URL
        ↓
Node.js + Express receives scan request
        ↓
Playwright opens authorized target
        ↓
Navigate product → cart → checkout/review
        ↓
Capture important UI states
        ↓
Extract DOM + visual information
        ↓
Vision model analyzes screenshots/UI states
        ↓
Dark patterns detected
        ↓
Calculate confidence + compliance score
        ↓
Annotate screenshots with bounding boxes
        ↓
Persist scan results in MongoDB
        ↓
React dashboard displays results
```

---

# 3. Target Technology Stack

| Layer               | Technology                     |
| ------------------- | ------------------------------ |
| Frontend            | React + TypeScript             |
| Styling             | Tailwind CSS                   |
| Backend Runtime     | Node.js                        |
| Backend Framework   | Express.js                     |
| Backend Language    | TypeScript                     |
| API                 | REST                           |
| Browser Automation  | Playwright                     |
| Browser             | Chromium                       |
| AI / Vision         | Qwen-2.5-VL or equivalent      |
| Local Model Runtime | Ollama or compatible local API |
| Database            | MongoDB                        |
| Containerization    | Docker where practical         |

The project is now a **MERN-based full-stack application**:

```text
MongoDB
Express.js
React
Node.js
```

TypeScript is used across the JavaScript/Node/React application layers.

Playwright and Ollama remain separate supporting technologies and are not part of the MERN acronym.

---

# 4. High-Level Architecture

```text
┌──────────────────────────┐
│ React UI                 │
│ TypeScript + Tailwind    │
└────────────┬─────────────┘
             │
             │ REST API
             ▼
┌──────────────────────────┐
│ Node.js + Express API    │
│ TypeScript               │
│                          │
│ Scan lifecycle           │
│ Result APIs              │
│ Score calculation        │
│ Model integration        │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Playwright Runner        │
│                          │
│ Browser navigation       │
│ Human-like interaction  │
│ DOM/state collection     │
│ Screenshot capture       │
└────────────┬─────────────┘
             │
       ┌─────┴──────┐
       ▼            ▼
┌────────────┐ ┌───────────────┐
│ UI / Page  │ │ Screenshot    │
│ Evidence   │ │ Evidence      │
│ DOM + text │ │ Product/cart/ │
│ + state    │ │ checkout/review│
└─────┬──────┘ └───────┬───────┘
      └────────┬───────┘
               ▼
┌──────────────────────────┐
│ Vision AI Layer          │
│ Qwen-2.5-VL / equivalent │
│ via Ollama/local API     │
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│ Finding + Score Engine   │
│                          │
│ Pattern type             │
│ Confidence               │
│ Evidence                 │
│ Compliance score         │
│ Bounding-box metadata    │
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│ MongoDB                  │
│                          │
│ Scan metadata            │
│ Finding metadata         │
│ Screenshot references    │
└────────────┬─────────────┘
             ▼
┌──────────────────────────┐
│ React Dashboard          │
│ Score • Findings • Images│
└──────────────────────────┘
```

---

# 5. Component Responsibilities

## 5.1 React Frontend

Responsibilities:

* Accept target URL
* Start scan
* Display scan progress
* Display final compliance score
* Display detected dark patterns
* Display confidence values
* Display screenshots
* Display bounding boxes
* Display evidence/details

Suggested screens:

```text
Dashboard
│
├── New Scan
├── Scan Progress
├── Scan Result
│   ├── Compliance Score
│   ├── Findings
│   └── Evidence
└── Finding Detail
```

React communicates with the backend through REST APIs.

React must not directly communicate with Playwright or Ollama.

---

# 5.2 Node.js + Express Backend

Node.js + Express is the central application layer.

Responsibilities:

* Receive scan requests
* Validate URLs
* Create scan records
* Start/manage scan lifecycle
* Coordinate Playwright
* Receive browser evidence
* Call the vision model
* Normalize model output
* Calculate compliance score
* Store scan results in MongoDB
* Serve results to frontend
* Handle backend errors

Recommended internal separation:

```text
Express Routes
      ↓
Controllers
      ↓
Services
      ↓
Repositories / Data Access
      ↓
MongoDB
```

Browser automation and vision-model clients should remain isolated behind services/interfaces rather than being embedded directly inside Express routes.

---

# 5.3 Playwright Runner

Responsible for:

* Browser navigation
* Interaction
* DOM/UI state collection
* Screenshots
* Checkout-flow handling
* Automation failure handling

Playwright should remain isolated from Express controllers.

---

# 5.4 Vision AI Layer

Responsible for:

* Visual dark-pattern classification
* Invoice/line-item analysis
* Confidence
* Bounding-box suggestions

Target model:

**Qwen-2.5-VL or another suitable compatible vision model.**

Runtime:

**Ollama or another compatible local API.**

The model provider must be isolated behind a small vision client/service so it can be replaced without changing the rest of the application.

---

# 6. Scan Lifecycle

```text
CREATED
   ↓
STARTING
   ↓
NAVIGATING
   ↓
CAPTURING
   ↓
ANALYZING
   ↓
SCORING
   ↓
COMPLETED
```

Failure:

```text
Any active state → FAILED
```

Optional:

```text
Any active state → CANCELLED
```

Do not introduce a distributed job system unless the project later demonstrates a real need.

---

# 7. URL Ingestion

The user submits a single URL, normally an e-commerce homepage or product page.

The backend should:

1. Validate the URL.
2. Ensure the scheme is supported.
3. Create a scan record in MongoDB.
4. Start browser automation.

HTTPS is the normal target.

HTTP may be supported for controlled local testing.

---

# 8. Browser Navigation

Target journey:

```text
Product page
      ↓
Add to cart
      ↓
Cart
      ↓
Checkout
      ↓
Information/shipping
      ↓
Order review/payment summary
```

The exact number of steps varies by website.

The crawler should inspect the current page and choose the next appropriate action rather than assume identical selectors everywhere.

Phantom Audit must never execute a real purchase or payment.

The target endpoint is the final review/payment-summary stage before actual transaction submission.

---

# 9. Human-Like Interaction

The automation may use:

* Randomized but bounded delays
* Human-like mouse movement
* Bezier-style cursor paths
* Realistic typing intervals
* Scrolling
* Waiting for UI state changes
* Clicking visible/interactable elements
* Avoiding unrealistically fast sequences

These techniques are for reliable authorized interaction.

The system must not:

* Bypass CAPTCHA
* Bypass authentication
* Defeat access controls
* Circumvent anti-bot security
* Make real purchases
* Submit payments

If automation is blocked, report the scan as blocked/failed.

---

# 10. Page State Collection

At important stages collect where useful:

### Screenshots

* Product
* Cart
* Checkout
* Order Review

### DOM/UI information

* Visible text
* Buttons
* Checkboxes
* Radio buttons
* Input fields
* Labels
* Prices
* Fees
* Selected states
* Links
* Relevant element coordinates

The analysis layer should receive both visual and structural context.

---

# 11. Evidence Capture

Every important finding should have supporting evidence where possible.

Example:

```text
Finding:
Pre-checked insurance option

Evidence:
Screenshot ID: screenshot-17

Bounding box:
x = 412
y = 681
width = 220
height = 48
```

Another example:

```text
Finding:
Unexpected handling fee

Evidence:
Cart screenshot
Review screenshot

Cart total: ₹999
Review total: ₹1098
Additional fee: ₹99
```

Evidence must make findings understandable to a human reviewer.

---

# 12. Screenshot Bounding Boxes

Preserve:

```text
Original screenshot
+
Finding metadata
+
Bounding box coordinates
```

Bounding box:

```json
{
  "x": 412,
  "y": 681,
  "width": 220,
  "height": 48
}
```

Coordinate system:

```text
Origin: top-left of screenshot
x: horizontal position
y: vertical position
width: box width
height: box height
```

The original screenshot must remain available so annotations can be reproduced.

---

# 13. Dark Pattern Detection

Initial manageable pattern categories:

* HIDDEN_FEE
* PRECHECKED_OPTION
* MISLEADING_BUTTON
* FAKE_COUNTDOWN
* FORCED_CONTINUITY
* DISGUISED_AD
* CONFIRM_SHAMING
* TRICK_QUESTION
* VISUAL_MANIPULATION
* INVOICE_INCONSISTENCY

Prioritize patterns demonstrable through visual/UI evidence.

---

# 14. Detection Pipeline

```text
Browser State
     ↓
Screenshot + UI metadata
     ↓
Deterministic Rules
     +
Vision Model
     ↓
Candidate Findings
     ↓
Validation / Normalization
     ↓
Confidence
     ↓
Bounding Box
     ↓
Compliance Score
     ↓
MongoDB
```

The vision model should not be the only source of truth when deterministic evidence is available.

Examples of deterministic evidence include:

* A paid checkbox is selected
* A fee appears between cart and review
* Cart and review totals differ
* A button's text/state contradicts the expected action

---

# 15. Vision Model

Initial target:

**Qwen-2.5-VL or another compatible vision-language model.**

Architecture:

```text
Node.js + Express
       ↓
Vision Client
       ↓
Ollama / Local API
       ↓
Vision Model
```

The model provider should be isolated behind a small client/service.

---

# 16. Fine-Tuned Model Plan

Fine-tuning is not required before the basic system works.

Recommended progression:

```text
Stage 1 — Existing capable vision model
        ↓
Stage 2 — Structured prompts + examples
        ↓
Stage 3 — Evaluation dataset
        ↓
Stage 4 — Fine-tuning/adaptation if feasible
        ↓
Stage 5 — Compare baseline vs adapted model
```

---

# 17. Vision Model Input

A model request may contain:

* Screenshot
* Relevant UI text
* Page type
* Extracted prices/elements
* Specific analysis instruction

Example:

```text
Page type: Checkout review

Task:
Identify visually deceptive e-commerce patterns.

Look specifically for:
- preselected paid options
- hidden fees
- misleading buttons
- urgency/countdown elements

Return:
- pattern type
- explanation
- confidence
- bounding box
- evidence
```

---

# 18. Structured AI Output

Normalize model responses into a predictable structure.

```json
{
  "findings": [
    {
      "patternType": "PRECHECKED_OPTION",
      "description": "A paid protection option is selected by default.",
      "confidence": 0.91,
      "boundingBox": {
        "x": 412,
        "y": 681,
        "width": 220,
        "height": 48
      }
    }
  ]
}
```

The backend must validate model output before using it.

Malformed AI output must not crash the scan.

---

# 19. Confidence

Every detected pattern should have a confidence value.

Example:

```text
PRECHECKED_OPTION
Confidence: 94%
```

Confidence is the model/system's confidence in the detection.

It is not a legal or certified probability.

Low-confidence findings must be clearly identified.

---

# 20. Compliance Score

Each scan produces:

```text
Dark Pattern Compliance Score
82 / 100
```

Simple explainable approach:

```text
Start at 100
     ↓
Apply penalties
     ↓
Critical/high-impact → larger penalty
Medium → moderate penalty
Low confidence → smaller penalty
     ↓
Clamp to 0–100
```

The exact formula should be finalized and tested by the team.

The score is a summary metric, not a legally certified compliance measurement.

---

# 21. Finding Model

A finding should contain:

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
createdAt
```

Example:

```json
{
  "patternType": "HIDDEN_FEE",
  "severity": "HIGH",
  "confidence": 0.94,
  "pageType": "ORDER_REVIEW",
  "description": "A handling fee appears during final review.",
  "screenshotId": "review-3"
}
```

---

# 22. MongoDB Data Model

Minimum conceptual collections:

### scans

```text
_id
url
status
score
createdAt
startedAt
completedAt
errorMessage
```

### findings

```text
_id
scanId
patternType
severity
confidence
description
pageType
screenshotId
boundingBox
evidence
createdAt
```

### screenshots

```text
_id
scanId
pageType
filePath
capturedAt
```

MongoDB should store metadata and references.

Large screenshots should normally remain as files rather than MongoDB binary documents.

---

# 23. Image Storage

Screenshots should normally be stored as files.

Example:

```text
data/
└── scans/
    └── 42/
        ├── product.png
        ├── cart.png
        ├── checkout.png
        └── review.png
```

MongoDB stores references to these files.

---

# 24. REST API

Target API:

```text
POST /api/scans

GET /api/scans/:scanId

GET /api/scans/:scanId/findings

GET /api/scans/:scanId/screenshots/:screenshotId

GET /api/scans/:scanId/progress
```

Example:

```http
POST /api/scans
```

```json
{
  "url": "https://example-shop.com/product/example"
}
```

Example response:

```json
{
  "scanId": "42",
  "status": "CREATED"
}
```

These are target endpoints and do not prove current implementation.

---

# 25. Error Handling

Possible failures:

* Invalid URL
* Site unreachable
* Navigation timeout
* Unsupported checkout flow
* Automation blocked
* Vision model unavailable
* Malformed model response
* Screenshot failure
* MongoDB failure

The UI should show useful user-facing status rather than internal stack traces.

Example:

```text
Scan could not complete.

Reason:
The checkout review page could not be reached.
```

---

# 26. AI Unavailability

The scanner should remain useful when the local vision model is unavailable.

```text
Playwright
     ↓
Screenshots + UI data
     ↓
AI unavailable
     ↓
"Visual AI analysis unavailable"
```

Where possible, deterministic observations should still be displayed.

Ollama being offline must not make the entire application unusable.

---

# 27. Security Considerations

The project is not a general vulnerability scanner, but the application itself must be reasonably secure.

### URL validation

Validate user-provided URLs.

### SSRF awareness

Because the server may visit user-provided URLs, consider SSRF risks.

Do not blindly allow arbitrary internal/private network access in production.

### File safety

Treat downloaded pages and screenshots as untrusted data.

### Command execution

If Playwright or other tools are launched from Node.js, avoid unsafe shell-string construction and validate arguments.

Prefer safe process APIs.

### Credentials

Never commit credentials to source code.

### Payment safety

Never submit real payment information or complete a real purchase.

---

# 28. Browser Automation Safety

Only audit targets where the team has permission to perform automated testing.

The project must not attempt to:

* Bypass CAPTCHA
* Defeat authentication
* Circumvent access controls
* Exploit anti-bot systems
* Purchase products
* Submit payments

If automation is blocked, report the scan as blocked/failed.

---

# 29. Docker

Docker is recommended where practical.

Conceptually:

```text
docker-compose
│
├── frontend
├── backend
└── mongodb
```

Playwright/Chromium may run within the backend/automation environment depending on implementation.

Ollama may run separately on the host or as another container depending on hardware.

Do not introduce unnecessary infrastructure.

---

# 30. Development Environment

Typical local setup:

```text
Browser
   ↓
React frontend
   ↓
Node.js + Express backend
   │
   ├── Playwright
   ├── MongoDB
   └── Ollama
```

The project should remain runnable on ordinary student development hardware where practical.

Large vision models may require more RAM/VRAM, so model selection must follow actual team hardware.

---

# 31. Team Responsibilities

### Member 1 — Backend

* Node.js
* Express.js
* TypeScript
* REST APIs
* Scan lifecycle
* MongoDB integration
* Data models
* Repositories/data access
* Services
* Result APIs
* Backend integration

### Member 2 — Playwright / Automation

* Playwright
* Chromium
* Navigation
* Interaction
* Checkout flow
* DOM/UI state collection
* Screenshot capture
* Automation failure handling

### Member 3 — AI / Vision + Detection

* Deterministic detection
* Dark-pattern rules
* Vision model
* Ollama
* Prompt design
* Classification
* Confidence
* Bounding boxes
* Dataset/evaluation
* Optional fine-tuning

### Member 4 — React Frontend

* React
* TypeScript
* Tailwind
* Dashboard
* Scan form
* Progress UI
* Results UI
* Finding details
* Evidence visualization
* Bounding boxes

### Member 5 — Integration + Testing + Infrastructure

* Cross-module integration
* End-to-end testing
* Controlled test websites
* Test fixtures
* Docker
* Integration environment
* Regression testing
* Documentation coordination
* Model evaluation infrastructure

For a four-person team, responsibilities can be combined.

---

# 32. Repository Structure

Recommended monorepo:

```text
phantom-audit/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── ...
│   └── package.json
│
├── automation/
│   ├── playwright/
│   └── ...
│
├── data/
│   └── scans/
│
├── docs/
├── docker-compose.yml
├── .env.example
├── README.md
└── architecture.md
```

This is a recommendation, not a requirement to restructure an existing repository.

---

# 33. Testing Strategy

### Backend tests

Test:

* URL validation
* Scan lifecycle
* Score calculation
* Finding normalization
* API responses
* Error handling
* MongoDB persistence

### Playwright tests

Use controlled/demo pages:

* Fake pre-checked checkbox
* Fake hidden fee
* Fake countdown
* Fake misleading button
* Invoice inconsistency

### AI tests

Use fixed screenshots/test fixtures.

Mock model responses for most automated tests so the suite does not require Ollama.

### End-to-end test

At least one complete test:

```text
URL
 ↓
Playwright
 ↓
Screenshot
 ↓
Finding
 ↓
Score
 ↓
API
 ↓
Frontend result
```

---

# 34. Evaluation Dataset

Create a small controlled dataset:

* Normal UI
* Pre-checked option
* Hidden fee
* Fake countdown
* Misleading CTA
* Invoice inconsistency

Each sample should ideally contain:

* Screenshot
* Page type
* Expected pattern
* Bounding box
* Expected severity

---

# 35. Fine-Tuning / Model Evaluation

If time and hardware allow, compare:

```text
Baseline Vision Model
        VS
Prompt-optimized Model
        VS
Fine-tuned Model
```

Possible metrics:

* Accuracy
* Precision
* Recall
* F1
* Bounding-box IoU
* Confidence calibration

Fine-tuning is an enhancement, not a reason to delay the working product.

---

# 36. MVP

The minimum successful Phantom Audit should support:

* Enter URL
* Start scan
* Open target with Playwright
* Navigate through supported checkout flow
* Capture screenshots
* Detect a defined set of dark patterns
* Produce confidence values
* Calculate compliance score
* Store scan results in MongoDB
* Display findings in React
* Show screenshot evidence
* Show bounding boxes
* Integrate a vision model

---

# 37. Optional Extensions

Only consider these after the core workflow works:

* More dark-pattern categories
* Better checkout-flow generalization
* Advanced model fine-tuning
* More detailed analytics
* PDF report export
* Additional browser support
* Historical price analysis
* Legal/policy knowledge retrieval

These must not distract from the core workflow.

---

# 38. Development Principles

Keep the architecture simple.

Prefer:

```text
React
+
Node.js / Express
+
Playwright
+
Vision Model
+
MongoDB
```

over additional infrastructure without a demonstrated need.

Keep interfaces modular.

The vision client should be replaceable.

Browser automation should be isolated from Express routes.

MongoDB access should be isolated behind the backend data layer.

Build vertically.

A working small end-to-end scan is more valuable than five incomplete subsystems.

Recommended development order:

```text
1. URL → Playwright
2. Playwright → screenshots
3. Screenshots → findings
4. Findings → score
5. Backend → MongoDB
6. Backend → React
7. AI improvement
8. Fine-tuning/evaluation
```

---

# 39. AI-Assisted Development Rules

When an AI assistant works on Phantom Audit:

1. Read this file before making architectural assumptions.
2. Inspect the actual repository before claiming a component exists.
3. Treat this document as target architecture, not proof of implementation.
4. Distinguish CURRENT, PLANNED, and PROPOSED.
5. Do not invent endpoints, files, classes, collections, dependencies, or services.
6. Do not introduce unrelated features.
7. Do not add enterprise infrastructure without explicit need.
8. Do not claim tests passed unless actually run.
9. Do not claim a model detected a pattern without evidence.
10. Prefer the smallest implementation satisfying the requirement.

---

# 40. CURRENT vs PLANNED vs PROPOSED

**CURRENT**

Confirmed by repository code/tests/configuration.

**PLANNED**

Described by this architecture but not necessarily implemented.

**PROPOSED**

A new idea suggested during development but not yet accepted.

An AI assistant must never convert PLANNED or PROPOSED architecture into CURRENT facts without repository evidence.

---

# 41. Source-of-Truth Hierarchy

When information conflicts:

1. Actual repository code
2. Tests
3. Existing configuration
4. Accepted team decisions
5. `architecture.md`
6. README/documentation
7. AI assumptions

Repository evidence wins.

---

# 42. Definition of Done

A feature is complete when:

* It satisfies the requested requirement.
* It fits the current architecture.
* It has reasonable error handling.
* Security implications have been considered.
* Relevant tests exist.
* It does not introduce unnecessary infrastructure.
* Documentation is updated if architecture changes.

---

# 43. Final Project Principle

Phantom Audit should remain a focused final-year project with one strong story:

```text
E-COMMERCE URL
       ↓
┌─────────────────────┐
│ Playwright Agent    │
│ Product → Cart      │
│ → Checkout → Review │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Visual Evidence     │
│ + UI State          │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Vision Model        │
│ Dark Patterns       │
│ + Confidence        │
│ + Bounding Box      │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Score + Findings    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ React Dashboard     │
└─────────────────────┘
```

Core philosophy:

**Browse → Observe → Detect → Explain → Show Evidence**

Everything in Phantom Audit should support this workflow.
