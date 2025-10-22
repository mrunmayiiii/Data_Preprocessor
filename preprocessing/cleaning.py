import pandas as pd

def handle_missing(df, strategy="mean", fill_value=None):
    if strategy == "drop":
        return df.dropna()
    elif strategy == "mean":
        return df.fillna(df.mean(numeric_only=True))
    elif strategy == "median":
        return df.fillna(df.median(numeric_only=True))
    elif strategy == "mode":
        return df.fillna(df.mode().iloc[0])
    elif strategy == "custom":
        return df.fillna(fill_value)
    else:
        raise ValueError("Invalid missing value strategy")
    
def remove_duplicates(df, keep="first"):
    return df.drop_duplicates(keep=keep)
