import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate("/chat");
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
            <p className="auth-kicker">AI Tutor</p>
            <h1>Welcome back to guided learning.</h1>
            <p>
              Continue building understanding through hints, questions, and
              feedback that helps you think through the problem.
            </p>
          </div>
          <div className="auth-proof">
            <span>Hints before answers</span>
            <span>Progress saved</span>
            <span>Practice smarter</span>
          </div>
        </section>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-heading">
            <p>Log in</p>
            <h2>Enter your workspace</h2>
          </div>
          {error && <p className="error">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
          <p>
            No account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
