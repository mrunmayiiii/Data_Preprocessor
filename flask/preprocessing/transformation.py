import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

def encode_categorical(df):
    """Encode all categorical columns."""
    le = LabelEncoder()
    for col in df.select_dtypes(include=['object']).columns:
        df[col] = le.fit_transform(df[col].astype(str))
    print("✅ Categorical columns encoded.")
    return df

def scale_data(df):
    """Standard scale all numeric columns."""
    numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
    scaler = StandardScaler()
    df[numeric_cols] = scaler.fit_transform(df[numeric_cols])
    print("✅ Data scaled.")
    return df
