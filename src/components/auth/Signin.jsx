import { useState, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../services";
import { AuthContext } from "../../context/AuthContext";
import Button from "../ui/Button";
import styles from "./Signin.module.css";

function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const inputs = useMemo(
    () => [
      {
        name: "email",
        label: "Email address",
        type: "email",
        placeholder: "you@example.com",
        autoComplete: "email",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        autoComplete: "current-password",
      },
    ],
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const applySession = (token) => {
    localStorage.setItem("token", token);
    const baseUser = (() => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return { id: payload.sub, email: payload.email };
      } catch (err) {
        return {};
      }
    })();
    login({ ...baseUser, token });
    navigate("/app/course", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { token } = await authApi.login(form.email, form.password);
      if (!token) throw new Error("No token received from server");
      applySession(token);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.brandPane}>
        <p className={styles.kicker}>Learnit</p>
        <h1>Welcome back</h1>
        <p className={styles.copy}>
          Pick up where you left off with a focused workspace for learning.
        </p>
      </div>

      <div className={styles.cardPane}>
        <div className={styles.card}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Sign in</p>
              <h2>Access your workspace</h2>
              <p className={styles.subhead}>
                Use your email and password to continue.
              </p>
            </div>
            <Link to="/auth/register" className={styles.inlineLink}>
              Need an account?
            </Link>
          </header>

          {error && (
            <div className={styles.error} role="alert" aria-live="polite">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {inputs.map((field) => (
              <label key={field.name} className={styles.field}>
                <span>{field.label}</span>
                <input
                  {...field}
                  value={form[field.name]}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  autoFocus={field.name === "email"}
                />
              </label>
            ))}

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className={styles.footerText}>
            New here? <Link to="/auth/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
