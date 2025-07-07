import sys
import pickle
import os

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Load model and vectorizer
with open(os.path.join(script_dir, "vectorizer.pkl"), "rb") as f:
    vectorizer = pickle.load(f)
with open(os.path.join(script_dir, "model.pkl"), "rb") as f:
    model = pickle.load(f)

# Get description from command line argument
if len(sys.argv) < 2:
    print("No description provided", file=sys.stderr)
    sys.exit(1)
description = sys.argv[1]

# Transform and predict
X = vectorizer.transform([description])
pred = model.predict(X)[0]

print(pred) 