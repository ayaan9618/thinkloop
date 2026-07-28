import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // If email confirmation is on, there's no session yet
    if (data.session) {
      navigate("/chat");
    } else {
      setMessage("Check your email to confirm your account, then log in.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-story">
          <Link to="/" className="auth-brand">
            <img src="/logo.jpg" alt="" className="auth-logo" />
            <span>ThinkLoop</span>
          </Link>
          <div>
            <p className="auth-kicker">Start free</p>
            <h1>Learn by thinking, not by copying.</h1>
            <p>
              Create your account and study with an AI tutor that asks better
              questions, gives progressive hints, and helps ideas stick.
            </p>
          </div>
          <div className="auth-proof">
            <span>Guided tutoring</span>
            <span>Code debugging</span>
            <span>Exam practice</span>
          </div>
        </section>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-heading">
            <p>Create account</p>
            <h2>Start Learning Free</h2>
          </div>
          {error && <p className="error">{error}</p>}
          {message && <p className="info">{message}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (8+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
