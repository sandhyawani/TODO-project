import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-showcase">
        <div className="brand-lockup">
          <span className="brand-mark">TF</span>
          <div>
            <div className="brand-title">TaskFlow</div>
            <div className="brand-subtitle">Daily tasks, neatly handled</div>
          </div>
        </div>

        <div>
          <h1>Plan the day without fighting the interface.</h1>
          <p>
            A calmer workspace for adding tasks, checking progress, and keeping
            pending work easy to scan.
          </p>
        </div>

        <ul className="auth-benefits" aria-label="TaskFlow benefits">
          <li>Quick capture</li>
          <li>Clear status</li>
          <li>Simple focus</li>
        </ul>
      </section>

      <main className="auth-card">
        <div className="auth-card-header">
          <span className="section-label">Welcome back</span>
          <h1>Sign in</h1>
          <p className="subtitle">Open your task dashboard.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-link">
          New to TaskFlow? <Link to="/register">Create an account</Link>
        </div>
      </main>
    </div>
  );
}

export default Login;
