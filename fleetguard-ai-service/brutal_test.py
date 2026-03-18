import os
import time
from ultralytics import YOLO

def benchmark():
    # Load absolute latest weights from model4
    model_path = "../runs/classify/fleetguard_damage_model4/weights/best.pt"
    if not os.path.exists(model_path):
        model_path = "../runs/classify/fleetguard_damage_model3/weights/best.pt"
        
    print(f"Loading weights for brutal test: {model_path}")
    model = YOLO(model_path)
    
    val_dir = "dataset/data1a/val"
    classes = ["00-damage", "01-whole"]
    
    total = 0
    correct = 0
    
    damage_total = 0
    damage_correct = 0
    
    whole_total = 0
    whole_correct = 0
    
    print("\n--- Starting Brutal Accuracy Benchmark ---\n")
    start = time.time()
    
    for c in classes:
        cls_dir = os.path.join(val_dir, c)
        if not os.path.exists(cls_dir):
            continue
            
        is_damage_cls = "damage" in c.lower()
        print(f"Testing class: {c}")
        
        for img_name in os.listdir(cls_dir):
            if not img_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                continue
                
            img_path = os.path.join(cls_dir, img_name)
            results = model(img_path, verbose=False)
            r = results[0]
            
            # Get peak confidence class index
            top1_idx = r.probs.top1
            predicted_name = r.names[top1_idx]
            
            total += 1
            if is_damage_cls:
                damage_total += 1
                if "damage" in predicted_name.lower():
                    correct += 1
                    damage_correct += 1
            else:
                whole_total += 1
                if "whole" in predicted_name.lower():
                    correct += 1
                    whole_correct += 1
                    
    duration = time.time() - start
    
    print("\n--- Benchmark Results ---")
    print(f"Total Images Validated: {total}")
    print(f"Total Correct: {correct} ({_pct(correct, total)})")
    print(f"Total Incorrect: {total - correct} ({_pct(total - correct, total)})")
    print("\n[Damage Class Statistics]")
    print(f"Damage Images Tested: {damage_total}")
    print(f"Correctly Identified: {damage_correct} ({_pct(damage_correct, damage_total)})")
    print(f"False Negatives (Missed): {damage_total - damage_correct}")
    print("\n[Whole Class Statistics]")
    print(f"Whole Images Tested: {whole_total}")
    print(f"Correctly Identified: {whole_correct} ({_pct(whole_correct, whole_total)})")
    print(f"False Positives (Mistaken for Damage): {whole_total - whole_correct}")
    print(f"\nTime Elapsed: {duration:.2f} seconds ({duration/max(1, total):.4f}s per image)")

def _pct(num, den):
    if den == 0: return "0%"
    return f"{(num / den) * 100:.2f}%"

if __name__ == "__main__":
    benchmark()
