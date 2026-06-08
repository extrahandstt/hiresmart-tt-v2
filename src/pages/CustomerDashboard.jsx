import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
const createNotification = async (user_id, title, message, type) => {
  await supabase.from("notifications").insert({
    user_id,
    title,
    message,
    type
  });
};

export default function CustomerDashboard() {
  const ADMIN_WHATSAPP = "18687326795";
  const navigate = useNavigate();
const logout = async () => {
  await supabase.auth.signOut();
  navigate("/");
};



const [plan, setPlan] = useState("free");
const [workerProfiles, setWorkerProfiles] = useState({});
const [editingId, setEditingId] = useState(null);
const [tab, setTab] = useState("dashboard");
const [applications,setApplications]=useState([]);
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [location, setLocation] = useState("");
const [budget, setBudget] = useState("");
const [jobs, setJobs] = useState([]);
const [service, setService] = useState("");
const [flyer, setFlyer] = useState(null);
const [uploading, setUploading] = useState(false);
const [notifications, setNotifications] = useState([]);
const [isJobPost, setIsJobPost] = useState(false);


const openAdminWhatsApp = (message) => {
  const url = `https://wa.me/${18687326795}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};


useEffect(() => {
  if (!jobs.length) return;
  loadApplications();
}, [jobs]);

useEffect(() => {
  const init = async () => {
    await loadJobs();
    await loadNotifications(); // 👈 ADD THIS
  };

  init();
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
        .eq("id", String(user.id))
        .single();

      if (!profile || profile.role !== "customer") {
        navigate("/");
      }
    };

    checkAccess();
  }, []);

const loadJobs = async () => {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  if (!user) return;

  const { data, error } = await supabase
  .from("jobs")
  .select("*")
  .eq("customer_id", user.id)
  .in("status", ["approved", "closed"]);

  if (error) {
    console.log("ERROR:", error);
    return;
  }

  setJobs(data || []);
};
const loadNotifications = async () => {
  const { data: auth } = await supabase.auth.getUser();

  const user = auth?.user;

  if (!user) return;

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  setNotifications(data || []);
};
const uploadFlyer = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setUploading(true);

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("flyers")
    .upload(fileName, file);

  if (error) {
    alert("Upload failed");
    setUploading(false);
    return;
  }

  const { data } = supabase.storage
    .from("flyers")
    .getPublicUrl(fileName);

  setFlyer(data.publicUrl);

  setUploading(false);
};
const saveJob = async () => {
    if (
  !title?.trim() ||
  !description?.trim() ||
  !location?.trim() ||
  !service?.trim()
) {
  alert(
    "Please complete all required fields:\n\n• Title\n• Description\n• Location\n• Service Needed"
  );

  return;
  
  if (!isJobPost && !editingId) {
  alert("Please confirm this is a job listing before posting.");
  return;
}
}
  const { data: auth } =
    await supabase.auth.getUser();

  const user = auth?.user;

  if (!user) {
    alert("User not found");
    return;
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

  if (profileError || !profile) {
    console.log(profileError);
    alert("Profile not found");
    return;
  }

  // Free plan limit ONLY for new posts
  if (
    !editingId &&
    profile.plan === "free" &&
    profile.monthly_post_count >= 5
  ) {
    alert(
      "Free posting limit reached. Upgrade to Pro."
    );

    navigate("/subscription");
    return;
  }

  let error;

  // UPDATE existing job
  if (editingId) {

    ({ error } = await supabase
      .from("jobs")
      .update({
        title,
        service,
        budget,
        location,
        description,
        flyer
      })
      .eq("id", editingId));

  } else {

    // CREATE new job
    ({ error } = await supabase
      .from("jobs")
      .insert({
        customer_id: user.id,
        title,
        service,
        budget,
        location,
        description,
        flyer,
        status: "pending",   // admin approval
state: "open"        // user control
      }));

    // Increase post count ONLY for new jobs
    await supabase
      .from("profiles")
      .update({
        monthly_post_count:
          (profile.monthly_post_count || 0) + 1
      })
      .eq("id", user.id);
  }

  if (error) {
    console.log("JOB ERROR:", error);
    alert(error.message);
    return;
  }

  alert(
    editingId
      ? "Job updated successfully"
      : "Job posted successfully"
  );
if (!editingId) {
  sendAdminWhatsAppAlert(title, location, service);
}
  loadJobs();

  // Reset form
  setTitle("");
  setService("");
  setBudget("");
  setLocation("");
  setDescription("");
  setFlyer(null);
  setEditingId(null);

  setTab("jobs");
};
const editJob = (job) => {
  setEditingId(job.id);

  setTitle(job.title);
  setService(job.service);
  setBudget(job.budget);
  setLocation(job.location);
  setDescription(job.description);
  setFlyer(job.flyer);

  setTab("dashboard");
};
const deleteJob = async (job) => {
  console.log("DELETE JOB:", job);

  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  if (!user) return;

  // SAFETY CHECK
  if (job.user_id && job.user_id !== user.id) {
    alert("Not allowed");
    return;
  }

  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job.id);

  if (error) {
    console.log("DELETE ERROR:", error);
    alert(error.message);
    return;
  }

  setJobs(prev => prev.filter(j => j.id !== job.id));

  alert("Job deleted");
};
const toggleJobStatus = async (job) => {
  const newStatus =
    job.status === "approved"
      ? "closed"
      : "approved";

  const { error } = await supabase
    .from("jobs")
    .update({ status: newStatus })
    .eq("id", job.id);

  if (error) {
    console.log(error);
    return;
  }

  loadJobs();
};
const loadApplications = async () => {
  const { data, error } = await supabase
    .from("job_applications")
    .select("*");

  if (error) {
    console.log("APP ERROR:", error);
    return;
  }

  // Workers
  const workerIds = [...new Set(
    data.map(a => a.worker_id)
  )];

  const { data: workers } = await supabase
  .from("worker_profiles")
  .select(`
    id,
    name,
    service,
    location,
    price,
    avatar,
    phone,
    is_pro
  `)
  .in("id", workerIds);

  const workerMap = {};

  workers?.forEach(w => {
    workerMap[w.id] = w;
  });


  // Jobs
  const jobIds = [...new Set(
    data.map(a => a.job_id)
  )];

  const { data: jobsData } = await supabase
    .from("jobs")
    .select("*")
    .in("id", jobIds);

  const jobMap = {};

  jobsData?.forEach(j => {
    jobMap[j.id] = j;
  });


  // Combine everything
  const enriched = data.map(app => ({
    ...app,
    worker: workerMap[app.worker_id] || null,
    job: jobMap[app.job_id] || null
  }));

  setApplications(enriched);
};
const hireWorker = async (app) => {
  const worker = app.worker;

  if (!worker?.phone) {
    alert("Worker has no WhatsApp number");
    return;
  }

  const { error } = await supabase
    .from("job_applications")
    .update({
      status: "contacted",
    })
    .eq("id", app.id);

  if (error) {
    console.log(error);
    return;
  }

  const cleanPhone = worker.phone.replace(/\D/g, "");

  const jobTitle = app.job?.title || "your application";

  const message = `Hi ${worker.name},

You were contacted regarding "${jobTitle}" through HireSmart TT.

Please reply to this message for more details.

Thank you,
HireSmart TT`;

  // ✅ FIXED: use correct IDs here
  await createNotification(
    worker.id,   // FIX #1
    "New Job Request",
    `You were contacted for "${jobTitle}"`, // FIX #2
    "hire"
  );

  window.open(
    `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );

  setApplications((prev) =>
    prev.map((item) =>
      item.id === app.id
        ? { ...item, status: "contacted" }
        : item
    )
  );
};
const sendAdminWhatsAppAlert = (title, location, service) => {
  const ADMIN_NUMBER = "18687326795";

  const message = `🚨 New Job Posted on HireSmart TT

📌 Title: ${title}
🔧 Service: ${service}
📍 Location: ${location}

Please review in the admin dashboard.`;

  const url = `https://wa.me/${ADMIN_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
};
const reportWorker = async (worker) => {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  if (!user) return;

  const reason = prompt("Why are you reporting this worker?");

  if (!reason) return;

  const { error } = await supabase
    .from("reports")
    .insert({
      reporter_id: user.id,
      reported_id: worker.id,
      type: "worker",
      target_type: "worker",
      reason,
      status: "pending"
    });

  if (error) {
    console.log(error);
    alert("Report failed");
    return;
  }

  alert("Worker reported. Admin will review it.");
};
  return (
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
    background: "#0f0f0f",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "15px",
    fontSize: "14px"
  }}
>
  Upgrade to Pro for unlimited access + featured listings ⭐
  <button
    onClick={() => navigate("/subscription")}
    style={{
      marginLeft: "10px",
      background: "#f59e0b",
      border: "none",
      padding: "5px 10px",
      borderRadius: "6px",
      cursor: "pointer",
      color: "white"
    }}
  >
    Upgrade
  </button>
</div>
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
    marginTop: "5px",
    fontSize: "20px",
    fontWeight: "600"
  }}
>
  Welcome Customer 👋
  
</p>
<p style={{ fontSize: "14px" }}>
  🔔 Notifications: {
    notifications.filter(n => !n.read).length
  }
</p>
    </div>

    <button
      onClick={logout}
      style={{
        background: "white",
        color: "#2563eb",
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

  <div
    style={{
      display: "flex",
      gap: "15px",
      marginTop: "20px"
    }}
  >
    <button
  onClick={() => setTab("dashboard")}
  style={{ padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer" }}
>
  🏠 Dashboard
</button>

<button
onClick={()=>setTab("applications")}
>
📋 Applications
</button>

<button
  onClick={() => setTab("jobs")}
  style={{ padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer" }}
>
  📢 My Jobs
</button>

  </div>
</div>
{/* 💳 SUBSCRIPTION / SUPPORT SECTION */}
<div
  style={{
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
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
marginTop:"10px",
padding:"10px",
borderRadius:"8px",
background:"#2563eb",
color:"white",
border:"none",
cursor:"pointer"
}}
>
Pay via WiPay
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
marginTop:"10px",
padding:"10px",
borderRadius:"8px",
background:"#10b981",
color:"white",
border:"none",
cursor:"pointer"
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
marginTop:"10px",
padding:"10px",
borderRadius:"8px",
background:"#111827",
color:"white",
border:"none",
cursor:"pointer"
}}
>
Pay via PayPal
</button>
{/* Featured Slot */}
<button
onClick={() =>
openAdminWhatsApp(
"Hi Admin, I want to purchase a Featured Slot Add-On ($20 for 7 days)."
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
  {tab === "dashboard" && (
  <div
    style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      maxWidth: "600px",
      marginBottom: "20px"
    }}
  >
    <h2>Post A Job</h2>
<div
  style={{
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "15px"
  }}
>
  <strong style={{ display: "block", marginBottom: "6px" }}>
    Job Posts Only
  </strong>

  <span style={{ color: "#9a3412", fontSize: "14px" }}>
    This section is strictly for persons posting job opportunities.  
    If you are offering a service (e.g. plumbing, cleaning, driving), please use the Workers section instead.  
    Service ads posted here may be removed.
  </span>
</div>
    <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  }}
>

{/* Job Title */}
<div>
  <label
    style={{
      display: "block",
      fontWeight: "600",
      marginBottom: "6px"
    }}
  >
    Job Title
  </label>

  <input
    value={title}
    onChange={(e)=>setTitle(e.target.value)}
    placeholder="Kitchen sink leaking urgently"
    style={{
      width:"100%",
      padding:"12px",
      borderRadius:"10px",
      border:"1px solid #d1d5db",
      fontSize:"14px"
    }}
  />

  <small
    style={{
      color:"#6b7280"
    }}
  >
    Short title describing what needs to be done
  </small>
</div>


{/* Service Needed */}
<div>
  <label
    style={{
      display:"block",
      fontWeight:"600",
      marginBottom:"6px"
    }}
  >
    Service Needed
  </label>

  <select
    value={service}
    onChange={(e)=>setService(e.target.value)}
    style={{
      width:"100%",
      padding:"12px",
      borderRadius:"10px",
      border:"1px solid #d1d5db",
      fontSize:"14px"
    }}
  >
    <option value="">Select worker category</option>
    <option>Plumber</option>
    <option>Cleaner</option>
    <option>Painter</option>
    <option>Landscaper</option>
    <option>Carpenter</option>
    <option>Labourer</option>
    <option>Electrician</option>
    <option>Mechanic</option>
    <option>Driver</option>
    <option>Delivery Services</option>
    <option>Event Helper</option>
    <option>Handyman</option>
    <option>Babysitter</option>
    <option>Personal Assistant</option>
    <option>Office Worker</option>


  </select>

  <small
    style={{
      color:"#6b7280"
    }}
  >
    Choose the type of worker needed
  </small>
</div>


{/* Budget + Location row */}
<div
  style={{
    display:"flex",
    gap:"15px"
  }}
>

<div style={{flex:1}}>
<label
style={{
display:"block",
fontWeight:"600",
marginBottom:"6px"
}}
>
Budget
</label>

<input
value={budget}
onChange={(e)=>setBudget(e.target.value)}
placeholder="$300"
style={{
width:"100%",
padding:"12px",
borderRadius:"10px",
border:"1px solid #d1d5db"
}}
/>
</div>


<div style={{flex:1}}>
<label
style={{
display:"block",
fontWeight:"600",
marginBottom:"6px"
}}
>
Location
</label>

<input
value={location}
onChange={(e)=>setLocation(e.target.value)}
placeholder="Arima, Trinidad"
style={{
width:"100%",
padding:"12px",
borderRadius:"10px",
border:"1px solid #d1d5db"
}}
/>
</div>

</div>


{/* Description */}
<div>
<label
style={{
display:"block",
fontWeight:"600",
marginBottom:"6px"
}}
>
Description
</label>

<textarea
value={description}
onChange={(e)=>setDescription(e.target.value)}
placeholder="Explain the job in detail. Example: Pipe leaking under kitchen sink and needs repair today if possible."
style={{
width:"100%",
height:"120px",
padding:"12px",
borderRadius:"10px",
border:"1px solid #d1d5db",
resize:"none"
}}
/>

<small
style={{
color:"#6b7280"
}}
>
Add details workers should know before applying
</small>
</div>

</div>
    
    <input type="file" accept="image/*" onChange={uploadFlyer} />

    {uploading && <p>Uploading...</p>}

    {flyer && (
      <img
        src={flyer}
        style={{ width: "150px", marginTop: "10px" }}
      />
    )}
<div style={{ marginTop: "15px" }}>
  <label style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
    <input
      type="checkbox"
      checked={isJobPost}
      onChange={(e) => setIsJobPost(e.target.checked)}
      style={{ marginTop: "3px" }}
    />

    <span style={{ fontSize: "14px", color: "#374151" }}>
      I confirm this is a <strong>job listing</strong> and not a service advertisement.
      I understand that service ads belong in the Workers section.
    </span>
  </label>
</div>

    <button
      onClick={saveJob}
      style={{
        width: "100%",
        padding: "14px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontWeight: "bold",
        marginTop: "15px"
      }}
    >
      {editingId
? "💾 Update Job"
: "📢 Post Job Request"}
    </button>
  </div>
)}

{tab === "jobs" && (
  <>
    <h2>My Jobs</h2>
    {jobs.length === 0 && (
  <p style={{ color: "#6b7280" }}>
    No jobs posted yet. Create your first job above.
  </p>
)}
<p style={{ color: "black" }}>
  Jobs loaded: {jobs.length}
</p>
    {jobs.map((job) => (
  <div
    key={job.id}
    style={{
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "15px",
      margin: "15px 0",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
    }}
  >
    <h3 style={{ marginBottom: "8px", color: "#111827" }}>
      {job.title}
    </h3>
<span
  style={{
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    background: "#e0e7ff",
    color: "#3730a3",
    display: "inline-block",
    marginBottom: "8px"
  }}
>
  {job.status}
</span>
    <p style={{ margin: "4px 0", color: "#4b5563" }}>
      📍 {job.location}
    </p>

    <p style={{ margin: "4px 0", color: "#4b5563" }}>
      💰 {job.budget}
    </p>

    <p style={{ marginTop: "10px", color: "#6b7280" }}>
      {job.description}
    </p>

<button
  onClick={() =>
    toggleJobStatus(
      job.id,
      job.status
    )
  }
  style={{
    marginTop:"10px",
    marginLeft:"10px",
    padding:"8px 12px",
    background:
      job.state === "open"
        ? "#f59e0b"
        : "#10b981",
    color:"white",
    border:"none",
    borderRadius:"6px",
    cursor:"pointer"
  }}
>
  {job.status === "approved"
  ? "Close Job"
  : "Reopen Job"}
</button>

<button
  onClick={() => editJob(job)}
  style={{
    marginTop:"10px",
    marginLeft:"10px",
    padding:"8px 12px",
    background:"#f59e0b",
    color:"white",
    border:"none",
    borderRadius:"6px",
    cursor:"pointer"
  }}
>
  Edit
</button>
    {job.flyer && (
  <img
    src={job.flyer}
    alt="flyer"
    style={{
      width: "100%",
      maxWidth: "200px",
      aspectRatio: "1 / 1",
      objectFit: "cover",
      borderRadius: "12px",
      marginTop: "10px",
      display: "block"
    }}
  />
)}
  </div>
))}
      </>
  )}
  {tab === "applications" && (
  <>
    <h2 style={{ marginBottom: "20px" }}>
      Applications
    </h2>

    {applications.length === 0 ? (
      <p style={{ color: "#6b7280" }}>
        No applications yet
      </p>
    ) : (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
          gap: "20px"
        }}
      >

        {applications.map((app) => {
  const worker = app.worker;
  if (!worker) {
    return (
      <div
        key={app.id}
        style={{
          background:"#fff",
          padding:"20px",
          borderRadius:"16px",
          textAlign:"center",
          color:"#6b7280"
        }}
      >
        Worker information unavailable
      </div>
    );
  }

  return (
    <div
      key={app.id}
      style={{
        background:"#fff",
        borderRadius:"22px",
        padding:"22px",
        border:"1px solid #eef2f7",
        boxShadow:"0 8px 24px rgba(0,0,0,0.06)"
      }}
    >
      
      {/* Worker Top */}

      <div
        style={{
          display:"flex",
          gap:"15px",
          alignItems:"center",
          marginBottom:"18px"
        }}
      >

        <img
          src={
            worker.avatar ||
            "https://placehold.co/100x100?text=👤"
          }
          alt="worker"
          style={{
            width:"75px",
            height:"75px",
            borderRadius:"50%",
            objectFit:"cover",
            border:"3px solid #f3f4f6"
          }}
        />

        <div style={{flex:1}}>

          <h3
            style={{
              margin:0,
              fontWeight:"700",
              color:"#111827"
            }}
          >
            {worker.name}
          </h3>
{worker.is_pro && (
  <span style={{
    marginLeft: "8px",
    padding: "3px 8px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
    background: "#f59e0b",
    color: "white"
  }}>
    ⭐ Featured Worker
  </span>
)}
          <p
            style={{
              margin:"5px 0",
              color:"#2563eb",
              fontWeight:"600"
            }}
          >
            🔧 {worker.service}
          </p>

          <p
            style={{
              margin:0,
              color:"#6b7280",
              fontSize:"13px"
            }}
          >
            📍 {worker.location}
          </p>
          
<p
  style={{
    margin:"6px 0 0 0",
    color:"#10b981",
    fontSize:"14px",
    fontWeight:"700"
  }}
>
  💰 ${worker.price || "Price not listed"}
</p>
        </div>

      </div>


      {/* Job Card */}

      <div
        style={{
          background:"#f9fafb",
          borderRadius:"14px",
          padding:"14px",
          marginBottom:"15px"
        }}
      >

        <div
          style={{
            display:"flex",
            justifyContent:"space-between"
          }}
        >

          <strong>
            {app.job?.title}
          </strong>

          <span
            style={{
              color:"#10b981",
              fontWeight:"700"
            }}
          >
            ${app.job?.budget}
          </span>

        </div>

        <p
          style={{
            marginTop:"8px",
            color:"#6b7280",
            fontSize:"13px"
          }}
        >
          📍 {app.job?.location}
        </p>

      </div>


      {/* Message */}

      <div
        style={{
          background:"#f3f4f6",
          padding:"12px",
          borderRadius:"12px"
        }}
      >

        <strong>
          Message
        </strong>

        <p
          style={{
            marginTop:"8px",
            color:"#4b5563"
          }}
        >
          {app.message || "No message"}
        </p>

      </div>


      {/* Bottom */}

      <div
        style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          marginTop:"20px"
        }}
      >

        <span
          style={{
            padding:"6px 14px",
            borderRadius:"30px",
            fontSize:"12px",
            fontWeight:"700",

            background:
              app.status==="pending"
              ? "#fef3c7"
              : app.status==="contacted"
              ? "#dbeafe"
              : "#dcfce7",

            color:
              app.status==="pending"
              ? "#92400e"
              : app.status==="contacted"
              ? "#1d4ed8"
              : "#166534"
          }}
        >
          {app.status.toUpperCase()}
        </span>

        {app.status === "pending" && (
  <button
    onClick={() => hireWorker(app)}
    style={{
      background:"#10b981",
      color:"white",
      padding:"12px 18px",
      border:"none",
      borderRadius:"10px",
      cursor:"pointer",
      fontWeight:"600"
    }}
  >
    Contact Worker
  </button>
  
)}
<button
  onClick={() => reportWorker(worker)}
  style={{
    background: "#dc2626",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px"
  }}
>
  🚩 Report Worker
</button>
              </div>

    </div>
  );
})}

      </div>
    )}
  </>
)}
</div>
);
}