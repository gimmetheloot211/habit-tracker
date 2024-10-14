import { useAuthContext } from "../hooks/useAuthContext";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

const WeekDetails = () => {
	const { user } = useAuthContext();
	const [ week, setWeek ] = useState(null);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ error, setError ] = useState("");
	const { weekID } = useParams();

	const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

	const validateTime = (value) => {
		if (typeof value !== 'string' || value.split(':').length !== 2) {
			setError("Invalid time format. Please enter in hh:mm format (e.g. 7:00)");
			return false;
		};

		const [hours, minutes] = value.split(':').map(Number);
		const minutesString = value.split(':')[1];

		if (isNaN(hours) || isNaN(minutes) || minutesString.length !== 2) {
			setError("Invalid time format. Please enter in hh:mm format (e.g. 7:00)");
			return false;
		}

		if (!((hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) || (hours === 24 && minutes === 0))) {
			setError("Invalid time. Please enter a valid time between 00:00 and 24:00.");
			return false;
		}

		setError("");
		return true;
	}

	const formatTime = (minutes) => {
		const isNegative = minutes < 0;
		const hrs = Math.floor(Math.abs(minutes) / 60);
		const mins = Math.abs(minutes) % 60;

		return `${isNegative ? '-' : ''}${hrs}:${mins.toString().padStart(2, '0')}`
	}

	const parseTime = (timeString) => {
		if (typeof timeString !== 'string') return 0;
		const [hrs, mins] = timeString.split(':').map(num => parseInt(num, 10));
		return (isNaN(hrs) ? 0 : hrs) * 60 + (isNaN(mins) ? 0 : mins);
	}

	const getImba = (imba, goal) => {

		const imbaPercentage = (100 / goal) * imba;
		const absImbaPercentage = Math.abs(imbaPercentage);

		let imbaClass = '';

		if (imbaPercentage > 0) {
			for (let i = 90; i >= 10; i -= 10) {
				if (absImbaPercentage >= i) {
					imbaClass = `imbalance-positive-${i}`;
					break;
				}
			}
		} else if (imbaPercentage < 0) {
			for (let i = 90; i >= 10; i -= 10) {
				if (absImbaPercentage >= i) {
					imbaClass = `imbalance-negative-${i}`;
					break;
				}
			}
		}

		return imbaClass;
	}

	const handleChange = async (habitID, weekObjectID, field, value, day) => {
		validateTime(value);

		let updatedDays;
		let minutesGoalWeek;

		if (field === "daily") {
			const minutes = parseTime(value);
			updatedDays = {
				[day]: { minutesDoneToday: minutes },
			};
		} else if (field === "minutesGoalWeek") {
			minutesGoalWeek = parseTime(value);
		}

		try {
			setError("");
			const response = await fetch('http://localhost:4000/api/weeks/', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.token}`,
				},
				body: JSON.stringify({
					habitID,
					weekObjectID,
					updatedDays,
					minutesGoalWeek,
				}),
			});

			const json = await response.json();

			if (!response.ok) {
				setError(json.error);
			} else {
				setError("");
				setWeek(json);
			}

		} catch (err) {
			console.log(err);
			setError("Failed to update data. Please try again.");
		}
	}

	const toggleDone = async () => {
		try {
			const updatedDone = !week.done;

			const response = await fetch(`http://localhost:4000/api/weeks/id`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.token}`
				},
				body: JSON.stringify({
					updatedDone,
					_id: week._id
				})
			});

			const json = await response.json();

			if (response.ok) {
				setError("");
				setWeek(json);
			} else {
				setError(json.error);
			}
		} catch (err) {
			setError("Failed to update week status.");
		}
	}

	useEffect(() => {
		const fetchWeek = async () => {
			try {
				const response = await fetch(`http://localhost:4000/api/weeks/id/${weekID}`, {
								headers: { Authorization: `Bearer ${user.token}` }
				});
				const json = await response.json();
				if (response.ok) {
					setIsLoading(false);
					setWeek(json);
				} else {
					setIsLoading(false);
					setError(json.error);
				}
			} catch (err) {
				setIsLoading(false);
				setError("Failed to fetch week data");
			}
		};
		if (user && weekID) {
			fetchWeek();
		}
	}, [user, weekID]);

	if (isLoading) {
		return <div className="loading">Loading...</div>;
	}

	return (  
		<div className="main-content">
			<div className="table-container">
				<table className="week-table">
					<thead>
					<tr>
						<th className="useless"></th> 
						<th className="useless"></th>  
						<th className="useless"></th>  
						{days.map((day) => (
							<th key={`${day}-date`} className="date">
								{week?.days[day] ? new Date(week.days[day]).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }) : ''}
							</th>
						))}
						<th className="useless"></th>   
						<th className="useless"></th>  
					</tr>

					<tr>
						<th>Habits</th>
						<th>Weekly Goal</th>
						<th>Daily Goal</th>
						{days.map(day => (
							<th key={day}>{day}</th>
						))}
						<th>Imbalance</th>
						<th>Total</th>
  				</tr>
					</thead>
					<tbody>
						{week?.habits?.length > 0 && week.habits.map((habit) => {
							const weeklyData = week.weekData.find(data => data.habitID.toString() === habit._id.toString());

							return (
							<tr key={habit._id}>
								<td>{habit.activity}</td>
								<td>
									{!week.done &&
									<input
										type="text"
										pattern="\d{1,2}:\d{2}"
										defaultValue={weeklyData ? formatTime(weeklyData.minutesGoalWeek) : ''}
										onBlur={(e) => {
											const value = e.target.value.trim();
											handleChange(habit._id, week._id, "minutesGoalWeek", value);
										}}
									/>}
									{week.done && <span>{weeklyData ? formatTime(weeklyData.minutesGoalWeek) : ''}</span>}
								</td>
								<td>{weeklyData ? formatTime(weeklyData.dailyGoal) : ''}</td>
								{days.map(day => (
									<td className={getImba(weeklyData?.days[day].dailyImbalance, weeklyData?.dailyGoal)} key={day}>
										{!week.done &&
										<input
											type="text"
											pattern="\d{1,2}:\d{2}"
											min="0"
											max="24"
											defaultValue={weeklyData ? formatTime(weeklyData.days[day]?.minutesDoneToday) : ''}
											onBlur={(e) => {
												const value = e.target.value.trim();
												if (validateTime(value)) {
													handleChange(habit._id, week._id, "daily", value, day)
												}
											}}
										/>
										}
										{week.done && <span>{weeklyData ? formatTime(weeklyData.days[day]?.minutesDoneToday) : ''}</span>}
									</td>
								))}
								<td className={weeklyData ? getImba(weeklyData.weeklyImbalance, weeklyData.minutesGoalWeek) : ''}>
									{weeklyData ? formatTime(weeklyData.weeklyImbalance) : ''}</td>
								<td>{weeklyData ? formatTime(weeklyData.minutesDoneWeek) : ''}</td>
							</tr>
							)
						})}
					</tbody>
				</table>
				<br/>
				{error && <p className="error-message">{error}</p>}
			</div>
			<div className="week-status">
		<button className={`status-button ${week.done ? 'edit' : 'done'}`} onClick={toggleDone}>
		  {week.done ? 'Edit' : 'Done'}
		</button>
			</div>
		</div>
	);
}

export default WeekDetails;