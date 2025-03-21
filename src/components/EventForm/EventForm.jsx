import React, { useState } from "react";
import "./EventForm.scss";

export default function EventForm({ date, onClose, onAddEvent, editingEvent }) {
  // Prefill fields if editing, otherwise use default values
  const [title, setTitle] = useState(editingEvent ? editingEvent.title : "");
  const [type, setType] = useState(editingEvent ? editingEvent.type : "Event");
  const [color, setColor] = useState(
    editingEvent ? editingEvent.color : "#FFA07A"
  );
  const [reminder, setReminder] = useState(5); // Default: 5 minutes before
  const [time, setTime] = useState(editingEvent ? editingEvent.time : "12:00"); // Default: 12:00 PM

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Event title is required!");
      console.error("Form submission failed: Title is missing.");
      return;
    }

    const updatedEvent = {
      id: editingEvent?.id, // Include ID if editing
      date,
      time, // Include event time
      title,
      type,
      color,
      reminderTime: calculateReminderTime(`${date}T${time}`, reminder), // Combine date and time
    };

    onAddEvent(updatedEvent); // Send event data to parent component
    onClose(); // Close the form
  };

  // Calculate the reminder time based on the selected minutes before the event
  const calculateReminderTime = (eventDatetime, minutesBefore) => {
    if (minutesBefore === 0) {
      return null;
    }
    const eventTimestamp = new Date(eventDatetime).getTime();
    const reminderTimestamp = new Date(
      eventTimestamp - minutesBefore * 60000
    ).toISOString();
    console.log("Calculated reminder time:", reminderTimestamp); // Log calculated reminder time
    return reminderTimestamp;
  };

  return (
    <div className="event-form-overlay">
      <div className="event-form">
        <h3>
          {editingEvent ? "Edit Event" : "Add Event"} for{" "}
          {date.split("-").reverse().join("-")}
        </h3>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => {
            setTime(e.target.value);
          }}
        />
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
          }}
        >
          <option value="Event">Event</option>
          <option value="To-Do">To-Do</option>
          <option value="Memory">Memory</option>
        </select>
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
          }}
        />
        <label>
          Reminder:
          <select
            value={reminder}
            onChange={(e) => {
              console.log("Reminder changed to:", e.target.value); // Log reminder change
              setReminder(Number(e.target.value));
            }}
          >
            <option value={0}>No reminder</option>
            <option value={5}>5 minutes before</option>
            <option value={60}>1 hour before</option>
            <option value={180}>3 hours before</option>
            <option value={300}>5 hours before</option>
            <option value={720}>12 hours before</option>
            <option value={1440}>1 day before</option>
            <option value={10080}>1 week before</option>
          </select>
        </label>
        <div className="form-actions">
          <button
            onClick={() => {
              handleSubmit();
            }}
          >
            {editingEvent ? "Update Event" : "Add Event"}
          </button>
          <button
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
