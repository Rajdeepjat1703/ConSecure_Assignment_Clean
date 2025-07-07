import pandas as pd
import psycopg2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import pickle
import os

# Connect to your Postgres DB (adjust host/port if needed)
conn = psycopg2.connect(
    dbname="threatdb",
    user="postgres",
    password="postgres",
    host="localhost",
    port=5433
)

# Fetch data
query = 'SELECT "Cleaned_Threat_Description", "Threat_Category" FROM "Threat"'
df = pd.read_sql(query, conn)

# Print category distribution
print("Category distribution:")
print(df["Threat_Category"].value_counts())

# Vectorize and train
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["Cleaned_Threat_Description"].fillna(""))
y = df["Threat_Category"]
model = LogisticRegression(max_iter=1000)
model.fit(X, y)

# Print classification report on training data
print("\nClassification report (on training data):")
y_pred = model.predict(X)
print(classification_report(y, y_pred))

# Save artifacts in the script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(script_dir, "vectorizer.pkl"), "wb") as f:
    pickle.dump(vectorizer, f)
with open(os.path.join(script_dir, "model.pkl"), "wb") as f:
    pickle.dump(model, f)

print("Model and vectorizer saved!") 