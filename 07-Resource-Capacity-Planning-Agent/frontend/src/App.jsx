import { useEffect, useState } from 'react'
import './App.css'

const API_BASE = 'http://localhost:5678/webhook/project07'

function App() {
  const [activeView, setActiveView] = useState('dashboard')

  const [dashboard, setDashboard] = useState(null)
  const [conflicts, setConflicts] = useState([])
  const [scenarios, setScenarios] = useState([])
  const [governance, setGovernance] = useState(null)
  const [weeklyReports, setWeeklyReports] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  function loadDashboard() {
    setLoading(true)
    setError(null)

    fetch(`${API_BASE}/dashboard`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        return response.json()
      })
      .then((data) => {
        setDashboard(data)
        setActiveView('dashboard')
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  function loadConflicts() {
    setLoading(true)
    setError(null)

    fetch(`${API_BASE}/conflicts`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        return response.json()
      })
      .then((data) => {
        setConflicts(data)
        setActiveView('conflicts')
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  function loadScenarios() {
    setLoading(true)
    setError(null)

    fetch(`${API_BASE}/scenarios`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        return response.json()
      })
      .then((data) => {
        setScenarios(data)
        setActiveView('scenarios')
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  function openResourcePlanning() {
    setError(null)
    setActiveView('resource-planning')
  }
function loadGovernance() {
  setLoading(true)
  setError(null)

  fetch(`${API_BASE}/governance`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return response.json()
    })
    .then((data) => {
      const governanceData =
        data?.governance ||
        data?.[0]?.governance ||
        data

      setGovernance(governanceData)
      setActiveView('governance')
      setLoading(false)
    })
    .catch((err) => {
      setError(err.message)
      setLoading(false)
    })
}
  if (loading) {
    return (
      <div className="loading-state">
        Loading Project 07 data...
      </div>
    )
  }

  function loadWeeklyReports() {
  setLoading(true)
  setError(null)

  fetch(`${API_BASE}/weekly-reports`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return response.json()
    })
    .then((data) => {
      const reportData =
        data?.weekly_reports?.reports ||
        data?.[0]?.weekly_reports?.reports ||
        data?.reports ||
        []

      setWeeklyReports(reportData)
      setActiveView('weekly-reports')
      setLoading(false)
    })
    .catch((err) => {
      setError(err.message)
      setLoading(false)
    })
}

  if (error) {
    return (
      <div className="loading-state">
        <p>Unable to load data: {error}</p>

        <button
          className="primary-button"
          onClick={loadDashboard}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">AI</div>

          <div>
            <h2>PMO Capacity</h2>
            <span>Project 07</span>
          </div>
        </div>

        <nav>
          <button
            className={`nav-item ${
              activeView === 'dashboard' ? 'active' : ''
            }`}
            onClick={loadDashboard}
          >
            Portfolio Dashboard
          </button>

          <button
            className={`nav-item ${
              activeView === 'conflicts' ? 'active' : ''
            }`}
            onClick={loadConflicts}
          >
            Conflict Register
          </button>

          <button
            className={`nav-item ${
              activeView === 'scenarios' ? 'active' : ''
            }`}
            onClick={loadScenarios}
          >
            Scenario Analysis
          </button>

          <button
            className={`nav-item ${
              activeView === 'resource-planning' ? 'active' : ''
            }`}
            onClick={openResourcePlanning}
          >
            Resource Planning
          </button>

          <button
            className={`nav-item ${
              activeView === 'governance' ? 'active' : ''
            }`}
            onClick={loadGovernance}
          >
            Governance
          </button>

          <button
            className={`nav-item ${
              activeView === 'weekly-reports' ? 'active' : ''
            }`}
            onClick={loadWeeklyReports}
          >
            Weekly Reports
          </button>

        </nav>
      </aside>

      <main className="main-content">
        {activeView === 'dashboard' && dashboard && (
          <DashboardView dashboard={dashboard} />
        )}

        {activeView === 'conflicts' && (
          <ConflictRegister conflicts={conflicts} />
        )}

        {activeView === 'scenarios' && (
          <ScenarioAnalysis scenarios={scenarios} />
        )}

        {activeView === 'resource-planning' && (
          <ResourcePlanning />
        )}

        {activeView === 'governance' && governance && (
          <GovernanceView governance={governance} />
        )}
        {activeView === 'weekly-reports' && (
          <WeeklyReportsView reports={weeklyReports} />
        )}
      
        </main>
    </div>
  )
}

function DashboardView({ dashboard }) {
  const portfolio = dashboard.portfolio
  const exceptions = dashboard.exceptions || []

  const summary = [
    {
      label: 'Portfolio Utilization',
      value: `${portfolio.portfolio_utilization_pct}%`,
    },
    {
      label: 'Overloaded Resources',
      value: portfolio.overloaded_resources,
    },
    {
      label: 'Critical Resources',
      value: portfolio.critical_resources,
    },
    {
      label: 'Pending Approvals',
      value: portfolio.pending_approvals,
    },
  ]

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">
            AI Resource, Capacity & Governance Planning Agent
          </p>

          <h1>Portfolio Capacity Dashboard</h1>

          <p className="subtitle">
            Capacity Week: {dashboard.week_start_date}
          </p>
        </div>

        <div className="status-badge">
          Portfolio Status:{' '}
          {portfolio.critical_resources > 0
            ? 'Critical'
            : portfolio.overloaded_resources > 0
              ? 'Warning'
              : 'Normal'}
        </div>
      </header>

      <section className="summary-grid">
        {summary.map((item) => (
          <article
            className="summary-card"
            key={item.label}
          >
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Resource Capacity Exceptions</h2>
            <p>Resources requiring management attention</p>
          </div>

          <span className="exception-count">
            {exceptions.length} Exceptions
          </span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Role</th>
                <th>Utilization</th>
                <th>Overallocation</th>
                <th>Severity</th>
                <th>Conflict</th>
                <th>Governance Status</th>
                <th>Decision Owner</th>
              </tr>
            </thead>

            <tbody>
              {exceptions.map((item) => (
                <tr
                  key={`${item.resource_id}-${item.conflict_id}`}
                >
                  <td className="resource-name">
                    {item.resource_name}
                  </td>

                  <td>{item.role}</td>

                  <td>{item.utilization_pct}%</td>

                  <td>{item.overallocation_hours}h</td>

                  <td>
                    <span
                      className={`severity ${
                        item.severity?.toLowerCase()
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>

                  <td>
                    {item.conflict_id
                      ? `#${item.conflict_id}`
                      : '—'}
                  </td>

                  <td>
                    {formatGovernanceStatus(
                      item.governance_status
                    )}
                  </td>

                  <td>
                    {item.decision_owner || 'Not Assigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="lower-grid">
        <article className="panel compact">
          <h2>Governance Position</h2>

          <div className="metric-row">
            <span>Pending Approvals</span>
            <strong>{portfolio.pending_approvals}</strong>
          </div>

          <div className="metric-row">
            <span>Conflicts Without Decision</span>
            <strong>
              {portfolio.conflicts_without_decision}
            </strong>
          </div>

          <div className="metric-row">
            <span>Approved Mitigations</span>
            <strong>
              {portfolio.approved_mitigations}
            </strong>
          </div>

          <div className="metric-row">
            <span>Rejected Mitigations</span>
            <strong>
              {portfolio.rejected_mitigations}
            </strong>
          </div>
        </article>

        <article className="panel compact">
          <h2>Capacity Position</h2>

          <div className="metric-row">
            <span>Total Available Capacity</span>
            <strong>
              {portfolio.total_available_capacity_hours}h
            </strong>
          </div>

          <div className="metric-row">
            <span>Total Demand</span>
            <strong>{portfolio.total_demand_hours}h</strong>
          </div>

          <div className="metric-row">
            <span>Portfolio Utilization</span>
            <strong>
              {portfolio.portfolio_utilization_pct}%
            </strong>
          </div>
        </article>
      </section>
    </>
  )
}

function ConflictRegister({ conflicts }) {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">
            AI Resource, Capacity & Governance Planning Agent
          </p>

          <h1>Conflict Register</h1>

          <p className="subtitle">
            Current resource capacity conflicts
          </p>
        </div>

        <div className="status-badge">
          Open Conflicts: {conflicts.length}
        </div>
      </header>

      <section className="panel">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Conflict</th>
                <th>Resource</th>
                <th>Department</th>
                <th>Week</th>
                <th>Utilization</th>
                <th>Overallocation</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Governance</th>
                <th>Decision Owner</th>
              </tr>
            </thead>

            <tbody>
              {conflicts.map((item) => (
                <tr key={item.conflict_id}>
                  <td>#{item.conflict_id}</td>
                  <td className="resource-name">
                    {item.resource_name}
                  </td>
                  <td>{item.department}</td>
                  <td>{item.week_start_date}</td>
                  <td>{item.utilization_pct}%</td>
                  <td>{item.overallocation_hours}h</td>
                  <td>
                    <span
                      className={`severity ${
                        item.severity?.toLowerCase()
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td>{item.conflict_status}</td>
                  <td>
                    {formatGovernanceStatus(
                      item.governance_status
                    )}
                  </td>
                  <td>
                    {item.decision_owner || 'Not Assigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function ScenarioAnalysis({ scenarios }) {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">
            AI Resource, Capacity & Governance Planning Agent
          </p>

          <h1>Scenario Analysis</h1>

          <p className="subtitle">
            Ranked mitigation options for resource capacity conflicts
          </p>
        </div>

        <div className="status-badge">
          Scenarios: {scenarios.length}
        </div>
      </header>

      <section className="scenario-grid">
        {scenarios.map((scenario) => (
          <article
            className={`scenario-card ${
              Number(scenario.recommendation_rank) === 1
                ? 'recommended'
                : ''
            }`}
            key={scenario.scenario_id}
          >
            <div className="scenario-card-header">
              <div>
                <span className="scenario-rank">
                  Rank #{scenario.recommendation_rank}
                </span>

                <h2>{scenario.scenario_name}</h2>

                <p>{scenario.scenario_description}</p>
              </div>

              {Number(scenario.recommendation_rank) === 1 && (
                <span className="recommended-badge">
                  Recommended
                </span>
              )}
            </div>

            <div className="scenario-metrics">
              <div>
                <span>Baseline Utilization</span>
                <strong>
                  {scenario.baseline_utilization_pct}%
                </strong>
              </div>

              <div>
                <span>Scenario Utilization</span>
                <strong>
                  {scenario.scenario_utilization_pct}%
                </strong>
              </div>

              <div>
                <span>Effectiveness</span>
                <strong>
                  {scenario.effectiveness_score}
                </strong>
              </div>

              <div>
                <span>Governance</span>
                <strong>
                  {scenario.governance_score}
                </strong>
              </div>

              <div>
                <span>Overall Score</span>
                <strong>
                  {scenario.overall_recommendation_score}
                </strong>
              </div>
            </div>

            <div className="scenario-outcome-row">
              <span>Outcome</span>
              <strong>
                {formatScenarioOutcome(
                  scenario.scenario_outcome
                )}
              </strong>
            </div>

            <div className="scenario-flags">
              <span>
                Critical Path Impact:{' '}
                {scenario.critical_path_impact ? 'Yes' : 'No'}
              </span>

              <span>
                Priority Impact:{' '}
                {scenario.priority_impact || 'None'}
              </span>

              <span>
                Secondary Conflict:{' '}
                {scenario.creates_secondary_conflict
                  ? 'Yes'
                  : 'No'}
              </span>
            </div>

            <div className="scenario-changes">
              <h3>Proposed Changes</h3>

              {(scenario.proposed_changes || []).map(
                (change, index) => (
                  <div
                    className="change-row"
                    key={`${scenario.scenario_id}-${index}`}
                  >
                    <div>
                      <strong>{change.project_id}</strong>
                      <span>{change.activity_name}</span>
                    </div>

                    <div>
                      <span>
                        {formatChangeType(
                          change.change_type
                        )}
                      </span>

                      <strong>
                        {formatChangeDetails(change)}
                      </strong>
                    </div>
                  </div>
                )
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  )
}

function ResourcePlanning() {
  const [form, setForm] = useState({
    project_id: 'PRJ-005',
    project_name: 'Cloud Migration Program',
    project_priority: 'High',
    project_status: 'Active',
    start_date: '2025-08-01',
    end_date: '2025-12-31',

    resource_id: 'RES-007',
    resource_name: 'Cloud Architect A',
    role: 'Cloud Architect',
    department: 'Architecture',
    standard_weekly_hours: 40,

    week_start_date: '2025-08-18',
    standard_hours: 40,
    leave_hours: 0,
    holiday_hours: 0,
    training_hours: 4,
    bau_hours: 4,
  })

  const [demand, setDemand] = useState([
    {
      project_id: 'PRJ-005',
      activity_name: 'Cloud Architecture Design',
      planned_hours: 24,
      priority: 'High',
      critical_path: true,
    },
    {
      project_id: 'PRJ-001',
      activity_name: 'ERP Integration Review',
      planned_hours: 16,
      priority: 'Critical',
      critical_path: false,
    },
  ])

  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  function updateForm(event) {
    const { name, value, type, checked } = event.target

    setForm((current) => ({
      ...current,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
            ? Number(value)
            : value,
    }))
  }

  function updateDemand(index, field, value) {
    setDemand((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]:
                field === 'planned_hours'
                  ? Number(value)
                  : field === 'critical_path'
                    ? value
                    : value,
            }
          : item
      )
    )
  }

  function addDemandActivity() {
    setDemand((current) => [
      ...current,
      {
        project_id: form.project_id,
        activity_name: '',
        planned_hours: 0,
        priority: 'Medium',
        critical_path: false,
      },
    ])
  }

  function removeDemandActivity(index) {
    setDemand((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    )
  }

  async function submitPlan(event) {
    event.preventDefault()

    setSubmitting(true)
    setResult(null)
    setSubmitError(null)

    const payload = {
      project: {
        project_id: form.project_id,
        project_name: form.project_name,
        priority: form.project_priority,
        status: form.project_status,
        start_date: form.start_date,
        end_date: form.end_date,
      },

      resource: {
        resource_id: form.resource_id,
        resource_name: form.resource_name,
        role: form.role,
        department: form.department,
        standard_weekly_hours:
          Number(form.standard_weekly_hours),
        active: true,
      },

      capacity: {
        week_start_date: form.week_start_date,
        standard_hours: Number(form.standard_hours),
        leave_hours: Number(form.leave_hours),
        holiday_hours: Number(form.holiday_hours),
        training_hours: Number(form.training_hours),
        bau_hours: Number(form.bau_hours),
      },

      demand: demand.map((item) => ({
        project_id: item.project_id,
        activity_name: item.activity_name,
        planned_hours: Number(item.planned_hours),
        priority: item.priority,
        critical_path: Boolean(item.critical_path),
      })),
    }

    try {
      const response = await fetch(
        `${API_BASE}/resource-planning`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `HTTP ${response.status}`
        )
      }

      if (
        data.validation_status === 'FAILED' ||
        data.status === 'FAILED'
      ) {
        throw new Error(
          (data.errors || []).join(', ') ||
            'Validation failed'
        )
      }

      setResult(data)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">
            AI Resource, Capacity & Governance Planning Agent
          </p>

          <h1>Resource Planning</h1>

          <p className="subtitle">
            Submit project, resource, capacity and demand data
            for deterministic capacity analysis.
          </p>
        </div>
      </header>

      <form onSubmit={submitPlan}>
        <section className="panel">
          <h2>Project</h2>

          <div className="form-grid">
            <Field
              label="Project ID"
              name="project_id"
              value={form.project_id}
              onChange={updateForm}
            />

            <Field
              label="Project Name"
              name="project_name"
              value={form.project_name}
              onChange={updateForm}
            />

            <SelectField
              label="Priority"
              name="project_priority"
              value={form.project_priority}
              onChange={updateForm}
              options={[
                'Critical',
                'High',
                'Medium',
                'Low',
              ]}
            />

            <Field
              label="Status"
              name="project_status"
              value={form.project_status}
              onChange={updateForm}
            />

            <Field
              label="Start Date"
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={updateForm}
            />

            <Field
              label="End Date"
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={updateForm}
            />
          </div>
        </section>

        <section className="panel">
          <h2>Resource</h2>

          <div className="form-grid">
            <Field
              label="Resource ID"
              name="resource_id"
              value={form.resource_id}
              onChange={updateForm}
            />

            <Field
              label="Resource Name"
              name="resource_name"
              value={form.resource_name}
              onChange={updateForm}
            />

            <Field
              label="Role"
              name="role"
              value={form.role}
              onChange={updateForm}
            />

            <Field
              label="Department"
              name="department"
              value={form.department}
              onChange={updateForm}
            />

            <Field
              label="Standard Weekly Hours"
              name="standard_weekly_hours"
              type="number"
              value={form.standard_weekly_hours}
              onChange={updateForm}
            />
          </div>
        </section>

        <section className="panel">
          <h2>Capacity</h2>

          <div className="form-grid">
            <Field
              label="Week Start Date"
              name="week_start_date"
              type="date"
              value={form.week_start_date}
              onChange={updateForm}
            />

            <Field
              label="Standard Hours"
              name="standard_hours"
              type="number"
              value={form.standard_hours}
              onChange={updateForm}
            />

            <Field
              label="Leave Hours"
              name="leave_hours"
              type="number"
              value={form.leave_hours}
              onChange={updateForm}
            />

            <Field
              label="Holiday Hours"
              name="holiday_hours"
              type="number"
              value={form.holiday_hours}
              onChange={updateForm}
            />

            <Field
              label="Training Hours"
              name="training_hours"
              type="number"
              value={form.training_hours}
              onChange={updateForm}
            />

            <Field
              label="BAU Hours"
              name="bau_hours"
              type="number"
              value={form.bau_hours}
              onChange={updateForm}
            />
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Demand Activities</h2>
              <p>
                Add one or more planned activities for this
                resource and week.
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={addDemandActivity}
            >
              + Add Activity
            </button>
          </div>

          <div className="demand-list">
            {demand.map((item, index) => (
              <div
                className="demand-card"
                key={index}
              >
                <div className="form-grid">
                  <Field
                    label="Project ID"
                    value={item.project_id}
                    onChange={(event) =>
                      updateDemand(
                        index,
                        'project_id',
                        event.target.value
                      )
                    }
                  />

                  <Field
                    label="Activity Name"
                    value={item.activity_name}
                    onChange={(event) =>
                      updateDemand(
                        index,
                        'activity_name',
                        event.target.value
                      )
                    }
                  />

                  <Field
                    label="Planned Hours"
                    type="number"
                    value={item.planned_hours}
                    onChange={(event) =>
                      updateDemand(
                        index,
                        'planned_hours',
                        event.target.value
                      )
                    }
                  />

                  <SelectField
                    label="Priority"
                    value={item.priority}
                    onChange={(event) =>
                      updateDemand(
                        index,
                        'priority',
                        event.target.value
                      )
                    }
                    options={[
                      'Critical',
                      'High',
                      'Medium',
                      'Low',
                    ]}
                  />

                  <label className="checkbox-field">
                    <span>Critical Path</span>

                    <input
                      type="checkbox"
                      checked={item.critical_path}
                      onChange={(event) =>
                        updateDemand(
                          index,
                          'critical_path',
                          event.target.checked
                        )
                      }
                    />
                  </label>
                </div>

                {demand.length > 1 && (
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      removeDemandActivity(index)
                    }
                  >
                    Remove Activity
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="form-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting
              ? 'Submitting...'
              : 'Submit Resource Plan'}
          </button>
        </div>
      </form>

      {submitError && (
        <section className="result-panel error-result">
          <h2>Submission Failed</h2>
          <p>{submitError}</p>
        </section>
      )}

      {result && (
        <PlanningResult result={result} />
      )}
    </>
  )
}

function GovernanceView({ governance }) {
  const summary = governance.summary || {}
  const decisions = governance.decisions || []
  const audit = governance.audit || []

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">
            AI Resource, Capacity & Governance Planning Agent
          </p>

          <h1>Governance Dashboard</h1>

          <p className="subtitle">
            Current decision status and governance audit history
          </p>
        </div>

        <div className="status-badge">
          Governance Events: {summary.governance_events || 0}
        </div>
      </header>

      <section className="summary-grid">
        <article className="summary-card">
          <span>Recommendations Created</span>
          <strong>
            {summary.recommendations_created || 0}
          </strong>
        </article>

        <article className="summary-card">
          <span>Decisions Approved</span>
          <strong>
            {summary.decisions_approved || 0}
          </strong>
        </article>

        <article className="summary-card">
          <span>Decisions Rejected</span>
          <strong>
            {summary.decisions_rejected || 0}
          </strong>
        </article>

        <article className="summary-card">
          <span>Decisions Touched</span>
          <strong>
            {summary.decisions_touched || 0}
          </strong>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Current Governance Decisions</h2>

            <p>
              Latest governance state by capacity conflict
            </p>
          </div>

          <span className="exception-count">
            {decisions.length} Current
          </span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Conflict</th>
                <th>Decision</th>
                <th>Approval Status</th>
                <th>Decision</th>
                <th>Decision Owner</th>
                <th>Decision Date</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {decisions.map((item) => (
                <tr key={item.decision_id}>
                  <td>
                    #{item.conflict_id}
                  </td>

                  <td>
                    #{item.decision_id}
                  </td>

                  <td>
                    <span
                      className={`governance-pill ${
                        String(
                          item.approval_status || ''
                        ).toLowerCase()
                      }`}
                    >
                      {item.approval_status || 'No Status'}
                    </span>
                  </td>

                  <td>
                    {item.decision || 'Pending'}
                  </td>

                  <td>
                    {item.decision_owner || 'Not Assigned'}
                  </td>

                  <td>
                    {formatDateTime(item.decision_date)}
                  </td>

                  <td>
                    {formatDateTime(item.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Governance Audit Trail</h2>

            <p>
              Recommendation creation and human approval/rejection events
            </p>
          </div>

          <span className="exception-count">
            {audit.length} Events
          </span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Audit</th>
                <th>Conflict</th>
                <th>Decision</th>
                <th>Action</th>
                <th>Status Change</th>
                <th>Action By</th>
                <th>Source</th>
                <th>Timestamp</th>
              </tr>
            </thead>

            <tbody>
              {audit.map((item) => (
                <tr key={item.audit_id}>
                  <td>
                    #{item.audit_id}
                  </td>

                  <td>
                    #{item.conflict_id}
                  </td>

                  <td>
                    #{item.decision_id}
                  </td>

                  <td>
                    {formatGovernanceAction(item.action)}
                  </td>

                  <td>
                    {item.previous_status || '—'}
                    {' → '}
                    {item.new_status || '—'}
                  </td>

                  <td>
                    {item.action_by || '—'}
                  </td>

                  <td>
                    {item.action_source || '—'}
                  </td>

                  <td>
                    {formatDateTime(item.action_timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function PlanningResult({ result }) {
  return (
    <section className="result-panel">
      <div className="panel-header">
        <div>
          <h2>Planning Intake Completed</h2>

          <p>
            Resource plan was processed by the Project 07
            capacity engine.
          </p>
        </div>

        <span className="recommended-badge">
          Completed
        </span>
      </div>

      <div className="result-grid">
        <div>
          <span>Project</span>
          <strong>
            {result.project?.project_id}
          </strong>
          <small>
            {result.project?.project_name}
          </small>
        </div>

        <div>
          <span>Resource</span>
          <strong>
            {result.resource?.resource_id}
          </strong>
          <small>
            {result.resource?.resource_name}
          </small>
        </div>

        <div>
          <span>Available Capacity</span>
          <strong>
            {result.capacity?.available_hours}h
          </strong>
        </div>

        <div>
          <span>Total Demand</span>
          <strong>
            {result.demand?.total_planned_hours}h
          </strong>
        </div>
      </div>

      {result.conflict_detected ? (
        <div className="conflict-result">
          <h3>Capacity Conflict Detected</h3>

          <div className="result-grid">
            <div>
              <span>Conflict</span>
              <strong>
                #{result.conflict?.conflict_id}
              </strong>
            </div>

            <div>
              <span>Utilization</span>
              <strong>
                {result.conflict?.utilization_pct}%
              </strong>
            </div>

            <div>
              <span>Overallocation</span>
              <strong>
                {result.conflict?.overallocation_hours}h
              </strong>
            </div>

            <div>
              <span>Severity</span>
              <strong>
                {result.conflict?.severity}
              </strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-conflict-result">
          No formal resource overallocation conflict detected.
        </div>
      )}
    </section>
  )
}

function WeeklyReportsView({ reports }) {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">
            AI Resource, Capacity & Governance Planning Agent
          </p>

          <h1>Weekly Reports</h1>

          <p className="subtitle">
            Persisted weekly portfolio capacity and governance snapshots
          </p>
        </div>

        <div className="status-badge">
          Stored Reports: {reports.length}
        </div>
      </header>

      {reports.length === 0 ? (
        <section className="panel">
          <p>No weekly reports are currently available.</p>
        </section>
      ) : (
        <section className="weekly-report-list">
          {reports.map((report) => (
            <article
              className="weekly-report-card"
              key={report.report_id}
            >
              <div className="panel-header">
                <div>
                  <span className="scenario-rank">
                    Report #{report.report_id}
                  </span>

                  <h2>
                    Week {report.report_week_start}
                  </h2>

                  <p>
                    Reporting period:{' '}
                    {report.report_week_start}
                    {' → '}
                    {report.report_week_end}
                  </p>
                </div>

                <span className="recommended-badge">
                  {report.report_status}
                </span>
              </div>

              <div className="summary-grid">
                <article className="summary-card">
                  <span>Portfolio Utilization</span>
                  <strong>
                    {report.portfolio_utilization_pct}%
                  </strong>
                </article>

                <article className="summary-card">
                  <span>Available Capacity</span>
                  <strong>
                    {report.total_available_capacity_hours}h
                  </strong>
                </article>

                <article className="summary-card">
                  <span>Total Demand</span>
                  <strong>
                    {report.total_demand_hours}h
                  </strong>
                </article>

                <article className="summary-card">
                  <span>Critical Resources</span>
                  <strong>
                    {report.critical_resources}
                  </strong>
                </article>
              </div>

              <section className="lower-grid">
                <article className="panel compact">
                  <h2>Capacity Position</h2>

                  <div className="metric-row">
                    <span>Overloaded Resources</span>
                    <strong>
                      {report.overloaded_resources}
                    </strong>
                  </div>

                  <div className="metric-row">
                    <span>Critical Resources</span>
                    <strong>
                      {report.critical_resources}
                    </strong>
                  </div>

                  <div className="metric-row">
                    <span>Portfolio Utilization</span>
                    <strong>
                      {report.portfolio_utilization_pct}%
                    </strong>
                  </div>
                </article>

                <article className="panel compact">
                  <h2>Governance Position</h2>

                  <div className="metric-row">
                    <span>Recommendations Created</span>
                    <strong>
                      {report.recommendations_created}
                    </strong>
                  </div>

                  <div className="metric-row">
                    <span>Decisions Approved</span>
                    <strong>
                      {report.decisions_approved}
                    </strong>
                  </div>

                  <div className="metric-row">
                    <span>Decisions Rejected</span>
                    <strong>
                      {report.decisions_rejected}
                    </strong>
                  </div>

                  <div className="metric-row">
                    <span>Pending Approvals</span>
                    <strong>
                      {report.pending_approvals}
                    </strong>
                  </div>

                  <div className="metric-row">
                    <span>Conflicts Without Decision</span>
                    <strong>
                      {report.conflicts_without_decision}
                    </strong>
                  </div>
                </article>
              </section>

              <section className="panel weekly-exceptions-panel">
                <div className="panel-header">
                  <div>
                    <h2>Snapshot Exceptions</h2>

                    <p>
                      Exceptions persisted with this management report
                    </p>
                  </div>

                  <span className="exception-count">
                    {(report.exceptions || []).length} Exceptions
                  </span>
                </div>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Resource</th>
                        <th>Conflict</th>
                        <th>Utilization</th>
                        <th>Overallocation</th>
                        <th>Severity</th>
                        <th>Governance</th>
                        <th>Decision Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(report.exceptions || []).map((item) => (
                        <tr key={item.report_exception_id}>
                          <td className="resource-name">
                            {item.resource_id}
                          </td>

                          <td>
                            {item.conflict_id
                              ? `#${item.conflict_id}`
                              : '—'}
                          </td>

                          <td>
                            {item.utilization_pct}%
                          </td>

                          <td>
                            {item.overallocation_hours}h
                          </td>

                          <td>
                            <span
                              className={`severity ${
                                item.severity?.toLowerCase()
                              }`}
                            >
                              {item.severity}
                            </span>
                          </td>

                          <td>
                            {formatGovernanceStatus(
                              item.governance_status
                            )}
                          </td>

                          <td>
                            {item.decision_status || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="report-generated">
                Generated:{' '}
                {formatDateTime(report.generated_at)}
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
}) {
  return (
    <label className="form-field">
      <span>{label}</span>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
      />
    </label>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <label className="form-field">
      <span>{label}</span>

      <select
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option
            value={option}
            key={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function formatGovernanceStatus(status) {
  if (!status) return 'No Status'

  const labels = {
    PENDING_APPROVAL: 'Pending Approval',
    CONFLICT_NO_DECISION: 'No Decision',
    APPROVED_MITIGATION: 'Approved Mitigation',
    REJECTED_MITIGATION: 'Rejected Mitigation',
    CONFLICT_OPEN: 'Conflict Open',
    NO_FORMAL_CONFLICT: 'No Formal Conflict',
  }

  return labels[status] || status
}

function formatScenarioOutcome(outcome) {
  const labels = {
    RESOLVED: 'Resolved',
    IMPROVED_NOT_RESOLVED:
      'Improved, Not Resolved',
  }

  return labels[outcome] || outcome
}

function formatChangeType(type) {
  const labels = {
    MOVE_WEEK: 'Move Week',
    REASSIGN: 'Reassign',
  }

  return labels[type] || type
}

function formatChangeDetails(change) {
  if (change.change_type === 'MOVE_WEEK') {
    return `${change.original_hours}h → ${change.proposed_week_start_date}`
  }

  if (change.change_type === 'REASSIGN') {
    return `${change.original_hours}h reassigned`
  }

  return `${change.original_hours}h`
}

function formatGovernanceAction(action) {
  const labels = {
    RECOMMENDATION_CREATED: 'Recommendation Created',
    DECISION_APPROVED: 'Decision Approved',
    DECISION_REJECTED: 'Decision Rejected',
  }

  return labels[action] || action
}

function formatDateTime(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString()
}

export default App