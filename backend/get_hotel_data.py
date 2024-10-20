from serpapi import GoogleSearch

def get_hotel_data(city_name, check_in_date, check_out_date):
    params = {
    "engine": "google_hotels",
    "q": city_name,
    "check_in_date": check_in_date,
    "check_out_date": check_out_date,
    "brands" : 46,
    "adults": "1",
    "currency": "USD",
    "gl": "us",
    "hl": "en",
    "api_key": "2042f1270c13df5555808466cd31ba26f137362658fa1c8a982eb50cf31a3073"
    }
    search = GoogleSearch(params)
    hotel_list = search.get_dict()['properties']
    hotels = {}
    for i in range(len(hotel_list)):
        hotel = hotel_list[i]
        hotels[f'hotel{i + 1}'] = {
            'hotel_name': hotel.get('name', 'N/A'),
            'hotel_description': hotel.get('description', 'No description available'),
            'link': hotel.get('link', 'No link available'),
            'hotel_lat': hotel.get('gps_coordinates', {}).get('latitude', 'No latitude'),
            'hotel_lon': hotel.get('gps_coordinates', {}).get('longitude', 'No longitude'),
            'hotel_class': hotel.get('hotel_class', 'No class available'),
            'hotel_price' : hotel.get('rate_per_night', {}).get('lowest', "Please check Marriott's Website"),
            'hotel_image': hotel.get('images', [{}])[0].get('original_image', 'No image available'),
            'hotel_rating': hotel.get('overall_rating', 'No rating available'),
            'hotel_amenities': hotel.get('amenities', 'No amenities available'),
        }

    return hotels
