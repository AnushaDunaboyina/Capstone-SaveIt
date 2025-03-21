import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventForm from "../../components/EventForm/EventForm";
import axios from "axios";
import "./CalendarPage.scss";
import { API_URL } from "../../config";

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/calendar/getEvents`);

      const formattedEvents = response.data.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        reminderTime: new Date(event.reminderTime),
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSaveEvent = async (event) => {
    try {
      if (selectedEvent) {
        // Update an existing event
        await axios.patch(
          `${API_URL}/api/calendar/${selectedEvent.id}/updateEvent`,
          event,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        // Add a new event
        await axios.post(`${API_URL}/api/calendar/addEvent`, event, {
          headers: { "Content-Type": "application/json" },
        });
      }
      fetchEvents();
      setShowForm(false);
      setSelectedEvent(null);
      setSelectedSlot(null);
    } catch (error) {
      console.error("Failed to save event:", error.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/calendar/${id}/deleteEvent`);
      fetchEvents();
    } catch (error) {
      console.error("Failed to delete event:", error.message);
    }
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedEvent(null); // Clear any selected event
    setSelectedSlot(slotInfo); // Open form for adding a new event
    setShowForm(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event); // Open form for editing the selected event
    setSelectedSlot(null);
    setShowForm(true);
  };

  const handleDoubleClickEvent = async (event) => {
    if (event.type === "To-Do") {
      const updatedEvent = { ...event, isCompleted: !event.isCompleted };

      // Update the event in the backend
      try {
        await axios.patch(
          `${API_URL}/api/calendar/${event.id}/updateEvent`,
          updatedEvent,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        fetchEvents(); // Refresh events
      } catch (error) {
        console.error("Failed to update event:", error.message);
      }
    }
  };

  return (
    <div className="calendar-page">

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onDoubleClickEvent={handleDoubleClickEvent}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor:
              event.type === "To-Do" && event.isCompleted
                ? "#D3D3D3"
                : event.color,
            textDecoration:
              event.type === "To-Do" && event.isCompleted
                ? "line-through"
                : "none",
            whiteSpace: "normal", // Ensures text wraps properly
            height: "auto", // Adjusts height dynamically
          },
        })}
      />

      {showForm && (selectedSlot || selectedEvent) && (
        <EventForm
          event={selectedEvent}
          slot={selectedSlot}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => {
            setShowForm(false);
            setSelectedEvent(null);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
}
