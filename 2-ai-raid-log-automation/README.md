# Project 02 – AI RAID Log Automation

## 1. Overview

The **AI RAID Log Automation** workflow is an AI-powered PMO governance solution built using n8n, OpenAI, Google Sheets, Gmail, JavaScript, and Docker.

The workflow analyzes project updates and automatically identifies:

- Risks
- Assumptions
- Issues
- Dependencies

It then applies structured governance logic to generate record IDs, calculate risk scores, prevent duplicate entries, update a centralized RAID register, escalate High and Critical risks, and suppress repeated email alerts.

---

## 2. Business Problem

Project managers regularly review meeting minutes, status reports, emails, and stakeholder updates to identify information that could affect project delivery.

This process is often manual and creates several problems:

- Risks and issues may be identified late
- RAID registers may not be updated consistently
- Duplicate records may be created
- Risk ratings may be subjective
- Owners and mitigation actions may be missing
- Critical risks may not be escalated quickly
- Repeated notifications may create alert fatigue
- Governance processes depend heavily on manual follow-up

A poorly maintained RAID register reduces project visibility and weakens management decision-making.

---

## 3. Solution

The workflow receives an unstructured project update and sends it to an OpenAI model for analysis.

The AI extracts Risks, Assumptions, Issues, and Dependencies in structured JSON format.

The workflow then:

1. Parses and validates the AI response.
2. Splits each RAID category into a separate processing branch.
3. Generates unique record IDs.
4. Creates stable duplicate-detection keys.
5. Calculates risk scores and ratings.
6. Appends new records or updates existing records.
7. Assigns review dates.
8. Identifies High and Critical risks.
9. Checks whether an alert was previously sent.
10. Sends an email only when a new escalation is required.
11. Records the alert in an Alert Log.

---

## 4. Business Value

The solution provides the following business benefits:

- Faster identification of project threats
- Consistent RAID classification
- Reduced manual data entry
- Standardized risk scoring
- Prevention of duplicate RAID records
- Faster escalation of serious risks
- Improved auditability
- Centralized governance information
- Reduced notification fatigue
- Better visibility for project managers and stakeholders

---

## 5. Workflow Diagram

![AI RAID Log Automation Workflow](images/workflow.png)

The workflow contains one central AI extraction process and four separate RAID processing branches.

```text
Manual Trigger
      ↓
Sample Project Update
      ↓
AI Agent – Extract RAID
      ↓
Parse RAID JSON
      │
      ├── Risk Processing
      ├── Assumption Processing
      ├── Issue Processing
      └── Dependency Processing
```

---

## 6. Technology Stack

- n8n
- OpenAI GPT-5 Mini
- Google Sheets API
- Gmail API
- Google OAuth 2.0
- JavaScript
- Docker
- GitHub

---

## 7. Sample Project Update

The workflow currently uses a manual sample input for testing.

![Sample Project Update](images/setup/sample-project-update.png)

```text
Project: CRM Implementation

The vendor has confirmed that the production servers may be delivered five days late, which could delay system testing.

The project team assumes that the customer data migration files will be provided by 5 August 2026.

The Finance department has not yet approved the additional integration budget, and development work is currently blocked.

User acceptance testing depends on completion of the CRM and SAP integration.

The Infrastructure Manager will follow up with the vendor by 2 August 2026.
```

The sample update contains:

- One risk
- One assumption
- One issue
- One dependency

---

## 8. AI RAID Extraction

The AI Agent analyzes the project update and returns structured JSON.

![AI Agent RAID Extraction](images/setup/ai-agent-extract-raid.png)

The expected output structure is:

```json
{
  "project": "CRM Implementation",
  "risks": [
    {
      "title": "Production servers may be delivered late",
      "description": "The vendor has confirmed that the production servers may be delivered five days late.",
      "probability": "Medium",
      "impact": "High",
      "priority": "High",
      "owner": "Infrastructure Manager",
      "due_date": "2026-08-02",
      "mitigation": "Follow up with the vendor and adjust the testing schedule if required.",
      "status": "Open"
    }
  ],
  "assumptions": [
    {
      "title": "Customer data migration files delivery",
      "description": "The project team assumes that the migration files will be provided by 5 August 2026.",
      "owner": "Project team",
      "due_date": "2026-08-05",
      "status": "Open"
    }
  ],
  "issues": [
    {
      "title": "Integration budget approval pending",
      "description": "The integration budget has not been approved and development is blocked.",
      "priority": "Critical",
      "owner": "Finance department",
      "due_date": "",
      "resolution": "Obtain Finance approval to unblock development.",
      "status": "Open"
    }
  ],
  "dependencies": [
    {
      "title": "UAT depends on CRM-SAP integration",
      "description": "User acceptance testing depends on completion of the CRM and SAP integration.",
      "owner": "",
      "due_date": "",
      "status": "Open"
    }
  ]
}
```

