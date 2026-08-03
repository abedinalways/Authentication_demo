"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, isAuthenticated, isFetchingUser, logout } = useAuth();

  const handleLogout = () => void logout();

  if (!isAuthenticated) {
    return null; // middleware will redirect
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <div className="brand">🔐 Auth Demo</div>
        <div className="user-chip">
          <div className="avatar">{(user?.name ?? "?").charAt(0)}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.name ?? "…"}</div>
            <div style={{ color: "var(--text-dim)", fontSize: 12 }}>
              {user?.email} · {user?.role}
            </div>
          </div>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <div className="grid">
        <div className="card">
          <h2>Welcome</h2>
          <div className="value">
            {isFetchingUser ? "Loading…" : `Hello, ${user?.name ?? "there"}!`}
          </div>
          <p className="sub">
            You are authenticated. This is a protected page — only visible when
            you have a valid session.
          </p>
        </div>

        <div className="card">
          <h2>Your profile</h2>
          <div className="token-panel">
            <div>id    = {user?.id ?? "—"}</div>
            <div>name  = {user?.name ?? "—"}</div>
            <div>email = {user?.email ?? "—"}</div>
            <div>role  = {user?.role ?? "—"}</div>
          </div>
        </div>
      </div>
    </main>
  );
}