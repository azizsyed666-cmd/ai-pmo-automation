// ==========================================
// AI CHANGE REQUEST IMPACT ANALYZER
// Frontend Application Logic
// ==========================================


// ------------------------------------------
// 1. GET PAGE ELEMENTS
// ------------------------------------------

const form = document.getElementById("changeRequestForm");
const submitButton = document.getElementById("submitButton");
const statusMessage = document.getElementById("statusMessage");

const assessmentResults =
    document.getElementById("assessmentResults");

const GOVERNANCE_URL =
    "http://localhost:5678/webhook/change-decision";
const governanceDecisionForm =
    document.getElementById("governanceDecisionForm");

const governanceDecision =
    document.getElementById("governanceDecision");

const governanceConditionsGroup =
    document.getElementById("governanceConditionsGroup");

const governanceConditions =
    document.getElementById("governanceConditions");

const governanceSubmitButton =
    document.getElementById("governanceSubmitButton");

const governanceStatus =
    document.getElementById("governanceStatus");

// ------------------------------------------
// 2. N8N PRODUCTION WEBHOOK
// ------------------------------------------

const WEBHOOK_URL =
    "http://localhost:5678/webhook/change-request";

const REGISTER_URL =
    "http://localhost:5678/webhook/change-requests";

const refreshRegisterButton =
    document.getElementById("refreshRegisterButton");

const registerStatus =
    document.getElementById("registerStatus");

const changeRequestTableBody =
    document.getElementById("changeRequestTableBody");

const ASSESSMENT_URL =
    "http://localhost:5678/webhook/change-assessment";
// ------------------------------------------
// 3. FORM SUBMISSION
// ------------------------------------------

form.addEventListener("submit", async function (event) {

    // Prevent normal browser form submission
    event.preventDefault();


    // Hide results from any previous assessment
    assessmentResults.hidden = true;


    // --------------------------------------
    // BUILD REQUEST PAYLOAD
    // --------------------------------------

    const payload = {

        project_code:
            document
                .getElementById("projectCode")
                .value
                .trim(),

        change_title:
            document
                .getElementById("changeTitle")
                .value
                .trim(),

        change_description:
            document
                .getElementById("changeDescription")
                .value
                .trim(),

        business_reason:
            document
                .getElementById("businessReason")
                .value
                .trim(),

        requested_by:
            document
                .getElementById("requestedBy")
                .value
                .trim(),

        priority:
            document
                .getElementById("priority")
                .value,

        requested_completion_date:
            document
                .getElementById("completionDate")
                .value
    };


    console.log(
        "Submitting Change Request:",
        payload
    );


    // --------------------------------------
    // PROCESSING STATE
    // --------------------------------------

    submitButton.disabled = true;

    submitButton.textContent =
        "Analyzing...";

    statusMessage.className =
        "status-processing";

    statusMessage.textContent =
        "Submitting change request and running AI impact assessment...";


    try {

        // ----------------------------------
        // SEND REQUEST TO N8N
        // ----------------------------------

        const response = await fetch(
            WEBHOOK_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(payload)
            }
        );


        // ----------------------------------
        // READ API RESPONSE
        // ----------------------------------

        const data = await response.json();


        console.log(
            "API Response:",
            data
        );


        // ----------------------------------
        // HTTP ERROR CHECK
        // ----------------------------------

        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                `Request failed with HTTP ${response.status}`
            );

        }


        // ----------------------------------
        // APPLICATION ERROR CHECK
        // ----------------------------------

        if (!data.success) {

            throw new Error(
                data.message ||
                "The change request could not be processed."
            );

        }


        // ----------------------------------
        // POPULATE RESULTS DASHBOARD
        // ----------------------------------

        populateAssessmentResults(data);

        

        // ----------------------------------
        // SHOW RESULTS
        // ----------------------------------

        assessmentResults.hidden = false;


        // ----------------------------------
        // SUCCESS MESSAGE
        // ----------------------------------

        statusMessage.className =
            "status-success";

        statusMessage.textContent =
            `Assessment ${data.assessment_id} completed successfully.`;


        // ----------------------------------
        // SCROLL TO RESULTS
        // ----------------------------------

        assessmentResults.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

    catch (error) {

        console.error(
            "Change Request Error:",
            error
        );


        statusMessage.className =
            "status-error";


        statusMessage.textContent =
            `Error: ${error.message}`;

    }

    finally {

        // ----------------------------------
        // RESTORE BUTTON
        // ----------------------------------

        submitButton.disabled = false;

        submitButton.textContent =
            "Analyze Change Request";

    }

});


