# Project 01 – AI Meeting-to-Action Tracker

## 1. Overview

The AI Meeting-to-Action Tracker is an intelligent workflow built using n8n and OpenAI that automates the extraction of Action Items, Decisions, Risks, and Issues from meeting minutes.

Instead of manually reviewing meeting notes and updating RAID logs, the workflow uses an AI model to analyze meeting content, generate structured JSON, and automatically populate Google Sheets.

---

## 2. Business Problem

Project managers spend significant time reviewing meeting minutes and manually updating:

- Action Logs
- Decision Logs
- Risk Registers
- Issue Logs

This manual process:

- Consumes valuable project management time
- Creates inconsistent documentation
- Introduces human error
- Delays stakeholder communication

---

## 3. Solution Architecture

![Solution Architecture](images/architecture.png)

The workflow receives meeting notes, sends them to an AI model for analysis, converts the response into structured JSON, and updates dedicated Google Sheets for Actions, Decisions, Risks, and Issues.

---

## 4. Workflow Diagram

![n8n Workflow](images/workflow.png)

Workflow Steps

1. Receive meeting minutes.
2. Send content to GPT-5 Mini.
3. Extract structured information.
4. Parse JSON using JavaScript.
5. Update Google Sheets.
6. Prepare data for future integrations such as Jira, ClickUp, and email notifications.

---

## 5. Tech Stack

| Technology | Purpose |
|------------|---------|
| n8n | Workflow orchestration |
| OpenAI GPT-5 Mini | Information extraction |
| JavaScript | JSON transformation |
| Google Sheets | RAID log storage |
| Docker | Local deployment |
| GitHub | Version control |

---

## 6. n8n Workflow

The workflow consists of:

- Manual Trigger
- Edit Fields
- OpenAI Chat Model
- AI Agent
- JavaScript Parser
- Google Sheets (Actions)
- Google Sheets (Decisions)
- Google Sheets (Risks)
- Google Sheets (Issues)

Workflow JSON:

`workflow/meeting-to-action.json`

---

## 7. Sample Input

Example meeting minutes:

```text
CRM implementation is progressing well.

John will finalize the API integration by Friday.

The steering committee approved the revised implementation schedule.

There is a risk that the vendor may delay hardware delivery.

Issue:
Test environment credentials are still unavailable.
```

---

## 8. Sample AI Output

```json
{
  "actions": [
    {
      "owner": "John",
      "task": "Finalize API integration",
      "due_date": "Friday"
    }
  ],
  "decisions": [
    {
      "decision": "Approved revised implementation schedule"
    }
  ],
  "risks": [
    {
      "risk": "Vendor hardware delivery delay"
    }
  ],
  "issues": [
    {
      "issue": "Test environment credentials unavailable"
    }
  ]
}
```

---

## 9. Google Sheets Output

The extracted information is automatically written into dedicated Google Sheets:

- Action Log
- Decision Log
- Risk Register
- Issue Log

*(Insert a screenshot here)*

---

## 10. Lessons Learned

During this project I learned:

- Prompt engineering for structured AI extraction
- Building AI workflows using n8n
- Parsing JSON with JavaScript
- Integrating OpenAI with Google Workspace
- Designing reusable workflow automation
- Managing AI outputs for enterprise reporting

---

## 11. Future Improvements

Planned enhancements include:

- Outlook email integration
- Microsoft Teams meeting transcript ingestion
- Automatic stakeholder email summaries
- Jira ticket creation
- ClickUp task creation
- Power BI dashboard integration
- Confidence score for AI outputs
- Duplicate action detection

---

## Repository

This project is part of the **AI PMO Automation Portfolio**, demonstrating practical AI solutions for Project Management Offices using modern automation and large language models.
