import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Layout/Footer";
import Header from "./components/Layout/Header";
import LoginForm from "./pages/LoginForm";
import RegistrationForm from './pages/RegistrationForm';
import Chat from "./pages/Chat";

function App() {
  return (
      <Router>
      <Header />
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;