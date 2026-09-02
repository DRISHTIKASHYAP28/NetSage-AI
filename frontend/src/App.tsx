import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:8000";

type Case = {
  id?: number;
  case_id?: string;
  title?: string;
  concept?: string;
  symptom?: string;
  topology?: string;
  show_output?: string;
  expected_fault?: string;
  osi_layer?: string;
  severity?: string;
  review_status?: string;
  status?: string;
};

type Diagnosis = {
  case_id: string;
  root_cause: string;
  confidence: number;
  evidence: string[];
  next_command: string;
  suggested_fix: string;
};

type ReviewStatus = "Pending Review" | "Approved" | "Rejected";

function App() {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);

  const [page, setPage] = useState<
    "Dashboard" | "Cases" | "Diagnosis" | "Human Review"
  >("Dashboard");

  const [loading, setLoading] = useState(false);

  const [backendConnected, setBackendConnected] =
    useState(false);

  const [reviewStatus, setReviewStatus] =
    useState<ReviewStatus>("Pending Review");

  // =========================
  // LOAD CASES
  // =========================

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const response = await axios.get(
        `${API}/api/cases`
      );

      if (Array.isArray(response.data)) {
        setCases(response.data);
      } else {
        setCases([]);
      }

      setBackendConnected(true);
    } catch (error) {
      console.error(
        "Backend connection failed:",
        error
      );

      setBackendConnected(false);
    }
  };

  // =========================
  // HELPERS
  // =========================

  const getCaseId = (networkCase: Case) => {
    return (
      networkCase.case_id ||
      String(networkCase.id || "")
    );
  };

  const getTitle = (networkCase: Case) => {
    return (
      networkCase.title ||
      "Network Troubleshooting Case"
    );
  };

  const getSeverity = (networkCase: Case) => {
    return networkCase.severity || "Medium";
  };

  const getConcept = (networkCase: Case) => {
    return networkCase.concept || "Network";
  };

  // =========================
  // OPEN CASE
  // =========================

  const openCase = (networkCase: Case) => {
    setSelectedCase(networkCase);
    setDiagnosis(null);

    const existingStatus =
      networkCase.review_status;

    if (
      existingStatus === "Approved" ||
      existingStatus === "Rejected"
    ) {
      setReviewStatus(existingStatus);
    } else {
      setReviewStatus("Pending Review");
    }

    setPage("Diagnosis");
  };

  // =========================
  // AI DIAGNOSIS
  // =========================

  const runDiagnosis = async () => {
    if (!selectedCase) {
      return;
    }

    const caseId = getCaseId(selectedCase);

    if (!caseId) {
      alert("Invalid case ID.");
      return;
    }

    setLoading(true);
    setDiagnosis(null);

    try {
      const response = await axios.post(
        `${API}/api/diagnose/${encodeURIComponent(
          caseId
        )}`
      );

      setDiagnosis(response.data);

      setReviewStatus("Pending Review");
    } catch (error) {
      console.error(
        "Diagnosis error:",
        error
      );

      alert(
        "Could not connect to the NetSage AI backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HUMAN REVIEW
  // =========================

  const openHumanReview = () => {
    if (!selectedCase) {
      return;
    }

    if (!diagnosis) {
      alert(
        "Please run AI Diagnosis first."
      );

      return;
    }

    setPage("Human Review");
  };

  // =========================
  // APPROVE
  // =========================

  const approveRecommendation = async () => {
    if (!selectedCase) {
      return;
    }

    const caseId = getCaseId(selectedCase);

    if (!caseId) {
      alert("Invalid case ID.");
      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/review/${encodeURIComponent(
          caseId
        )}/approve`
      );

      setReviewStatus("Approved");

      setSelectedCase({
        ...selectedCase,
        review_status: "Approved"
      });

      alert(
        response.data?.message ||
        "Recommendation approved successfully."
      );
    } catch (error) {
      console.error(
        "Approval error:",
        error
      );

      alert(
        "Could not approve recommendation."
      );
    }
  };

  // =========================
  // REJECT
  // =========================

  const rejectRecommendation = async () => {
    if (!selectedCase) {
      return;
    }

    const caseId = getCaseId(selectedCase);

    if (!caseId) {
      alert("Invalid case ID.");
      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/review/${encodeURIComponent(
          caseId
        )}/reject`
      );

      setReviewStatus("Rejected");

      setSelectedCase({
        ...selectedCase,
        review_status: "Rejected"
      });

      alert(
        response.data?.message ||
        "Recommendation rejected."
      );
    } catch (error) {
      console.error(
        "Rejection error:",
        error
      );

      alert(
        "Could not reject recommendation."
      );
    }
  };

  // =========================
  // RESOLVE CASE
  // =========================

  const resolveCase = async () => {
    if (!selectedCase) {
      return;
    }

    if (reviewStatus !== "Approved") {
      alert(
        "Approve the recommendation before resolving the case."
      );

      return;
    }

    const caseId = getCaseId(selectedCase);

    if (!caseId) {
      alert("Invalid case ID.");
      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/cases/${encodeURIComponent(
          caseId
        )}/resolve`
      );

      setSelectedCase({
        ...selectedCase,
        status: "Resolved"
      });

      alert(
        response.data?.message ||
        "Case resolved successfully."
      );

      await loadCases();

      setPage("Cases");
    } catch (error) {
      console.error(
        "Resolve error:",
        error
      );

      alert(
        "Could not resolve the case."
      );
    }
  };

  // =========================
  // NAVIGATION
  // =========================

  const goDashboard = () => {
    setPage("Dashboard");
  };

  const goCases = () => {
    setPage("Cases");
  };

  // =========================
  // DASHBOARD
  // =========================

  const renderDashboard = () => {
    const resolvedCount = cases.filter(
      (item) => item.status === "Resolved"
    ).length;

    return (
      <div className="page-content">

        <section className="hero">

          <div>
            <p className="eyebrow">
              NETWORK TROUBLESHOOTING PLATFORM
            </p>

            <h1>NetSage AI</h1>

            <p className="hero-description">
              AI-assisted network fault diagnosis
              with evidence, rule checking and
              human review.
            </p>
          </div>

          <div className="hero-symbol">
            ◇
          </div>

        </section>

        <section className="stats-grid">

          <div className="stat-card">
            <span>Total Cases</span>

            <strong>
              {cases.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Resolved Cases</span>

            <strong>
              {resolvedCount}
            </strong>
          </div>

          <div className="stat-card">
            <span>AI Diagnosis</span>

            <strong className="status-active">
              Active
            </strong>
          </div>

          <div className="stat-card">
            <span>Human Review</span>

            <strong>
              Ready
            </strong>
          </div>

        </section>

        <section className="section-header">

          <div>
            <h2>
              Network Cases
            </h2>

            <p>
              Select a case to investigate.
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={goCases}
          >
            View All Cases →
          </button>

        </section>

        <div className="case-grid">

          {cases
            .slice(0, 6)
            .map(
              (networkCase, index) => (
                <CaseCard
                  key={
                    getCaseId(networkCase) ||
                    `case-${index}`
                  }
                  networkCase={
                    networkCase
                  }
                  onOpen={openCase}
                />
              )
            )}

        </div>

      </div>
    );
  };

  // =========================
  // CASES
  // =========================

  const renderCases = () => {
    return (
      <div className="page-content">

        <div className="page-heading">

          <div>
            <p className="eyebrow">
              CASE MANAGEMENT
            </p>

            <h1>
              Network Cases
            </h1>

            <p>
              Choose a network problem
              to investigate.
            </p>
          </div>

        </div>

        <div className="case-grid">

          {cases.map(
            (networkCase, index) => (
              <CaseCard
                key={
                  getCaseId(networkCase) ||
                  `case-${index}`
                }
                networkCase={
                  networkCase
                }
                onOpen={openCase}
              />
            )
          )}

        </div>

        {cases.length === 0 && (
          <div className="empty-state">

            <h3>
              No cases available
            </h3>

            <p>
              Make sure the backend is
              running on port 8000.
            </p>

          </div>
        )}

      </div>
    );
  };

  // =========================
  // DIAGNOSIS
  // =========================

  const renderDiagnosis = () => {
    if (!selectedCase) {
      return (
        <div className="empty-state">

          <h3>
            No case selected
          </h3>

          <button
            className="primary-button"
            onClick={goCases}
          >
            Go to Cases
          </button>

        </div>
      );
    }

    return (
      <div className="page-content">

        <div className="diagnosis-heading">

          <div>

            <p className="eyebrow">
              AI NETWORK ANALYSIS
            </p>

            <h1>
              {getTitle(selectedCase)}
            </h1>

            <p>
              <span className="severity-text">
                {getSeverity(
                  selectedCase
                )}{" "}
                severity
              </span>
            </p>

          </div>

          <button
            className="secondary-button"
            onClick={goCases}
          >
            ← Back to Cases
          </button>

        </div>

        <div className="diagnosis-layout">

          {/* NETWORK EVIDENCE */}

          <section className="panel">

            <div className="panel-header">

              <div>

                <p className="eyebrow">
                  NETWORK DATA
                </p>

                <h2>
                  Network Evidence
                </h2>

              </div>

              <div className="panel-icon">
                ⌁
              </div>

            </div>

            <div className="evidence-list">

              <EvidenceRow
                label="Case ID"
                value={
                  getCaseId(
                    selectedCase
                  ) ||
                  "Not available"
                }
              />

              <EvidenceRow
                label="Problem"
                value={
                  selectedCase.symptom ||
                  "Not available"
                }
              />

              <EvidenceRow
                label="Category"
                value={getConcept(
                  selectedCase
                )}
              />

              <EvidenceRow
                label="OSI Layer"
                value={
                  selectedCase.osi_layer ||
                  "Not available"
                }
              />

              <EvidenceRow
                label="Expected Fault"
                value={
                  selectedCase.expected_fault ||
                  "Not available"
                }
              />

            </div>

            <div className="command-section">

              <h3>
                Network Evidence
              </h3>

              <pre>
                {selectedCase.show_output ||
                  "No command output available."}
              </pre>

            </div>

          </section>

          {/* AI DIAGNOSIS */}

          <section className="panel ai-panel">

            <div className="panel-header">

              <div>

                <p className="eyebrow">
                  AI ENGINE
                </p>

                <h2>
                  NetSage Diagnosis
                </h2>

              </div>

              <div className="ai-badge">
                AI
              </div>

            </div>

            {!diagnosis &&
              !loading && (
                <div className="diagnosis-empty">

                  <div className="empty-icon">
                    ✦
                  </div>

                  <h3>
                    No diagnosis available
                  </h3>

                  <p>
                    Run the AI engine to
                    analyze this network case.
                  </p>

                  <button
                    className="primary-button"
                    onClick={
                      runDiagnosis
                    }
                  >
                    Run Diagnosis
                  </button>

                </div>
              )}

            {loading && (
              <div className="diagnosis-empty">

                <div className="spinner"></div>

                <h3>
                  Analyzing network evidence...
                </h3>

                <p>
                  NetSage AI is checking
                  the available evidence.
                </p>

              </div>
            )}

            {diagnosis &&
              !loading && (
                <DiagnosisResult
                  diagnosis={
                    diagnosis
                  }
                />
              )}

          </section>

        </div>

        {diagnosis && (
          <div className="diagnosis-actions">

            <button
              className="primary-button"
              onClick={
                openHumanReview
              }
            >
              Continue to Human Review →
            </button>

            <button
              className="secondary-button"
              onClick={
                runDiagnosis
              }
            >
              Run Diagnosis Again
            </button>

          </div>
        )}

      </div>
    );
  };

  // =========================
  // HUMAN REVIEW
  // =========================

  const renderHumanReview = () => {
    if (
      !selectedCase ||
      !diagnosis
    ) {
      return (
        <div className="empty-state">

          <h3>
            No diagnosis available
            for review.
          </h3>

          <button
            className="primary-button"
            onClick={() =>
              setPage("Diagnosis")
            }
          >
            Back to Diagnosis
          </button>

        </div>
      );
    }

    return (
      <div className="page-content">

        <div className="page-heading">

          <div>

            <p className="eyebrow">
              HUMAN OVERSIGHT
            </p>

            <h1>
              Human Review
            </h1>

            <p>
              Review the AI recommendation
              before applying a network change.
            </p>

          </div>

          <button
            className="secondary-button"
            onClick={() =>
              setPage("Diagnosis")
            }
          >
            ← Back to Diagnosis
          </button>

        </div>

        <section className="review-card">

          <div className="review-top">

            <div>

              <span className="case-id">
                {getCaseId(
                  selectedCase
                )}
              </span>

              <h2>
                {getTitle(
                  selectedCase
                )}
              </h2>

            </div>

            <span
              className={`review-status ${reviewStatus ===
                  "Approved"
                  ? "approved"
                  : reviewStatus ===
                    "Rejected"
                    ? "rejected"
                    : "pending"
                }`}
            >
              {reviewStatus}
            </span>

          </div>

          <div className="review-divider"></div>

          <h3>
            AI Recommendation
          </h3>

          <div className="review-info">

            <div>

              <span>
                Root Cause
              </span>

              <strong>
                {diagnosis.root_cause}
              </strong>

            </div>

            <div>

              <span>
                Confidence
              </span>

              <strong>
                {diagnosis.confidence}%
              </strong>

            </div>

          </div>

          <div className="review-section">

            <h3>
              Proposed Fix
            </h3>

            <p>
              {diagnosis.suggested_fix}
            </p>

          </div>

          <div className="review-section">

            <h3>
              Verification Command
            </h3>

            <pre>
              {diagnosis.next_command}
            </pre>

          </div>

          <div className="review-actions">

            <button
              className="approve-button"
              onClick={
                approveRecommendation
              }
              disabled={
                reviewStatus ===
                "Approved"
              }
            >
              ✓ Approve Recommendation
            </button>

            <button
              className="reject-button"
              onClick={
                rejectRecommendation
              }
              disabled={
                reviewStatus ===
                "Rejected"
              }
            >
              ✕ Reject / Request Revision
            </button>

            <button
              className="resolve-button"
              onClick={resolveCase}
              disabled={
                reviewStatus !==
                "Approved"
              }
            >
              ✓ Mark Case Resolved
            </button>

          </div>

        </section>

      </div>
    );
  };

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-logo">
            N
          </div>

          <div>

            <h2>
              NetSage
            </h2>

            <span>
              AI Network Intelligence
            </span>

          </div>

        </div>

        <nav className="navigation">

          <button
            className={
              page === "Dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={
              goDashboard
            }
          >
            ▣ Dashboard
          </button>

          <button
            className={
              page === "Cases"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={
              goCases
            }
          >
            ◉ Cases
          </button>

          <button
            className={
              page === "Diagnosis"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => {

              if (selectedCase) {
                setPage(
                  "Diagnosis"
                );
              } else {
                goCases();
              }

            }}
          >
            ◈ AI Diagnosis
          </button>

          <button
            className={
              page === "Human Review"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => {

              if (
                selectedCase &&
                diagnosis
              ) {
                setPage(
                  "Human Review"
                );
              } else {
                alert(
                  "Select a case and run AI Diagnosis first."
                );
              }

            }}
          >
            ✓ Human Review
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="connection">

            <span
              className={
                backendConnected
                  ? "connection-dot"
                  : "connection-dot offline"
              }
            ></span>

            {backendConnected
              ? "Backend Connected"
              : "Backend Offline"}

          </div>

          <small>
            NetSage AI v1.0
          </small>

        </div>

      </aside>

      <main className="main">

        <header className="topbar">

          <span>
            Network Operations
          </span>

          <div className="topbar-right">

            <span className="system-status">

              <span></span>

              System Online

            </span>

            <span>
              Admin
            </span>

          </div>

        </header>

        {page === "Dashboard" &&
          renderDashboard()}

        {page === "Cases" &&
          renderCases()}

        {page === "Diagnosis" &&
          renderDiagnosis()}

        {page === "Human Review" &&
          renderHumanReview()}

      </main>

    </div>
  );
}


// =========================
// CASE CARD
// =========================

function CaseCard({
  networkCase,
  onOpen,
}: {
  networkCase: Case;
  onOpen: (
    networkCase: Case
  ) => void;
}) {
  const caseId =
    networkCase.case_id ||
    String(
      networkCase.id || ""
    );

  const title =
    networkCase.title ||
    "Network Troubleshooting Case";

  const severity =
    networkCase.severity ||
    "Medium";

  const concept =
    networkCase.concept ||
    "Network";

  return (
    <div className="case-card">

      <div className="case-card-top">

        <span className="case-id">
          {caseId}
        </span>

        <span
          className={`severity-badge ${severity.toLowerCase()}`}
        >
          {severity}
        </span>

      </div>

      <h3>
        {title}
      </h3>

      <p>
        {networkCase.symptom ||
          "Network troubleshooting issue requiring investigation."}
      </p>

      <div className="tags">

        <span>
          {concept}
        </span>

        {networkCase.osi_layer && (
          <span>
            {networkCase.osi_layer}
          </span>
        )}

        {networkCase.status ===
          "Resolved" && (
            <span className="resolved-tag">
              Resolved
            </span>
          )}

      </div>

      <button
        className="case-button"
        onClick={() =>
          onOpen(networkCase)
        }
      >
        Investigate Case
      </button>

    </div>
  );
}


// =========================
// EVIDENCE ROW
// =========================

function EvidenceRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="evidence-row">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}


// =========================
// DIAGNOSIS RESULT
// =========================

function DiagnosisResult({
  diagnosis,
}: {
  diagnosis: Diagnosis;
}) {
  return (
    <div className="diagnosis-result">

      <div className="confidence-box">

        <span>
          AI Confidence
        </span>

        <strong>
          {diagnosis.confidence}%
        </strong>

      </div>

      <div className="root-cause">

        <span>
          ROOT CAUSE
        </span>

        <h2>
          {diagnosis.root_cause}
        </h2>

      </div>

      <div className="result-section">

        <h3>
          Evidence
        </h3>

        <ul>

          {diagnosis.evidence.map(
            (item, index) => (
              <li
                key={`${diagnosis.case_id}-evidence-${index}`}
              >
                {item}
              </li>
            )
          )}

        </ul>

      </div>

      <div className="result-section">

        <h3>
          Suggested Fix
        </h3>

        <p>
          {diagnosis.suggested_fix}
        </p>

      </div>

      <div className="result-section">

        <h3>
          Next Command
        </h3>

        <pre>
          {diagnosis.next_command}
        </pre>

      </div>

    </div>
  );
}

export default App;