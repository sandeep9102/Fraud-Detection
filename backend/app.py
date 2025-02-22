from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow import keras
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load the model (you'll need to train and save this first)
model = keras.models.load_model('fraud_model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Convert the input data to a DataFrame
        df = pd.DataFrame([data])
        
        # Preprocess the data (ensure this matches your training preprocessing)
        # Add your preprocessing steps here
        
        # Make prediction
        prediction = model.predict(df)
        
        # Convert prediction to binary (0 or 1)
        result = int(prediction[0] > 0.5)
        
        return jsonify({'prediction': result})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)