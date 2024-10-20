import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './styles/Hotels.css';
import backArrow from './assets/images/whitearrow.png'

export default function Hotels() {
  const location = useLocation();
  const { hotels, startCity, endCity, startingDate, endingDate, flights } = location.state || {};

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
              to='/flights'
              state={{
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
            src="http://127.0.0.1:5000/map"
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
                    {/* Hotel image */}
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
                        {/* Hotel name */}
                        <h3 style={{lineHeight:'1.2'}}>{hotel.hotel_name}</h3>
                        {/* Hotel description */}
                        {hotel.hotel_description !== 'No description available' && (
                            <h6 style={{lineHeight:'1.5', marginTop:'5px'}}>{hotel.hotel_description}</h6>
                        )}
                      </div>
                      <div className='user-rating'>
                        {/* Hotel rating */}
                        <h1>{hotel.hotel_rating}</h1>
                      </div>
                    </div>
                    <div className='amenities-container'>
                      <h3>Amenities:</h3>
                      {/* List of hotel amenities */}
                      <h5 style={{marginTop:'5px'}}>{hotel.hotel_amenities.join(', ')}</h5>
                    </div>
                    <div className='money-container'>
                      <div className='pricing'>
                        {/* Hotel pricing */}
                        <h3>
                          Price: {hotel.hotel_price !== `Please check Marriott's Website` ? (
                            <span>{hotel.hotel_price}</span>
                          ) : (
                            <span>N/A</span>
                          )}
                        </h3>
                      </div>
                      {/* Booking link */}
                      <Link style={{textDecoration:'none'}} to={hotel.link} target="_blank" rel="noopener noreferrer">
                        <div className='book-button'>Book Now</div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div> 

        </div>
      </div>
    </>
  );
}