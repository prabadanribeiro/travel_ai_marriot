import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Cities from './Cities';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
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

  const navigate = useNavigate(); // Initialize the useNavigate hook for redirection

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

    // Formats for Flask
    const formattedStartingDate = startingDate.toISOString().slice(0, 10);
    const formattedEndingDate = endingDate.toISOString().slice(0, 10);
    const formattedStartingCity = selectedStartCity.name;
    const formattedEndCity = selectedEndCity.name;

    // Sends post request
    try {
      const response = await axios.post('http://127.0.0.1:5000/cities-dates', {
        startCity: formattedStartingCity,
        endCity: formattedEndCity,
        startingDate: formattedStartingDate,
        endingDate: formattedEndingDate,
      });

      console.log('Cities and dates sent to Flask:', response.data);

      // Navigate to the Flights component after successfully sending data and pass the data in state
      navigate('/flights', {
        state: {
          startCity: response.data.startCity,
          endCity: response.data.endCity,
          startingDate: response.data.startingDate,
          endingDate: response.data.endingDate,
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

    return () => clearInterval(interval); // cleanup on unmount
  }, [backgroundImages.length]);

  return (
    <>
      <div className='home-container'>
        {/* {Switches Between Backgrounds} */}
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`background-image ${index === currentBackground && fade ? 'active' : ''} ${!fade ? 'fade-out' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

        <div className='action-container'>
          <div className='search-container'>
            <div className='search-location'>
              {/* {Imports Cities.jsx} */}
              <Cities onCitiesSelect={onCitiesSelect} />
            </div>
            <div className='search-dates'>
              <div className='starting-date' onClick={calendarStarting}>
                {/* {Formats the date} */}
                {startingDate ? (
                  <h1>{startingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h1>
                ) : (
                  <h1>Pick a start date</h1>
                )}
              </div>
              <div className='ending-date' onClick={calendarEnding}>
                {/* {Formats the date} */}
                {endingDate ? (
                  <h1>{endingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h1>
                ) : (
                  <h1>Pick an end date</h1>
                )}
              </div>
            </div>
          </div>

          {/* {Send button for Flask} */}
          <button
            className='send-city-button'
            onClick={handleSendCities}
            disabled={!selectedStartCity || !selectedEndCity || !startingDate || !endingDate}
          >
            Send to Backend
          </button>

          {/* {Displays calendar when appropriate} */}
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