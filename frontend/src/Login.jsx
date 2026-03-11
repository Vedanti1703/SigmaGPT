import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";
import "./auth.css";

function Login({ goToRegister }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      login(data.token);
    } else {
      alert(data.message || "User does not exist");
      goToRegister();  // 🔥 redirect to register
    }
  };

return (
  <div className="authContainer">
    <div className="authCard">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="authInput"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="authInput"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="authButton">
          Login
        </button>
      </form>

      <div className="authSwitch">
        Don't have an account?{" "}
        <span onClick={goToRegister}>Register</span>
      </div>
    </div>
  </div>
)};

export default Login;