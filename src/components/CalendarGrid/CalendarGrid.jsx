import React from "react";
import "./CalendarGrid.scss";

export default function CalendarGrid({
  days,
  events,
  adjustedFirstDayOfWeek,
  onDateClick,
  onEditEvent,
  onDeleteEvent,
}) {
  return (
    <div className="calendar-grid">
      {/* Render blank cells for alignment */}
      {Array.from({ length: adjustedFirstDayOfWeek }).map((_, index) => (
        <div key={`blank-${index}`} className="calendar-cell empty"></div>
      ))}

      {/* Render actual days */}
      {days.map((day) => (
        <div
          key={day.date}
          className="calendar-cell"
          onClick={() => onDateClick(day.date)}
        >
          <div className="date-label">{day.label}</div>
          <ul>
            {events[day.date]?.map((event, eventIndex) => (
              <li
                key={event.id || `${day.date}-${eventIndex}`}
                style={{ backgroundColor: event.color }}
              >
                {event.title}
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      {
                        console.log("Editing event:", event);
                      }
                      onEditEvent(day.date, event);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      onDeleteEvent(day.date, event.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
