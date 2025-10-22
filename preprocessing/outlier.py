import pandas as pd
import numpy as np
from scipy import stats

def auto_remove_outliers(df, threshold=3, iqr_multiplier=1.5, skew_threshold=1.0):
    """
    Automatically removes outliers using Z-score for near-normal columns
    and IQR for skewed columns.

    Parameters:
    -----------
    df : pd.DataFrame
        Input DataFrame
    threshold : float, optional
        Z-score threshold for outlier detection (default=3)
    iqr_multiplier : float, optional
        Multiplier for IQR method (default=1.5)
    skew_threshold : float, optional
        Absolute skewness cutoff for deciding normality (default=1.0)

    Returns:
    --------
    pd.DataFrame : DataFrame with outliers removed
    """

    df_clean = df.copy()
    numeric_cols = df_clean.select_dtypes(include=np.number).columns

    for col in numeric_cols:
        # Calculate skewness to check distribution symmetry
        skewness = df_clean[col].skew()

        if abs(skewness) < skew_threshold:
            # Use Z-score method
            z = np.abs(stats.zscore(df_clean[col], nan_policy='omit'))
            df_clean = df_clean[z < threshold]
            method = "Z-Score"
        else:
            # Use IQR method
            Q1 = df_clean[col].quantile(0.25)
            Q3 = df_clean[col].quantile(0.75)
            IQR = Q3 - Q1
            df_clean = df_clean[(df_clean[col] >= Q1 - iqr_multiplier * IQR) &
                                (df_clean[col] <= Q3 + iqr_multiplier * IQR)]
            method = "IQR"

        print(f"{col}: Skew={skewness:.2f} → Using {method} method")

    return df_clean
