import pandas as pd

def handle_missing(df):
    """Handle missing values by filling with median or mode depending on dtype."""
    for col in df.columns:
        if df[col].dtype in ['float64', 'int64']:
            df[col].fillna(df[col].median(), inplace=True)
        else:
            df[col].fillna(df[col].mode()[0], inplace=True)
    print("✅ Missing values handled.")
    return df

def remove_duplicates(df):
    """Remove duplicate rows."""
    before = len(df)
    df = df.drop_duplicates()
    after = len(df)
    print(f"✅ Removed {before - after} duplicate rows.")
    return df
