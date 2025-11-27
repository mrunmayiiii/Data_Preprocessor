import pandas as pd
from sklearn.model_selection import train_test_split
import os

def split_data(df, test_size=0.2):
    """Split dataset into train and test CSVs."""
    if df.shape[1] < 2:
        print("⚠️ Not enough columns to split.")
        return df

    train, test = train_test_split(df, test_size=test_size, random_state=42)

    os.makedirs("data/temp", exist_ok=True)
    train.to_csv("data/temp/train.csv", index=False)
    test.to_csv("data/temp/test.csv", index=False)

    print(f"✅ Data split into train ({len(train)}) and test ({len(test)})")
    return df