---

## 9. JSON Parsing

The AI response is returned as a JSON string and must be converted into structured workflow data.

![Parse RAID JSON](images/setup/parse-raid-json.png)

The Code node:

- Removes markdown code blocks if present
- Validates the JSON response
- Parses the JSON
- Preserves the Project ID
- Makes the RAID arrays available to downstream nodes

The parsed output contains:

```text
project_id
project
risks
assumptions
issues
dependencies
```

---

## 10. Risk Processing

### 10.1 Split Risk

The Risk branch separates each extracted risk into an individual workflow item.

![Split Risk](images/risks/split-risk.png)

---

### 10.2 Generate Risk ID, Score, Rating and Key

The workflow generates a unique Risk ID using:

- Risk prefix
- Timestamp
- Item index

![Generate Risk ID](images/risks/generate-risk-id.png)

Example:

```text
RSK-20260730141604-01
```

The item index prevents ID collisions when multiple risks are processed during the same second.

The same node also calculates:

- Risk Score
- Risk Rating
- Risk Key

---

### 10.3 Risk Scoring

Probability and Impact are converted into numeric values.

| Rating | Numeric Value |
|---|---:|
| Low | 1 |
| Medium | 2 |
| High | 3 |

The calculation is:

```text
Risk Score = Probability × Impact
```

Example:

```text
Probability = Medium = 2
Impact = High = 3

Risk Score = 2 × 3 = 6
```

---

### 10.4 Risk Rating Matrix

The numeric score is converted into a final Risk Rating.

| Risk Score | Risk Rating |
|---:|---|
| 1–2 | Low |
| 3–4 | Medium |
| 6 | High |
| 9 | Critical |

Example:

```text
Probability: Medium
Impact: High
Risk Score: 6
Risk Rating: High
```

The workflow calculates the final rating instead of depending only on the AI-generated priority. This makes the process more consistent and auditable.

---

### 10.5 Duplicate Detection

Generated IDs cannot be used for duplicate detection because they change during every execution.

The workflow therefore creates a stable Risk Key using:

```text
Project ID + normalized risk description
```

Example:

```text
prj-001-vendor-production-server-delivery-delay
```

The normalization process:

- Converts text to lowercase
- Removes special characters
- Replaces spaces with hyphens

The Google Sheets operation is configured as:

```text
Append or Update Row
```

Workflow behavior:

```text
Risk Key exists
→ Update the existing row
```

```text
Risk Key does not exist
→ Append a new row
```

---

### 10.6 Generate Risk Alert Key

The workflow creates a separate key for notification control.

![Generate Risk Alert Key](images/risks/generate-risk-alert-key.png)

The Alert Key combines:

```text
Risk Key + Risk Rating
```

Example:

```text
prj-001-vendor-production-server-delivery-delay-high
```

This allows the workflow to suppress repeated alerts while still sending a new notification if the risk rating changes.

---

### 10.7 Upsert Risk Record

The risk is written to the centralized RAID register.

![Upsert Risk Record](images/risks/upsert-risk-record.png)

The Risks sheet contains:

```text
Risk ID
Risk Key
Project ID
Project
Risk Title
Risk Description
Probability
Impact
Risk Score
Risk Rating
Risk Owner
Mitigation
Status
Last Review Date
Next Review Date
Created Date
Last Updated
```

---

### 10.8 Review Date Automation

The workflow automatically generates review dates.

```text
Last Review Date = Current Date
Next Review Date = Current Date + 7 Days
```

Example:

```text
Last Review Date: 2026-07-30
Next Review Date: 2026-08-06
```

This creates a consistent weekly governance review cycle.

---

### 10.9 High and Critical Risk Check

Only High and Critical risks generate immediate alerts.

![Check High or Critical Risk](images/risks/check-high-critical-risk.png)

The condition is:

```text
Risk Rating = High
OR
Risk Rating = Critical
```

Low and Medium risks are still recorded in the RAID register but do not trigger an immediate email.

---

### 10.10 Search Alert Log

Before sending an email, the workflow searches the Alert Log using the generated Alert Key.

![Search Alert Log](images/risks/search-alert-log.png)

If the key already exists, the alert was previously sent.

If the key does not exist, the workflow continues to the email step.

---

