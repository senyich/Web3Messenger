import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Layout/Footer";
import Header from "./components/Layout/Header";
import LoginForm from "./pages/LoginForm";
import RegistrationForm from './pages/RegistrationForm';

function App() {
  return (
      <Router>
      <Header />
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;