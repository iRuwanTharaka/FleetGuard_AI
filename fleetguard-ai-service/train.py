"""
@module     AI Service
@author     Bethmi Jayamila <bethmij@gmail.com>
@description This file is part of the AI Damage Detection service of FleetGuard AI.
             Developed and trained by Bethmi Jayamila.
@date       2026-02-14
"""

from ultralytics import YOLO
import os

def main():
    print("Initializing YOLOv8 Classification model training...")
    
    # Check if a previously trained model exists to resume or start fresh
    model_path = '../runs/classify/fleetguard_damage_model3/weights/best.pt'
    if not os.path.exists(model_path):
        model_path = 'yolov8n-cls.pt'
    model = YOLO(model_path)

    # Use data1a which has training and validation set
    data_dir = os.path.abspath('dataset/data1a')
    
    # In YOLOv8 classification, the dataset directory should contain 'train' and 'val' folders.
    # Currently, they are named 'training' and 'validation', we must copy or symlink them,
    # or rename them to 'train' and 'val' to strictly meet YOLO's expectations.
    
    train_src = os.path.join(data_dir, 'training')
    val_src = os.path.join(data_dir, 'validation')
    
    train_dest = os.path.join(data_dir, 'train')
    val_dest = os.path.join(data_dir, 'val')
    
    if os.path.exists(train_src) and not os.path.exists(train_dest):
        os.rename(train_src, train_dest)
    if os.path.exists(val_src) and not os.path.exists(val_dest):
        os.rename(val_src, val_dest)

    print(f"Starting actual training on dataset {data_dir}...")
    try:
        results = model.train(
            data=data_dir,
            epochs=50,          # The user allocated 10 hours; 50 epochs should be sufficient
            imgsz=224,          # Classification standard size
            batch=32,
            name='fleetguard_damage_model',
            device='mps'        # Attempt to use Apple Metal Performance Shaders (MPS)
        )
        print("Training completed! Model weights saved to runs/classify/fleetguard_damage_model/weights/best.pt")
    except Exception as e:
        print(f"Failed with mps device: {e}")
        print("Falling back to CPU device...")
        results = model.train(
            data=data_dir,
            epochs=50,          
            imgsz=224,          
            batch=32,
            name='fleetguard_damage_model',
            device='cpu'        
        )
        print("Training completed! Model weights saved to runs/classify/fleetguard_damage_model/weights/best.pt")

if __name__ == "__main__":
    main()
