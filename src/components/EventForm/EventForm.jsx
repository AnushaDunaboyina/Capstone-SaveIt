import React, { useState } from "react";
import "./EventForm.scss";

export default function EventForm({ date, onClose, onAddEvent, editingEvent }) {
  // Prefill fields if editing, otherwise use default values
  const [title, setTitle] = useState(editingEvent ? editingEvent.title : "");
  const [type, setType] = useState(editingEvent ? editingEvent.type : "Event");
  const [color, setColor] = useState(editingEvent ? editingEvent.color : "#FFA07A");
  const [reminder, setReminder] = useState(5); // Default: 5 minutes before

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Event title is required!");
      return;
    }

    const updatedEvent = {
      id: editingEvent?.id, // Include ID if editing
      date,
      title,
      type,
      color,
      reminderTime: calculateReminderTime(date, reminder),
    };

    onAddEvent(updatedEvent); // Send event data to parent component
    onClose(); // Close the form
  };

  // Calculate the reminder time based on the selected minutes before the event
  const calculateReminderTime = (eventDate, minutesBefore) => {
    const eventTime = new Date(eventDate).getTime();
    return new Date(eventTime - minutesBefore * 60000).toISOString();
  };

  return (
    <div className="event-form-overlay">
      <div className="event-form">
        <h3>{editingEvent ? "Edit Event" : "Add Event"} for {date.split("-").reverse().join("-")}</h3>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Event">Event</option>
          <option value="To-Do">To-Do</option>
          <option value="Memory">Memory</option>
        </select>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <label>
          Reminder:
          <select value={reminder} onChange={(e) => setReminder(Number(e.target.value))}>
            <option value={5}>5 minutes before</option>
            <option value={10}>10 minutes before</option>
            <option value={30}>30 minutes before</option>
            <option value={60}>1 hour before</option>
          </select>
        </label>
        <div className="form-actions">
          <button onClick={handleSubmit}>{editingEvent ? "Update Event" : "Add Event"}</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}


