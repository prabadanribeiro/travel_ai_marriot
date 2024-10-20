import requests
import googlemaps
import folium
from folium.plugins import MarkerCluster
from get_pic_desc import get_description, get_picture

api_key = 'AIzaSyCAYj_zkUEITnI-1DHi9FKTVUqbxVGpgwg'
gmaps = googlemaps.Client(key='AIzaSyCAYj_zkUEITnI-1DHi9FKTVUqbxVGpgwg')

def get_lat_lon(address):
    geocode_result = gmaps.geocode(address)
    if geocode_result and len(geocode_result):
        location = geocode_result[0]['geometry']['location']
        return [location['lat'], location['lng']
                ]
    return None

def find_places(api_key, location, radius=1000, place_type='restaurant'):
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&radius={radius}&type={place_type}&key={api_key}"
    
    response = requests.get(url) 
    if response.status_code == 200:
        places = response.json().get('results', [])
        return places
    else:
        print(f"Error fetching places: {response.status_code}, {response.text}")
        return []


# Example usage

def get_attractions_around_hotel(latitude=40.712776, longitude=-74.005974):
    location = str(latitude) + ',' + str(longitude)
    #get restaurants
    restaurants = find_places(api_key, location, place_type='restaurant')
    restaurants_near_by = {}
    for restaurant in restaurants:
        restaurants_near_by[restaurant['name']] = restaurant['vicinity']
    #get tourist attractions
    attractions = find_places(api_key, location, place_type='tourist_attraction')
    attractions_near_by = {}
    for attraction in attractions:
        attractions_near_by[attraction['name']] = attraction['vicinity']
    #get shopping malls
    malls = find_places(api_key, location, place_type='shopping_mall')
    malls_near_by = {}
    for mall in malls:
        malls_near_by[mall['name']] = mall['vicinity']
    
    return restaurants_near_by, attractions_near_by, malls_near_by



def create_map(lat=40.712776, lon=-74.005974):
    map_center = [lat, lon]
    m = folium.Map(location=map_center, zoom_start=12)
    restaurants, attractions , malls = get_attractions_around_hotel(lat, lon)
    print(malls)
    # Function to add markers to the map
    def add_markers(places, place_type):
        for place in places:
            name = place
            lat, lng = get_lat_lon(places[place])
            if place_type == 'Attraction':
                icon = folium.Icon(icon='star', color='red')  # Building icon for attractions
            elif place_type == 'Restaurant':
                icon = folium.Icon(icon='cutlery', color='blue')  # Cutlery icon for restaurants
            elif place_type == 'Shopping Center':
                icon = folium.Icon(icon='shopping-cart', color='green')  # Shopping cart icon for shopping centers
            picture = get_picture(name, places[place])
            popup_content = f"""
                <div style="background-color: #f9f9f9; border: 2px solid #007bff; border-radius: 5px; padding: 10px;">
                <h4 style="color: #007bff;">{name}</h4>
                <p style="margin: 5px 0;">Type: <strong>{place_type}</strong></p>
                {picture}
            </div>
        """
            folium.Marker(
                location=[lat, lng],
                popup=folium.Popup(popup_content, max_width=300),
                icon = icon
            ).add_to(m)

    # Add each category of places to the map
    add_markers(attractions, 'Attraction')
    add_markers(restaurants, 'Restaurant')
    add_markers(malls, 'Shopping Center')

    # Save the map to an HTML file
    m.save('map.html')
create_map()