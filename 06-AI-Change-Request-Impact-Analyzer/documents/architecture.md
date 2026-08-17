# Project 06 – Architecture

## Purpose

This document describes the architecture of the **AI Change Request Impact Analyzer**, a portfolio implementation that combines a browser-based frontend, n8n workflow orchestration, PostgreSQL persistence, deterministic analysis, AI-assisted qualitative assessment, and Human-in-the-Loop governance.

The central design principle is:

> AI supports the governance decision; it does not replace the governance decision-maker.

---

## 1. Architectural Overview

The solution is organized into four primary layers:

1. **Presentation Layer**
2. **Automation / API Layer**
3. **Intelligence Layer**
4. **Data Persistence Layer**

The end-to-end flow is:

```text
User
  ↓
Web Frontend
  ↓
n8n Webhook/API Layer
  ↓
Project Context + Deterministic Analysis
  ↓
AI Impact Assessment
  ↓
Structured Validation
  ↓
PostgreSQL Persistence
  ↓
Human Governance Decision
  ↓
Change Request Status Update
  ↓
Change Request Register
```

---

## 2. Presentation Layer

The frontend is implemented using:

- HTML
- CSS
- JavaScript

It provides four primary user-facing capabilities:

### Change Request Submission

Captures structured change-request inputs including:

- Project Code
- Change Title
- Change Description
- Business Reason
- Requested By
- Priority
- Requested Completion Date

### Change Request Register

Displays:

- Change Request Code
- Change Title
- Priority
- Current Status
- Overall Impact
- AI Recommendation
- Assessment Reference

### Impact Assessment Result

Displays the structured AI-assisted assessment including:

- Schedule Rating
- Cost Rating
- Resource Rating
- Technical Rating
- Risk Rating
- Overall Impact
- AI Summary
- Recommendation
- Resource Impact Narrative
- Technical Impact Narrative
- Risk Impact Narrative

### Human-in-the-Loop Governance

Supports:

- Approved
- Approved with Conditions
- Rejected
- Request More Information

Existing governance decisions are retrieved and displayed in a locked state.

---

## 3. Automation / API Layer

n8n provides workflow orchestration and webhook-based API services.

Implemented workflow responsibilities include:

### Change Request Processing

- Receive request
- Validate request
- Retrieve project context
- Build structured change record
- Persist change request
- Build analysis context
- Run deterministic analysis
- Invoke AI assessment
- Validate AI response
- Persist assessment
- Build API response
- Return response to frontend

### Change Request Register API

- Receive GET request
- Retrieve change requests
- Join latest assessment data
- Return register JSON

### Assessment Retrieval API

- Receive assessment ID
- Retrieve saved assessment
- Retrieve project/change context
- Retrieve latest associated governance decision
- Return structured JSON

### Governance Decision Workflow

- Receive governance decision
- Validate decision input
- Persist decision
- Update change-request status
- Return result to frontend

---

## 4. Intelligence Layer

The intelligence layer combines deterministic and AI-assisted analysis.

### Deterministic Analysis

Used for factual calculations that can be derived directly from source data.

Examples:

- Priority Weight
- Days Before Project End
- Schedule Pressure
- Deterministic Analysis Status

### AI-Assisted Assessment

Used for qualitative reasoning across:

- Schedule
- Cost
- Resources
- Technical complexity
- Risk
- Overall impact
- Recommendation

The system intentionally avoids unsupported quantitative estimation.

If effort, rates, vendor pricing, task-level schedules, or resource-capacity data are not supplied, the workflow preserves:

```text
schedule_impact_days = null
cost_impact = null
```

rather than inventing numbers.

---

## 5. Data Persistence Layer

PostgreSQL stores the persistent project-governance records.

Core entities include:

### Projects

Contains project context.

### Change Requests

Contains submitted changes and current lifecycle status.

### Change Impact Assessments

Contains structured assessment output.

### Change Governance Decisions

Contains final human governance decisions.

The relationships provide traceability between:

```text
Project
  ↓
Change Request
  ↓
Impact Assessment
  ↓
Governance Decision
```

---

## 6. Integration Pattern

The browser frontend communicates with n8n using HTTP/JSON webhooks.

Implemented endpoint patterns include:

```text
POST /webhook/change-request
GET  /webhook/change-requests
GET  /webhook/change-assessment?assessment_id={id}
POST /webhook/change-decision
```

These are local development endpoints and are not represented as production-hardened public APIs.

---

## 7. Human Governance Boundary

The architecture deliberately separates:

```text
AI Recommendation
```

from:

```text
Human Governance Decision
```

This allows cases such as:

```text
AI Recommendation:
Request More Information

Human Decision:
Approved with Conditions
```

without overwriting the original AI recommendation.

The architecture therefore preserves:

- AI reasoning traceability
- Human accountability
- Final decision authority
- Audit history

---

## 8. Architecture Diagram

Recommended image:

```text
../images/architecture.png
```

Suggested README reference:

```markdown
![Solution Architecture](../images/architecture.png)
```

---

## 9. Design Principles

The implemented architecture demonstrates:

- Human-in-the-Loop AI governance
- Separation of deterministic and AI logic
- Structured persistence
- Historical assessment retrieval
- Governance traceability
- Unknown-data preservation
- Duplicate governance decision protection
- Clear frontend/backend separation

---

## 10. Current Scope

The architecture represents a locally developed and functionally tested portfolio implementation.

It does not claim:

- enterprise production deployment,
- high availability,
- public cloud deployment,
- security certification,
- formal regulatory compliance,
- or organization-wide production usage.
