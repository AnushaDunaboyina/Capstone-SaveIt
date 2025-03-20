import React, { useState } from "react";
import CalendarGrid from "../../components/CalendarGrid/CalendarGrid";
import EventForm from "../../components/EventForm/EventForm";
import "./CalendarPage.scss";
import { API_URL } from "../../config";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  // Change month using offset (e.g., -1 for previous, +1 for next)
  const handleMonthChange = (offset) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
    );
  };

  // Change month/year using dropdown and input
  const handleSpecificMonthYearChange = (month, year) => {
    setCurrentDate(new Date(year, month, 1));
  };

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/calendar/getEvents`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error.message);
    }
  };

  // Add or edit an event
  const handleAddOrEditEvent = async (event) => {
    try {
      const url = editingEvent
        ? `${API_URL}/api/calendar/${editingEvent.id}/updateEvent`
        : `${API_URL}/api/calendar/addEvent`;

      const method = editingEvent ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });

      const data = await response.json();
      setEvents(data); // Refresh calendar data
      setShowForm(false); // Close the form
      setEditingEvent(null); // Clear editing state
    } catch (error) {
      console.error("Failed to add or edit event:", error.message);
    }
  };

  // Delete an event
  const handleDeleteEvent = async (date, id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/calendar/${id}/deleteEvent`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date }),
        }
      );

      const data = await response.json();
      setEvents(data); // Refresh calendar data
    } catch (error) {
      console.error("Failed to delete event:", error.message);
    }
  };

  // Handle clicking on a date
  const handleDateClick = (date) => {
    console.log("Date clicked:", date);
    setSelectedDate(date);
    setShowForm(true);
  };

  
  // Handle editing an existing event
  const handleEditEvent = (date, event) => {
    setSelectedDate(date);
    setEditingEvent(event); // Set the event to be edited
    setShowForm(true);
  };

//   // Schedule a reminder notification
//   const scheduleReminder = (event) => {
//     const now = new Date().getTime();
//     const reminderTime = new Date(event.reminderTime).getTime();

//     if (reminderTime > now) {
//       const delay = reminderTime - now;
//       setTimeout(() => {
//         alert(`Reminder: ${event.title}`); // Replace with Notification API later
//       }, delay);
//     }
//   };

  // Calculate days in the current month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Adjust weekday alignment for the first day of the month
  const firstDayOfWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay(); // JavaScript's getDay() starts weeks on Sunday (0)
  const adjustedFirstDayOfWeek = (firstDayOfWeek + 6) % 7; // Shift Sunday (0) to Monday (0)

  // Create an array of all days in the current month
  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
      .toISOString()
      .split("T")[0], // Format as yyyy-mm-dd
    label: i + 1, // Display day number
  }));

  return (
    <div className="calendar-page">
      {/* Calendar Header */}
      <header className="calendar-header">
        <button onClick={() => handleMonthChange(-1)}>&lt;</button>
        <div className="month-year-controls">
          <select
            value={currentDate.getMonth()}
            onChange={(e) =>
              handleSpecificMonthYearChange(
                parseInt(e.target.value),
                currentDate.getFullYear()
              )
            }
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={currentDate.getFullYear()}
            onChange={(e) =>
              handleSpecificMonthYearChange(
                currentDate.getMonth(),
                parseInt(e.target.value)
              )
            }
          />
        </div>
        <button onClick={() => handleMonthChange(1)}>&gt;</button>
      </header>

      {/* Weekdays Header */}
      <div className="calendar-weekdays">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
          (day, index) => (
            <div key={index} className="weekday">
              {day}
            </div>
          )
        )}
      </div>

      {/* Calendar Grid */}
      <CalendarGrid
        days={days}
        events={events}
        adjustedFirstDayOfWeek={adjustedFirstDayOfWeek}
        onDateClick={handleDateClick}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />

      {/* Event Form Popup */}
      {showForm && (
        <EventForm
          date={selectedDate}
          onClose={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
          onAddEvent={handleAddOrEditEvent}
          editingEvent={editingEvent}
        />
      )}
    </div>
  );
}
