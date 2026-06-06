import { useNavigate } from "react-router-dom";

export default function SubscriptionPage() {
  const navigate = useNavigate();

  const ADMIN_WHATSAPP = "18687326795"; // 👈 change this

  const openAdminWhatsApp = (message) => {
    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const cardStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    flex: 1,
    minWidth: "280px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  };

  return (
    <div style={{ padding: "30px" }}>

      {/* 🔵 HEADER (TOP SECTION) */}
      <div style={{ marginBottom: "25px" }}>
        <h1>Choose Your Plan</h1>
        <p style={{ color: "#6b7280" }}>
          Simple pricing for workers and customers
        </p>
      </div>

      {/* 💳 PLAN CONTAINER (EXACT PLACE FOR CARDS) */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap"
        }}
      >

        {/* 🆓 FREE PLAN (LEFT CARD) */}
        <div style={cardStyle}>
          <h2>Free Plan</h2>
          <h3>$0 / month</h3>

          <hr />

          <h4>Workers</h4>
          <ul>
            <li>Limited job applications</li>
            <li>Basic profile visibility</li>
          </ul>

          <h4>Customers</h4>
          <ul>
            <li>Limited job posting</li>
            <li>Standard listing</li>
          </ul>

          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer"
            }}
          >
            Continue Free
          </button>
        </div>

        {/* 💎 PRO PLAN (RIGHT CARD) */}
        <div style={cardStyle}>
          <h2>Pro Plan ⭐</h2>
          <h3>$100 / month</h3>


          <hr />

          <h4>Workers</h4>
<ul>
  <li>Unlimited job applications</li>
  <li>⭐ Featured badge</li>
  <li>Priority placement in customer application view</li>
  <li>Photo gallery for past work</li>
  <li>⭐ Early access to new jobs (10 min head start)</li>
  <li>Higher visibility in job listings</li>
</ul>

<h4>Customers</h4>
<ul>
  <li>Unlimited job posting</li>
  <li>⭐ Top priority listings</li>
  <li>Saved worker lists</li>
  <li>Post worker reviews</li>
</ul>

          {/* 💬 PAYMENT BUTTONS (EXACT PLACE) */}
          <button
  onClick={async () => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) {
      alert("Please login");
      return;
    }

    await supabase.from("subscription_requests").insert({
      user_id: user.id,
      plan: "pro",
      payment_method: "WiPay (Card)"
    });

    openAdminWhatsApp(
      "Hi Admin, I want to subscribe to PRO plan via WiPay (Card Payment)."
    );
  }}
  style={{
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer"
  }}
>
  Pay by Card (WiPay)
</button>

          <button
  onClick={async () => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) {
      alert("Please login");
      return;
    }

    await supabase.from("subscription_requests").insert({
      user_id: user.id,
      plan: "pro",
      payment_method: "Bank Transfer"
    });

    openAdminWhatsApp(
      "Hi Admin, I want to subscribe to PRO plan via Bank Transfer."
    );
  }}
  style={{
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    background: "#10b981",
    color: "white",
    border: "none",
    cursor: "pointer"
  }}
>
  Bank Transfer
</button>
          <button
  onClick={() => {
    window.open("https://paypal.me/HireSmartTT", "_blank");
  }}
  style={{
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    border: "none",
    cursor: "pointer"
  }}
>
  Pay via PayPal
</button>
<div style={cardStyle}>

<div style={cardStyle}>

<h2>🚀 Featured Slot Add-On</h2>

<h3>$20 / 7 Days</h3>

<hr />

<p
style={{
color:"#6b7280",
marginBottom:"15px"
}}
>
Need extra visibility? Promote yourself or your job for 7 days.
Works for Free and Pro users.
</p>

<h4>Workers</h4>
<ul>
<li>Temporary featured placement</li>
<li>More profile exposure</li>
<li>Increase visibility for 7 days</li>
</ul>

<h4>Customers</h4>
<ul>
<li>Temporary top placement</li>
<li>More worker exposure</li>
<li>Higher visibility for 7 days</li>
</ul>

<button
onClick={() =>
openAdminWhatsApp(
"Hi Admin, I want to purchase a Featured Slot Add-On ($20 for 7 days)."
)
}
style={{
marginTop:"10px",
width:"100%",
padding:"10px",
background:"#f59e0b",
color:"white",
border:"none",
borderRadius:"8px",
cursor:"pointer",
fontWeight:"bold"
}}
>
Buy Featured Slot
</button>

</div>
</div>
          <button
            onClick={() =>
              openAdminWhatsApp("Hi Admin, I need help with subscription.")
            }
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              background: "#25D366",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            💬 Contact Admin
          </button>
        </div>

      </div>

      {/* 📌 FOOTER INFO (BOTTOM SECTION) */}
      <div style={{ marginTop: "30px", color: "#6b7280" }}>
        All payments are manually verified. Upgrade happens within 24 hours.
      </div>

    </div>
  );
}