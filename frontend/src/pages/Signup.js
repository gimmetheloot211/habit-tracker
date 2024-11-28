import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(username, password);
  };

  return (
    <div className="main-content">
      <form className="signup" onSubmit={handleSubmit}>
        <h3>Sign up</h3>

        <label>Username:</label>
        <input
          type="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <label>Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button disabled={isLoading}>Sign up</button>
        {error && <div className="error">{error}</div>}
        {isLoading && (
          <div className="userInitialization">
            Initializing user, this might take a few moments...
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;
