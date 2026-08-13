# Project 06 – Governance Workflow

## Purpose

This document describes the **Human-in-the-Loop governance workflow** implemented in the AI Change Request Impact Analyzer.

The workflow ensures that AI assessment remains advisory and that final project change decisions are recorded by a human governance role.

---

## 1. Governance Principle

The central principle is:

> AI recommends. Humans decide.

The AI assessment can produce a recommendation, but the final change decision is independently recorded.

---

## 2. Supported Governance Decisions

The implemented governance decisions are:

- Approved
- Approved with Conditions
- Rejected
- Request More Information

---

## 3. Governance-to-Status Mapping

| Governance Decision | Change Request Status |
|---|---|
| Approved | Approved |
| Approved with Conditions | Approved |
| Rejected | Rejected |
| Request More Information | Under Assessment |

This mapping was functionally tested across all four configured paths.

---

## 4. Governance Workflow

```text
Saved Impact Assessment
        ↓
Human Review
        ↓
Governance Decision
        ↓
Validate Input
        ↓
Persist Governance Decision
        ↓
Update Change Request Status
        ↓
Return API Response
        ↓
Refresh Change Request Register
```

---

## 5. Governance Input Model

The frontend submits a structured payload similar to:

```json
{
  "change_request_id": 13,
  "assessment_id": 6,
  "decision": "Approved with Conditions",
  "decision_comments": "The assessment supports proceeding with the change subject to completion of the required technical and security controls.",
  "conditions": "Complete security validation, regression testing, and confirmation of implementation readiness before production deployment.",
  "decided_by": "PMO Change Manager"
}
```

---

## 6. Governance Validation

The n8n validation layer checks:

### Change Request ID

Must be a valid positive integer.

### Assessment ID

Must be a valid positive integer or null.

### Decision

Must match one of:

```text
Approved
Approved with Conditions
Rejected
Request More Information
```

### Decided By

Must not be empty.

### Approval Conditions

Required when:

```text
decision = Approved with Conditions
```

---

## 7. Governance Persistence

Governance decisions are stored in PostgreSQL.

Core fields include:

- decision_id
- change_request_id
- assessment_id
- decision
- decision_comments
- conditions
- decided_by
- decided_at

Foreign keys link the governance decision to the relevant change request and impact assessment.

---

## 8. AI Recommendation vs Human Decision

The system preserves both.

Example:

```text
AI Recommendation:
Request More Information

Human Governance Decision:
Approved
```

The human decision does not overwrite the AI recommendation.

This maintains traceability between:

- machine recommendation,
- human judgement,
- and final lifecycle outcome.

---

## 9. Existing Decision Retrieval

When a saved assessment is reopened, the assessment retrieval API also returns the latest associated governance decision.

The frontend then restores:

- Decision
- Decided By
- Decision Comments
- Approval Conditions
- Decision Timestamp

---

## 10. Duplicate Decision Protection

When an assessment already has a governance decision, the frontend:

- populates the saved values,
- disables governance fields,
- disables the submit button,
- and displays:

```text
Governance Decision Recorded
```

This prevents accidental duplicate submissions from the user interface.

Assessments with no saved governance decision remain editable.

---

## 11. Conditional Approval Behavior

When the user selects:

```text
Approved with Conditions
```

the Approval Conditions field becomes visible and required.

For all other decisions, the field remains hidden or non-required.

---

## 12. Tested Governance Paths

### Approved

Expected result:

```text
Change Request Status = Approved
```

Result:

```text
Passed
```

### Approved with Conditions

Expected result:

```text
Change Request Status = Approved
```

Result:

```text
Passed
```

### Rejected

Expected result:

```text
Change Request Status = Rejected
```

Result:

```text
Passed
```

### Request More Information

Expected result:

```text
Change Request Status = Under Assessment
```

Result:

```text
Passed
```

Overall:

```text
4/4 configured governance paths tested successfully
```

---

## 13. Governance Audit Trail

The design maintains traceability across:

```text
Change Request
     ↓
AI Assessment
     ↓
AI Recommendation
     ↓
Human Decision
     ↓
Status Update
```

This creates a clear distinction between decision support and decision authority.

---

## 14. Current Limitations

The current governance implementation does not yet include:

- authenticated users,
- role-based permissions,
- multi-level approvers,
- delegated approval,
- formal Change Approval Board routing,
- electronic signatures,
- or enterprise identity integration.

These are future enhancements and are not claimed as completed capabilities.
