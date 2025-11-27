from flask import Flask, request, jsonify
import os
import pandas as pd
from preprocessing.cleaning import handle_missing, remove_duplicates
from preprocessing.outlier import auto_remove_outliers
from preprocessing.transformation import encode_categorical, scale_data
from preprocessing.splitting import split_data

app = Flask(__name__)

# -------------------- DIRECTORY SETUP --------------------

# Dynamically resolve Node backend path (1 level up from this Flask app)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Paths for uploads and processed data (inside Node backend folders)
UPLOAD_DIR = os.path.join(BASE_DIR, "backend", "uploads")
PROCESSED_DIR = os.path.join(BASE_DIR, "backend", "data", "processed")

# Ensure all directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "backend", "data", "temp"), exist_ok=True)


# -------------------- PREPROCESS ROUTE --------------------
@app.route("/preprocess", methods=["POST"])
def preprocess():
    try:
        file = request.files.get("file")
        steps = request.form.get("steps")
        final_format = request.form.get("finalFormat", "csv")

        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        # Save uploaded file inside backend/uploads
        filename = file.filename
        file_path = os.path.join(UPLOAD_DIR, filename)
        file.save(file_path)

        # Read uploaded CSV
        df = pd.read_csv(file_path)
        steps = eval(steps) if isinstance(steps, str) else steps
        print(f"🧩 Preprocessing steps: {steps}")

        # Execute preprocessing steps in order
        for step in steps:
            if step == "clean_missing":
                df = handle_missing(df)
            elif step == "clean_duplicates":
                df = remove_duplicates(df)
            elif step == "outliers_remove":
                df = auto_remove_outliers(df)
            elif step == "transform_encode":
                df = encode_categorical(df)
            elif step == "transform_scale":
                df = scale_data(df)
            elif step == "split":
                split_data(df)
            else:
                print(f"⚠️ Unknown step: {step}")

        # Save processed file in backend/data/processed
        processed_filename = f"processed_{filename}"
        processed_path = os.path.join(PROCESSED_DIR, processed_filename)
        df.to_csv(processed_path, index=False)

        print("✅ Processed file saved at:", processed_path)

        # Return relative path (so Node can join __dirname)
        return jsonify({
            "message": "Preprocessing completed successfully",
            "processed_file_path": f"data/processed/{processed_filename}"
        })

    except Exception as e:
        print("❌ Processing error:", e)
        return jsonify({"error": str(e)}), 500


# -------------------- MAIN ENTRY --------------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
