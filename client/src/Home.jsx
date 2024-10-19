import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles/Home.css';

export default function Home() {

  const [startingDate, setStartingDate] = useState(null); 
  const [endingDate, setEndingDate] = useState(null); 
  const [calendarVisibility, setCalendarVisibility] = useState(false);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);

  const onChange = (date) => {
    if (starting) {
      setStartingDate(date);
    } else if (ending) {
      setEndingDate(date);
    }
    setCalendarVisibility(false);
  }

  const calendarStarting = () => {
    setEnding(false);
    setStarting(true);
    setCalendarVisibility(true);
  }

  const calendarEnding = () => {
    setStarting(false);
    setEnding(true);
    setCalendarVisibility(true);
  }

  return (
    <>
      <div className='home-container'>
        <div className='action-container'>
          <div className='search-container'>

            <div className='search-location'>
              <div className='starting-destination'>

              </div>
              <div className='final-destination'>

              </div>
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
