import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import InstallButton from "../components/InstallButton";

export default function Home() {
  const [stats, setStats] = useState({
    users: 0,
    workers: 0,
    jobs: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { count: usersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: workersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "worker");

    const { count: jobsCount } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true });

    setStats({
      users: usersCount || 0,
      workers: workersCount || 0,
      jobs: jobsCount || 0,
    });
  };

  return (
    <div style={{ fontFamily: "Arial,sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)", color: "white", padding: "80px 30px", textAlign: "center" }}>
        <h1 style={{ fontSize: "45px", marginBottom: "15px" }}>
          HireSmart TT
        </h1>

        <p>📲 Download The HireSmart TT App for faster access to workers & jobs</p>

        <InstallButton />

        <p style={{ fontSize: "20px", maxWidth: "700px", margin: "0 auto" }}>
          Connecting Trinidad & Tobago with trusted workers and clients. Find jobs, hire help, and grow your business faster.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "30px" }}>
          <button onClick={() => window.location = "/signup"} style={{ padding: "14px 25px", background: "white", color: "#2563eb", border: "none", borderRadius: "8px", fontWeight: "bold" }}>
            Create Free Account
          </button>

          <button onClick={() => window.location = "/login"} style={{ padding: "14px 25px", background: "transparent", color: "white", border: "1px solid white", borderRadius: "8px", fontWeight: "bold" }}>
            Login
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
          <div>👥 Users: {stats.users}</div>
          <div>👷 Workers: {stats.workers}</div>
          <div>📢 Jobs: {stats.jobs}</div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: "60px 30px", textAlign: "center" }}>
        <h2>How It Works</h2>
        <p>Post jobs, get applicants, and hire instantly via WhatsApp.</p>
      </div>

      {/* SERVICES */}
      <div style={{ padding: "60px 30px", textAlign: "center", background: "#f1f5f9" }}>
        <h2>Services Available</h2>
        <p>Find trusted workers across Trinidad & Tobago</p>
      </div>

      {/* FOOTER */}
      <div style={{ background: "#111827", color: "white", padding: "50px", textAlign: "center" }}>
        <h2>Start Today</h2>
        <p>Join HireSmart TT and grow your business.</p>
      </div>

    </div>
  );
}