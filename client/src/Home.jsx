import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Cities from './Cities';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import 'react-calendar/dist/Calendar.css';
import './styles/Home.css';
import backgroundImage1 from '../src/assets/images/home-backgrounds/background-image1.jpeg';
import backgroundImage2 from '../src/assets/images/home-backgrounds/background-image2.jpg';
import backgroundImage3 from '../src/assets/images/home-backgrounds/background-image3.jpg';
import backgroundImage4 from '../src/assets/images/home-backgrounds/background-image4.jpeg';

export default function Home() {
  // Initializes all states
  const [startingDate, setStartingDate] = useState(null);
  const [endingDate, setEndingDate] = useState(null);
  const [calendarVisibility, setCalendarVisibility] = useState(false);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [selectedStartCity, setSelectedStartCity] = useState(null);
  const [selectedEndCity, setSelectedEndCity] = useState(null);
  const [currentBackground, setCurrentBackground] = useState(0);
  const [fade, setFade] = useState(true);

  const navigate = useNavigate(); 

  // Array of background image URLs
  const backgroundImages = [
    backgroundImage1,
    backgroundImage2,
    backgroundImage3,
    backgroundImage4,
  ];

  // Updates starting and ending dates
  const onChange = (date) => {
    if (starting) {
      setStartingDate(date);
    } else if (ending) {
      setEndingDate(date);
    }
    setCalendarVisibility(false);
  };

  // Using starting date calendar
  const calendarStarting = () => {
    setEnding(false);
    setStarting(true);
    setCalendarVisibility(true);
  };

  // Using ending date calendar
  const calendarEnding = () => {
    setStarting(false);
    setEnding(true);
    setCalendarVisibility(true);
  };

  // Receives cities from Cities.jsx
  const onCitiesSelect = (startCity, endCity) => {
    setSelectedStartCity(startCity);
    setSelectedEndCity(endCity);
  };

  // Sends cities and dates to Flask
  const handleSendCities = async () => {
    if (!selectedStartCity || !selectedEndCity || !startingDate || !endingDate) {
      console.error('Both cities and both dates must be selected.');
      return;
    }

    const formattedStartingDate = startingDate.toISOString().slice(0, 10);
    const formattedEndingDate = endingDate.toISOString().slice(0, 10);
    const formattedStartingCity = selectedStartCity.name;
    const formattedEndCity = selectedEndCity.name;

    try {
      const response = await axios.post('http://127.0.0.1:5000/cities-dates', {
        startCity: formattedStartingCity,
        endCity: formattedEndCity,
        startingDate: formattedStartingDate,
        endingDate: formattedEndingDate,
      });

      console.log('Cities and dates sent to Flask:', response.data);

      navigate('/flights', {
        state: {
          startCity: response.data.startCity,
          endCity: response.data.endCity,
          startingDate: response.data.startingDate,
          endingDate: response.data.endingDate,
          flights: response.data.flights,
        },
      });
    } catch (error) {
      console.error('Error sending cities and dates to backend:', error);
    }
  };

  // Handles the fading between images and switching between images
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentBackground((prevBackground) => (prevBackground + 1) % backgroundImages.length);
        setFade(true);
      }, 3000);
    }, 10000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <>
      <div className='home-container'>
        <div className='home-message'>
          <h1>CONNECTING YOU TO TRAVEL AROUND THE WORLD</h1>
        </div>
        {/* Background image switch */}
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`background-image ${index === currentBackground && fade ? 'active' : ''} ${!fade ? 'fade-out' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      <div className='center-search'>
        <div className='begin-text'>
          <h1>Begin Your Travel Journey</h1>
        </div>
        <div className='action-container'>
          <div className="flight-search-bar">  
            <div className="location-field">  
              <Cities onCitiesSelect={onCitiesSelect} /> 
            </div>  
            <div className="date-field" onClick={calendarStarting}>  
              <input
                type="text"
                value={startingDate ? startingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                placeholder="From?" 
                readOnly 
              />
            </div>  
            <div className="date-field" onClick={calendarEnding}>  
              <input
                type="text"
                value={endingDate ? endingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                placeholder="To?" 
                readOnly 
              />
            </div>  
            <button className="find-deals-btn" onClick={handleSendCities}><strong>Find Deals</strong></button>  
          </div>

          {calendarVisibility && (
            <div className='calendar-container'>
              <Calendar onChange={onChange} value={starting ? startingDate : endingDate} />
            </div>
          )}
        </div>
      </div>
      
    </>
  );
}
