"""
@module     AI Service
@author     Bethmi Jayamila <bethmij@gmail.com>
@description This file is part of the AI Damage Detection service of FleetGuard AI.
             Developed and trained by Bethmi Jayamila.
@date       2026-02-20
"""

import os
import zipfile
from kaggle.api.kaggle_api_extended import KaggleApi

def main():
    print("Initializing Kaggle API...")
    try:
        api = KaggleApi()
        api.authenticate()
    except Exception as e:
        print("Error authenticating with Kaggle API:", e)
        print("\nMake sure you have set KAGGLE_USERNAME and KAGGLE_KEY environment variables")
        print("or have a valid ~/.kaggle/kaggle.json file.")
        return

    # Using a common Kaggle car damage dataset identifier
    dataset_name = "anujms/car-damage-detection" # You can swap this for the specific VehiDE dataset ID if you have it
    dataset_path = "./dataset"

    if not os.path.exists(dataset_path):
        os.makedirs(dataset_path)

    print(f"Downloading dataset {dataset_name} to {dataset_path}...")
    try:
        api.dataset_download_files(dataset_name, path=dataset_path, unzip=True)
        print("Dataset downloaded successfully.")
        
        # Check the structure and ensure it matches YOLO expectations
        # Or print instructions on how to structure it
        print("Please ensure the dataset is in YOLO format (images/ labels/ directories)")
        print("and the data.yaml file is correctly configured for training.")
    except Exception as e:
        print(f"Failed to download dataset: {e}")

if __name__ == "__main__":
    main()
