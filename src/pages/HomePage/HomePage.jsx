import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const handleCalendarClick = () => {
    navigate("/calendar"); // Navigate to CalendarPage
  };

  return (
    <div>
      <h1>Welcome to SaveIt</h1>
      <button onClick={handleCalendarClick}>Calendar</button>
    </div>
  );
}


