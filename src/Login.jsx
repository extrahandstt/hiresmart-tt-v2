import { useState } from "react";
import { supabase } from "./lib/supabase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
console.log("SUPABASE CHECK:", supabase);

const navigate = useNavigate();


const checkSession = async () => {
  const { data } = await supabase.auth.getSession();

  const user = data.session?.user;

  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) return;

  if (profile.role === "admin") {
    navigate("/admin");

  } else if (profile.role === "worker") {
    navigate("/worker");

  } else if (profile.role === "customer") {
    navigate("/customer");

  } else if (profile.role === "pending") {
    await supabase.auth.signOut();

    alert("Account waiting for approval");
  }
};
useEffect(() => {
  checkSession();
}, []);
const signIn = async () => {
  console.log("LOGIN CLICKED");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.log(error);
    return alert(error.message);
  }

  const authUser = data.user;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single();

  console.log("PROFILE:", profile);
  console.log("PROFILE ERROR:", profileError);

  if (profileError || !profile) {
    return alert("Cannot load profile");
  }

  const role = profile.role;

if (role === "admin") {
  navigate("/admin");

} else if (role === "worker") {
  navigate("/worker");

} else if (role === "customer") {
  navigate("/customer");

} else if (role === "pending") {
  await supabase.auth.signOut();

  alert("Account waiting for approval");
}
};
  return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg,#2563eb,#4f46e5)",
      padding: "20px"
    }}
  >
    <div
      style={{
        background: "white",
        width: "100%",
        maxWidth: "420px",
        padding: "35px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#2563eb",
          marginBottom: "5px"
        }}
      >
        HireSmart TT
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#6b7280",
          marginBottom: "30px"
        }}
      >
        Welcome Back 👋
      </p>

      <input
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "10px",
          border: "1px solid #ddd"
        }}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "10px",
          border: "1px solid #ddd"
        }}
      />

      <button
        onClick={signIn}
        style={{
          width: "100%",
          padding: "14px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "16px"
        }}
      >
        Login
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: "20px"
        }}
      >
        <p style={{ color: "#6b7280" }}>
          Don't have an account?
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Create Account
        </button>
      </div>
    </div>
  </div>
);
}