### 10.11 Check if Alert Was Already Sent

![Check Alert Already Sent](images/risks/check-alert-already-sent.png)

The condition checks whether the returned Alert Key is empty.

```text
Alert Key is empty
→ True
→ Send email
```

```text
Alert Key exists
→ False
→ Stop notification path
```

This prevents repeated notifications for the same unchanged risk.

---

### 10.12 Send Risk Alert Email

When a new High or Critical risk is identified, the workflow sends an email through Gmail.

![Send Risk Alert Email](images/risks/send-risk-alert-email.png)

Example subject:

```text
[RAID Alert] High Risk – Production server delivery delay
```

The email contains:

```text
Project ID
Project
Risk ID
Risk Title
Risk Description
Probability
Impact
Risk Score
Risk Rating
Risk Owner
Mitigation
Status
Next Review Date
```

---

### 10.13 Log Risk Alert

After the email is successfully sent, the workflow records the notification in the Alert Log.

![Log Risk Alert](images/risks/log-risk-alert.png)

The Alert Log contains:

```text
Alert Key
Project ID
RAID ID
RAID Type
Title
Rating
Alert Date
Recipient
```

This provides an audit trail and supports duplicate alert suppression.

---

## 11. Assumption Processing

### 11.1 Split Assumptions

The workflow separates each assumption into an individual item.

![Split Assumptions](images/assumptions/split-assumptions.png)

---

### 11.2 Generate Assumption ID and Key

The workflow generates a unique Assumption ID and duplicate-detection key.

![Generate Assumption Key](images/assumptions/generate-assumption-key.png)

Example Assumption ID:

```text
ASM-20260730140402-01
```

The Assumption Key is used to identify and update duplicate assumption records.

---

### 11.3 Upsert Assumption Record

The workflow appends a new assumption or updates an existing assumption in Google Sheets.

![Upsert Assumption Record](images/assumptions/upsert-assumption-record.png)

The Assumptions sheet contains:

```text
Assumption ID
Assumption Key
Project ID
Project
Assumption Title
Assumption Description
Owner
Due Date
Status
Created Date
Last Updated
Last Review Date
Next Review Date
```

---

## 12. Issue Processing

### 12.1 Split Issues

The workflow separates each issue into an individual item.

![Split Issues](images/issues/split-issues.png)

---

### 12.2 Generate Issue ID and Key

The workflow generates a unique Issue ID and duplicate-detection key.

![Generate Issue Key](images/issues/generate-issue-key.png)

Example Issue ID:

```text
ISS-20260730140405-01
```

The Issue Key supports duplicate detection and record updates.

---

### 12.3 Upsert Issue Record

The workflow appends a new issue or updates an existing issue.

![Upsert Issue Record](images/issues/upsert-issue-record.png)

The Issues sheet contains:

```text
Issue ID
Issue Key
Project ID
Project
Issue Title
Issue Description
Owner
Status
Resolution
Severity
Created Date
Last Updated
```

---

## 13. Dependency Processing

### 13.1 Split Dependencies

The workflow separates each dependency into an individual item.

![Split Dependencies](images/dependencies/split-dependencies.png)

---

### 13.2 Generate Dependency ID and Key

The workflow generates a unique Dependency ID and duplicate-detection key.

![Generate Dependency Key](images/dependencies/generate-dependency-key.png)

Example Dependency ID:

```text
DEP-20260730140407-01
```

The Dependency Key supports duplicate detection and record updates.

---

### 13.3 Upsert Dependency Record

The workflow appends a new dependency or updates an existing dependency.

![Upsert Dependency Record](images/dependencies/upsert-dependency-record.png)

The Dependencies sheet contains:

```text
Dependency ID
Dependency Key
Project ID
Project
Dependency Title
Dependency Description
Owner
Due Date
Status
Created Date
Last Updated
Last Review Date
Next Review Date
```

---

## 14. Google Sheets Structure

The RAID workbook contains the following tabs:

```text
Risks
Assumptions
Issues
Dependencies
Alert Log
```

### 14.1 Risks

Stores risk information, probability, impact, score, rating, owner, mitigation, status, IDs, keys, and review dates.

### 14.2 Assumptions

Stores assumptions, owners, due dates, status, IDs, keys, and review dates.

### 14.3 Issues

Stores issues, severity, owners, resolutions, status, IDs, and keys.

### 14.4 Dependencies

Stores dependencies, owners, due dates, status, IDs, keys, and review dates.

### 14.5 Alert Log

Stores a history of sent risk alerts and prevents repeated notifications.

---

## 15. Alert Suppression Logic

