import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import NotesPage from "./pages/NotesPage/NotesPage";
import LinksPage from "./pages/LinksPage/LinksPage";
import DocumentsPage from "./pages/DocumentsPage/DocumentsPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

export const API_URL = import.meta.env.VITE_API_URL;

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/links" element={<LinksPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
