import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backArrow from './assets/images/whitearrow.png';
import './styles/Hotels.css';

const Hotels = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotels, startCity, endCity, startingDate, endingDate, flights } = location.state || {};
  const [loading, setLoading] = useState(false);  // Loading state for the spinner

  const handleExplore = async (hotelLon, hotelLat) => {
    setLoading(true);  // Set loading to true when Explore is clicked
    try {
      const response = await axios.post('http://127.0.0.1:5000/send-map-data', {
        city: endCity,
        longitude: hotelLon,
        latitude: hotelLat,
      });

      // Navigate to the map page after successful data fetching
      navigate('/hotels-map', {
        state: {
          hotels,
          startCity,
          endCity,
          startingDate,
          endingDate,
          flights,
        },
      });
    } catch (error) {
      console.error('Error fetching map data:', error);
    } finally {
      setLoading(false);  // Set loading back to false once the action is complete
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
      'radial-gradient(rgb(200, 160, 0) 40%, transparent 60%) -620px -180px no-repeat, ' +
      'radial-gradient(rgb(240, 140, 0) 33%, transparent 67%) -120px -24px no-repeat, ' +
      'radial-gradient(rgb(210, 110, 0) 40%, transparent 70%) -470px 150px no-repeat, ' +
      'hsl(30, 100%, 45%)',
    zIndex: '-1',
  };

  return (
    <>
      <div style={gradientParentStyleTopLeft}>
        <div style={gradientAfterStyleTopLeft}></div>
      </div>
      <div className='hotels1-page-container'>
        <div className='back-arrow-container3'>
          <div className='back-arrow3'>
            <Link
              to='/flights'
              state={{
                startCity: 'test',
                endCity,
                startingDate,
                endingDate,
                flights,
              }}
            >
              <img src={backArrow} alt="Go Back" />
            </Link>
          </div>
        </div>
        <div className='city-name-hotels'>
          <div className='city-text1'>
            <strong>
              <p style={{ fontSize: '100px' }}>City: {endCity}</p>
            </strong>
          </div>
        </div>
        <div className='hotel-stack-container'>
          <div className='hotel-stack-text'>
            <p style={{ fontSize: '75px' }}>Marriott Hotels</p>
            <hr />
          </div>
          <div className='hotel-stack-list'>
            {/* Rendering each hotel */}
            {hotels && Object.keys(hotels).map((hotelKey, index) => {
              const hotel = hotels[hotelKey];
              return (
                <div key={index} className='hotel-stack-item-container'>
                  <div className='img-container2'>
                    {/* Hotel image */}
                    <img
                      src={hotel.hotel_image}
                      alt={`${hotel.hotel_name} image`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className='information-container-hotel'>
                    <div className='hotel-name-rating2'>
                      <div className='hotel-name-description2'>
                        {/* Hotel name and description */}
                        <strong>
                          <p style={{ fontSize: '14px' }}>{hotel.hotel_name}</p>
                        </strong>
                        {hotel.hotel_description !== 'No description available' && (
                          <p style={{ fontSize: '11px' }}>{hotel.hotel_description}</p>
                        )}
                      </div>
                      <div className='hotel-rating2'>
                        {/* Hotel rating */}
                        <h1>{hotel.hotel_rating}</h1>
                      </div>
                    </div>
                    <div className='amenities-container2'>
                      <p style={{ fontSize: '15px' }}>
                        <strong>Amenities:</strong>
                      </p>
                      {/* Hotel amenities */}
                      <p style={{ fontSize: '12px' }}>{hotel.hotel_amenities.join(', ')}</p>
                    </div>
                    <div className='action-container-hotels'>
                      <h4>
                        Price: {hotel.hotel_price !== `Please check Marriott's Website` ? (
                          <span>{hotel.hotel_price}</span>
                        ) : (
                          <span>N/A</span>
                        )}
                      </h4>
                      {/* Booking and Explore buttons */}
                      <div
                        style={{ border: '1px solid white' }}
                        className='book-button2'
                      >
                        <Link
                          style={{ textDecoration: 'none', color: 'white' }}
                          to={hotel.link}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <h3>Book Now</h3>
                        </Link>
                      </div>
                      <button
                        style={{
                          height: '40px',
                          width: '100px',
                          color: 'white',
                          background: 'orange',
                          borderRadius: '3px',
                          border: '1px solid white',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '16px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onClick={() => handleExplore(hotel.hotel_lon, hotel.hotel_lat)}
                      >
                        {loading ? (
                          <div
                            className='spinner'
                            style={{
                              border: '2px solid white',
                              borderTop: '2px solid transparent',
                              borderRadius: '50%',
                              width: '16px',
                              height: '16px',
                              animation: 'spin 1s linear infinite',
                            }}
                          ></div>
                        ) : (
                          <h3>Explore</h3>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default Hotels;