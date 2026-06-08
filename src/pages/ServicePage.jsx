import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ServicePage() {
  const { type } = useParams();
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    loadWorkers();
  }, [type]);

useEffect(() => {
  document.title = `${type} Services in Trinidad & Tobago | HireSmart TT`;
}, [type]);

  const loadWorkers = async () => {
    const { data, error } = await supabase
      .from("worker_profiles")
      .select("*")
      .eq("service", type.toLowerCase());

    if (error) {
      console.log(error);
      return;
    }

    setWorkers(data || []);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>
  {type.charAt(0).toUpperCase() + type.slice(1)} Services in Trinidad & Tobago
</h1>
<p>
  Find trusted {type} professionals in Trinidad & Tobago. Hire verified workers fast through HireSmart TT.
</p>
<div style={{ marginTop: "20px" }}>
  <h3>Explore other services</h3>

  <a href="/services/plumber" style={{ marginRight: "10px" }}>
    Plumbers
  </a>

  <a href="/services/cleaner" style={{ marginRight: "10px" }}>
    Cleaners
  </a>

  <a href="/services/electrician">
    Electricians
  </a>
</div>
      {workers.length === 0 ? (
        <p>No workers found for this service.</p>
      ) : (
        workers.map((w) => (
          <div key={w.id} style={{
            background: "white",
            padding: "15px",
            margin: "10px 0",
            borderRadius: "10px"
          }}>
            <h3>{w.name}</h3>
            <p>{w.location}</p>
            <p>${w.price}</p>
          </div>
                  ))
      )}
      
    </div>
  );
}