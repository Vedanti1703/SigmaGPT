import { useState } from "react";
import "./Auth.css";

function Register({ goToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registered successfully! Please login.");
    } else {
      alert(data.error);
    }
  };

 return (
  <div className="authContainer">
    <div className="authCard">
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          className="authInput"
          onChange={(e) => setName(e.target.value)}
        />

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
          Register
        </button>
      </form>

      <div className="authSwitch">
        Already have an account?{" "}
        <span onClick={goToLogin}>Login</span>
      </div>
    </div>
  </div>
)};
export default Register;