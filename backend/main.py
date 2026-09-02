from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from cases_data import CASES


app = FastAPI(title="NetSage AI")


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "NetSage AI backend is running"
    }


# --------------------------------------------------
# GET ALL CASES
# --------------------------------------------------

@app.get("/api/cases")
def get_cases():
    return CASES


# --------------------------------------------------
# GET SINGLE CASE
# --------------------------------------------------

@app.get("/api/cases/{case_id}")
def get_case(case_id: str):

    for case in CASES:

        current_id = str(
            case.get("case_id", case.get("id", ""))
        )

        if current_id == case_id:
            return case

    raise HTTPException(
        status_code=404,
        detail="Case not found"
    )


# --------------------------------------------------
# AI DIAGNOSIS
# --------------------------------------------------

@app.post("/api/diagnose/{case_id}")
def diagnose_case(case_id: str):

    case = None

    for item in CASES:

        current_id = str(
            item.get("case_id", item.get("id", ""))
        )

        if current_id == case_id:
            case = item
            break

    if case is None:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    diagnosis = {
        "case_id": case_id,

        "root_cause": case.get(
            "expected_fault",
            "Network configuration problem"
        ),

        "confidence": 91,

        "evidence": [
            f"Symptom: {case.get('symptom', 'Not available')}",
            f"Network concept: {case.get('concept', 'Not available')}",
            f"OSI layer: {case.get('osi_layer', 'Not available')}",
            f"Severity: {case.get('severity', 'Not available')}",
            f"Topology: {case.get('topology', 'Not available')}",
            f"Command output: {case.get('show_output', 'Not available')}"
        ],

        "next_command": (
            "show vlan brief && show interfaces trunk"
        ),

        "suggested_fix": (
            "Verify the network configuration, "
            "check the affected interfaces, "
            "and confirm that the required configuration is correct."
        )
    }

    return diagnosis


# --------------------------------------------------
# APPROVE RECOMMENDATION
# --------------------------------------------------

@app.post("/api/review/{case_id}/approve")
def approve_case(case_id: str):

    for case in CASES:

        current_id = str(
            case.get("case_id", case.get("id", ""))
        )

        if current_id == case_id:

            case["review_status"] = "Approved"

            return {
                "message": "Recommendation approved successfully.",
                "case_id": case_id,
                "review_status": "Approved"
            }

    raise HTTPException(
        status_code=404,
        detail="Case not found"
    )


# --------------------------------------------------
# REJECT RECOMMENDATION
# --------------------------------------------------

@app.post("/api/review/{case_id}/reject")
def reject_case(case_id: str):

    for case in CASES:

        current_id = str(
            case.get("case_id", case.get("id", ""))
        )

        if current_id == case_id:

            case["review_status"] = "Rejected"

            return {
                "message": "Recommendation rejected.",
                "case_id": case_id,
                "review_status": "Rejected"
            }

    raise HTTPException(
        status_code=404,
        detail="Case not found"
    )


# --------------------------------------------------
# MARK CASE AS RESOLVED
# --------------------------------------------------

@app.post("/api/review/{case_id}/resolve")
def resolve_case(case_id: str):

    for case in CASES:

        current_id = str(
            case.get("case_id", case.get("id", ""))
        )

        if current_id == case_id:

            case["review_status"] = "Resolved"

            return {
                "message": "Case marked as resolved successfully.",
                "case_id": case_id,
                "review_status": "Resolved"
            }

    raise HTTPException(
        status_code=404,
        detail="Case not found"
    )