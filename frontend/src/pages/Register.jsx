import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please complete every field.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setSuccess("Account created. Taking you to sign in...");
      setTimeout(() => {
        navigate("/");
      }, 1600);
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message || "Registration failed. Please try again."
      );
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
          <h1>Start with a clean board and a clearer day.</h1>
          <p>
            Create your workspace, capture what matters, and move tasks from
            pending to complete with less visual clutter.
          </p>
        </div>

        <ul className="auth-benefits" aria-label="TaskFlow benefits">
          <li>Fast setup</li>
          <li>Readable lists</li>
          <li>Progress view</li>
        </ul>
      </section>

      <main className="auth-card">
        <div className="auth-card-header">
          <span className="section-label">Get started</span>
          <h1>Create account</h1>
          <p className="subtitle">Set up your task dashboard.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="register-name">Full name</label>
            <input
              id="register-name"
              type="text"
              className="form-control"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
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
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              className="form-control"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-confirm-password">Confirm password</label>
            <input
              id="register-confirm-password"
              type="password"
              className="form-control"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/">Sign in</Link>
        </div>
      </main>
    </div>
  );
}

export default Register;
