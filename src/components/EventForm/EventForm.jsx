import React, { useState } from "react";
import "./EventForm.scss";
import { v4 as uuidv4 } from "uuid";
import EmojiPicker from "emoji-picker-react";
// import "./EmojiPicker.scss";

export default function EventForm({ event, slot, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(event?.title || "");
  const [type, setType] = useState(event?.type || "Event");
  const [color, setColor] = useState(event?.color || "#FFA07A");
  const [reminder, setReminder] = useState(event?.reminderTime || 5);
  const [isCompleted, setIsCompleted] = useState(event?.isCompleted || false); // For To-Do
  const [notes, setNotes] = useState(event?.notes || ""); // For Memory-specific notes
  const [start, setStart] = useState(
    slot?.start ? new Date(slot.start) : new Date(event?.start)
  );
  const [end, setEnd] = useState(
    slot?.end ? new Date(slot.end) : new Date(event?.end)
  );
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false); // Controls emoji picker visibility

  const handleSubmit = () => {
    if (!start || !end || start >= end) {
      // alert("Start time must be earlier than end time!");
      return;
    }

    try {
      const manualISO = (date) => {
        const pad = (num) => String(num).padStart(2, "0");
        return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
          date.getUTCDate()
        )}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
          date.getUTCSeconds()
        )}.${String(date.getUTCMilliseconds()).padStart(3, "0")}Z`;
      };

      const eventData = {
        id: event?.id || uuidv4(),
        title: title || "Untitled Event",
        type,
        color,
        start: manualISO(new Date(start)),
        end: manualISO(new Date(end)),
        reminderTime: manualISO(new Date(start.getTime() - reminder * 60000)), // Reminder before start
        isCompleted: type === "To-Do" ? isCompleted : undefined, // Relevant for To-Do
        notes: type === "Memory" ? notes : undefined, // Relevant for Memory
      };

      onSave(eventData); // Save event
    } catch (error) {
      console.error("Error in constructing event data:", error);
    }
  };

  const handleAddEvent = () => {
    // Reset form fields for creating a new event
    setTitle("");
    setType("Event");
    setColor("#FFA07A");
    setReminder(5);
    setIsCompleted(false);
    setNotes("");
    setStart(new Date());
    setEnd(new Date());
  };

  return (
    <div className="event-form-overlay">
      <div className="event-form">
        <h3 className="event-form__title">
          {event ? "Edit Event" : "Add Event"}
        </h3>

        {/* Event Title Input */}
        <input
          className="event-form__input event-form__title-input"
          type="text"
          placeholder="Add an event here..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Event Type Dropdown */}
        <select
          className="event-form__input event-form__type-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option className="event-form__option" value="Event">
            Event
          </option>
          <option className="event-form__option" value="To-Do">
            To-Do
          </option>
          <option className="event-form__option" value="Memory">
            Memory
          </option>
        </select>

        {/* Color Picker */}
        <input
          className="event-form__input event-form__color-picker"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        {/* To-Do: Mark as Completed */}
        {type === "To-Do" && (
          <label className="event-form__label event-form__completed-label">
            <input
              className="event-form__checkbox"
              type="checkbox"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
            />
            Mark as Completed
          </label>
        )}

        {/* Memory: Notes Input */}
        {type === "Memory" && (
          <textarea
            className="event-form__input event-form__notes-input"
            placeholder="Add a memory (e.g., 'Had a wonderful day! 😊')"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        )}

        {/* Emoji Picker Toggle */}
        <button
          type="button"
          className="event-form__button event-form__emoji-toggle-button"
          onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
        >
          {emojiPickerVisible ? "Close Emoji Picker" : "Emojis 😊"}
        </button>

        {/* Emoji Picker */}
        {emojiPickerVisible && (
          <div className="event-form__emoji-picker-container">
            <EmojiPicker
              onEmojiClick={(emojiObject) => {
                setTitle(title + emojiObject.emoji);
              }}
            />
          </div>
        )}

        {/* Form Actions */}
        <div className="event-form__actions">
          <button
            className="event-form__button event-form__save-button"
            onClick={handleSubmit}
          >
            {event ? "Update" : "Add"}
          </button>

          {event && (
            <button
              className="event-form__button event-form__delete-button"
              onClick={() => {
                onDelete(event.id);
                onClose();
              }}
            >
              Delete
            </button>
          )}

          <button
            className="event-form__button event-form__cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
