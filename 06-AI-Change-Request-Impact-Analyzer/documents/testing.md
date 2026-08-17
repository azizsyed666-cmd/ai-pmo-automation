# Project 06 – Testing and Validation

## Purpose

This document records the functional testing performed for the **AI Change Request Impact Analyzer**.

Testing focused on proving implemented behavior rather than claiming production-grade reliability or performance.

---

## 1. Test Scope

The project was tested across:

- Change Request Submission
- Project Context Retrieval
- Deterministic Analysis
- AI Impact Assessment
- AI Output Validation
- Assessment Persistence
- Change Request Register
- Historical Assessment Retrieval
- Human Governance Decisions
- Change Status Updates
- Existing Decision Retrieval
- Duplicate Submission Protection
- Frontend State Reset

---

## 2. Change Request Submission

### Objective

Confirm that the frontend can submit structured change-request data to the n8n production webhook.

### Result

Passed.

Multiple test change requests were created and persisted successfully.

Examples included:

- Database Backup Validation
- User Access Review
- Automated Session Timeout
- Audit Log Retention
- Privileged Access Monitoring

---

## 3. Project Context Retrieval

### Objective

Confirm that the workflow retrieves the related project context from PostgreSQL.

### Test Context

```text
Project Code: PRJ-001
Project Name: Enterprise CRM Implementation
```

### Result

Passed.

Project fields were included in the analysis context.

---

## 4. Deterministic Analysis

### Objective

Confirm that project/change dates and priority information are processed before AI assessment.

### Example Output

```json
{
  "priority_weight": 2,
  "days_before_project_end": 44,
  "schedule_pressure": "Medium",
  "deterministic_analysis_status": "COMPLETED"
}
```

### Result

Passed.

---

## 5. Unknown Quantitative Data Handling

### Objective

Confirm that missing schedule/cost evidence is not replaced by invented numeric estimates.

### Expected

```text
schedule_impact_days = null
cost_impact = null
```

when required source data is unavailable.

### Result

Passed.

The assessment preserved null values while still producing qualitative analysis.

---

## 6. AI Impact Assessment

### Objective

Confirm that the workflow produces structured multidimensional assessment output.

### Verified Fields

- Schedule Rating
- Cost Rating
- Resource Rating
- Technical Rating
- Risk Rating
- Overall Impact
- Resource Impact
- Technical Impact
- Risk Impact
- AI Summary
- Recommendation

### Result

Passed.

---

## 7. Assessment Persistence

### Objective

Confirm validated assessments are saved to PostgreSQL.

### Result

Passed.

Saved assessment records were successfully retrieved using their assessment IDs.

---

## 8. Change Request Register

### Objective

Confirm the frontend retrieves and renders the change register.

### Verified Fields

- Change Request
- Change Title
- Priority
- Status
- Overall Impact
- Recommendation
- Assessment

### Result

Passed.

The register displayed both assessed and unassessed change requests.

---

## 9. Historical Assessment Retrieval

### Objective

Confirm that clicking an assessment reference retrieves and displays the saved assessment.

### Example

```text
Assessment #6
```

### Result

Passed.

The saved assessment populated the existing assessment dashboard.

---

## 10. Existing Governance Decision Retrieval

### Objective

Confirm that reopening a decided assessment retrieves the saved human decision.

### Verified Fields

- Decision
- Decided By
- Decision Comments
- Approval Conditions

### Result

Passed.

---

## 11. Duplicate Governance Submission Protection

### Objective

Confirm that an existing governance decision cannot be accidentally resubmitted through the frontend.

### Expected Behavior

Existing decision:

```text
Fields disabled
Button disabled
Button text = Governance Decision Recorded
```

Undecided assessment:

```text
Fields enabled
Button enabled
Button text = Record Governance Decision
```

### Result

Passed.

The state also reset correctly when switching from a decided assessment to an undecided assessment without refreshing the browser.

