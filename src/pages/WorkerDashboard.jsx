import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function WorkerDashboard() {
  const ADMIN_WHATSAPP = "18687326795";
  const navigate = useNavigate();
  const logout = async () => {
  await supabase.auth.signOut();
  navigate("/");
};
const [isPro, setIsPro] = useState(false);
const [plan,setPlan] = useState("free");
const [jobs, setJobs] = useState([]);
const [applications, setApplications] = useState([]);
const [avatar, setAvatar] = useState(null);
const [uploading, setUploading] = useState(false);
const [tab, setTab] = useState("profile");
const [selectedImage, setSelectedImage] = useState(null);
const [applicationMessage, setApplicationMessage] = useState("");

const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
const [service, setService] = useState("");
const [location, setLocation] = useState("");
const [bio, setBio] = useState("");
const [price, setPrice] = useState("");
const [notifications, setNotifications] = useState([]);

const openAdminWhatsApp = (message) => {
  const url = `https://wa.me/${18687326795}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};
useEffect(() => {
  const init = async () => {
    const profile = await loadProfile();
    const plan = await loadPlan();

    await fetchJobs(profile, plan);
    await loadApplications();
    await loadNotifications();
  };

  init();
}, []);
useEffect(() => {
  const test = async () => {
    const { data } = await supabase.auth.getUser();
    console.log("AUTH USER:", data.user);
  };

  test();
}, []);

  useEffect(() => {
    const checkAccess = async () => {
      const { data } = await supabase.auth.getUser();

      const user = data.user;

      if (!user) {
        navigate("/");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
        

      if (!profile || profile.role !== "worker") {
        navigate("/");
      }
    };

    checkAccess();
  }, []);
const saveProfile = async () => {
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) {
    alert("Not logged in");
    return;
    if (!name || !location || !service) {
    alert("Please complete all required fields: Name, Location, and Service.");
    return;
  }
  }
console.log({
  name: fullName,
  service,
  location,
  price,
  bio,
  phone,
  avatar
});
  const { error } = await supabase
  .from("worker_profiles")
      .upsert(
    {
      id: user.id,
      name: fullName,
      service: service,
      location: location,
      price: price,
      bio: bio,
      phone: phone,
      avatar: avatar
    },
    {
      onConflict: "id"
    }
  );
  if (error) {
    console.log("FULL PROFILE ERROR:", error);
    alert(error.message);
    return;
  }

  alert("Profile saved");
  loadProfile();
};
const loadProfile = async () => {
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) return;

  const { data, error } = await supabase
    .from("worker_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.log("PROFILE LOAD ERROR:", error);
    return;
  }

  if (data) {
    setFullName(data.name || "");
    setPhone(data.phone || "");
    setService(data.service || "");
    setLocation(data.location || "");
    setBio(data.bio || "");
    setPrice(data.price || "");
    setAvatar(data.avatar || null);
  }
};
const loadPlan = async () => {
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) return;

  const { data, error } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();

  if (error) {
    console.log(error);
    return;
  }

  const active = data?.subscription_status === "active";

  setIsPro(active);
};
const applyJob = async (jobId) => {

const { data: authData } =
await supabase.auth.getUser();

const user = authData?.user;

if(!user){
alert("Not logged in");
return;
}

const { data: profile } =
await supabase
.from("profiles")
.select("*")
.eq("id",user.id)
.single();

if (
profile.plan === "free" &&
profile.monthly_application_count >= 10
) {
  alert("Free plan limit reached. Upgrade to Pro.");
  navigate("/subscription");
  return;
}

const { error } =
await supabase
.from("job_applications")
.insert({

job_id:jobId,
worker_id:user.id,
status:"pending",
message:applicationMessage

});

if(error){
console.log(error);
return;
}

await supabase
.from("profiles")
.update({

monthly_application_count:
(profile.monthly_application_count || 0)+1

})
.eq("id",user.id);

alert("Applied successfully");



};
const uploadAvatar = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file);

  if (error) {
    alert("Upload failed");
    setUploading(false);
    return;
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  setAvatar(data.publicUrl);

  setUploading(false);
};

const fetchJobs = async (profile, plan) => {

  let query = supabase.from("jobs").select("*");

  // ONLY apply filters if they exist
  if (profile?.service) {
    query = query.eq("service", profile.service);
  }

  if (plan === "free") {
    query = query.eq("status", "open");
  }

  const { data, error } = await query;

  if (error) {
    console.log(error);
    return;
  }

  setJobs(data || []);
};
const loadApplications = async () => {
  const { data: auth } =
    await supabase.auth.getUser();

  const user = auth?.user;

  console.log("WORKER ID:", user?.id);

  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .eq("worker_id", user.id);

  console.log("APPLICATIONS:", data);
  console.log("APP ERROR:", error);

  if (error) return;

  const jobIds = [...new Set(
    data.map(a => a.job_id)
  )];

  console.log("JOB IDS:", jobIds);

  const { data: jobsData } = await supabase
    .from("jobs")
    .select("*")
    .in("id", jobIds);

  console.log("JOBS FOR APPS:", jobsData);

  const jobMap = {};

  jobsData?.forEach(job => {
    jobMap[job.id] = job;
  });

  const enriched = data.map(app => ({
    ...app,
    job: jobMap[app.job_id]
  }));

  console.log("FINAL APPLICATIONS:", enriched);

  setApplications(enriched);
};
const updateApplicationStatus = async (
  applicationId,
  newStatus
) => {

  const { error } = await supabase
    .from("job_applications")
    .update({
      status: newStatus
    })
    .eq("id", applicationId);

  if (error) {
    console.log(error);
    alert("Could not update status");
    return;
  }

  // Update local state immediately
  setApplications(prev =>
    prev.map(app =>
      app.id === applicationId
        ? {
            ...app,
            status: newStatus
          }
        : app
    )
  );
};
const loadNotifications = async () => {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  if (!user) return;

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("NOTIF ERROR:", error);
    return;
  }

  setNotifications(data || []);
};
const reportJob = async (job) => {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  if (!user) return;

  const reason = prompt("Why are you reporting this job?");

  if (!reason) return;

  const { error } = await supabase
    .from("reports")
    .insert({
      reporter_id: user.id,
      reported_id: job.id,
      type: "job",
      target_type: "job",
      reason,
      status: "pending"
    });

  if (error) {
    console.log(error);
    alert("Report failed");
    return;
  }

  alert("Job reported. Admin will review it.");
};
  return (
  <div style={{ padding: "30px" }}>

  <div style={{ padding: "30px" }}>

<div
  style={{
    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
    color: "white",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "25px"
  }}
>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
      }}
>
  <div
style={{
display: "flex",
gap: "15px",
marginTop: "20px"
}}
></div>

<div>
<h1 style={{ margin: 0 }}>
HireSmart TT
</h1>

<p
style={{
marginTop:"5px",
fontSize:"20px",
fontWeight:"600"
}}
>
Welcome Worker 👋
</p>
<h3>Notifications</h3>

{notifications.length === 0 ? (
  <p>No notifications yet</p>
) : (
  notifications.map((n) => (
    <div
      key={n.id}
      style={{
        background: "white",
        padding: "12px",
        marginBottom: "10px",
        borderRadius: "10px",
        border: "1px solid #eee"
      }}
    >
      <strong>{n.title}</strong>
      <p>{n.message}</p>
    </div>
  ))
)}
</div>

<button
onClick={logout}
style={{
background:"white",
color:"#2563eb",
border:"none",
padding:"10px 15px",
borderRadius:"8px",
cursor:"pointer",
fontWeight:"bold"
}}
>
Logout
</button>

</div>

<div
style={{
display:"flex",
gap:"10px",
marginTop:"20px"
}}
>

<button
onClick={() => setTab("profile")}
>
👤 Profile
</button>

<button
onClick={() => setTab("jobs")}
>
📢 Jobs
</button>

<button
onClick={() => setTab("applications")}
>
📋 Applications
</button>
<div
  >
  </div>
</div>

</div>
<div
style={{
background:"#f8fafc",
padding:"10px 14px",
borderRadius:"10px",
marginBottom:"12px",
borderLeft:"4px solid #f59e0b",
fontSize:"13px"
}}
>

<p style={{ margin:0, color:"#374151", lineHeight:"1.5" }}>
💎 <strong>Pro Plan:</strong> Unlimited access, featured badge, higher visibility in job listings, priority placement in customer application view  & portfolio gallery — <strong>$100/month</strong>
<br />
🚀 <strong>Featured Slot:</strong> Get more visibility for 7 days — <strong>$20</strong>
</p>

</div>
{/* 💳 SUBSCRIPTION / SUPPORT SECTION */}
<div
style={{
background:"#fff",
padding:"12px",
borderRadius:"12px",
marginBottom:"20px",
display:"flex",
gap:"10px",
flexWrap:"wrap"
}}
>

  {/* WiPay */}
<button
onClick={async()=>{

const { data: authData } =
await supabase.auth.getUser();

const user = authData?.user;

if(!user){
alert("Please login");
return;
}

await supabase
.from("subscription_requests")
.insert({
user_id:user.id,
plan:"pro",
payment_method:"WiPay"
});

openAdminWhatsApp(
"Hi Admin, I want to subscribe to PRO plan via WiPay."
);

}}
style={{
background:"#2563eb",
color:"white",
padding:"10px 14px",
border:"none",
borderRadius:"8px",
cursor:"pointer",
fontSize:"13px",
flex:"1",
minWidth:"140px"
}}
>
Pay by Card
</button>


{/* Bank Transfer */}
<button
onClick={async()=>{

const { data: authData } =
await supabase.auth.getUser();

const user = authData?.user;

if(!user){
alert("Please login");
return;
}

await supabase
.from("subscription_requests")
.insert({
user_id:user.id,
plan:"pro",
payment_method:"Bank Transfer"
});

openAdminWhatsApp(
"Hi Admin, I want to subscribe to PRO plan via Bank Transfer."
);

}}
style={{
background:"#2563eb",
color:"white",
padding:"10px 14px",
border:"none",
borderRadius:"8px",
cursor:"pointer",
fontSize:"13px",
flex:"1",
minWidth:"140px"
}}
>
Bank Transfer
</button>


{/* PayPal */}
<button
onClick={async()=>{

const { data: authData } =
await supabase.auth.getUser();

const user = authData?.user;

if(!user){
alert("Please login");
return;
}

await supabase
.from("subscription_requests")
.insert({
user_id:user.id,
plan:"pro",
payment_method:"PayPal"
});

window.open(
"https://paypal.me/HireSmartTT",
"_blank"
);

}}
style={{
background:"#2563eb",
color:"white",
padding:"10px 14px",
border:"none",
borderRadius:"8px",
cursor:"pointer",
fontSize:"13px",
flex:"1",
minWidth:"140px"
}}
>
Pay via PayPal
</button>
{/* Featured Slot */}
<button
onClick={() =>
window.open(
`https://wa.me/18687326795?text=${encodeURIComponent(
"Hi Admin, I want to purchase a Featured Slot Add-On ($20 for 7 days)."
)}`,
"_blank"
)
}
style={{
background:"#f59e0b",
color:"white",
padding:"10px 12px",
border:"none",
borderRadius:"8px",
cursor:"pointer",
fontWeight:"bold"
}}
>
🚀 7 Days Featured Slot
</button>

  {/* Help Button */}
  <button
    onClick={() =>
      openAdminWhatsApp(
        "Hi Admin, I need help with HireSmart TT."
      )
    }
    style={{
      background: "#25D366",
      color: "white",
      padding: "10px 12px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold"
    }}
  >
    💬 Help
  </button>

</div>
  </div>
  {tab === "profile" && (
<>
    {/* PROFILE FORM */}
    <div style={{
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  maxWidth: "500px"
}}>
  
  <h2 style={{ marginTop: "5px" }}>Worker Profile</h2>

<p style={{ marginTop: "5px", color: "#6b7280" }}>
  Complete your profile below so you can start applying for jobs and get hired faster.
</p>
  {/* PROFILE IMAGE */}
  <div style={{ marginBottom: "15px" }}>
    <label>Profile Picture</label><br />
    <input type="file" onChange={uploadAvatar} />
    {avatar && (
      <img
        src={avatar}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          marginTop: "10px"
        }}
      />
    )}
  </div>

  {/* FULL NAME */}
  <div style={{ marginBottom: "12px" }}>
    <label>Full Name / Business Name</label><br />
    <input
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      style={{ width: "100%", padding: "8px" }}
    />
  </div>

  <div style={{ marginBottom: "12px" }}>
  <label>WhatsApp Number</label><br />

  <input
    placeholder="8687123456"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    style={{
      width: "100%",
      padding: "10px",
      border: "1px solid #d1d5db",
      borderRadius: "8px"
    }}
  />

  <p
    style={{
      fontSize: "12px",
      color: "#6b7280",
      marginTop: "5px"
    }}
  >
    Example: 8687123456
  </p>
</div>

  {/* SERVICE */}
  <div style={{ marginBottom: "12px" }}>
    <label>Service Category</label><br />
    <input
      value={service}
      onChange={(e) => setService(e.target.value)}
      style={{ width: "100%", padding: "8px" }}
    />
  </div>

  {/* LOCATION */}
  <div style={{ marginBottom: "12px" }}>
    <label>Location</label><br />
    <input
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      style={{ width: "100%", padding: "8px" }}
    />
  </div>

  {/* ABOUT */}
  <div style={{ marginBottom: "12px" }}>
    <label>About Yourself</label><br />
    <textarea
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      style={{ width: "100%", padding: "8px" }}
    />
  </div>

  {/* PRICE */}
  <div style={{ marginBottom: "12px" }}>
    <label>Price / Rate</label><br />
    <input
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      style={{ width: "100%", padding: "8px" }}
    />
  </div>

  <button
    onClick={saveProfile}
    style={{
      marginTop: "10px",
      padding: "10px 15px",
      background: "green",
      color: "white",
      border: "none",
      borderRadius: "6px"
    }}
  >
    Save Profile
  </button>

</div>
<div
  style={{
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "350px",
    marginBottom: "20px",
    border: "1px solid #ddd"
  }}
>
  <h2>Profile Preview</h2>

  {avatar && (
  <img
    src={avatar}
    alt="profile"
    style={{
      width: "150px",
      height: "150px",
      objectFit: "cover",
      borderRadius: "10px",
      marginTop: "10px"
    }}
  />
)}
  
  <h3>{fullName || "Your Name / Business Name"}</h3>

  <p>🔧 {service || "Service Category"}</p>

  <p>📍 {location || "Location"}</p>

  <p>{bio || "Tell customers about yourself..."}</p>

  <p>
    💰 {price ? `$${price}` : "Price not set"}
  </p>
</div>
</>
)}
    {/* JOBS SECTION (MUST BE INSIDE RETURN) */}
    {tab === "jobs" && (
<>

<h2>Available Jobs</h2>

{jobs.length === 0 ? (
<p>No jobs available</p>
) : (

jobs.map((job) => (

<div
  key={job.id}
  style={{
    background: "#fff",
    borderRadius: "15px",
    overflow: "hidden",
    marginBottom: "20px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
    maxWidth: "500px"
  }}
>

  {job.flyer && (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      paddingTop: "15px"
    }}
  >
    <img
      src={job.flyer}
      alt="job"
      onClick={() => setSelectedImage(job.flyer)}
      style={{
        width: "120px",
        height: "120px",
        objectFit: "contain",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "0.3s"
      }}
    />
  </div>
)}

  <div style={{ padding: "15px" }}>

    <h3
      style={{
        margin: "0 0 10px 0",
        color: "#111827"
      }}
    >
      {job.title}
    </h3>
<span
style={{
background:
job.status==="open"
? "#dcfce7"
: "#fee2e2",

color:
job.status==="open"
? "#166534"
: "#991b1b",

padding:"5px 10px",
borderRadius:"20px",
fontSize:"12px",
fontWeight:"600"
}}
>
{job.status==="open"
? "🟢 Open"
: "🔴 Closed"}
</span>
    <p style={{ color:"#6b7280", margin:"5px 0" }}>
      📍 {job.location}
    </p>

    <p style={{ color:"#6b7280", margin:"5px 0" }}>
      💰 {job.budget}
    </p>

    <p
      style={{
        marginTop:"10px",
        color:"#4b5563"
      }}
    >
      {job.description}
    </p>
<textarea
  placeholder="Tell the customer why you're a good fit..."
  value={applicationMessage}
  onChange={(e) => setApplicationMessage(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px"
  }}
  />
    <button
      onClick={() => applyJob(job.id)}
      style={{
        marginTop:"15px",
        width:"100%",
        padding:"12px",
        background:"#2563eb",
        color:"white",
        border:"none",
        borderRadius:"8px",
        fontWeight:"bold",
        cursor:"pointer"
      }}
    >
      Apply
    </button>

  </div>
</div>

))
)}

</>
)}
{tab === "applications" && (
  <>
    <h2>My Applications</h2>

    {applications.length === 0 ? (
      <p>No applications yet</p>
    ) : (
      applications.map((app) => (
        <div
  key={app.id}
  style={{
    background: "white",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "15px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    maxWidth: "520px"
  }}
>
  {/* HEADER */}
  <div style={{ marginBottom: "10px" }}>
    <h3 style={{ margin: 0, fontSize: "18px", color: "#111827" }}>
      {app.job?.title || "Job Request"}
    </h3>
{isPro && (
  <span
    style={{
      display: "inline-block",
      marginLeft: "8px",
      padding: "3px 8px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: "700",
      background: "#f59e0b",
      color: "white"
    }}
  >
    ⭐ Featured Worker
  </span>
)}
    <span
      style={{
        display: "inline-block",
        marginTop: "6px",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
        background:
          app.status === "pending"
            ? "#fef3c7"
            : app.status === "accepted"
            ? "#dcfce7"
            : "#fee2e2",
        color:
          app.status === "pending"
            ? "#92400e"
            : app.status === "accepted"
            ? "#166534"
            : "#991b1b"
      }}
    >
      {app.status}
    </span>
  </div>

  {/* BODY */}
  <div style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.6" }}>
    <p style={{ margin: "6px 0" }}>
      📍 <strong>Location:</strong> {app.job?.location}
    </p>
<button
  onClick={() => reportJob(app.job)}
  style={{
    background: "#ef4444",
    color: "white",
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "8px"
  }}
>
  🚩 Report Job
</button>
    <p style={{ margin: "6px 0" }}>
      💰 <strong>Budget:</strong> {app.job?.budget}
    </p>

    <p style={{ margin: "10px 0", color: "#374151" }}>
      💬 {app.message || "No message provided"}
    </p>

    <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "10px" }}>
      Application ID: {app.id}
    </p>
  </div>
</div>
      ))
    )}
  </>
)}
   </div>
);

}