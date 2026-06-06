import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("customer"); // ✅ FIXED

  const handleSignup = async () => {
    // 1. Create auth user
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = authData?.user;

    if (!user) {
      alert("Signup failed. Try again.");
      return;
    }

    // 2. Create profile
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email,
        role,
        name
      });

    if (profileError) {
  console.log("PROFILE INSERT ERROR:", profileError);
  alert("Profile not saved");
  return;
}

    alert("Account created successfully");

    navigate("/login");
  };

  return (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg,#2563eb,#4f46e5)"
  }}>

    <div style={{
      background: "white",
      padding: "30px",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "420px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
    }}>

      {/* BRANDING */}
      <h2 style={{ marginBottom: "5px", color: "#111827" }}>
        HireSmart TT
      </h2>

      <p style={{
        color: "#6b7280",
        marginBottom: "20px"
      }}>
        Create your account to get started
      </p>

      {/* NAME */}
      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb"
        }}
      />

      {/* EMAIL */}
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb"
        }}
      />

      {/* PASSWORD */}
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb"
        }}
      />

      {/* ROLE */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb"
        }}
      >
        <option value="customer">Customer</option>
        <option value="worker">Worker</option>
      </select>

      {/* BUTTON */}
      <button
        onClick={handleSignup}
        style={{
          width: "100%",
          padding: "12px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Create Account
      </button>

      {/* LOGIN LINK */}
      <p style={{
        textAlign: "center",
        marginTop: "15px",
        fontSize: "13px",
        color: "#6b7280"
      }}>
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          style={{ color: "#2563eb", cursor: "pointer" }}
        >
          Login
        </span>
      </p>

    </div>
  </div>
);
}