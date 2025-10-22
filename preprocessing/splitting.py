from sklearn.model_selection import train_test_split

def split_data(df, target_column=None, test_size=0.2, random_state=42):
    if target_column:
        X = df.drop(columns=[target_column])
        y = df[target_column]
        return train_test_split(X, y, test_size=test_size, random_state=random_state)
    else:
        train, test = train_test_split(df, test_size=test_size, random_state=random_state)
        return train, test
