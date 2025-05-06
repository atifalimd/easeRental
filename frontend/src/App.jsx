import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import Earnings from "./pages/Earning";
import ActiveListings from "./pages/ActiveListing";
import PendingRequests from "./pages/PendingList";
import PreferencesPage from "./pages/Prefer";
import RentalHistory from "./pages/RentalHistory";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/get-earnings" element={<Earnings />} />
          <Route path="/get-active-listing" element={<ActiveListings />} />
          <Route path="/get-pending-requests" element={<PendingRequests />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/tenant/preferences" element={<PreferencesPage />} />
          <Route path="rentals/history" element={<RentalHistory />} />

          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
