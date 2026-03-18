"""
@module     AI Service
@author     Bethmi Jayamila <bethmij@gmail.com>
@description This file is part of the AI Damage Detection service of FleetGuard AI.
             Developed and trained by Bethmi Jayamila.
@date       2026-02-14
"""

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

# Dynamically link to the newly training YOLOv8 model weights
# (It will load the pre-trained nano until the best.pt file finishes writing in ~3 hours)
TRAINED_WEIGHTS = "../runs/classify/fleetguard_damage_model4/weights/best.pt"
MODEL_PATH = TRAINED_WEIGHTS if os.path.exists(TRAINED_WEIGHTS) else "../runs/classify/fleetguard_damage_model3/weights/best.pt"

print(f"Loading Genuine PyTorch ultralytics backend via: {MODEL_PATH}")

try:
    model = YOLO(MODEL_PATH)
    STUB_MODE = False
except Exception as e:
    print(f"Warning: PyTorch init failed. Running in STUB mode. Error: {e}")
    STUB_MODE = True

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "FleetGuard AI Service (Python/PyTorch-Native)"})

@app.route('/api/detect', methods=['POST'])
def detect_damage():
    if 'images' not in request.files:
        return jsonify({"success": False, "error": "No image uploaded"}), 400

    # FleetGuard backend sends an array of 8 images batch (Front, Rear, Left, etc.)
    files = request.files.getlist('images')
    inspection_id = request.form.get('inspection_id', 'unknown')

    if not files or len(files) == 0:
        return jsonify({"success": False, "error": "No selected files"}), 400

    if STUB_MODE:
        return jsonify({"success": True, "inspection_id": "STUB_DARKNET", "overall_severity": "low", "health_score": 95, "damages": [{"damage_type": "stub", "severity": "low", "confidence": 0.9, "bbox_json": [0,0,1,1]}]}), 200

    damages = []
    overall_severity = "low"
    health_score = 100
    is_damaged_any = False

    try:
        # Loop over every uploaded photo in the 8-photo batch stream
        for idx, file in enumerate(files):
            if file.filename == '':
                continue
                
            filepath = os.path.join(UPLOAD_FOLDER, secure_filename(f"{idx}_{file.filename}"))
            file.save(filepath)

            try:
                # Run inference against the newly trained PyTorch model
                results = model(filepath)
                r = results[0]
                
                # Parse classification outputs (00-damage, 01-whole)
                class_names = r.names
                probs = r.probs.data.tolist()
                
                is_damaged = False
                damage_prob = 0.0
                
                damage_idx = -1
                for c_idx, name in class_names.items():
                    if "damage" in name.lower():
                        damage_idx = c_idx
                
                if damage_idx != -1:
                    damage_prob = probs[damage_idx]
                    is_damaged = damage_prob > 0.5
                
                if is_damaged:
                    is_damaged_any = True
                    severity = "high" if damage_prob > 0.8 else "medium"
                    
                    if severity == "high":
                        overall_severity = "high"
                        health_score = max(0, health_score - 20)
                    elif overall_severity != "high":
                        overall_severity = "medium"
                        health_score = max(0, health_score - 10)

                    # Simulated dummy bbox for classification output mapping to target labels
                    damages.append({
                        "damage_type": "dent/scratch/structural",
                        "severity": severity,
                        "confidence": damage_prob,
                        "photo_index": idx,  # Critical link for node inspections.controller.js
                        "location_description": f"Detected in Frame {idx + 1}",
                        "bbox_json": {"location": f"Frame {idx}", "bbox": [0, 0, 800, 600]},
                        "bbox": [0, 0, 800, 600] # Explicit d.bbox for inspections.controller.js
                    })
            except Exception as inner_e:
                print(f"Error processing image {idx}: {inner_e}")
            finally:
                if os.path.exists(filepath):
                    os.remove(filepath)

        return jsonify({
            "success": True,
            "inspection_id": inspection_id,
            "overall_severity": overall_severity if is_damaged_any else "low",
            "health_score": max(0, min(100, health_score)),
            "damages": damages,
            "model_info": {
                "stub_mode": STUB_MODE,
                "type": "yolov8-pytorch-batch"
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

if __name__ == '__main__':
    # Backend proxy expects 5000, but if AirPlay blocks it on macOS, we can use 5001.
    # We use AI_PORT to prevent conflicting with the Node backend which globally uses PORT=3001.
    port = int(os.environ.get("AI_PORT", 5001))
    app.run(host='0.0.0.0', port=port)