---

## 12. Governance Decision Path Tests

All four configured governance paths were tested.

| Test | Governance Decision | Expected Status | Result |
|---|---|---|---|
| GOV-01 | Approved | Approved | Passed |
| GOV-02 | Approved with Conditions | Approved | Passed |
| GOV-03 | Rejected | Rejected | Passed |
| GOV-04 | Request More Information | Under Assessment | Passed |

Result:

```text
4/4 governance paths passed
```

---

## 13. Approved with Conditions Test

### Example Assessment

```text
CR-013
Assessment #6
```

### Decision

```text
Approved with Conditions
```

### Verified

- Decision persisted
- Conditions persisted
- Decision maker persisted
- Status updated to Approved
- Existing decision reloaded
- Form locked after retrieval

### Result

Passed.

---

## 14. Rejected Test

### Example

```text
CR-014
Assessment #7
```

### Decision

```text
Rejected
```

### Expected Status

```text
Rejected
```

### Result

Passed.

---

## 15. Request More Information Test

### Example

```text
CR-012
Assessment #5
```

### Decision

```text
Request More Information
```

### Expected Status

```text
Under Assessment
```

### Result

Passed.

---

## 16. Approved Test

### Example

```text
CR-011
Assessment #4
```

### Decision

```text
Approved
```

### Expected Status

```text
Approved
```

### Result

Passed.

---

## 17. Data Integrity Issue Identified During Testing

During governance testing, positional SQL query parameters caused text containing commas to shift across fields.

Example symptom:

```text
decided_by = regression testing
```

instead of:

```text
decided_by = PMO Change Manager
```

The workflow was corrected by passing the validated governance payload as a single JSON parameter and extracting fields inside PostgreSQL.

The corrupted test record was removed and the scenario was retested.

### Result

Passed after correction.

---

## 18. Frontend JavaScript Debugging

During frontend changes, a duplicate JavaScript declaration caused:

```text
Uncaught SyntaxError:
Identifier 'governanceSubmitButton' has already been declared
```

The duplicate declaration was removed.

### Verification

After correction:

- JavaScript executed
- Register loaded successfully
- Assessment links worked
- Governance state locking worked

### Result

Passed.

---

## 19. Tested Local Environment

The project was functionally tested using:

- n8n self-hosted
- Docker
- PostgreSQL
- Browser-based frontend
- Local Python HTTP server
- OpenAI API
- macOS development environment

The tests demonstrate local functional behavior only.

---

## 20. Claims Supported by Testing

The current testing supports claims that the project:

- accepts structured change requests,
- performs deterministic analysis,
- generates structured AI-assisted assessments,
- preserves unknown quantitative values,
- persists assessments,
- renders a change register,
- retrieves historical assessments,
- records human governance decisions,
- updates change-request statuses,
- restores existing decisions,
- prevents duplicate frontend decision submission,
- and successfully exercised all four configured governance outcomes.

---

## 21. Claims Not Supported

Testing does not support claims of:

- enterprise production deployment,
- high availability,
- quantified productivity savings,
- quantified cost savings,
- measured assessment accuracy,
- measured decision-quality improvement,
- cybersecurity certification,
- regulatory compliance certification,
- or organization-wide adoption.

---

## 22. Test Summary

| Area | Status |
|---|---|
| Change Request Submission | Passed |
| Project Context Retrieval | Passed |
| Deterministic Analysis | Passed |
| AI Assessment | Passed |
| AI Output Validation | Passed |
| Assessment Persistence | Passed |
| Change Register | Passed |
| Historical Assessment Retrieval | Passed |
| Governance Persistence | Passed |
| Status Synchronization | Passed |
| Existing Decision Retrieval | Passed |
| Duplicate Decision Protection | Passed |
| Governance Paths | 4/4 Passed |

Overall status:

```text
Functional portfolio implementation successfully tested across the implemented Project 06 workflow.
```
