import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Header from "./components/Header/Header";
// import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import NotesPage from "./pages/NotesPage/NotesPage";
import LinksPage from "./pages/LinksPage/LinksPage";
import DocumentsPage from "./pages/DocumentsPage/DocumentsPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import DocumentEdit from "./components/DocumentEdit/DocumentEdit";
import DocumentDetails from "./components/DocumentDetails/DocumentDetails";

import { API_URL } from "./config";

console.log("API_URL in App:", API_URL);

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/links" element={<LinksPage />} />
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
