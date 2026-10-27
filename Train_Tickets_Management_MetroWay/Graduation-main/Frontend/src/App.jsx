import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import Home from './Home';
import EmployeeAddForm from './EmployeeAddForm';
import './App.css';
import ScheduleSearch from './ScheduleSearch';
import TicketBooking from './features/tickets/TicketBooking';
import EmployeeForm from './EmployeeManagerForm';
import ClientManagement from './ClientManagement';
import AddClient from './AddClient';
import AppLayout from './components/AppLayout';
import RequireRole from './components/RequireRole';
import Reports from './features/reports/Reports';
import Catalog from './features/catalog/Catalog';
import MyTickets from './features/tickets/MyTickets';
import AdminTickets from './pages/AdminTickets';
import Landing from './pages/Landing';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public landing + auth */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User area */}
          <Route path="/app/home" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/app/forgot-password" element={<AppLayout><ForgotPassword /></AppLayout>} />
          <Route path="/app/ticket-booking" element={<RequireRole allowedRoles={["hanhkhach"]} namespace="user"><AppLayout><TicketBooking /></AppLayout></RequireRole>} />
          <Route path="/app/schedule" element={<AppLayout><ScheduleSearch /></AppLayout>} />
          <Route path="/app/my-tickets" element={<RequireRole allowedRoles={["hanhkhach"]} namespace="user"><AppLayout><MyTickets /></AppLayout></RequireRole>} />

          {/* Admin area */}
          <Route path="/admin/home" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/admin/manage-employee" element={<RequireRole allowedRoles={["admin"]} namespace="admin"><AppLayout><EmployeeForm /></AppLayout></RequireRole>} />
          <Route path="/admin/add-employee" element={<RequireRole allowedRoles={["admin"]} namespace="admin"><AppLayout><EmployeeAddForm /></AppLayout></RequireRole>} />
          <Route path="/admin/client" element={<RequireRole allowedRoles={["admin","employee"]} namespace="admin"><AppLayout><ClientManagement /></AppLayout></RequireRole>}/>
          <Route path="/admin/add-client" element={<RequireRole allowedRoles={["admin","employee"]} namespace="admin"><AppLayout><AddClient /></AppLayout></RequireRole>} />
          <Route path="/admin/schedule" element={<RequireRole allowedRoles={["admin","employee"]} namespace="admin"><AppLayout><ScheduleSearch /></AppLayout></RequireRole>} />
          <Route path="/admin/reports" element={<RequireRole allowedRoles={["admin"]} namespace="admin"><AppLayout><Reports /></AppLayout></RequireRole>} />
          <Route path="/admin/catalog" element={<RequireRole allowedRoles={["admin"]} namespace="admin"><AppLayout><Catalog /></AppLayout></RequireRole>} />
          <Route path="/admin/tickets" element={<RequireRole allowedRoles={["admin","employee"]} namespace="admin"><AppLayout><AdminTickets /></AppLayout></RequireRole>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
