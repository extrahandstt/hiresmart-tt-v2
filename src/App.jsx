import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./Login";
import AdminDashboard from "./pages/AdminDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Signup from "./pages/Signup";
import Subscription from "./pages/Subscription";
import PlumbersTT from "./pages/PlumbersTT";
import CleanersTT from "./pages/CleanersTT";
import ServicePage from "./pages/ServicePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/worker" element={<WorkerDashboard />} />
      <Route path="/customer" element={<CustomerDashboard />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/plumbers-trinidad" element={<PlumbersTT />} />
      <Route path="/cleaners-trinidad" element={<CleanersTT />} />
      <Route path="/services/:type" element={<ServicePage />} />
    </Routes>
  );
}