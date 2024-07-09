import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import UserContextProvider from "./UserContext";
import AccountPage from "./pages/Account";
import PlacesPage from "./pages/PlacesPage";
import PlaceForm from "./pages/PlaceForm";
import SingleHomePage from "./pages/SingleHomePage";
import Bookings from "./pages/Bookings";
import Booking from "./pages/Booking";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlaceForm />} />
          <Route path="/account/places/:id" element={<PlaceForm />} />
          <Route path="/home/:id" element={<SingleHomePage />} />
          <Route path="/account/bookings" element={<Bookings />} />
          <Route path="/account/bookings/:id" element={<Booking />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
