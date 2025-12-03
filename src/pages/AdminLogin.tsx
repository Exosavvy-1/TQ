import { useState } from "react";
import { useNavigate } from "../hooks/useNavigate";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // HARD CODED ADMIN LOGIN
    const adminEmail = "tqpicture@gmail.com";
    const adminPassword = "TyraMokhotla@2705";

    if (email === adminEmail && password === adminPassword) {
      // redirect to admin dashboard
      navigate("/admin");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login as Admin</button>
      </form>
    </div>
  );
}

export default AdminLogin;
