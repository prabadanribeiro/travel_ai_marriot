from serpapi import GoogleSearch
from amadeus import Client, Location, ResponseError
import requests
import os, json, csv

#function to the airport's IATA code to use in flight search#
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
        return ','.join(final_list) #returns a string of IATA codes seperated by ","#
    except ResponseError as error:
        return error

#function to get the flight data according to length of trip and cities#
def get_flight_data(origin, endpoint, departure, arrival):
    origin = get_airport_code(origin)
    endpoint = get_airport_code(endpoint)
    params = {
    'api_key' : 'c141450bc8fca73781cc5ba783d313968e6e3eb8479fa81428a2b761a7a25e68',
    'engine' : 'google_flights',
    'stops' : 0, #only non stop flights#
    'departure_id' : origin,
    'arrival_id' : endpoint,
    'outbound_date' : departure,
    'return_date' : arrival
    }
    best_flights = GoogleSearch(params).get_dict()['best_flights'] #google's machine learning sorts the best flights#
    flights = {}
    for i in range(len(best_flights)):
        #following gets the booking page for the flight#
        params = {
        'engine' : "google_flights",
        'departure_id' : origin,
        'arrival_id': endpoint,
        'outbound_date': departure,
        'return_date': arrival,
        'currency': "USD",
        'hl': "en",
        'booking_token': best_flights[i]['departure_token'],
        'api_key': "c141450bc8fca73781cc5ba783d313968e6e3eb8479fa81428a2b761a7a25e68"
        }
        link = GoogleSearch(params).get_dict()
        flights['flight' + str(i+1)] = {
        'departure_airport' : best_flights[i]['flights'][0]['departure_airport']['name'],
        'arrival_airport' : best_flights[i]['flights'][0]['arrival_airport']['name'],
        'departure_time'  : best_flights[i]['flights'][0]['departure_airport']['time'],
        'arrival_time' : best_flights[i]['flights'][0]['arrival_airport']['time'],
        'flight_duration' : best_flights[i]['flights'][0]['duration'],
        'airline_name' : best_flights[i]['flights'][0]['airline'],
        'airline_logo' : best_flights[i]['flights'][0]['airline_logo'],
        'price' : best_flights[i]['price'],
        'flight_link' : link['search_metadata']['google_flights_url']
        }
        
    return flights #returns a dictionary with the above information#
      
