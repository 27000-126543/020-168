import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import QuoteDetail from "@/pages/QuoteDetail";
import Consultation from "@/pages/Consultation";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quote/:packageId" element={<QuoteDetail />} />
        <Route path="/consultation/:id" element={<Consultation />} />
      </Routes>
    </Router>
  );
}
