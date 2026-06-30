import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import {
  Home2,
  About,
  Contact,
  Login,
  Auth,
  Service,
  ForgotPwd,
  ResetPassword,
} from "./components/pages";
import { Navbar, Footer } from "./components/include";
import "./App.css";
import AdminDashboard from "./components/adminComponents/AdminDashboard";
import {
  Dashboard, Equipment,  Maintenance, Reports, Calendar, Performance, Alerts, AdminProfile, AdminResetPassword, SpareParts, ContactMessages, OperatorAdministration as AdminOperatorAdmin
} from "./components/adminComponents/adminPages";

import OperatorDashboard from "./components/OperatorComponents/OperatorDashboard";
import RequestSparePart from "./components/OperatorComponents/operatorPages/RequestSparePart";
import {
  OpDashboard,
  EquipmentStatus,
  MyTasks,
  PerformanceMetrics,
  ActiveAlerts,
  Downtime,
  OperatorProfile,
  OperatorResetPassword,
} from "./components/OperatorComponents/operatorPages";
import TaskDebug from "./components/OperatorComponents/operatorPages/TaskDebug";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home2 />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/services"
          element={
            <>
              <Navbar />
              <Service />
              <Footer />
            </>
          }
        />
        <Route
          path="/auth"
          element={
            <>
              <Navbar />
              <Auth />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />
        <Route
          path="/forgot"
          element={
            <>
              <Navbar />
              <ForgotPwd />
            </>
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        
        {/* Admin Page routes */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="equipment" element={<Equipment />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="reports" element={<Reports />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="performance" element={<Performance />} />
          <Route path="spareparts" element={<SpareParts />} />
          <Route path="messages" element={<ContactMessages />} />
          <Route path="profile" element={<AdminProfile/>} />
          <Route path="reset-admin-password" element={<AdminResetPassword />} />
          <Route path="operator-administration" element={<AdminOperatorAdmin/>} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
        
        {/* Operator Page routes */}
        <Route path="/operator" element={<ProtectedRoute requiredRole="operator"><OperatorDashboard /></ProtectedRoute>}>
          <Route index element={<OpDashboard />} />
          <Route path="dashboard" element={<OpDashboard />} />
          <Route path="equipstatus" element={<EquipmentStatus />} />
          <Route path="mytasks" element={<MyTasks />} />
          <Route path="metrics" element={<PerformanceMetrics />} />
          <Route path="alerts" element={<ActiveAlerts />} />
          <Route path="downtime" element={<Downtime />} />
          <Route path="profile" element={<OperatorProfile />} />
          <Route path="request-spare" element={<RequestSparePart />} />
          <Route path="reset-operator-password" element={<OperatorResetPassword />} />
          <Route path="debug-tasks" element={<TaskDebug />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;