# 🌐 NetSage AI

### AI-Assisted Cisco Network Troubleshooting & Diagnosis Platform

<p align="center">
  <strong>Diagnose faster. Troubleshoot smarter. Review with confidence.</strong>
</p>

---

## 🚀 Overview

**NetSage AI** is an AI-assisted Cisco network troubleshooting platform designed to help network engineers identify and analyze network faults efficiently.

The system analyzes network symptoms, topology information, Cisco command outputs, networking concepts, OSI layers, and severity levels to generate a structured diagnostic recommendation.

NetSage AI provides:

- 🔍 Probable root-cause identification
- 📊 Confidence scoring
- 🧠 Evidence-based diagnosis
- 💻 Recommended Cisco commands
- 🛠️ Suggested troubleshooting fixes
- 👨‍💻 Human review and approval
- ✅ Case resolution tracking

The platform follows a **Human-in-the-Loop** approach, ensuring that AI recommendations can be reviewed by a human before being treated as a final decision.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔎 Network Diagnosis | Analyze predefined Cisco network troubleshooting cases |
| 🧠 AI-Assisted Analysis | Generate probable root causes from network information |
| 📊 Confidence Score | Show confidence level for each diagnosis |
| 📋 Evidence | Display supporting network information |
| 💻 Cisco Commands | Recommend useful troubleshooting commands |
| 🛠️ Suggested Fix | Provide corrective troubleshooting guidance |
| 👨‍💻 Human Review | Approve or reject AI recommendations |
| ✅ Case Resolution | Mark successfully handled cases as resolved |
| 🌐 Web Dashboard | Manage and visualize troubleshooting cases |

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      User / Engineer │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   NetSage AI UI     │
                    │ React + TypeScript  │
                    └──────────┬──────────┘
                               │
                          REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    │      Python         │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
        ┌────────────┐ ┌────────────┐ ┌──────────────┐
        │ Case Data  │ │ Diagnosis  │ │ Human Review │
        │            │ │   Engine   │ │    Module    │
        └────────────┘ └────────────┘ └──────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Diagnostic Result   │
                    │ Root Cause + Fix    │
   HOW ITS WORK :
                 └─────────────────────┘
Network Case
     ↓
Case Information
     ↓
NetSage AI Analysis
     ↓
Root Cause Identification
     ↓
Evidence + Confidence Score
     ↓
Recommended Cisco Command
     ↓
Suggested Fix
     ↓
Human Review
     ↓
Approve / Reject / Resolve
AI Diagnosis

For each troubleshooting case, NetSage AI generates:

Root Cause
Confidence Score
Diagnostic Evidence
Next Cisco Command
Suggested Fix
Example
Root Cause:
VLAN / Network Configuration Issue

Confidence:
91%

Evidence:
• Network Symptom
• Network Concept
• OSI Layer
• Severity
• Topology
• Cisco Command Output

Next Command:
show vlan brief && show interfaces trunk

Suggested Fix:
Verify the network configuration and affected interfaces.
👨‍💻 Human Review

NetSage AI keeps a human involved in the troubleshooting workflow.

Recommendations can be:

✅ Approved
❌ Rejected
🔵 Resolved

This provides better control and accountability over AI-assisted network decisions.

🖥️ Main Modules
📊 Dashboard

Displays available network troubleshooting cases and important information such as:

Case ID
Network Concept
Symptom
Topology
OSI Layer
Severity
🧠 Diagnosis

Analyzes the selected case and generates an AI-assisted troubleshooting recommendation.

👨‍💻 Human Review

Allows engineers to review and manage AI-generated recommendations.

🛠️ Technology Stack
Frontend
React
TypeScript
Axios
CSS
Backend
Python
FastAPI
REST API
Networking
Cisco Networking
Cisco IOS Commands
VLAN & Switching
Network Topology
OSI Model
📁 Project Structure
NetSageAiCisco/
│
├── backend/
│   ├── main.py
│   ├── cases_data.py
│   ├── checker.py
│   ├── schemas.py
│   └── venv/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── NetSageAI/
│
├── .gitignore
└── README.md

venv/ and node_modules/ should not be uploaded to GitHub.

⚙️ Installation
1. Clone the Repository
git clone https://github.com/DRISHTIKASHYAP28/NetSage-AI.git
cd NetSage-AI
2. Start Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn
uvicorn main:app --reload

Backend:

http://127.0.0.1:8000
3. Start Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Frontend:

http://localhost:5175
🔌 API Endpoints
Method	Endpoint	Purpose
GET	/api/cases	Get all cases
GET	/api/cases/{case_id}	Get a specific case
POST	/api/diagnose/{case_id}	Run diagnosis
POST	/api/review/{case_id}/approve	Approve recommendation
POST	/api/review/{case_id}/reject	Reject recommendation
POST	/api/review/{case_id}/resolve	Resolve case
🔐 Responsible AI

NetSage AI is designed as an AI-assisted decision-support system rather than an autonomous network configuration system.

The platform:

👨‍💻 Keeps humans involved in decisions
🔍 Provides supporting evidence
📊 Displays confidence levels
🛑 Does not automatically modify network devices
✅ Allows recommendations to be reviewed
🎯 Project Objectives
Reduce network troubleshooting time.
Assist engineers in identifying network faults.
Provide structured diagnostic information.
Recommend relevant Cisco troubleshooting commands.
Provide human oversight of AI recommendations.
Demonstrate the practical use of AI in networking and cybersecurity.
🔮 Future Scope

Future versions can include:

🤖 Advanced Machine Learning models
🧠 Large Language Model integration
📚 Retrieval-Augmented Generation (RAG)
🔌 Real-time Cisco device integration
📡 Live network monitoring
📄 Automated log analysis
🚨 Real-time fault detection
🔐 Advanced cybersecurity analysis
⚙️ Automated remediation with human approval
🌟 Benefits
For Network Engineers
Faster troubleshooting
Reduced manual analysis
Consistent diagnostic workflow
Actionable troubleshooting recommendations
For Organizations
Improved troubleshooting efficiency
Reduced potential network downtime
Structured network diagnosis
Human-controlled AI assistance
🧪 Example Use Case
Network Connectivity Problem
            ↓
       Case Analysis
            ↓
    Cisco Output Analysis
            ↓
      Root Cause
            ↓
   Evidence + Confidence
            ↓
 Recommended Command
            ↓
      Suggested Fix
            ↓
       Human Review
            ↓
   Approve / Reject
            ↓
         Resolve

👩‍💻 Developer

Drishti Kashyap

Project: NetSage AI
Domain: AI & Cyber Security / Networking

💡 Project Vision

"Making network troubleshooting faster, smarter, explainable, and human-controlled with AI."
