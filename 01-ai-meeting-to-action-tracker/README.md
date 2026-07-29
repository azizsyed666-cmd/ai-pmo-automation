# Project 01 – AI Meeting-to-Action Tracker

| **Status** | ✅ Completed |
|------------|--------------|
| **Version** | 1.0 |
| **Category** | AI Workflow Automation |
| **Platform** | n8n + OpenAI GPT-5 Mini |
| **Development Environment** | Docker Desktop (Local) |

---

# 1. Overview

The **AI Meeting-to-Action Tracker** is an AI-powered workflow built using **n8n**, **OpenAI GPT-5 Mini**, **JavaScript**, and **Google Sheets** that automates the extraction of project governance information from meeting minutes.

Instead of manually reviewing meeting notes and updating RAID logs, the workflow analyzes meeting content using an AI model, converts the response into structured JSON, and automatically updates dedicated Google Sheets for:

- Action Items
- Decisions
- Risks
- Issues

This project demonstrates how Large Language Models (LLMs) can automate repetitive PMO activities while improving consistency, traceability, and reporting.

---

# 2. Key Features

- AI-powered meeting minutes analysis
- Automatic extraction of Action Items
- Automatic extraction of Decisions
- Automatic extraction of Risks
- Automatic extraction of Issues
- Structured JSON generation
- Google Sheets integration
- Modular workflow design
- Easily extendable to Jira, ClickUp, Microsoft Teams, and Power BI

---

# 3. Business Problem

Project Managers and PMOs spend significant time reviewing meeting minutes and manually updating governance documents such as Action Logs, Decision Logs, Risk Registers, and Issue Registers.

Manual documentation creates several challenges:

- Time-consuming administrative work
- Inconsistent meeting documentation
- Human error when capturing actions and decisions
- Delayed stakeholder communication
- Outdated RAID logs
- Limited visibility across projects

This project automates the extraction and documentation process using AI, reducing manual effort while improving consistency and governance.

---

# 4. Business Value

This solution helps organizations:

- Reduce manual meeting documentation effort
- Standardize RAID log management
- Improve project governance
- Increase accountability through structured action tracking
- Accelerate stakeholder reporting
- Provide a scalable foundation for AI-powered PMO automation

---

# 5. Solution Architecture

![Solution Architecture](images/architecture.png)

The workflow follows these steps:

1. Receive meeting minutes.
2. Send the transcript to GPT-5 Mini.
3. Extract Actions, Decisions, Risks, and Issues.
4. Convert the AI response into structured JSON.
5. Update dedicated Google Sheets.
6. Prepare the solution for future enterprise integrations.

---

# 6. Workflow Diagram

![n8n Workflow](images/workflow.png)

## Workflow Steps

1. Manual Trigger
2. Capture meeting information
3. AI analysis using GPT-5 Mini
4. JavaScript JSON transformation
5. Update Action Log
6. Update Decision Log
7. Update Risk Register
8. Update Issue Register

---

# 7. Project Statistics

| Metric | Value |
|---------|------:|
| Workflow Nodes | 11 |
| AI Models | GPT-5 Mini |
| Programming Language | JavaScript |
| Integrations | Google Sheets |
| Output Types | 4 |
| Development Environment | Docker + n8n |

---

# 8. Execution Flow

```text
Meeting Minutes
        │
        ▼
GPT-5 Mini Analysis
        │
        ▼
Structured JSON
        │
        ▼
JavaScript Processing
        │
        ▼
Google Sheets
        │
        ├── Action Log
        ├── Decision Log
        ├── Risk Register
        └── Issue Register
        │
        ▼
Future Integrations
```

---

# 9. Tech Stack

| Technology | Purpose | Why Used |
|------------|---------|----------|
| n8n | Workflow Automation | Low-code workflow orchestration |
| OpenAI GPT-5 Mini | AI Processing | Meeting information extraction |
| JavaScript | Data Transformation | JSON parsing and processing |
| Google Sheets | Data Storage | RAID log repository |
| Docker Desktop | Development | Local self-hosted environment |
| GitHub | Version Control | Source code management |

---

# 10. Repository Structure

```text
01-ai-meeting-to-action-tracker/
│
├── README.md
│
├── images/
│   ├── architecture.png
│   └── workflow.png
│
└── workflow/
    └── meeting-to-action.json
```

---

# 11. n8n Workflow

The workflow consists of the following nodes:

- Manual Trigger
- Edit Fields
- OpenAI Chat Model
- AI Agent
- JavaScript Parser
- Google Sheets – Action Log
- Google Sheets – Decision Log
- Google Sheets – Risk Register
- Google Sheets – Issue Register

Workflow Export:

```text
workflow/meeting-to-action.json
```

---

# 12. Sample Input

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

# 13. Sample AI Output

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

# 14. Google Sheets Output

The workflow automatically updates four governance registers:

- ✅ Action Log
- ✅ Decision Log
- ✅ Risk Register
- ✅ Issue Register

> **Screenshot Placeholder**

Insert a screenshot showing the populated Google Sheets after workflow execution.

Example:

```markdown
![Google Sheets Output](images/google-sheets-output.png)
```

---

# 15. Skills Demonstrated

This project demonstrates practical experience with:

- AI Workflow Automation
- Prompt Engineering
- Large Language Models (LLMs)
- n8n Workflow Development
- JavaScript
- JSON Processing
- Google Workspace Integration
- Process Automation
- PMO Governance
- Git & GitHub
- Docker
- AI Solution Design

---

# 16. Lessons Learned

Key learnings from this project include:

- Designing AI workflows using n8n
- Prompt engineering for structured information extraction
- Transforming AI responses into structured JSON
- Integrating OpenAI with Google Sheets
- Building reusable automation components
- Applying AI to automate PMO governance processes
- Managing workflow versioning using GitHub

---

# 17. Future Improvements

Planned enhancements include:

- Microsoft Teams transcript ingestion
- Outlook email integration
- Automatic stakeholder email summaries
- Jira issue creation
- ClickUp task creation
- Monday.com integration
- SharePoint integration
- Power BI dashboard integration
- AI confidence scoring
- Duplicate action detection
- Action owner notifications
- Due-date reminders
- Meeting summary generation

---

# 18. Author

**Syed A Aziz**

AI PMO Automation Portfolio

Dubai, United Arab Emirates

---

# Repository

This project is part of the **AI PMO Automation Portfolio**, a collection of practical AI-powered automation solutions demonstrating how Large Language Models can improve Project Management Office (PMO) processes through workflow automation, intelligent information extraction, and executive reporting.
