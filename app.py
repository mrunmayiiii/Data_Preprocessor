from flask import Flask, request, jsonify
import pandas as pd
import os
from preprocessing.cleaning import handle_missing, remove_duplicates
from preprocessing.file_loader import load_file
from preprocessing.outlier import auto_remove_outliers
from preprocessing.splitting import split_data
from preprocessing.transformation import scale_data, encode_categorical
DATA_RAW = "data/raw"
DATA_PROCESSED = "data/processed"
TEMP_PATH = "data/temp"

os.makedirs(DATA_RAW, exist_ok=True)
os.makedirs(DATA_PROCESSED, exist_ok=True)
os.makedirs(TEMP_PATH, exist_ok=True)

CURRENT_DATA_PATH = os.path.join(TEMP_PATH, "current_data.csv")

app = Flask(__name__)


@app.route('/load', methods=['POST'])
def load_dataset():
    """
    Expects: a file upload (CSV, Excel, JSON)
    Returns: JSON message + basic dataset info
    """
    file = request.files['file']
    if not file:
        return jsonify({"error": "No file provided"}), 400

    filepath = os.path.join("uploads", file.filename)
    os.makedirs("uploads", exist_ok=True)
    file.save(filepath)

    try:
        df = load_file(filepath)
        df.to_csv(CURRENT_DATA_PATH, index=False)
        return jsonify({
            "message": "File loaded successfully",
            "columns": df.columns.tolist(),
            "rows": len(df)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/clean/missing', methods=['POST'])
def clean_missing():
    data = request.get_json()
    strategy = data.get("strategy", "mean")
    fill_value = data.get("fill_value")

    df = pd.read_csv("data\\temp\\current_data.csv")
    df = handle_missing(df, strategy=strategy, fill_value=fill_value)
    df.to_csv(CURRENT_DATA_PATH, index=False)


    return jsonify({"message": f"Missing values handled using {strategy} strategy."})


@app.route('/clean/duplicates', methods=['POST'])
def clean_duplicates():
    data = request.get_json()
    keep = data.get("keep", "first")

    df = pd.read_csv("data\\temp\\current_data.csv")
    before = len(df)
    df = remove_duplicates(df, keep=keep)
    after = len(df)
    df.to_csv(CURRENT_DATA_PATH, index=False)


    return jsonify({"message": f"Removed {before - after} duplicate rows."})


@app.route('/outliers/remove', methods=['POST'])
def remove_outliers():
    df = pd.read_csv("data\\temp\\current_data.csv")
    df = auto_remove_outliers(df)
    df.to_csv(CURRENT_DATA_PATH, index=False)


    return jsonify({"message": "Outliers removed automatically."})


@app.route('/transform/scale', methods=['POST'])
def transform_scale():
    data = request.get_json()
    columns = data.get("columns")
    method = data.get("method", "minmax")

    df = pd.read_csv("data\\temp\\current_data.csv")
    df = scale_data(df, columns=columns, method=method)
    df.to_csv(CURRENT_DATA_PATH, index=False)


    return jsonify({"message": f"Columns scaled using {method} scaler."})


@app.route('/transform/encode', methods=['POST'])
def transform_encode():
    data = request.get_json()
    columns = data.get("columns")
    method = data.get("method", "onehot")

    df = pd.read_csv("data\\temp\\current_data.csv")
    df = encode_categorical(df, columns=columns, method=method)
    df.to_csv(CURRENT_DATA_PATH, index=False)


    return jsonify({"message": f"Categorical columns encoded using {method} encoding."})


@app.route('/split', methods=['POST'])
def split_dataset():
    data = request.get_json()
    target_column = data.get("target_column")
    test_size = data.get("test_size", 0.2)

    df = pd.read_csv("data\\temp\\current_data.csv")

    result = split_data(df, target_column=target_column, test_size=test_size)
    if target_column:
        X_train, X_test, y_train, y_test = result
        X_train.to_csv("data\\processed\\X_train.csv", index=False)
        X_test.to_csv("data\\processed\\X_test.csv", index=False)
        y_train.to_csv("data\\processed\\y_train.csv", index=False)
        y_test.to_csv("data\\processed\\y_test.csv", index=False)
        return jsonify({"message": "Data split into X_train/X_test/y_train/y_test."})
    else:
        train, test = result
        train.to_csv("data\\processed\\train.csv", index=False)
        test.to_csv("data\\processed\\test.csv", index=False)
        return jsonify({"message": "Data split into train/test."})


@app.route('/download', methods=['GET'])
def download_processed():
    if not os.path.exists("data\\temp\\current_data.csv"):
        return jsonify({"error": "No processed data found"}), 404
    df = pd.read_csv("data\\temp\\current_data.csv")
    return df.to_json(orient="records")


if __name__ == "__main__":
    app.run(debug=True)
