from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/cities-dates', methods=['POST'])
def cities_dates():
    data = request.get_json()  # Get the data sent from the frontend
    print(f"Received data: {data}")  # Print the received data for debugging

    start_city = data.get('startCity')
    end_city = data.get('endCity')
    starting_date = data.get('startingDate')
    ending_date = data.get('endingDate')

    # Add logic here if needed to process the data

    # Return a success message with the received data
    return jsonify({
        'message': 'Cities and dates received successfully',
        'startCity': start_city,
        'endCity': end_city,
        'startingDate': starting_date,
        'endingDate': ending_date
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
