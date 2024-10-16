import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const {login, error, isLoading}= useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault()

		await login(username, password)
	}

	return (  
		<div className="main-content">
			<form className="login" onSubmit={handleSubmit}>
				<h3>Login</h3>

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

				<button disabled={isLoading}>Log in</button>
				{error && <div className="error">{error}</div>}
			</form>
		</div>
	);
}
 
export default Login;
