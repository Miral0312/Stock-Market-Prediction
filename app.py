from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import yfinance as yf

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model and scalers
model = joblib.load('model.pkl')
scaler1 = joblib.load('scaler1.pkl')
scaler2 = joblib.load('scaler2.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    input_values = [data[key] for key in data.keys()]
    data = np.array(input_values).reshape(1, -1)
    data = scaler1.transform(data)
    prediction = model.predict(data)  # Make a prediction
    prediction = scaler2.inverse_transform(prediction)
    return jsonify({'prediction': prediction.tolist()[0]})  # Return the prediction as JSON

@app.route('/historical-data/<symbol>', methods=['GET'])
def historical_data(symbol):
    # Fetch historical data for the given symbol using yfinance
    stock_data = yf.Ticker(symbol)
    
    # Get historical prices for 2024
    historical_df = stock_data.history(start="2024-01-01", end="2024-12-31")
    
    # If there are no records for 2024, return an empty list
    if historical_df.empty:
        return jsonify([]), 404
    
    # Convert historical data to a list of dictionaries (date and close price)
    historical_data = [{"date": date.strftime('%Y-%m-%d'), "close": close} 
                       for date, close in zip(historical_df.index, historical_df['Close'])]
    
    return jsonify(historical_data)

@app.route('/')
def home():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(host="localhost", port="3000", debug=True)
