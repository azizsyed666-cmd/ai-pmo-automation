# Project 06 – Assessment Logic

## Purpose

This document describes how the **AI Change Request Impact Analyzer** evaluates change requests using a hybrid model of deterministic analysis and AI-assisted qualitative assessment.

The assessment logic is designed to distinguish between:

- facts that can be calculated,
- qualitative interpretation,
- and information that is unavailable.

---

## 1. Assessment Pipeline

The assessment sequence is:

```text
Change Request
    ↓
Project Context Retrieval
    ↓
Build Analysis Context
    ↓
Deterministic Analysis
    ↓
AI Impact Assessment
    ↓
Structured Output Validation
    ↓
Assessment Persistence
```

---

## 2. Input Context

The analysis can use fields such as:

### Project Context

- Project ID
- Project Code
- Project Name
- Project Status
- Project Manager
- Project Start Date
- Project Planned End Date
- Project Budget
- Currency

### Change Request Context

- Change Request ID
- Change Request Code
- Change Title
- Change Description
- Business Reason
- Requested By
- Priority
- Requested Completion Date
- Change Status

---

## 3. Deterministic Analysis

Deterministic logic is used where values can be derived directly from source data.

Example outputs include:

```json
{
  "priority_weight": 2,
  "days_before_project_end": 44,
  "schedule_pressure": "Medium",
  "deterministic_analysis_status": "COMPLETED"
}
```

### Priority Weight

Priority can be normalized into a numeric weight for deterministic rules.

Example conceptual mapping:

```text
Low      → 1
Medium   → 2
High     → 3
Critical → 4
```

### Days Before Project End

The workflow compares:

```text
Requested Completion Date
```

against:

```text
Project Planned End Date
```

to determine remaining schedule buffer.

### Schedule Pressure

The workflow converts schedule proximity into a qualitative pressure classification.

The exact threshold logic should remain documented in workflow code if changed.

---

## 4. AI Assessment Dimensions

The AI assessment evaluates five primary dimensions.

| Dimension | Purpose |
|---|---|
| Schedule | Delivery timing and implementation-window pressure |
| Cost | Known or expected financial impact |
| Resource | Team, specialist, and capacity requirements |
| Technical | Integration and implementation complexity |
| Risk | Delivery, operational, security, and project risk |

The workflow also produces:

- Overall Impact
- AI Summary
- Recommendation

---

## 5. Structured Assessment Output

A valid assessment can include:

```json
{
  "schedule_impact_days": null,
  "cost_impact": null,
  "resource_impact": "Narrative assessment",
  "technical_impact": "Narrative assessment",
  "risk_impact": "Narrative assessment",
  "schedule_rating": "Medium",
  "cost_rating": "Low",
  "resource_rating": "Medium",
  "technical_rating": "Low",
  "risk_rating": "Medium",
  "overall_impact": "Medium",
  "ai_summary": "Structured assessment summary",
  "recommendation": "Approve with Conditions"
}
```

---

## 6. Supported Ratings

Qualitative impact ratings used by the workflow include:

```text
Low
Medium
High
Critical
```

Not every test scenario necessarily uses every rating level.

---

## 7. Unsupported Quantitative Data

A core rule is that the AI must not invent quantitative schedule or cost values.

If the change request does not contain enough data to calculate:

- effort,
- person-days,
- resource rates,
- vendor costs,
- licensing costs,
- infrastructure costs,
- or task-level schedule changes,

the workflow returns:

```text
schedule_impact_days = null
cost_impact = null
```

This is deliberate.

The system can still provide qualitative impact ratings and explain what additional information is required.

---

## 8. Example – Session Timeout Change

Example tested change:

```text
CR-013
Implement Automated Session Timeout
```

The deterministic analysis identified a constrained delivery window before project end.

The AI assessment produced qualitative ratings and returned quantitative cost/schedule impact as null because the required source estimates were not supplied.

The recommendation was:

```text
Approve with Conditions
```

---

## 9. Validation Layer

AI output is validated before persistence.

Validation checks ensure:

- expected assessment fields are present,
- rating values are recognized,
- output structure is usable,
- null quantitative values remain valid,
- and malformed responses are not blindly persisted.

The validated result is then written to PostgreSQL.

---

## 10. Assessment Persistence

Saved assessment data includes:

- Assessment ID
- Change Request ID
- Schedule Impact Days
- Cost Impact
- Resource Impact
- Technical Impact
- Risk Impact
- Schedule Rating
- Cost Rating
- Resource Rating
- Technical Rating
- Risk Rating
- Overall Impact
- AI Summary
- Recommendation
- Assessed By
- Assessed At

---

## 11. Historical Retrieval

Assessment records can be retrieved using an assessment ID.

Example:

```text
GET /webhook/change-assessment?assessment_id=6
```

The retrieval API returns:

- project context,
- change request context,
- complete saved assessment,
- and the latest associated governance decision where present.

---

## 12. Assessment Design Principles

The assessment model is built around:

- factual context first,
- deterministic calculations where possible,
- AI reasoning only where interpretation adds value,
- explicit unknown values,
- structured outputs,
- validation before persistence,
- and preservation of the AI recommendation even after human governance decisions.

---

## 13. Limitations

The current model does not provide a verified quantitative estimate when the necessary source data is absent.

It is not represented as:

- a certified financial-estimation model,
- a scheduling engine,
- a formal risk quantification model,
- or a replacement for expert technical estimation.
