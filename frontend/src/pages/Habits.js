import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const Habits = () => {
	const { user } = useAuthContext();
  const [habits, setHabits] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [habitToCreate, setHabitToCreate] = useState("");

	const handleClick = async (id) => {
		try {
			const response = await fetch(`http://localhost:4000/api/habits/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			});

			const json = await response.json();
			if (response.ok) {
				setHabits(prevHabits => prevHabits.filter(habit => habit._id !== id));
    	} else {
      	setError(json.error);
			}
		} catch (err) {
			setError("Failed to delete habit")
		}
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		const body = JSON.stringify({ activity: habitToCreate});

		try {
			const response = await fetch('http://localhost:4000/api/habits', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.token}`
				},
				body
			});

			const json = await response.json();
			if (response.ok) {
				setHabits(prevHabits => [...prevHabits, json]);
				setError("");
				setHabitToCreate('');
			} else {
				setError(json.error);
			}

		} catch (err) {
			setIsLoading(false);
			setError("Failed to fetch habits");
		}
	}
	useEffect(() => {
		const fetchHabits = async () => {
			try {
			const response = await fetch('http://localhost:4000/api/habits', {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			});
			const json = await response.json();
			if (response.ok) {
				setIsLoading(false);
				setHabits(json);
			} else {
				setIsLoading(false);
				setError(json.error);
			}

		} catch (err) {
			setIsLoading(false);
      setError("Failed to fetch weeks");
		}
		}

		if (user) {
			fetchHabits()
		}
	}, [user])

	if (isLoading) {
		return (
				<div className="loading">Loading...</div>
		)
	}

  return (
		<div className="main-content">
			<div className="habits">
				{habits?.map(habit => {
					const hours = Math.floor(habit.totalMinutesDone / 60);
					const minutes = habit.totalMinutesDone % 60;

					return (
						<div className="habitDetails" key={habit._id}>
							<h4>{habit.activity}</h4>
							<p>Total time: {`${hours} hours and ${minutes} minutes`}</p>
							<span className="material-symbols-outlined" onClick={(e) => handleClick(habit._id)}>delete</span>
						</div>
					)
				})}
			</div>

				<div className="habitCreation">
					<form onSubmit={handleSubmit}>
						<label>Create a new habit:</label>
						<input 
							type="text"
							onChange={(e) => setHabitToCreate(e.target.value)}
							value={habitToCreate}
						/>
						<button>Create</button>
					</form>
					{error && <p className="error-message">{error}</p>}
				</div>
		</div> 
	);
}
 
export default Habits;
