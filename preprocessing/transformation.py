from sklearn.preprocessing import MinMaxScaler, StandardScaler, RobustScaler
import pandas as pd
def scale_data(df, columns, method="minmax"):
    scaler = None
    if method == "minmax":
        scaler = MinMaxScaler()
    elif method == "standard":
        scaler = StandardScaler()
    elif method == "robust":
        scaler = RobustScaler()
    
    df[columns] = scaler.fit_transform(df[columns])
    return df



def encode_categorical(df, columns, method="onehot"):
    if method == "onehot":
        return pd.get_dummies(df, columns=columns, drop_first=True)
    elif method == "label":
        from sklearn.preprocessing import LabelEncoder
        le = LabelEncoder()
        for col in columns:
            df[col] = le.fit_transform(df[col])
        return df
    else:
        raise ValueError("Invalid encoding method")
