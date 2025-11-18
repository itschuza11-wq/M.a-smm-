import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);

  useEffect(()=>{ fetchOrders(); }, []);

  async function fetchOrders() {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) return console.error(error);
    setOrders(data || []);
  }

  async function updateStatus(id, status) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return alert(error.message);
    fetchOrders();
  }

  return (
    <div>
      <h2>Admin — Orders</h2>
      <div className="card">
        <table className="orders-table">
          <thead><tr><th>ID</th><th>User</th><th>Service</th><th>Qty</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.user_email}</td>
                <td>{o.service}</td>
                <td>{o.quantity}</td>
                <td>{o.status}</td>
                <td>
                  <button onClick={()=>updateStatus(o.id,"processing")} className="btn">Processing</button>
                  <button onClick={()=>updateStatus(o.id,"completed")} className="btn primary">Complete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
      }
      
