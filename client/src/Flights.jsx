import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for GET requests
import './styles/Flights.css';
import backArrow from './assets/images/whitearrow.png';
import departureIMG from './assets/images/departurewhite3.jpg';
import arrivalIMG from './assets/images/arrivalwhite.png';
import clockIMG from './assets/images/whiteclock5.png';
import moneyIMG from './assets/images/whitemoney2.png';

export default function Flights() {
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate to programmatically navigate

  const { startCity, endCity, startingDate, endingDate, flights } = location.state || {};

  // State for storing hotel data
  const [hotels, setHotels] = useState(null);

  // Function to handle the "Skip to Hotels" click
  const handleSkipToHotels = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get-hotels', {
        params: {
          city: endCity, // Fetch hotels at the destination city
          check_in: startingDate,
          check_out: endingDate,
        },
      });

      // Navigate to the Hotels component with the fetched hotel data
      navigate('/hotels', {
        state: {
          hotels: response.data,
          startCity,
          endCity,
          startingDate,
          endingDate,
          flights,
        },
      });
    } catch (error) {
      console.error('Error fetching hotel data:', error);
    }
  };

  const gradientParentStyleTopLeft = {
    position: 'absolute',
    top: '-300px',
    left: '0',
    width: '100vw',
    height: '100vh',
    transformOrigin: '0 60%',
    transform: 'skewY(-8deg)',
    overflow: 'hidden',
    zIndex: '-1',
  };

  const gradientAfterStyleTopLeft = {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    minWidth: '1000px',
    width: '100%',
    height: '100%',
    background:
      'radial-gradient(rgb(200, 160, 0) 40%, transparent 60%) -620px -180px no-repeat, ' +  // Darker yellow-orange
      'radial-gradient(rgb(240, 140, 0) 33%, transparent 67%) -120px -24px no-repeat, ' +  // Darker orange
      'radial-gradient(rgb(210, 110, 0) 40%, transparent 70%) -470px 150px no-repeat, ' +  // Deeper orange
      'hsl(30, 100%, 45%)',  // Darkened orange using HSL
    zIndex: '-1',
  };

  return (
    <>
      <div style={gradientParentStyleTopLeft}>
        <div style={gradientAfterStyleTopLeft}></div>
      </div>

      <div className='flights-page-container'>
        <div className='back-arrow-skip-container'>
          <div className='back-arrow-container'>
            <Link to='/'>
              <img src={backArrow} alt="Go Back" />
            </Link>
          </div>
          <div className='skip-button'>
            {/* Handle the click for fetching hotels */}
            <button onClick={handleSkipToHotels}>
              <h1>Skip to Hotels</h1>
            </button>
          </div>
        </div>
        <div className='homepage-info-container'>
          <h1 style={{ fontSize: '80px' }}>From {startCity} to {endCity}</h1>
          <h1 style={{ fontSize: '45px', marginTop: '20px' }}>From {startingDate} to {endingDate}</h1>
        </div>
        <div className='flights-list-container'>
          <div className='flights-text-hr'>
            <h1>Flights available</h1>
            <hr />
          </div>

          {/* Map through flights */}
          {flights && Object.keys(flights).map((flightKey, index) => (
            <div key={index} className="flight-container">
              <div className='flight-container-image-company'>
                <div className='flight-container-image'>
                  {/* Airline logo */}
                  <img
                    src={flights[flightKey].airline_logo}
                    alt={`${flights[flightKey].airline_name} logo`}
                    style={{
                      width: '90%',
                      height: '90%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
                <div className='flight-container-company'>
                  <p><strong>{flights[flightKey].airline_name}</strong></p>
                </div>
              </div>
              <div className='flight-container-information'>
                <div className='flight-container-information-box'>
                  <img src={departureIMG} alt="Departure Icon" />
                  <p>
                    <strong>Departure Airport:</strong> {flights[flightKey].departure_airport}
                  </p>
                </div>
                <div className='flight-container-information-box'>
                  <img src={arrivalIMG} alt="Arrival Icon" />
                  <p>
                    <strong>Arrival Airport:</strong> {flights[flightKey].arrival_airport}
                  </p>
                </div>
                <div className='flight-container-information-box'>
                  <img src={clockIMG} alt="Clock Icon" />
                  <p>
                    <strong>Departure Time:</strong> {flights[flightKey].departure_time}
                  </p>
                </div>
                <div className='flight-container-information-box'>
                  <img src={clockIMG} alt="Clock Icon" />
                  <p>
                    <strong>Arrival Time:</strong> {flights[flightKey].arrival_time}
                  </p>
                </div>
                <div className='flight-container-information-box'>
                  <img src={moneyIMG} alt="Money Icon" />
                  <p>
                    <strong>Price:</strong> ${flights[flightKey].price}
                  </p>
                  <div className='flight-container-button'>
                    <a href={flights[flightKey].flight_link} target="_blank" rel="noopener noreferrer">Book Now</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}