// ==========================================
// 4. POPULATE ASSESSMENT DASHBOARD
// ==========================================

function populateAssessmentResults(data) {

    console.log(
        "ASSESSMENT DATA RECEIVED:",
        data
    );

    document.getElementById(
        "governanceChangeRequestId"
    ).value = data.change_request_id || "";

    document.getElementById(
        "governanceAssessmentId"
    ).value = data.assessment_id || "";

// ==========================================
// EXISTING GOVERNANCE DECISION
// ==========================================

const governanceDecisionField =
        document.getElementById("governanceDecision");

    const governanceDecidedByField =
        document.getElementById("governanceDecidedBy");

    const governanceCommentsField =
        document.getElementById("governanceComments");

    const governanceConditionsField =
        document.getElementById("governanceConditions");

    const governanceConditionsGroup =
        document.getElementById("governanceConditionsGroup");

    const governanceStatusField =
        document.getElementById("governanceStatus");


    if (data.decision_id) {

    console.log(
        "Existing governance decision found:",
        data.decision_id
    );

    governanceDecisionField.value =
        data.decision ?? "";

    governanceDecidedByField.value =
        data.decided_by ?? "";

    governanceCommentsField.value =
        data.decision_comments ?? "";

    governanceConditionsField.value =
        data.conditions ?? "";

    const hasConditions =
        data.decision === "Approved with Conditions";

    governanceConditionsGroup.hidden =
        !hasConditions;

    // Existing decisions are read-only
    governanceConditionsField.required = false;

    governanceDecisionField.disabled = true;
    governanceDecidedByField.disabled = true;
    governanceCommentsField.disabled = true;
    governanceConditionsField.disabled = true;

    governanceSubmitButton.disabled = true;
    governanceSubmitButton.textContent =
        "Governance Decision Recorded";

    governanceStatusField.className =
        "governance-status-success";

    governanceStatusField.textContent =
        `Existing governance decision recorded by ${
            data.decided_by ?? "Unknown"
        }.`;

} else {

    governanceDecisionField.value = "";
    governanceDecidedByField.value = "";
    governanceCommentsField.value = "";
    governanceConditionsField.value = "";

    governanceConditionsGroup.hidden = true;
    governanceConditionsField.required = false;

    governanceDecisionField.disabled = false;
    governanceDecidedByField.disabled = false;
    governanceCommentsField.disabled = false;
    governanceConditionsField.disabled = false;

    governanceSubmitButton.disabled = false;
    governanceSubmitButton.textContent =
        "Record Governance Decision";

    governanceStatusField.className = "";
    governanceStatusField.textContent = "";
}


    // ==========================================
    // EXISTING ASSESSMENT FIELD MAPPING
    // ==========================================

    setText(
        "resultChangeTitle",
        data.change_title
    );

    // --------------------------------------
    // CHANGE REQUEST INFORMATION
    // --------------------------------------

    setText(
        "resultChangeTitle",
        data.change_title
    );


    setText(
        "resultChangeCode",
        data.change_request_code
    );


    setText(
        "resultAssessmentId",
        `Assessment #${data.assessment_id}`
    );


    // --------------------------------------
    // PROJECT INFORMATION
    // --------------------------------------

    setText(
        "resultProjectName",
        data.project_name
    );


    setText(
        "resultProjectCode",
        data.project_code
    );


    // --------------------------------------
    // OVERALL ASSESSMENT
    // --------------------------------------

    setText(
        "resultOverallImpact",
        data.overall_impact
    );


    setText(
        "resultRecommendation",
        data.recommendation
    );


    // --------------------------------------
    // IMPACT RATINGS
    // --------------------------------------

    setText(
        "resultScheduleRating",
        data.schedule_rating
    );


    setText(
        "resultCostRating",
        data.cost_rating
    );


    setText(
        "resultResourceRating",
        data.resource_rating
    );


    setText(
        "resultTechnicalRating",
        data.technical_rating
    );


    setText(
        "resultRiskRating",
        data.risk_rating
    );


    // --------------------------------------
    // QUANTITATIVE IMPACT
    // --------------------------------------

    setText(
        "resultScheduleDays",
        formatScheduleImpact(
            data.schedule_impact_days
        )
    );


    setText(
        "resultCostImpact",
        formatCostImpact(
            data.cost_impact
        )
    );


    // --------------------------------------
    // AI ANALYSIS
    // --------------------------------------

    setText(
        "resultAiSummary",
        data.ai_summary
    );


    setText(
        "resultResourceImpact",
        data.resource_impact
    );


    setText(
        "resultTechnicalImpact",
        data.technical_impact
    );


    setText(
        "resultRiskImpact",
        data.risk_impact
    );


    // --------------------------------------
    // ASSESSMENT DATE
    // --------------------------------------

    setText(
        "resultAssessedAt",
        formatAssessmentDate(
            data.assessed_at
        )
    );

}


