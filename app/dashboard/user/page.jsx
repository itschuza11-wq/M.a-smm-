"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UserDashboard() {
  const [amount, setAmount] = useState("");
  const [screenshot, setScreenshot] = useState("");

  const submitPayment = async () => {
    const { data } = await supabase.auth.getUser();
    const email = data?.user?.email;

    await supabase.from("orders").insert({
      email,
      amount,
      screenshot,
      status: "approved" // auto approve!
    });

    alert("Payment Approved Automatically ✔️");
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">Add Funds</h1>

      <input
        className="border p-3 w-full mt-4"
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        className="border p-3 w-full mt-4"
        placeholder="Screenshot URL (Upload on Imgur)"
        onChange={(e) => setScreenshot(e.target.value)}
      />

      <button
        onClick={submitPayment}
        className="mt-4 bg-green-600 text-white px-5 py-2 rounded"
      >
        Add Funds
      </button>
    </div>
  );
}
