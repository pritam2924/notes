import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendar.css';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());

  const events = [
    { date: '2024-01-15', title: 'Equipment Inspection', type: 'inspection' },
    { date: '2024-01-20', title: 'Vendor Meeting', type: 'meeting' },
    { date: '2024-01-25', title: 'Maintenance Schedule', type: 'maintenance' }
  ];

  return (
    <div className="calendar-page">
      <h2 className="text-center fs-1 fw-bold text-dark mb-3">Calendar & Schedule</h2>
      
      <div className="calendar-container">
        <div className="calendar-wrapper">
          <Calendar onChange={setDate} value={date} />
        </div>
        
        <div className="events-panel">
          <h4>Upcoming Events</h4>
          {events.map((event, index) => (
            <div key={index} className={`event-item ${event.type}`}>
              <i className="bi bi-calendar-event"></i>
              <div>
                <h6>{event.title}</h6>
                <small>{event.date}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
