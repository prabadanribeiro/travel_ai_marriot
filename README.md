# Marriott Travel Booking App

This project is a travel booking platform designed for the Marriott Codefest at Virginia Tech. It allows users to book flights, hotels, and explore local attractions all in one place. The app is built with a modular approach using Flask, integrated with various APIs for real-time data, and aims to provide a seamless travel experience to expand Marriott into a full-service travel company while improving user experience.
## Table of Contents
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [Security](#security)
* [Future Plans](#future-plans)

## Features
* Flight Booking: Fetch flight data between cities for specified dates.
* Hotel Booking: Search for available hotels based on city and date range.
* Attractions Search: Locate nearby attractions and view pictures and descriptions.
* Map Integration: Visualize attractions on a dynamic map with clustered markers.

## Tech Stack
* Backend: Flask (Python)
* Frontend: React
* APIs:
    * [Google Maps API](https://pypi.org/project/googlemaps/) for geolocation and attractions
    * [Amadeus API](https://pypi.org/project/amadeus/) for flight and hotel data
    * [Serp API](https://pypi.org/project/serpapi/) for images, descriptions, and price data

## Installation
1. Clone this repo: 
    `git clone https://github.com/prabadanribeiro/travel_ai_marriot`
2. Install requirements (shown at [Tech Stack](#tech-stack))
3. Create a .env file for all your API keys
4. Run the app by running `start npm` in the `/client` directory and `python server.py` in the `/backend` directory

## Security
* Ensure API keys are stored in the .env file
* Use HTTPS to communicate between the client and the server

## Future Plans
* Add a way to get tours booked
* Add a way to handle transportation from and to airports
* AX/CX/UI improvements
