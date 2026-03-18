# FleetGuard AI Service

This directory contains the Python-based AI service for FleetGuard's damage detection, using YOLOv8.

## Prerequisites
- Python 3.8+
- Kaggle API credentials (for downloading the VehiDE dataset)

## 1. Setup Environment
```bash
cd fleetguard-ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 2. Download Dataset
The VehiDE dataset is hosted on Kaggle. You must provide your Kaggle credentials:
1. Export them in your terminal:
   ```bash
   export KAGGLE_USERNAME="your-username"
   export KAGGLE_KEY="your-api-key"
   ```
2. Or place your `kaggle.json` in `~/.kaggle/kaggle.json`.

Then, run the download script:
```bash
python download_dataset.py
```

## 3. Train the Model
Ensure `data.yaml` is pointing to the downloaded dataset.
```bash
python train.py
```
*This will train the YOLOv8 model and save the best weights to `runs/detect/fleetguard_damage_model/weights/best.pt`.*

## 4. Run the Inference API
Start the Flask server on port 5000 (which the backend expects):
```bash
python app.py
```
- If the trained model is found, it will use it.
- If not, it will run in "STUB mode" using a generic base YOLO model array, outputting pseudo-detections so the backend does not crash.
