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
<section className="how-it-works">
  <div className="how-container">

    <h2>How It Works</h2>

    <div className="steps-container">

      <div className="step-card">
        <div className="step-number">1️⃣</div>
        <h3>Create an Account</h3>
        <p>
          Sign up as a worker or customer in a few simple steps.
        </p>
      </div>

      <div className="step-card">
        <div className="step-number">2️⃣</div>
        <h3>Post or Find Jobs</h3>
        <p>
          Customers post jobs and workers browse available opportunities.
        </p>
      </div>

      <div className="step-card">
        <div className="step-number">3️⃣</div>
        <h3>Connect & Get Work Done</h3>
        <p>
          Customers can contact workers directly and complete jobs easily.
        </p>
      </div>

    </div>

  </div>
</section>

{/* SERVICES AVAILABLE */}

{/* SERVICES AVAILABLE */}
<section className="services-section">
  <h2>Services Available</h2>

  <div className="services-grid">

    {[
      { name: "Plumber", icon: "🔧" },
      { name: "Cleaner", icon: "🧹" },
      { name: "Painter", icon: "🎨" },
      { name: "Landscaper", icon: "🌿" },
      { name: "Carpenter", icon: "🔨" },
      { name: "Labourer", icon: "👷" },
      { name: "Electrician", icon: "⚡" },
      { name: "Mechanic", icon: "🔩" },
      { name: "Driver", icon: "🚗" },
      { name: "Delivery Services", icon: "📦" },
      { name: "Event Worker", icon: "🎉" },
      { name: "Handyman", icon: "🛠️" },
      { name: "Babysitter", icon: "👶" },
      { name: "Personal Assistant", icon: "📋" },
      { name: "Office Worker", icon: "🏢" },
      { name: "Phone Technician", icon: "📱" },
      { name: "Wrecking Service", icon: "🚚" },
      { name: "Laptop Repairs", icon: "💻" },
      { name: "Photography", icon: "📸" },
      { name: "Aircondition Technician", icon: "❄️" },
      { name: "Hairdresser", icon: "✂️" },
      { name: "Geriatric Services", icon: "❤️" },
      { name: "Transport Services", icon: "🚌" },
      { name: "Nail Technician", icon: "💅" },
      { name: "Business Registration", icon: "📄" },
      { name: "Appliance Repair", icon: "🔌" },
      { name: "Security", icon: "🛡️" },
      { name: "Construction Worker", icon: "🏗️" },
      { name: "Makeup Artist", icon: "💄" },
      { name: "Customer Service", icon: "🎧" },
      { name: "Warehouse Worker", icon: "📦" },
      { name: "Cashier", icon: "💵" },
      { name: "Barber", icon: "💈" },
      { name: "Pool Maintenance", icon: "🏊" },
      { name: "Roofing", icon: "🏠" },
      { name: "Massage Therapist", icon: "💆" }
    ].map((service) => (
      <div key={service.name} className="service-card">
        <div className="service-icon">{service.icon}</div>
        <div className="service-name">{service.name}</div>
      </div>
    ))}

  </div>
</section>


{/* WHY USE HIRESMART TT */}
<section className="why-hiresmart">
  <h2>Why Use HireSmart TT?</h2>

  <div className="why-grid">

    <div className="why-card">
      <h3>For Workers</h3>

      <p className="why-subtext">
        Grow your income and find opportunities faster.
      </p>

      <div className="why-features">
        <div className="feature-item">✔ Find nearby jobs</div>
        <div className="feature-item">✔ Create professional profile</div>
        <div className="feature-item">✔ Receive hiring request</div>
        <div className="feature-item">✔ Grow your income opportunities</div>
      </div>
    </div>

    <div className="why-card">
      <h3>For Clients</h3>

      <p className="why-subtext">
        Hire trusted workers easily and quickly.
      </p>

      <div className="why-features">
        <div className="feature-item">✔ Find workers quickly</div>
        <div className="feature-item">✔ Compare applicants</div>
        <div className="feature-item">✔ Hire through WhatsApp</div>
        <div className="feature-item">✔ Manage jobs easily</div>
      </div>
    </div>

  </div>
</section>

      {/* FOOTER */}
      <div style={{ background: "#111827", color: "white", padding: "50px", textAlign: "center" }}>
        <h2>Start Today</h2>
        <p>Join us on HireSmart TT Workers Marketplace.</p>
      </div>

    </div>
  );
}