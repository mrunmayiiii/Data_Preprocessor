import pandas as pd

def auto_remove_outliers(df, z_thresh=3):
    """Automatically remove outliers using Z-score method."""
    numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
    for col in numeric_cols:
        mean, std = df[col].mean(), df[col].std()
        if std != 0:
            df = df[(abs(df[col] - mean) / std) < z_thresh]
    print("✅ Outliers removed.")
    return df
