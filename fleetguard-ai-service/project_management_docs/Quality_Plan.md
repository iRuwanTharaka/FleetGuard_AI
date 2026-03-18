# Exhaustive AI Quality Assurance & Quality Control Master Plan

## 1. FleetGuard Enterprise Quality Policy and Objective Alignment
The core functional directive of the FleetGuard AI Damage Detection Service is reliability. If the inference model hallucinates or misinterprets an image—for instance, classifying a severe structural crush as a minor scratch—the cascaded business effect is catastrophic for auto-insurance adjusters. Alternatively, if the Node API crashes entirely, downstream mobile engineers are physically blocked from building their interfaces. Our Quality Plan dictates that **System Uptime** and **API Resiliency (`STUB_MODE`)** are elevated to the same critical status as neural network precision (`mAP > 85%`).

---

## 2. Quality Assurance (QA) Methodologies
Quality Assurance occurs *before* a functional defect is instantiated in production. We ensure quality proactively via environmental isolation and pipeline engineering.

### 2.1. Strict Python Dependency Management
By enforcing a uniform virtual environment (`venv`) through `requirements.txt`, we prevent PyTorch version drift globally across the engineering team. Developers utilizing `conda` or raw `pip install` globally represent a P1 security and quality hazard. The QA requirement mandates all training data scripts (`download_dataset.py`, `train.py`) must be executed inside this insulated Python boundary.

### 2.2. Defensive Node.js API Architecture
The JavaScript AI bridging wrapper (`app.js`) is held to draconian memory-management policies. The QA requirement explicitly highlights `@tensorflow/tfjs` usage inside standard Express architecture as notoriously volatile memory-wise. 
- **Requirement:** Every execution layer utilizing `jpeg-js` decoding and `tf.tensor3d` arrays must be manually scoped with garbage collection overrides (`tf.dispose()`).
- **Validation:** Developers must physically document memory utilization via the macOS Activity Monitor during 100 concurrent Postman POST loops against `/api/detect`.

---

## 3. Quality Control (QC) Checklists and Metrics
QC activities monitor the functional reality against the QA standard.

### 3.1. PyTorch Model QC Tracking
During the execution of `yolov8n-cls.pt` across `epochs=50`, the Model Engineer must document:
- **General Classification Loss:** Tracking the entropy penalty for a wrong categorical guess. Expected gradient is steep loss through Epoch 15, tapering aggressively toward Epoch 45.
- **Overfitting Deltas:** Continually checking the discrepancy between training mAP metrics and validation `images/val` mAP metrics. If the model exhibits aggressive memorization without validation extrapolation, the QC team mandates emergency `EarlyStopping` implementation.

### 3.2. Vector/Dataset Parsing Integrity
Kaggle's `VehiDE` dataset is dense and raw. QC tests pre-validate the schema:
1. Directory traversal validation ensures strict alignment containing exactly 5 primary subclasses `['01-whole', '00-damage']` or equivalent multi-class damage directories.
2. Removal of corrupt byte streams utilizing a script to intercept 0-byte `.jpg` configurations that will segfault PyTorch's `cv2.imread()`.

### 3.3. API Endpoint Payload QC (Postman Scripts)
Before the `app.js` is declared "Quality Assured", the `/api/detect` route must pass an extensive integration check:
- **Test 01: Standard Upload.** Transmitting a clean `200kb .jpeg` bounding to `128x128`. Validating the JSON payload structure containing `overall_severity`, `health_score`, and `detections` arrays.
- **Test 02: STUB_MODE Emergency.** The tester manually corrupts or deletes the `best.pt` file. They re-run the `POST` request to ensure the API catches the error gracefully, simulates an analysis, and appends the `model_info: { stub_mode: true }` metadata preventing a 500 fatal Internal Server crash.
- **Test 03: Malicious File Override.** Submitting `document.pdf` and `virus.exe` renamed to `.jpg`. Ensuring the `multer` disk-write protocol and `jpeg-js` decoders catch the hex anomaly and return a `400 Bad Request`.

---

## 4. Defect and Bug Tracking Lifecycle
Our triage matrix categorizes bugs by severity rather than origin. A bug in Python affects the Node team equitably.

| Priority Level | Resolution SLA | Examples from FleetGuard Sprint | Protocol |
|---|---|---|---|
| **P0: Blocker / Fatal** | Under 4 Hours | MPS execution throwing `NotImplementedError` stopping PyTorch training. `app.js` crashing entirely via TensorFlow memory leak. | Stop sprint velocity immediately. Team war-room established. |
| **P1: High Impact** | Within 24 Hours | API `/api/health` returns 200, but `/api/detect` drops incoming connection if `confidence < 50%`. | Task assigned dynamically. Next PR merges a hotfix. |
| **P2: Medium Priority** | Within Current Sprint (Days) | Classification confidence oscillates erroneously between "Scratches" and "Cracks" on specific angles. | Scheduled retrain cycle; `data.yaml` dataset adjustment. |
| **P3: Low / Trivial** | Backlog / Ad Hoc | Missing comments in the README or a typo within the JSON payload variables (e.g., `inspecton_id`). | Picked up at the developer's discretion asynchronously. |

---

## 5. Ongoing Monitoring and Re-Training Triggers
The Quality plan recognizes that YOLOv8 computer vision models decay over massive throughput. As real-world vehicular uploads differ from Kaggle's idealized lighting sets, a threshold tracker connects internally via `STUB_MODE` logs. Any week exceeding 100 inferences classified sub-70% overall confidence automatically triggers an internal notification sequence for a `data1a` re-training sprint on new physical inputs.
