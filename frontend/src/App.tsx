import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Layout/Footer";
import Header from "./components/Layout/Header";
import LoginForm from "./components/LoginForm";
import RegistrationForm from './components/RegistrationForm';

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