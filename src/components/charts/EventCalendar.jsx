"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import { enUS } from 'date-fns/locale';
const events = [
  {
    id: 1,
    title: "Lake Trip",
    time: "12:00 PM - 1:00 PM",
    description: "Lake Trip with family",
  },
  {
    id: 2,
    title: "Picnic",
    time: "12:00 PM - 1:00 PM",
    description: "Picnic with family",
  },
  {
    id: 3,
    title: "Beach Trip",
    time: "12:00 PM - 1:00 PM",
    description: "Beach Trip with family",
  },
  {
    id: 4,
    title: "Museum Trip",
    time: "12:00 PM - 1:00 PM",
    description: "Museum Trip with family",
  },
];
const EventCalendar = () => {
  const [value, onChange] = useState(new Date());
  return (
    <div className="bg-white p-4 rounded-md ">
      <Calendar value={value} onChange={onChange} locale='en-US' className='text-black' />
      <h1 className="text-xl font-semibold my-4 text-black">Events</h1>
      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div
            className="p-5 rounded-md border-gray-100 border-2 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
            key={event.id}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-600">{event.title}</h4>
              <span className="text-gray-300 text-xs">{event.time}</span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
