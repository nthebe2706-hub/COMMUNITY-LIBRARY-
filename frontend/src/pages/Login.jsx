
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api.js";

export default function Login({ onLogin, currentUser }) {
  const [mode, setMode] = useState("login");

  const [membershipId, setMembershipId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (mode === "register") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const data = await api("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name,
            membershipId,
            password
          })
        });

        onLogin(data);
        setMessage("Your member account was created successfully.");
      } else {
        const data = await api("/auth/login", {
          method: "POST",
          body: JSON.stringify({ membershipId, password })
        });

        onLogin(data);
      }

      navigate("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-layout">
      <section className="login-intro">
        <span className="eyebrow">MEMBER ACCESS</span>

        <h2>
          {mode === "login" ? "Welcome back" : "Join our library"}
        </h2>

        <p>
          {mode === "login"
            ? "Sign in to your community library account."
            : "Create your own community library member account."}
        </p>

        <div className="login-feature">
          <span className="feature-check">✓</span>
          <div>
            <b>Book management</b>
            <small>View available library books</small>
          </div>
        </div>

        <div className="login-feature">
          <span className="feature-check">✓</span>
          <div>
            <b>Member records</b>
            <small>Keep your library account organised</small>
          </div>
        </div>

        <div className="login-feature">
          <span className="feature-check">✓</span>
          <div>
            <b>Secure accounts</b>
            <small>Your password is protected using bcrypt hashing</small>
          </div>
        </div>
      </section>

      <section className="panel login-panel">
        <div className="panel-heading">
          <div>
            <h3>{mode === "login" ? "Sign in" : "Create account"}</h3>
            <p>
              {mode === "login"
                ? "Enter your membership ID and password."
                : "Complete the details below to register."}
            </p>
          </div>
        </div>

        {currentUser && (
          <p className="success-message">
            Already signed in as {currentUser.name}.
          </p>
        )}

        <form className="form-stack" onSubmit={submit}>
          {mode === "register" && (
            <label>
              Full name
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </label>
          )}

          <label>
            Membership ID
            <input
              value={membershipId}
              onChange={e => setMembershipId(e.target.value)}
              required
              autoComplete="username"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>

          {mode === "register" && (
            <label>
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>
          )}

          {error && (
            <p className="form-message" role="alert">{error}</p>
          )}

          {message && (
            <p className="success-message" role="status">{message}</p>
          )}

          <button
            className="button button-primary button-wide"
            type="submit"
            disabled={busy || Boolean(currentUser)}
          >
            {busy
              ? "Please wait…"
              : mode === "login"
                ? "Sign in"
                : "Create member account"}
          </button>
        </form>

        <p className="login-help">
          {mode === "login" ? (
            <>
              New member?{" "}
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setMessage("");
                }}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setMessage("");
                }}
              >
                Sign in
              </button>
            </>
          )}
        </p>

        <p className="login-help">
          First time administrator setup?{" "}
          <Link to="/users">Create the first administrator account</Link>.
        </p>
      </section>
    </div>
  );
}
