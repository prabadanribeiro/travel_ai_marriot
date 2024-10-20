import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './styles/HotelsMap.css';
import backArrow from './assets/images/whitearrow.png';

export default function HotelsMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hotels, startCity, endCity, startingDate, endingDate, flights } = location.state || {};
  const [mapUrl, setMapUrl] = useState('http://127.0.0.1:5000/map');
  const [iframeKey, setIframeKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleExplore = async (hotelLon, hotelLat) => {
    setLoading(true); 
    try {
      const response = await axios.post('http://127.0.0.1:5000/send-map-data', {
        city: endCity,
        longitude: hotelLon,
        latitude: hotelLat,
      });

      setMapUrl(`http://127.0.0.1:5000/map?lon=${hotelLon}&lat=${hotelLat}`);
      setIframeKey(iframeKey + 1);
  
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

      window.location.reload();
    } catch (error) {
      console.error('Error fetching map data:', error);
    }
    setLoading(false);  // Set loading to false once the action is complete
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
      <div className='hotels-page-container'>
        <div className='back-arrow-container2'>
          <div className='back-arrow'>
            <Link 
              to='/hotels'
              state={{
                hotels,
                startCity,
                endCity,
                startingDate,
                endingDate,
                flights
              }}
            >
              <img src={backArrow} alt="Go Back" />
            </Link>
          </div>
        </div>
        <div className='general-map-container'>
          <div className='map-label'>
            <h1>{endCity}</h1>
          </div>
          <div className='actual-map-container'>
            <iframe
              key={iframeKey}
              src={mapUrl}
              title="Map"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>
        <div className='everything-hotels-container'>
          <div className='hotels-text'>
            <h1>Hotels</h1>
            <hr />
          </div>

          <div className='hotel-list'>
            {hotels && Object.keys(hotels).map((hotelKey, index) => {
              const hotel = hotels[hotelKey];
              
              return (
                <div key={index} className='hotel-item-container'>
                  <div className='hotel-img-container'>
                    <img src={hotel.hotel_image} 
                      alt={`${hotel.hotel_name} image`} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                  <div className='not-img-container'>
                    <div className='name-user-rating'>
                      <div className='hotel-name-star'>
                        <strong><p style={{lineHeight:'1.2', fontSize:'12px'}}>{hotel.hotel_name}</p></strong>
                        {hotel.hotel_description !== 'No description available' && (
                            <p style={{lineHeight:'1.3', marginTop:'5px', fontSize:'8px'}}>{hotel.hotel_description}</p>
                        )}
                      </div>
                      <div className='user-rating'>
                        <h1>{hotel.hotel_rating}</h1>
                      </div>
                    </div>
                    <div className='amenities-container'>
                      <strong><p style={{fontSize:'13px'}}>Amenities:</p></strong>
                      <p style={{marginTop:'5px', fontSize:'12px'}}>{hotel.hotel_amenities.join(', ')}</p>
                    </div>
                    <div className='money-container'>
                      <div className='pricing'>
                        <p style={{fontSize:'12px'}}>
                          Price: {hotel.hotel_price !== `Please check Marriott's Website` ? (
                            <span style={{fontSize:'12px'}}>{hotel.hotel_price}</span>
                          ) : (
                            <span style={{fontSize:'12px'}}>N/A</span>
                          )}
                        </p>
                      </div>
                      <Link style={{textDecoration:'none'}} to={hotel.link} target="_blank" rel="noopener noreferrer">
                        <div className='book-button'>Book Now</div>
                      </Link>
                      <button style={{height:'32px', width:'66px', color:'white', background:'orange', borderRadius:'3px', border:'1px solid white', fontFamily:'Poppins, sans-serif', fontSize:'16px', display:'flex', justifyContent:'center', alignItems:'center'}} onClick={() => handleExplore(hotel.hotel_lon, hotel.hotel_lat)}>
                        {loading ? (
                          <div className="spinner" style={{
                            border: "2px solid white",
                            borderTop: "2px solid transparent",
                            borderRadius: "50%",
                            width: "16px",
                            height: "16px",
                            animation: "spin 1s linear infinite"
                          }}></div>
                        ) : (
                          <p>Explore</p>
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
}