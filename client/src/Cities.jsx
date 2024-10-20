import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Cities.css';

const Cities = ({ onCitiesSelect }) => {
  const [inputStart, setInputStart] = useState(''); 
  const [inputEnd, setInputEnd] = useState(''); 
  const [citiesStart, setCitiesStart] = useState([]); 
  const [citiesEnd, setCitiesEnd] = useState([]); 
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingEnd, setLoadingEnd] = useState(false); 
  const [selectedStartCity, setSelectedStartCity] = useState(null);
  const [selectedEndCity, setSelectedEndCity] = useState(null);
  const [accessToken, setAccessToken] = useState('');

  // Fetch access token when the component mounts
  useEffect(() => {
    fetchAccessToken();
  }, []);

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
      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  // Fetch cities from Amadeus API for starting point
  const fetchCitiesStart = async (query) => {
    if (!accessToken) return; 
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
    if (!accessToken) return;
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
      setCitiesEnd(response.data.data);
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
    setSelectedStartCity(city); 
    setInputStart(city.name); 
    setCitiesStart([]); 
    if (city && selectedEndCity) {
      onCitiesSelect(city, selectedEndCity);
    }
  };

  // Handle city selection for end point
  const handleEndCitySelect = (city) => {
    setSelectedEndCity(city);
    setInputEnd(city.name);
    setCitiesEnd([]); 
    if (selectedStartCity && city) {
      onCitiesSelect(selectedStartCity, city); 
    }
  };

  return (
    <>
      <div className='cities-container'>
        <div className='destination-text'>
          <h4>Starting Point</h4>
          <div className='city-search-container'>
            <div className='input-container'>
              <input
                type="text"
                value={inputStart}
                onChange={handleInputStartChange}
                placeholder="Enter a Starting City"
              />
            </div>
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
        </div>
    
        <div className='destination-text'>
          <h4>Destination</h4>
          <div className='city-search-container'>
            {/* Input for end city */}
            <div className='input-container'>
              <input
                type="text"
                value={inputEnd}
                onChange={handleInputEndChange}
                placeholder="Enter an End City"
              />
            </div>
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
      </div>
        
    </>
  );
};

export default Cities;
