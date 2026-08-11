# Project 03 – AI Project Health Scoring

## 1. Overview

The AI Project Health Scoring workflow is an n8n-based PMO automation solution that evaluates project health using deterministic scoring logic across multiple project-control dimensions.

The workflow converts operational project data into:

- Component health scores
- Consolidated RAID Health
- Overall Project Health Score
- RAG status
- Critical override conditions
- Historical health trend
- AI-generated executive interpretation
- Conditional management alerts
- Duplicate-alert suppression

A key design principle is that **AI does not calculate or alter project health scores**.

All scoring is performed using deterministic JavaScript business rules. AI is used only to interpret the calculated result for management.

---

## 2. Business Problem

Project health reporting is often subjective and dependent on manual interpretation.

Common challenges include:

- Inconsistent RAG assessments
- Different scoring approaches between project managers
- Duplicate RAID records affecting reporting accuracy
- Delayed identification of schedule deterioration
- Weak visibility of governance issues
- Manual executive-summary preparation
- Repeated alerts for unchanged conditions
- Limited visibility into project-health trends

The objective of this project was to create a repeatable, transparent, and auditable project-health assessment workflow.

---

## 3. Solution Architecture

The solution separates deterministic scoring from generative AI.

![Solution Architecture](images/architecture.png)

High-level flow:

```text
PMO Source Data
      ↓
n8n Data Collection
      ↓
Deterministic Scoring Engine
      ↓
Component Health Scores
      ↓
Overall Project Health
      ↓
Critical Override Logic
      ↓
Bounded AI Interpretation
      ↓
Historical Trend Analysis
      ↓
Project Health Repository
      ↓
Conditional Alerting
      ↓
Duplicate Alert Suppression