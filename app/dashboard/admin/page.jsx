"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  const adminEmail = "its.mujahid47@gmail.com"; // Your admin email

  // Fetch Orders
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setOrders(data);
    }
  };

  // Check admin login
  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== adminEmail) {
      window.location.href = "/login";
    } else {
      fetchOrders();
    }
  };

  // Change Order Status
  const updateStatus = async (id, status) => {
    await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    fetchOrders();
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600">All customer orders:</p>

      <table className="w-full mt-6 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Customer Email</th>
            <th className="p-3 border">Service</th>
            <th className="p-3 border">Qty</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border">
              <td className="p-3 border">{o.id}</td>
              <td className="p-3 border">{o.customer_email}</td>
              <td className="p-3 border">{o.service}</td>
              <td className="p-3 border">{o.quantity}</td>
              <td className="p-3 border">{o.status}</td>

              <td className="p-3 border">
                <button
                  onClick={() => updateStatus(o.id, "completed")}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Mark Completed
                </button>

                <button
                  onClick={() => updateStatus(o.id, "rejected")}
                  className="ml-2 px-3 py-1 bg-red-600 text-white rounded"
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
