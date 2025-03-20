import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Header from "./components/Header/Header";
// import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import CalendarPage from "./pages/CalendarPage/CalendarPage";
import NotesPage from "./pages/NotesPage/NotesPage";
import NoteAddForm from "./components/NoteAddForm/NoteAddForm";
import NoteDetails from "./components/NoteDetails/NoteDetails";
import NoteEdit from "./components/NoteEdit/NoteEdit";
import LinksPage from "./pages/LinksPage/LinksPage";
import LinkAddForm from "./components/LinkAddForm/LinkAddForm";
import LinkDetails from "./components/LinkDetails/LinkDetails";
import LinkEdit from "./components/LinkEdit/LinkEdit";
import DocumentsPage from "./pages/DocumentsPage/DocumentsPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import DocumentEdit from "./components/DocumentEdit/DocumentEdit";
import DocumentDetails from "./components/DocumentDetails/DocumentDetails";

// import { API_URL } from "./config";


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/add" element={<NoteAddForm />} />
        <Route path="/notes/:id" element={<NoteDetails />} />
        <Route path="/notes/:id/edit" element={<NoteEdit />} />
        <Route path="/links" element={<LinksPage />} />
        <Route path="/links/add" element={<LinkAddForm />} />
        <Route path="/links/:id" element={<LinkDetails />} />
        <Route path="/links/:id/edit" element={<LinkEdit />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/documents/:id" element={<DocumentDetails />} />
        <Route path="/documents/:id/edit" element={<DocumentEdit />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
