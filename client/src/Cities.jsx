import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Cities.css';

const Cities = ({ onCitiesSelect }) => {
  const [inputStart, setInputStart] = useState(''); // Input for starting point
  const [inputEnd, setInputEnd] = useState(''); // Input for end point
  const [citiesStart, setCitiesStart] = useState([]); // Cities list for starting point suggestions
  const [citiesEnd, setCitiesEnd] = useState([]); // Cities list for end point suggestions
  const [loadingStart, setLoadingStart] = useState(false); // Loading state for starting point
  const [loadingEnd, setLoadingEnd] = useState(false); // Loading state for end point
  const [selectedStartCity, setSelectedStartCity] = useState(null); // Store selected start city
  const [selectedEndCity, setSelectedEndCity] = useState(null); // Store selected end city
  const [accessToken, setAccessToken] = useState(''); // Store the access token

  // Fetch access token from Amadeus API
  const fetchAccessToken = async () => {
    try {
      const response = await axios.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': 'fIZvU3nGGUfVBNYkKKZMXAkMUuju6K66',
          'client_secret': 'OCyxk1G6sE3dHIBO'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      setAccessToken(response.data.access_token); // Store the access token
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  // Fetch cities from Amadeus API for starting point
  const fetchCitiesStart = async (query) => {
    if (!accessToken) return; // Ensure access token is available
    setLoadingStart(true);
    try {
      const response = await axios.get(
        `https://test.api.amadeus.com/v1/reference-data/locations`,
        {
          params: {
            subType: 'CITY',
            keyword: query,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCitiesStart(response.data.data); // Set the city list for starting point
    } catch (error) {
      console.error('Error fetching cities for start:', error);
    } finally {
      setLoadingStart(false);
    }
  };

  // Fetch cities from Amadeus API for end point
  const fetchCitiesEnd = async (query) => {
    if (!accessToken) return; // Ensure access token is available
    setLoadingEnd(true);
    try {
      const response = await axios.get(
        `https://test.api.amadeus.com/v1/reference-data/locations`,
        {
          params: {
            subType: 'CITY',
            keyword: query,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCitiesEnd(response.data.data); // Set the city list for end point
    } catch (error) {
      console.error('Error fetching cities for end:', error);
    } finally {
      setLoadingEnd(false);
    }
  };

  // Handle input change and fetch cities for starting point
  const handleInputStartChange = (e) => {
    const query = e.target.value;
    setInputStart(query);

    // If the user modifies or deletes the input, reset selectedStartCity
    if (selectedStartCity && query !== selectedStartCity.name) {
      setSelectedStartCity(null);
    }

    // Only fetch cities if input length > 2
    if (query.length > 2) {
      fetchCitiesStart(query);
    } else {
      setCitiesStart([]);
    }
  };

  // Handle input change and fetch cities for end point
  const handleInputEndChange = (e) => {
    const query = e.target.value;
    setInputEnd(query);

    // If the user modifies or deletes the input, reset selectedEndCity
    if (selectedEndCity && query !== selectedEndCity.name) {
      setSelectedEndCity(null);
    }

    // Only fetch cities if input length > 2
    if (query.length > 2) {
      fetchCitiesEnd(query);
    } else {
      setCitiesEnd([]);
    }
  };

  // Handle city selection for starting point
  const handleStartCitySelect = (city) => {
    setSelectedStartCity(city); // Set the selected start city when user clicks on a city
    setInputStart(city.name); // Display the selected start city name in the input
    setCitiesStart([]); // Clear the cities list after selection
    if (city && selectedEndCity) {
      onCitiesSelect(city, selectedEndCity); // Send both cities to Home.jsx when both are selected
    }
  };

  // Handle city selection for end point
  const handleEndCitySelect = (city) => {
    setSelectedEndCity(city); // Set the selected end city when user clicks on a city
    setInputEnd(city.name); // Display the selected end city name in the input
    setCitiesEnd([]); // Clear the cities list after selection
    if (selectedStartCity && city) {
      onCitiesSelect(selectedStartCity, city); // Send both cities to Home.jsx when both are selected
    }
  };

  // Fetch access token when the component mounts
  useEffect(() => {
    fetchAccessToken();
  }, []);

  return (
    <>
      <div className='cities-container'>
        <div className='city-search-container'>
          <h3>Starting Point</h3>
          <input
            type="text"
            value={inputStart}
            onChange={handleInputStartChange}
            placeholder="Enter a starting city"
          />
          <div className='cities-list'>
            {loadingStart && <p>Loading...</p>}
            <ul>
              {citiesStart.map((city) => (
                <li
                  key={city.id}
                  onClick={() => handleStartCitySelect(city)}
                  className="city-item"
                >
                  {city.name}, {city.address.countryName}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='city-search-container'>
          <h3>End Point</h3>
          <input
            type="text"
            value={inputEnd}
            onChange={handleInputEndChange}
            placeholder="Enter an end city"
          />
          <div className='cities-list'>
            {loadingEnd && <p>Loading...</p>}
            <ul>
              {citiesEnd.map((city) => (
                <li
                  key={city.id}
                  onClick={() => handleEndCitySelect(city)}
                  className="city-item"
                >
                  {city.name}, {city.address.countryName}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cities;
