import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Cities from './Cities';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './styles/Home.css';
import backgroundImage1 from '../src/assets/images/home-backgrounds/background-image1.jpeg';
import backgroundImage2 from '../src/assets/images/home-backgrounds/background-image2.jpg';
import backgroundImage3 from '../src/assets/images/home-backgrounds/background-image3.jpg';
import backgroundImage4 from '../src/assets/images/home-backgrounds/background-image4.jpeg';

export default function Home() {
  const [startingDate, setStartingDate] = useState(null);
  const [endingDate, setEndingDate] = useState(null);
  const [calendarVisibility, setCalendarVisibility] = useState(false);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [selectedStartCity, setSelectedStartCity] = useState(null);
  const [selectedEndCity, setSelectedEndCity] = useState(null);
  const [currentBackground, setCurrentBackground] = useState(0);
  const [fade, setFade] = useState(true);

  // Array of background image URLs
  const backgroundImages = [
    backgroundImage1,
    backgroundImage2,
    backgroundImage3,
    backgroundImage4,
  ];

  const onChange = (date) => {
    if (starting) {
      setStartingDate(date);
    } else if (ending) {
      setEndingDate(date);
    }
    setCalendarVisibility(false);
  };

  const calendarStarting = () => {
    setEnding(false);
    setStarting(true);
    setCalendarVisibility(true);
  };

  const calendarEnding = () => {
    setStarting(false);
    setEnding(true);
    setCalendarVisibility(true);
  };

  const onCitiesSelect = (startCity, endCity) => {
    setSelectedStartCity(startCity);
    setSelectedEndCity(endCity);
  };

  const handleSendCities = async () => {
    if (!selectedStartCity || !selectedEndCity || !startingDate || !endingDate) {
      console.error('Both cities and both dates must be selected.');
      return;
    }

    // Format the dates in "YYYY-MM-DD" format
    const formattedStartingDate = startingDate.toISOString().slice(0, 10);
    const formattedEndingDate = endingDate.toISOString().slice(0, 10);

    try {
      const response = await axios.post('http://127.0.0.1:5000/cities-dates', {
        startCity: selectedStartCity,
        endCity: selectedEndCity,
        startingDate: formattedStartingDate,
        endingDate: formattedEndingDate,
      });
      console.log('Cities and dates sent to Flask:', response.data);
    } catch (error) {
      console.error('Error sending cities and dates to backend:', error);
    }
  };

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
              <Cities onCitiesSelect={onCitiesSelect} />
            </div>
            <div className='search-dates'>
              <div className='starting-date' onClick={calendarStarting}>
                {startingDate ? (
                  <h1>{startingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h1>
                ) : (
                  <h1>Pick a start date</h1>
                )}
              </div>
              <div className='ending-date' onClick={calendarEnding}>
                {endingDate ? (
                  <h1>{endingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h1>
                ) : (
                  <h1>Pick an end date</h1>
                )}
              </div>
            </div>
          </div>

          <button
            className='send-city-button'
            onClick={handleSendCities}
            disabled={!selectedStartCity || !selectedEndCity || !startingDate || !endingDate}
          >
            Send to Backend
          </button>

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