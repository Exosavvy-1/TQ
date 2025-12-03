import { AuthProvider } from './contexts/AuthContext';
import { useCurrentPath } from './hooks/useNavigate';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Booking from './pages/Booking';

function Router() {
  const path = useCurrentPath();

  switch (path) {
    case '/':
      return <Home />;
    case '/login':
      return <Login />;
    case '/signup':
      return <SignUp />;
    case '/admin-login':
      return <AdminLogin />;
    case '/admin':
      return <AdminDashboard />;
    case '/dashboard':
      return <UserDashboard />;
    case '/booking':
      return <Booking />;
    default:
      return <Home />;
  }
}

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
