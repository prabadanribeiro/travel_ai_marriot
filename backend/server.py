from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from get_flight_data import get_flight_data
from get_hotel_data import get_hotel_data
from get_attractions import create_map
from serpapi import GoogleSearch
from amadeus import Client, Location, ResponseError
import requests
import os, json, csv

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/cities-dates', methods=['POST'])
def cities_dates():
    data = request.get_json()
    print(f"Received data: {data}") 

    start_city = data.get('startCity')
    end_city = data.get('endCity')
    end_country = data.get('endCountry')
    starting_date = data.get('startingDate')
    ending_date = data.get('endingDate')
    
    flights = get_flight_data(start_city, end_city, starting_date, ending_date)

    return jsonify({
        'startCity': start_city,
        'endCity': end_city,
        'endCountry': end_country,
        'startingDate': starting_date,
        'endingDate': ending_date,
        'flights': flights,
    }), 200

@app.route('/get-hotels', methods=['GET'])
def get_hotels():
    city = request.args.get('city')
    country = request.args.get('country')
    check_in = request.args.get('check_in')
    check_out = request.args.get('check_out')

    if not city or not check_in or not check_out:
        return jsonify({"error": "Missing required parameters"}), 400

    # Call the hotel data fetching function
    hotels = get_hotel_data(city, country, check_in, check_out)

    return jsonify(hotels), 200

@app.route('/map')
def serve_map():
    return send_from_directory('static', 'map.html')

@app.route('/send-map-data', methods=['POST'])
def send_map_data():
    longitude = request.json.get('longitude') 
    latitude = request.json.get('latitude')
    city = request.json.get('city')

    if not longitude or not latitude:
        return jsonify({"error": "Missing longitude or latitude"}), 400

    create_map(latitude, longitude, city)

    return jsonify({'message': 'Map data successfully processed'}), 200


if __name__ == '__main__':
    app.run(debug=True)
