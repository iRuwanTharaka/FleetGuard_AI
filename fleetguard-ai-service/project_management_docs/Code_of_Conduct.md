# FleetGuard AI Service: Master Code of Conduct & Ethical Framework

## 1. Vision Statement and Letter from Leadership
Welcome to the FleetGuard AI project squad. Developing an artificial intelligence pipeline that can accurately interpret physical vehicle damage requires more than just excellent coding capabilities; it demands a unified, respectful, and ethically aligned development team. Our output directly influences logistical operations and financial quotations. Because our software wields this power, our behavior during its construction must be held to the absolute highest professional standard. This Master Code of Conduct outlays our shared values, engineering heuristics, unacceptable behavior thresholds, and detailed conflict resolution procedures.

---

## 2. Core Ethical Framework and Shared Values
The core functioning of this team relies on psychological safety, mutual respect, and accountability.

**A. Psychological Safety & Open Inquiry**
No developer should feel intimidated when raising questions regarding architecture or methodology. Questions like "Why are we using Node.js instead of Python Flask?" or "How does `STUB_MODE` actually prevent a memory leak?" are not only welcomed—they are required. We are a team of varying experience levels; educating each other is a primary objective.

**B. Quality-First Mindset over Hacking**
While speed is necessary to meet the Friday deadline, it cannot come at the cost of deploying "spaghetti code." We will not bypass testing to merge a pull request. We embrace defensive programming, error handling, and robust try-catch mechanisms over brittle, happy-path-only code.

**C. Radical Transparency and Ownership**
Mistakes will occur. A local training script will crash the terminal. An API endpoint might leak memory causing an out-of-memory (OOM) error. If you deploy code that introduces a bug, own it transparently in the public Slack channel. The squad approaches failures as systemic issues to solve, not personal character flaws to punish.

---

## 3. Engineering and Development Guidelines
Conduct extends directly into how we interact with the repository.

### 3.1. Code Reviews and Pull Requests (PRs)
- **Review with Empathy:** When assigned as a code reviewer, evaluate the code, not the coder. Avoid phrases like, "Why did you write it this way?" Instead, utilize, "What do you think about refactoring this array manipulation to utilize `tf.dispose()` to save memory?"
- **Mandatory Description:** Never submit an empty PR description. Always include the "Why", "What", and "How" of the code change, especially when altering the `data.yaml` or YOLO model weights.

### 3.2. Environmental Responsibility
- Do not pollute the master branch with undocumented hardware checks. If you write a fallback (`device='cpu'` after an `mps` failure), meticulously comment on why that block exists for future developers who may not be on Apple Silicon.
- Properly respect `.gitignore`. Never upload local `venv` folders, `.DS_Store` files, or the Kaggle API `kaggle.json` credentials to the remote repository. Doing so compromises security and clutters the workspace.

---

## 4. Diversity, Equity, and Inclusion (DEI)
FleetGuard AI thrives on the diverse backgrounds of its managerial cohort. We categorically mandate an environment free from discrimination based on race, gender identity and expression, sexual orientation, disability, physical appearance, body size, age, or religion. Team members are expected to utilize inclusive language in all documentation, comments, and meeting transcripts. 

---

## 5. Unacceptable Behaviors (Zero-Tolerance Policy)
The following actions are strictly prohibited and will result in immediate escalation:
1. **Harassment & Intimidation:** Any form of belittlement, aggressive posturing in meetings, or relentless unsolicited criticism.
2. **Knowledge Hoarding / Gatekeeping:** Intentionally obfuscating the AI architecture, refusing to comment on complex Python tensor matrices, or withholding access to the VehiDE Kaggle subset to maintain power or indispensability within the team.
3. **Deliberate Sabotage:** Introducing malicious loops, intentionally bypassing the `STUB_MODE` to crash downstream team apps during testing, or tampering with the model weight configurations (`best.pt`) to negatively skew the accuracy.
4. **Unprofessional Communication:** Using Slack or team meetings to broadcast derogatory remarks regarding internal tools, other departments, or project constraints.

---

## 6. Comprehensive Conflict Resolution Matrix
When conflicts arise—whether they are technical disagreements over PyTorch device deployment or interpersonal clashes—the following escalation matrix must be utilized.

### Step 1: Peer-to-Peer Asynchronous Discussion
- *Trigger:* Initial disagreement (e.g., how to handle `multer` uploads).
- *Action:* The involved parties discuss the issue publicly in the PR comments or a dedicated Slack thread. Empirical evidence (documentation links, performance benchmarks) must be used. Emotional rhetoric is removed.

### Step 2: Synchronous Team Debugging / Vote
- *Trigger:* Impasse reached after 24 hours of discussion.
- *Action:* The issue is moved to the Bi-Weekly Team Sync meeting. Both individuals have 3 minutes to present their architectural argument. The broader assembled team (Quality, Risk, and Project Managers) votes on the path forward. 

### Step 3: Managerial Intervention & HR Escalation
- *Trigger:* Interpersonal conflict involving violations of the Code of Conduct (e.g., harassment, gatekeeping).
- *Action:* Incident is reported directly to the Start-Up Manager via direct message. The Start-up Manager acts as a neutral arbiter. If the violation is severe, the offending team member may have their repository access revoked while a formal project reassignment occurs.

---

## 7. Acknowledgment
By checking out this repository and executing `npm install` or `pip install -r requirements.txt`, you acknowledge and bind yourself to the expectations laid out in this Master Code of Conduct. We succeed or fail together as the FleetGuard squad.