// ==========================================
// 5. SAFE TEXT HELPER
// ==========================================

function setText(elementId, value) {

    const element =
        document.getElementById(elementId);


    if (!element) {

        console.warn(
            `Element not found: ${elementId}`
        );

        return;
    }


    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        element.textContent =
            "Not available";

        return;
    }


    element.textContent =
        String(value);

}


// ==========================================
// 6. FORMAT SCHEDULE IMPACT
// ==========================================

function formatScheduleImpact(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "Not available";

    }


    const days = Number(value);


    if (!Number.isFinite(days)) {

        return "Not available";

    }


    if (days === 1) {

        return "1 day";

    }


    return `${days} days`;

}


// ==========================================
// 7. FORMAT COST IMPACT
// ==========================================

function formatCostImpact(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "Not available";

    }


    const amount = Number(value);


    if (!Number.isFinite(amount)) {

        return "Not available";

    }


    return new Intl.NumberFormat(
        "en-AE",
        {
            style: "currency",
            currency: "AED",
            maximumFractionDigits: 2
        }
    ).format(amount);

}


// ==========================================
// 8. FORMAT ASSESSMENT DATE
// ==========================================

function formatAssessmentDate(value) {

    if (!value) {

        return "Not available";

    }


    const date = new Date(value);


    if (Number.isNaN(date.getTime())) {

        return String(value);

    }


    return new Intl.DateTimeFormat(
        "en-AE",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(date);

}

// ==========================================
// 9. LOAD CHANGE REQUEST REGISTER
// ==========================================

async function loadChangeRequestRegister() {

    registerStatus.textContent =
        "Loading change requests...";

    changeRequestTableBody.innerHTML = `
        <tr>
            <td colspan="7" class="empty-table-message">
                Loading change requests...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(REGISTER_URL);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                `Register request failed with HTTP ${response.status}`
            );
        }

        if (!Array.isArray(data)) {
            throw new Error(
                "Register API did not return an array."
            );
        }

        renderChangeRequestRegister(data);

        registerStatus.textContent =
            `${data.length} change request${data.length === 1 ? "" : "s"} loaded.`;

    } catch (error) {

        console.error(
            "Register Load Error:",
            error
        );

        registerStatus.textContent =
            `Error: ${error.message}`;

        changeRequestTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table-message">
                    Unable to load change request register.
                </td>
            </tr>
        `;
    }
}


// ==========================================
// 10. RENDER REGISTER TABLE
// ==========================================

function renderChangeRequestRegister(records) {

    if (records.length === 0) {

        changeRequestTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table-message">
                    No change requests found.
                </td>
            </tr>
        `;

        return;
    }

    changeRequestTableBody.innerHTML =
        records.map(record => {

            const priorityClass =
                getRatingBadgeClass(record.priority);

            const impactClass =
                getRatingBadgeClass(record.overall_impact);

            const statusClass =
                getStatusClass(record.change_status);

            const assessmentText =
                record.assessment_id
                    ? `#${escapeHtml(record.assessment_id)}`
                    : "Not assessed";

            const impactText =
                record.overall_impact || "Not assessed";

            const recommendationText =
                record.recommendation || "Not available";

            return `
                <tr>

                    <td>
                        <span class="cr-code">
                            ${escapeHtml(record.change_request_code)}
                        </span>
                    </td>

                    <td class="cr-title">
                        ${escapeHtml(record.change_title)}
                    </td>

                    <td>
                        <span class="table-badge ${priorityClass}">
                            ${escapeHtml(record.priority)}
                        </span>
                    </td>

                    <td>
                        <span class="table-badge ${statusClass}">
                            ${escapeHtml(record.change_status)}
                        </span>
                    </td>

                    <td>
                        <span class="table-badge ${impactClass}">
                            ${escapeHtml(impactText)}
                        </span>
                    </td>

                    <td class="recommendation-text">
                        ${escapeHtml(recommendationText)}
                    </td>

                    <td>
                        ${
                        record.assessment_id
                        ? `
                            <button
                                type="button"
                                class="assessment-link assessment-link-button"
                                data-assessment-id="${escapeHtml(record.assessment_id)}"
                            >
                                #${escapeHtml(record.assessment_id)}
                            </button>
                        `
                        : `
                            <span class="assessment-link">
                            Not assessed
                            </span>
                            `
                        }
                    </td>

                </tr>
            `;

        }).join("");
}


