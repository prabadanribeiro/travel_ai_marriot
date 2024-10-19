from serpapi import GoogleSearch
from amadeus import Client, Location, ResponseError
import requests
import os, json, csv

import requests
def get_airport_code(city_name):
    amadeus = Client(
        client_id='fIZvU3nGGUfVBNYkKKZMXAkMUuju6K66',
        client_secret='OCyxk1G6sE3dHIBO'
    )

    try:
        response = amadeus.reference_data.locations.get(
            keyword=city_name,
            subType=Location.AIRPORT
        )    
        airports = response.data
        final_list = []
        for index in range(len(airports)):
            final_list.append(airports[index]['iataCode'])
        return ','.join(final_list)
    except ResponseError as error:
        return error

def get_flight_data(origin, endpoint, departure, arrival):
    origin = get_airport_code(origin)
    endpoint = get_airport_code(endpoint)
    params = {
    'api_key' : '2042f1270c13df5555808466cd31ba26f137362658fa1c8a982eb50cf31a3073',
    'engine' : 'google_flights',
    'stops' : 0,
    'departure_id' : origin,
    'arrival_id' : endpoint,
    'outbound_date' : departure,
    'return_date' : arrival
    }
    return GoogleSearch(params).get_dict()['best_flights']#[0]['price']

print(get_flight_data('new york', 'paris', '2024-10-20', '2024-10-25'))