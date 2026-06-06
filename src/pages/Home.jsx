import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [stats, setStats] = useState({
  users: 0,
  workers: 0,
  jobs: 0
});

useEffect(() => {
  loadStats();
}, []);

const loadStats = async () => {

  // USERS (profiles table)
  const { count: users } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // WORKERS
  const { count: workers } = await supabase
    .from("worker_profiles")
    .select("*", { count: "exact", head: true });

  // JOBS
  const { count: jobs } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true });

  setStats({
    users: users || 0,
    workers: workers || 0,
    jobs: jobs || 0
  });
};
  return (
    <div
      style={{
        fontFamily:"Arial,sans-serif",
        background:"#f8fafc",
        minHeight:"100vh"
      }}
    >

{/* HERO */}

<div
style={{
background:"linear-gradient(135deg,#2563eb,#4f46e5)",
color:"white",
padding:"80px 30px",
textAlign:"center"
}}
>

<h1
style={{
fontSize:"45px",
marginBottom:"15px"
}}
>
HireSmart TT
</h1>

<p
style={{
fontSize:"20px",
maxWidth:"700px",
margin:"0 auto"
}}
>
Connecting Trinidad & Tobago with trusted workers and clients.
Find jobs, hire help, and grow your business faster.
</p>

<div
style={{
marginTop:"30px",
display:"flex",
justifyContent:"center",
gap:"15px"
}}
>

<button
onClick={() => window.location="/signup"}
style={{
padding:"14px 25px",
background:"white",
color:"#2563eb",
border:"none",
borderRadius:"8px",
fontWeight:"bold",
cursor:"pointer"
}}
>
Create Free Account
</button>

<button
onClick={() => window.location="/login"}
style={{
padding:"14px 25px",
background:"transparent",
color:"white",
border:"1px solid white",
borderRadius:"8px",
fontWeight:"bold",
cursor:"pointer"
}}
>
Login
</button>

</div>
<div style={{ display: "flex", gap: "20px" }}>

  <div>
    👥 Users: {stats.users}
  </div>

  <div>
    👷 Workers: {stats.workers}
  </div>

  <div>
    📢 Jobs: {stats.jobs}
  </div>

</div>
</div>


{/* HOW IT WORKS */}
<div
  style={{
    padding: "60px 30px",
    textAlign: "center"
  }}
>
  <h2>How It Works</h2>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: "30px",
      flexWrap: "wrap",
      marginTop: "30px"
    }}
  >
    <div style={{ background: "white", padding: "25px", width: "250px", borderRadius: "15px" }}>
      <h3>1️⃣ Post A Job</h3>
      <p>Clients post jobs and describe what help they need.</p>
    </div>

    <div style={{ background: "white", padding: "25px", width: "250px", borderRadius: "15px" }}>
      <h3>2️⃣ Workers Apply</h3>
      <p>Workers submit applications and explain why they fit the job.</p>
    </div>

    <div style={{ background: "white", padding: "25px", width: "250px", borderRadius: "15px" }}>
      <h3>3️⃣ Hire Instantly</h3>
      <p>Hire workers and connect directly through WhatsApp.</p>
    </div>
  </div>
</div>
{/* SERVICES SECTION */}
<div
  style={{
    padding: "60px 30px",
    textAlign: "center",
    background: "#f1f5f9"
  }}
>
  <h2>Services Available</h2>

  <p style={{ color: "#6b7280", marginBottom: "30px" }}>
    Find trusted workers for everyday jobs across Trinidad & Tobago
  </p>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "15px",
      maxWidth: "900px",
      margin: "0 auto"
    }}
  >
    {[
      "🔧 Plumbers",
      "⚡ Electricians",
      "🧹 Cleaners",
      "🚗 Mechanics",
      "🚚 Drivers",
      "🔨 Handymen",
      "🎉 Event Helpers",
      "🏠 Landscapers",
      "🪚 Carpentry",
      "📦 Delivery Services",
      "🧱 Labourers",
      "🖌️ Painters",
      "👶 Babysitters",
      "💼 Personal Assistants",
      "🏢 Office Workers"
    ].map((service, index) => (
      <div
        key={index}
        style={{
          background: "white",
          padding: "12px 18px",
          borderRadius: "20px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          fontSize: "14px",
          fontWeight: "500"
        }}
      >
        {service}
      </div>
    ))}
  </div>
</div>

{/* BENEFITS */}

<div
style={{
padding:"60px 30px"
}}
>

<h2
style={{
textAlign:"center"
}}
>
Why Use HireSmart TT?
</h2>

<div
style={{
display:"flex",
gap:"30px",
justifyContent:"center",
flexWrap:"wrap",
marginTop:"30px"
}}
>

<div
style={{
background:"white",
padding:"25px",
width:"300px",
borderRadius:"15px"
}}
>

<h3>For Clients</h3>

<p>✅ Find workers quickly</p>
<p>✅ Compare applicants</p>
<p>✅ Hire through WhatsApp</p>
<p>✅ Manage jobs easily</p>

</div>


<div
style={{
background:"white",
padding:"25px",
width:"300px",
borderRadius:"15px"
}}
>

<h3>For Workers</h3>

<p>✅ Find nearby jobs</p>
<p>✅ Create a professional profile</p>
<p>✅ Receive hiring requests</p>
<p>✅ Grow your business</p>

</div>

</div>

</div>


{/* FOOTER CTA */}

<div
style={{
background:"#111827",
color:"white",
padding:"50px",
textAlign:"center"
}}
>

<h2>Start Today</h2>

<p>
Join HireSmart TT and connect with workers and clients across Trinidad & Tobago.
</p>

<button
onClick={() => window.location="/signup"}
style={{
marginTop:"15px",
padding:"14px 25px",
background:"#2563eb",
color:"white",
border:"none",
borderRadius:"8px",
cursor:"pointer",
fontWeight:"bold"
}}
>
Get Started
</button>

</div>

</div>
  );
}