Sending an email every time the workflow executes would create repeated alerts.

The workflow prevents this using the Alert Log.

```text
High or Critical Risk
      ↓
Generate Alert Key
      ↓
Search Alert Log
      ↓
Alert Key Found?
```

```text
No
→ Send email
→ Log alert
```

```text
Yes
→ Do not send another email
```

If the risk rating changes, a new Alert Key is generated.

Example:

```text
prj-001-server-delivery-delay-high
```

can later become:

```text
prj-001-server-delivery-delay-critical
```

A new email is then allowed because the risk has escalated.

---

## 16. Workflow Testing

The workflow was tested using the same project update across multiple executions.

### 16.1 First Execution

Expected results:

- RAID records created
- Risk Score calculated
- Risk Rating calculated
- High or Critical risk email sent
- Alert Log record created

### 16.2 Second Execution

Expected results:

- Existing RAID records updated
- No duplicate RAID rows created
- Existing Alert Key detected
- No duplicate email sent
- No duplicate Alert Log row created

The test confirmed that record deduplication and alert suppression work correctly.

---

## 17. Repository Structure

```text
Project-02-AI-RAID-Log-Automation/
│
├── README.md
│
├── workflow/
│   └── project-02-ai-raid-log-automation.json
│
├── images/
│   ├── workflow.png
│   │
│   ├── setup/
│   │   ├── sample-project-update.png
│   │   ├── ai-agent-extract-raid.png
│   │   └── parse-raid-json.png
│   │
│   ├── risks/
│   │   ├── split-risk.png
│   │   ├── generate-risk-id.png
│   │   ├── generate-risk-alert-key.png
│   │   ├── upsert-risk-record.png
│   │   ├── check-high-critical-risk.png
│   │   ├── search-alert-log.png
│   │   ├── check-alert-already-sent.png
│   │   ├── send-risk-alert-email.png
│   │   └── log-risk-alert.png
│   │
│   ├── assumptions/
│   │   ├── split-assumptions.png
│   │   ├── generate-assumption-key.png
│   │   └── upsert-assumption-record.png
│   │
│   ├── issues/
│   │   ├── split-issues.png
│   │   ├── generate-issue-key.png
│   │   └── upsert-issue-record.png
│   │
│   └── dependencies/
│       ├── split-dependencies.png
│       ├── generate-dependency-key.png
│       └── upsert-dependency-record.png
│
├── prompts/
│   └── raid-extraction-prompt.txt
│
└── samples/
    ├── sample-project-update.txt
    └── sample-ai-output.json
```

---

## 18. Key Skills Demonstrated

- AI workflow automation
- PMO governance
- RAID management
- Risk scoring
- Risk escalation
- Structured JSON processing
- Duplicate detection
- Google Sheets integration
- Gmail API integration
- OAuth 2.0 configuration
- JavaScript expressions
- Conditional routing
- Alert suppression
- n8n workflow design
- Data-quality management

---

## 19. Current Limitations

- The workflow currently uses a Manual Trigger
- AI classification may still require human validation
- Owners remain blank when they are not specified in the source
- Only High and Critical risks currently trigger emails
- Duplicate detection depends on normalized text keys
- Google Sheets is suitable for a prototype but not a high-volume enterprise implementation

---

## 20. Future Improvements

Potential future enhancements include:

- Microsoft Teams transcript ingestion
- Gmail project-update ingestion
- SharePoint document processing
- Weekly status-report ingestion
- High and Critical issue alerts
- Automatic overdue-item detection
- Stale RAID item reminders
- Risk ageing analysis
- Executive RAID summaries
- Scheduled weekly RAID reports
- Power BI dashboard integration
- Project master-data validation
- Named-owner escalation
- Human approval before record creation
- Database storage instead of Google Sheets

---

## 21. Lessons Learned

This project demonstrated that AI extraction alone is not enough for a reliable PMO automation solution.

A governed workflow also requires:

- Structured data validation
- Stable duplicate keys
- Record deduplication
- Deterministic risk scoring
- Controlled escalation rules
- Alert history
- Notification suppression
- Consistent naming
- Audit information

The project combines AI interpretation with deterministic business rules to create a more reliable governance workflow.

---

## 22. Conclusion

The AI RAID Log Automation workflow converts raw project updates into structured and governed RAID records.

It combines:

```text
AI Extraction
+ PMO Governance
+ Risk Scoring
+ Duplicate Prevention
+ Automated Escalation
+ Alert Suppression
```

The result is a practical PMO automation solution that improves consistency, visibility, accountability, and response time across project delivery.