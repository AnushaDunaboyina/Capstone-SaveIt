import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventForm from "../../components/EventForm/EventForm";
import { API_URL } from "../../config";
import axios from "axios";

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events and format them for the library
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/calendar/getEvents`);
      const formattedEvents = Object.entries(response.data).flatMap(([date, eventList]) =>
        eventList.map((event) => ({
          id: event.id,
          title: event.title,
          start: `${event.date}T${event.time}`,
          end: `${event.date}T${event.time}`, // Adjust for end time if needed
          color: event.color,
        }))
      );
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (newEvent) => {
    try {
      await axios.post(`${API_URL}/api/calendar/addEvent`, newEvent);
      fetchEvents(); // Refresh events
      setShowForm(false); // Close the form
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  const handleSelectSlot = ({ start }) => {
    setShowForm(true);
    setSelectedEvent({
      date: start.toISOString().split("T")[0],
      time: moment(start).format("HH:mm"),
    });
  };

  const handleSelectEvent = (event) => {
    setShowForm(true);
    setSelectedEvent(event); // Open form pre-filled for editing
  };

  return (
    <div className="calendar-page">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot} // Add new event
        onSelectEvent={handleSelectEvent} // Edit existing event
      />
      {showForm && (
        <EventForm
          date={selectedEvent?.date}
          onClose={() => setShowForm(false)}
          onAddEvent={handleAddEvent}
          editingEvent={selectedEvent} // Pass selected event for editing
        />
      )}
    </div>
  );
}








// import React, { useState, useEffect } from "react";
// import CalendarGrid from "../../components/CalendarGrid/CalendarGrid";
// import EventForm from "../../components/EventForm/EventForm";
// import "./CalendarPage.scss";
// import { API_URL } from "../../config";
// import axios from "axios";

// export default function CalendarPage() {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [events, setEvents] = useState({});
//   const [showForm, setShowForm] = useState(false);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [editingEvent, setEditingEvent] = useState(null);

//   // Fetch events when component loads

//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/calendar/getEvents`);
//       setEvents(response.data); // Update state with fetched events
//     } catch (error) {
//       console.error("Failed to fetch events:", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []); // Empty dependency array to fetch only on mount

//   // Add an event
//   const handleAddEvent = async (event) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/api/calendar/addEvent`,
//         event,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       fetchEvents();
//       setShowForm(false); // Close the form
//     } catch (error) {
//       console.error("Failed to add event:", error.message);
//     }
//   };

//   // Edit an event
//   const handleEditEvent = async (event) => {
//     if (!event.id) {
//       console.error("Event ID is missing, cannot edit event.");
//       return;
//     }
//     try {
//       const response = await axios.patch(
//         `${API_URL}/api/calendar/${event.id}/updateEvent`,
//         event,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       fetchEvents();
//       setShowForm(false); // Close the form
//       setEditingEvent(null); // Clear editing state
//     } catch (error) {
//       console.error("Failed to edit event:", error.message);
//     }
//   };

//   // Delete an event
//   const handleDeleteEvent = async (date, id) => {
//     if (!id) {
//       console.error("Event ID is missing, cannot delete event.");
//       return;
//     }
//     try {
//       await axios.delete(`${API_URL}/api/calendar/${id}/deleteEvent`, {
//         data: { date }, // Pass the date in the request body
//       });

//       fetchEvents();
//     } catch (error) {
//       console.error("Failed to delete event:", error.message);
//     }
//   };

//   // Handle clicking on a date
//   const handleDateClick = (date) => {
//     setSelectedDate(date);
//     setShowForm(true);
//   };

//   // Set up editing for an existing event
//   const setupEditEvent = (date, event) => {
//     setSelectedDate(date);
//     setEditingEvent(event); // Set the event to be edited
//     setShowForm(true);
//   };

//   // Change month using offset (e.g., -1 for previous, +1 for next)
//   const handleMonthChange = (offset) => {
//     setCurrentDate(
//       new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
//     );
//   };

//   // Change month/year using dropdown and input
//   const handleSpecificMonthYearChange = (month, year) => {
//     setCurrentDate(new Date(year, month, 1));
//   };

//   // Calculate days in the current month
//   const daysInMonth = new Date(
//     currentDate.getFullYear(),
//     currentDate.getMonth() + 1,
//     0
//   ).getDate();

//   // Adjust weekday alignment for the first day of the month
//   const firstDayOfWeek = new Date(
//     currentDate.getFullYear(),
//     currentDate.getMonth(),
//     1
//   ).getDay(); // JavaScript's getDay() starts weeks on Sunday (0)
//   const adjustedFirstDayOfWeek = (firstDayOfWeek + 6) % 7; // Shift Sunday (0) to Monday (0)

//   // Create an array of all days in the current month
//   const days = Array.from({ length: daysInMonth }, (_, i) => ({
//     date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
//       .toISOString()
//       .split("T")[0], // Format as yyyy-mm-dd
//     label: i + 1, // Display day number
//   }));

//   return (
//     <div className="calendar-page">
//       {/* Calendar Header */}
//       <header className="calendar-header">
//         <button onClick={() => handleMonthChange(-1)}>&lt;</button>
//         <div className="month-year-controls">
//           <select
//             value={currentDate.getMonth()}
//             onChange={(e) =>
//               handleSpecificMonthYearChange(
//                 parseInt(e.target.value),
//                 currentDate.getFullYear()
//               )
//             }
//           >
//             {Array.from({ length: 12 }, (_, i) => (
//               <option key={i} value={i}>
//                 {new Date(0, i).toLocaleString("default", { month: "long" })}
//               </option>
//             ))}
//           </select>
//           <input
//             type="number"
//             value={currentDate.getFullYear()}
//             onChange={(e) =>
//               handleSpecificMonthYearChange(
//                 currentDate.getMonth(),
//                 parseInt(e.target.value)
//               )
//             }
//           />
//         </div>
//         <button onClick={() => handleMonthChange(1)}>&gt;</button>
//       </header>

//       {/* Weekdays Header */}
//       <div className="calendar-weekdays">
//         {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
//           <div key={index} className="weekday">
//             {day}
//           </div>
//         ))}
//       </div>

//       {/* Calendar Grid */}
//       <CalendarGrid
//         days={days}
//         events={events}
//         adjustedFirstDayOfWeek={adjustedFirstDayOfWeek}
//         onDateClick={handleDateClick}
//         onEditEvent={setupEditEvent}
//         onDeleteEvent={handleDeleteEvent}
//       />

//       {/* Event Form Popup */}
//       {showForm && (
//         <EventForm
//           date={selectedDate}
//           onClose={() => {
//             setShowForm(false);
//             setEditingEvent(null);
//           }}
//           onAddEvent={editingEvent ? handleEditEvent : handleAddEvent} // Dynamically choose based on editing state
//           editingEvent={editingEvent}
//         />
//       )}
//     </div>
//   );
  
// }
