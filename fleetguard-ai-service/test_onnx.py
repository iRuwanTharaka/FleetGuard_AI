"""
@module     AI Service
@author     Bethmi Jayamila <bethmij@gmail.com>
@description This file is part of the AI Damage Detection service of FleetGuard AI.
             Developed and trained by Bethmi Jayamila.
@date       2026-02-17
"""

import cv2
import numpy as np

print(cv2.__version__)
net = cv2.dnn.readNetFromONNX("yolov8n.onnx")
print("Successfully initialized ONNX network.")
