import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);
    alert("Sign-up successful. Please login.");
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    alert("Login successful");
    onLogin?.();
  };

  return (
    <div className="card auth-card">
      <h2>M.A SMM</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      <div className="row">
        <button onClick={handleLogin} className="btn primary">Login</button>
        <button onClick={handleSignUp} className="btn">Sign-up</button>
      </div>
      <p className="muted">Payments: JazzCash { /* number shown below */ }</p>
    </div>
  );
}
