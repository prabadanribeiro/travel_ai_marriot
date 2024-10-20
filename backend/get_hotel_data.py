from serpapi import GoogleSearch
from get_pic_desc import get_picture
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
    "api_key": "fa91ac0fdc808e58ae120682ea9945b512d6f9666ea8817f5b0e608665b156ca"
    }
    search = GoogleSearch(params)
    hotel_list = search.get_dict()['properties']
    hotels = {}
    for i in range(len(hotel_list)):
        hotel = hotel_list[i]
        print(hotel.get('images'))
        hotels[f'hotel{i + 1}'] = {
            'hotel_name': hotel.get('name', 'N/A'),
            'hotel_description': hotel.get('description', 'No description available'),
            'link': hotel.get('link', 'No link available'),
            'hotel_lon': hotel.get('gps_coordinates', {}).get('longitude', 'No longitude'),
            'hotel_lat': hotel.get('gps_coordinates', {}).get('latitude', 'No latitude'),
            'hotel_class': hotel.get('hotel_class', 'No class available'),
            'hotel_price' : hotel.get('rate_per_night', {}).get('lowest', "Please check Marriott's Website"),
            'hotel_image': get_picture(hotel['name'], city_name),
            'hotel_rating': hotel.get('overall_rating', 'No rating available'),
            'hotel_amenities': hotel.get('amenities', 'No amenities available'),
        }

    return hotels

