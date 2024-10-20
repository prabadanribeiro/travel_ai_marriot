from serpapi import GoogleSearch
serp_api_key = '2dfd45d31b0940e834ab7b7ed379b19ec6bf429a423d4c86eaf056cdef83ece7'
def get_picture(name, vicinity):
    params = {
        "engine": "google_images",
        "q": f"{name} at {vicinity}",  # Add vicinity to the query to make it more specific
        "api_key": serp_api_key
    }
    search = GoogleSearch(params)
    results = search.get_dict()
    try:
        picture = results['images_results'][0]['original']
        return picture
    except (IndexError, KeyError):
        print(results)
        return None
print(get_picture('W Barcelona', 'Barcelona'))

def get_description(name, vicinity):
    params = {
        "engine": "google_light",
        "q": f"{name} at {vicinity}",
        "google_domain": "google.com",
        "hl": "en",
        "gl": "us",
        "api_key": serp_api_key
    }
    search = GoogleSearch(params)
    results = search.get_dict()
    try:
        if 'organic_results' in results and results['organic_results']:
            organic_result = results['organic_results'][0]
            description = organic_result.get('snippet')
            more = organic_result.get('link')
            return description, more
        else:
            print("No 'organic_results' found or it's empty.")
            return None, None
    except (IndexError, KeyError) as e:
        print(f"Error accessing organic results: {e}")
        return None, None

