import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import backArrow from './assets/images/back-arrow.png';
import './styles/Flights.css'

export default function Flights() {
  const location = useLocation();

  const { startCity, endCity, startingDate, endingDate } = location.state || {};

  return (
    <>
      <div className='flights-page-container'>
        <div className='back-arrow-skip-container'>
          <div className='back-arrow-container'>
            <Link to='/'>
              <img src={backArrow}></img>
            </Link>
          </div>

          <Link>
            <div className='skip-button'>
              <h1>Skip to Hotels</h1>
            </div>
          </Link>
        </div>
        <div className='homepage-info-container'>
          <h1>From {startCity} to {endCity} from the {startingDate} to {endingDate}</h1>
        </div>
        <div className='flights-list-container'>
          <div className='flights-text-hr'>
            <h1>Flights available</h1>
            <hr />
          </div>
          <div className='flight-container'>
            <div className='flight-container-image-company'>
              <div className='flight-container-image'>
                <h1>asdfas</h1>
              </div>
              <div className='flight-container-company'>
                <h1>ijoinpo</h1>
              </div>
            </div>
            <div className='flight-container-information'>
              <div className='flight-container-information-box'>

              </div>
              <div className='flight-container-information-box'>

              </div>
              <div className='flight-container-information-box'>

              </div>
              <div className='flight-container-information-box'>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
