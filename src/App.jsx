import React, { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import { supabase } from "./lib/supabaseClient";
import { payments } from "./lib/paymentMethods";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login"); // "login" | "dashboard" | "admin"

  useEffect(() => {
    // get session on load
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
        setView("dashboard");
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setView("dashboard");
      } else {
        setUser(null);
        setView("login");
      }
    });

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand" onClick={() => (user ? setView("dashboard") : setView("login"))}>M.A SMM</div>
        <div className="top-actions">
          <a className="wa-link" href={payments.whatsappLink} target="_blank" rel="noreferrer">WhatsApp</a>
          {user ? (
            <>
              <button onClick={() => { supabase.auth.signOut(); }}>Logout</button>
              {user.email === "itsmujahid.pk@gmail.com" && <button onClick={() => setView("admin")}>Admin</button>}
            </>
          ) : null}
        </div>
      </header>

      <main className="container">
        {view === "login" && <LoginPage onLogin={() => setView("dashboard")} />}
        {view === "dashboard" && <Dashboard user={user} />}
        {view === "admin" && <AdminPage />}
      </main>

      {/* WhatsApp floating button */}
      <a className="wa-floating" href={payments.whatsappLink} target="_blank" rel="noreferrer">📱</a>
    </div>
  );
        }
