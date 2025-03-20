// import React from "react";
// import "./CalendarGrid.scss";

// export default function CalendarGrid({
//   days,
//   events,
//   adjustedFirstDayOfWeek,
//   onDateClick,
//   onEditEvent,
//   onDeleteEvent,
// }) {
//   return (
//     <div className="calendar-grid">
//       {/* Render blank cells for alignment */}
//       {Array.from({ length: adjustedFirstDayOfWeek }).map((_, index) => (
//         <div key={`blank-${index}`} className="calendar-cell empty"></div>
//       ))}

//       {/* Render actual days */}
//       {days.map((day) => (
//         <div key={day.date} className="calendar-cell">
//           <div className="date-label" onClick={() => onDateClick(day.date)}>
//             {day.label}
//           </div>
//           <ul>
//             {events[day.date]?.map((event) => (
//               <li key={event.id} style={{ backgroundColor: event.color }}>
//                 {event.title}
//                 <button onClick={() => onEditEvent(day.date, event)}>Edit</button>
//                 <button onClick={() => onDeleteEvent(day.date, event.id)}>
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// }






import React from "react";
import "./CalendarGrid.scss";

function CalendarGrid({
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
          onClick={() => onDateClick(day.date)} // Make the whole box clickable
        >
          <div className="date-label">{day.label}</div>
          <ul>
            {events[day.date]?.map((event) => (
              <li key={event.id} style={{ backgroundColor: event.color }}>
                {event.title}
                <button onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering onDateClick
                  onEditEvent(day.date, event);
                }}>
                  Edit
                </button>
                <button onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering onDateClick
                  onDeleteEvent(day.date, event.id);
                }}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default CalendarGrid;

