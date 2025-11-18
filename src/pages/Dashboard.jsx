import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { payments } from "../lib/paymentMethods";

export default function Dashboard({ user }) {
  const [orders, setOrders] = useState([]);
  const [service, setService] = useState("Instagram Likes");
  const [quantity, setQuantity] = useState(100);
  const [screenshot, setScreenshot] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  async function fetchOrders() {
    if (!user) return;
    const { data, error } = await supabase.from("orders").select("*").eq("user_email", user.email).order("created_at", { ascending: false });
    if (error) { console.error(error); return; }
    setOrders(data || []);
  }

  async function placeOrder() {
    if (!user) return alert("Please login first");
    if (!screenshot) return alert("Upload payment screenshot for manual payment verification");
    // store image in Supabase storage or as base64 url — here simple approach: store metadata, not file
    const { error } = await supabase.from("orders").insert([{
      user_email: user.email,
      service,
      quantity,
      payment_method: "JazzCash/Easypaisa",
      payment_screenshot: screenshot,
      status: "pending",
      created_at: new Date().toISOString()
    }]);
    if (error) return alert("Order failed: " + error.message);
    alert("Order placed. Admin will verify payment.");
    setScreenshot(null);
    fetchOrders();
  }

  return (
    <div>
      <h2>Welcome, {user?.email}</h2>

      <div className="card">
        <h3>Place New Order</h3>
        <select value={service} onChange={e=>setService(e.target.value)}>
          <option>Instagram Likes</option>
          <option>Instagram Views</option>
          <option>TikTok Views</option>
          <option>YouTube Subscribers</option>
          <option>Followers</option>
        </select>

        <input type="number" value={quantity} onChange={e=>setQuantity(Number(e.target.value))} />
        <p>Send payment to:</p>
        <ul>
          <li>JazzCash: {payments.jazzCash}</li>
          <li>Easypaisa: {payments.easypaisa}</li>
        </ul>

        <label className="upload">
          Upload payment screenshot
          <input type="file" accept="image/*" onChange={e=> {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = ()=> setScreenshot(reader.result);
            reader.readAsDataURL(file);
          }} />
        </label>

        <button className="btn primary" onClick={placeOrder}>Place Order</button>
      </div>

      <div className="card">
        <h3>Your Orders</h3>
        {orders.length === 0 ? <p>No orders yet.</p> : (
          <table className="orders-table">
            <thead><tr><th>Id</th><th>Service</th><th>Qty</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.service}</td>
                  <td>{o.quantity}</td>
                  <td>{o.status}</td>
                  <td>{new Date(o.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
          }
