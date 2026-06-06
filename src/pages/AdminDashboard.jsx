import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // =========================
  // STATES (MUST BE INSIDE COMPONENT)
  // =========================
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState("users");
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  

  const logout = async () => {
  await supabase.auth.signOut();
  navigate("/");
};
  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {
  const checkAccess = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) {
      navigate("/");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
console.log(profile, profileError);
    if (profileError) {
      console.log("PROFILE ERROR:", profileError);
      return;
    }

    if (!profile || profile.role !== "admin") {
      navigate("/");
      return;
    }

    // =========================
    // 1. LOAD ALL USERS
    // =========================
    const { data: users, error: usersError } = await supabase
  .from("profiles")
  .select("*");

if (usersError) {
  console.log("USERS ERROR:", usersError);
} else {
  console.log("PROFILES RAW:", users);
  console.log("COUNT:", users?.length);

  setProfiles(users || []);
}
    // =========================
    // 2. LOAD ALL JOBS
    // =========================
    const { data: jobData } = await supabase
  .from("jobs")
  .select("*")
  .order("created_at", { ascending: false });

setJobs(jobData || []);

    // ❌ REMOVED: pending workers (no longer needed)

  };

  checkAccess();
}, [navigate]);

      const activateProPlan = async (userId) => {
  const { error } = await supabase
    .from("profiles")
    .update({
      plan: "pro",
      is_pro: true,
      pro_activated_at: new Date().toISOString()
    })
    .eq("id", userId);

  if (error) {
    console.log("PRO ACTIVATION ERROR:", error);
    alert("Failed to activate Pro plan");
    return;
  }

  alert("User upgraded to Pro successfully");
};
const deleteJob = async (id) => {
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", id);

  if (!error) {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }
};
  // =========================
  // FILTER
  // =========================
  
 const filteredProfiles = profiles.filter((p) => {
  const searchText = search.toLowerCase();

  const matchesSearch =
    (p.name ?? "").toLowerCase().includes(searchText) ||
    (p.email ?? "").toLowerCase().includes(searchText);

  const matchesRole =
    filterRole === "all" ? true : p.role === filterRole;

  return matchesSearch && matchesRole;
});
  const activatePro = async (id) => {

const { error } = await supabase
.from("profiles")
.update({
plan:"pro",
subscription_status:"active"
})
.eq("id",id);

if(!error){

setProfiles(prev =>
prev.map(user =>
user.id===id
? {
...user,
plan:"pro",
subscription_status:"active"
}
:user
)
);

}

};

const cancelSubscription = async (id) => {

const { error } = await supabase
.from("profiles")
.update({
plan:"free",
subscription_status:"inactive"
})
.eq("id",id);

if(!error){

setProfiles(prev =>
prev.map(user =>
user.id===id
? {
...user,
plan:"free",
subscription_status:"inactive"
}
:user
)
);

}

};

const activateFeatured = async(id)=>{

const expiry = new Date();

expiry.setDate(
expiry.getDate()+7
);

const { error } = await supabase
.from("profiles")
.update({
featured:true,
featured_expiry:
expiry.toISOString()
})
.eq("id",id);

if(!error){

alert(
"Featured slot activated"
);

}

};

  // =========================
  // UI
  // =========================
  const tabBtn = {
  padding: "10px 15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  fontWeight: "500"
};
  return (
  <div>

    {/* HEADER ONLY */}
    <div
      style={{
        background: "linear-gradient(135deg, #111827, #1f2937)",
        color: "white",
        padding: "20px",
        borderRadius: "0 0 15px 15px"
      }}
    >
      {/* TOP ROW */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>

        <button
          onClick={logout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>
      </div>

      {/* TABS INSIDE HEADER (optional but OK here) */}
      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <button onClick={() => setTab("users")} style={tabBtn}>
          All Users
        </button>

        <button onClick={() => setTab("jobs")} style={tabBtn}>
  Jobs
</button>
<button
onClick={() => setTab("subscriptions")}
style={tabBtn}
>
💳 Subscriptions
</button>
      </div>
          </div>

    {/* MAIN CONTENT AREA (OUTSIDE HEADER) */}
    <div style={{ padding: "20px" }}>

      {/* USERS TAB */}
{tab === "users" && (
  <>
    <div style={{ margin: "10px 0" }}>
      <input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={filterRole}
        onChange={(e) => setFilterRole(e.target.value)}
      >
        <option value="all">All</option>
        <option value="admin">Admins</option>
        <option value="worker">Workers</option>
        <option value="customer">Customers</option>
      </select>
    </div>

    <h2>All Users</h2>

    {filteredProfiles.map((p) => (
  <div key={p.id}>

    <p>{p.name}</p>
    <p>{p.email}</p>
    <p>{p.role}</p>

    <button onClick={() => updateRole(p.id, "admin")}>
      Admin
    </button>

    <button onClick={() => deleteUser(p.id)}>
      Delete
    </button>

    <button onClick={() => activatePro(p.id)}>
      Make Pro ⭐
    </button>

    <button onClick={() => cancelSubscription(p.id)}>
      Remove Pro
    </button>

  </div>
))}
  </>
)}

 
{/* JOBS TAB */}
{tab === "jobs" && (
  <>
    <h2>All Jobs</h2>

    {jobs.length === 0 ? (
      <p>No jobs posted yet</p>
    ) : (
      jobs.map((job) => (
        <div
          key={job.id}
          style={{
            background: "white",
            color: "black",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "flex-start"
            }}
          >
            {job.flyer && (
              <img
                src={job.flyer}
                alt="job"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
              />
            )}

            <div>
              <h3>{job.title}</h3>

              <p>📍 {job.location}</p>

              <p>💰 {job.budget}</p>

              <p>{job.description}</p>

              <button
                onClick={() => deleteJob(job.id)}
                style={{
                  marginTop: "10px",
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "8px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Delete Job
              </button>
            </div>

          </div>
        </div>
      ))
    )}
  </>
)}
{tab === "subscriptions" && (
  <>
    <h2>Subscriptions</h2>

    {profiles.map(user => (
      <div key={user.id}>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <p>{user.plan}</p>

        <button onClick={() => activatePro(user.id)}>
          Activate Pro
        </button>

        <button onClick={() => cancelSubscription(user.id)}>
          Cancel
        </button>

        <button onClick={() => activateFeatured(user.id)}>
          Featured 7 Days
        </button>
      </div>
    ))}
  </>
)}
    </div>

  </div>
);
}