// ==========================================
// 11. BADGE HELPERS
// ==========================================

function getRatingBadgeClass(value) {

    switch (value) {

        case "Low":
            return "badge-low";

        case "Medium":
            return "badge-medium";

        case "High":
            return "badge-high";

        case "Critical":
            return "badge-critical";

        default:
            return "badge-neutral";
    }
}


function getStatusClass(value) {

    switch (value) {

        case "Submitted":
            return "status-submitted";

        case "Under Assessment":
            return "status-under-assessment";

        default:
            return "badge-neutral";
    }
}


// ==========================================
// 12. SAFE HTML FOR TABLE CELLS
// ==========================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ==========================================
// 13. REGISTER EVENTS
// ==========================================

refreshRegisterButton.addEventListener(
    "click",
    loadChangeRequestRegister
);

// ==========================================
// 14. OPEN SAVED ASSESSMENT
// ==========================================

document.addEventListener("click", async function (event) {

    const button =
        event.target.closest(".assessment-link-button");

    if (!button) {
        return;
    }

    const assessmentId =
        button.dataset.assessmentId;

    if (!assessmentId) {
        return;
    }

    await loadSavedAssessment(assessmentId);
});


async function loadSavedAssessment(assessmentId) {

    statusMessage.className =
        "status-processing";

    statusMessage.textContent =
        `Loading assessment #${assessmentId}...`;

    try {

        const response = await fetch(
            `${ASSESSMENT_URL}?assessment_id=${encodeURIComponent(assessmentId)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                `Assessment request failed with HTTP ${response.status}`
            );
        }

        if (!data.assessment_id) {
            throw new Error(
                "Assessment not found."
            );
        }

        populateAssessmentResults(data);

        assessmentResults.hidden = false;

        statusMessage.className =
            "status-success";

        statusMessage.textContent =
            `Assessment ${data.assessment_id} loaded successfully.`;

        assessmentResults.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {

        console.error(
            "Assessment Load Error:",
            error
        );

        statusMessage.className =
            "status-error";

        statusMessage.textContent =
            `Error: ${error.message}`;
    }
}

// ==========================================
// GOVERNANCE DECISION UI
// ==========================================

governanceDecision.addEventListener(
    "change",
    function () {

        const requiresConditions =
            governanceDecision.value ===
            "Approved with Conditions";

        governanceConditionsGroup.hidden =
            !requiresConditions;

        governanceConditions.required =
            requiresConditions;

        if (!requiresConditions) {
            governanceConditions.value = "";
        }
    }
);


// ==========================================
// SUBMIT GOVERNANCE DECISION
// ==========================================

governanceDecisionForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const changeRequestId =
            document.getElementById(
                "governanceChangeRequestId"
            ).value;

        const assessmentId =
            document.getElementById(
                "governanceAssessmentId"
            ).value;

        const decidedBy =
            document.getElementById(
                "governanceDecidedBy"
            ).value.trim();

        const comments =
            document.getElementById(
                "governanceComments"
            ).value.trim();

        const decision =
            governanceDecision.value;

        const conditions =
            governanceConditions.value.trim();


        const payload = {
            change_request_id:
                Number(changeRequestId),

            assessment_id:
                assessmentId
                    ? Number(assessmentId)
                    : null,

            decision,

            decision_comments:
                comments,

            conditions:
                conditions,

            decided_by:
                decidedBy
        };


        governanceSubmitButton.disabled = true;

        governanceSubmitButton.textContent =
            "Recording Decision...";

        governanceStatus.className =
            "governance-status-processing";

        governanceStatus.textContent =
            "Saving governance decision...";


        try {

            const response =
                await fetch(
                    GOVERNANCE_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(payload)
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.error ||
                    `Request failed with HTTP ${response.status}`
                );
            }


            governanceStatus.className =
                "governance-status-success";

            governanceStatus.textContent =
                `Decision recorded successfully. Change request status: ${data.change_status || "updated"}.`;


            // Refresh register so the new status appears
            await loadChangeRequestRegister();

        }

        catch (error) {

            console.error(
                "Governance Decision Error:",
                error
            );


            governanceStatus.className =
                "governance-status-error";

            governanceStatus.textContent =
                `Error: ${error.message}`;
        }

        finally {

    // Only restore the button if there is no existing saved decision
    if (!governanceSubmitButton.dataset.locked) {
        governanceSubmitButton.disabled = false;
        governanceSubmitButton.textContent =
            "Record Governance Decision";
    }
}
    }
);


// Load register when the page opens
loadChangeRequestRegister();