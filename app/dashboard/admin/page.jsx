"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: session } = await supabase.auth.getUser();
      if (!session?.user) {
        window.location.href = "/login";
        return;
      }

      // Check admin role
      if (session.user.email !== "its.mujahid47@gmail.com") {
        window.location.href = "/dashboard/user";
        return;
      }

      setUser(session.user);

      // Load orders
      const { data } = await supabase.from("orders").select("*").order("id", { ascending: false });
      setOrders(data || []);
      setLoading(false);
    }

    loadData();
  }, []);

  const updateStatus = async (id, status) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    alert("Order updated!");
    location.reload();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Admin Dashboard</h1>
      <h3 className="text-xl mb-3">Welcome, Admin ({user.email})</h3>

      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
            <th>User Email</th>
            <th>Service</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Approve</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b">
              <td>{o.id}</td>
              <td>{o.email}</td>
              <td>{o.service}</td>
              <td>{o.amount}</td>
              <td>{o.status}</td>
              <td>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                  onClick={() => updateStatus(o.id, "approved")}
                >
                  Approve
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => updateStatus(o.id, "rejected")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
              }
