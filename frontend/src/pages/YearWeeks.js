import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getISOWeek, getYear } from 'date-fns';

const YearWeeks = () => {
	const { user } = useAuthContext();
	const { year } = useParams();
	const [ weeks, setWeeks ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ error, setError ] = useState("");
	
	const isCurrentWeek = (weekID) => {
		const now = new Date();
		const year = getYear(now);
		const week = getISOWeek(now);

		const currentWeek = `${year}-${week}`;
		if (currentWeek === weekID) return true;

		return false;
	}

	useEffect(() => {
		const fetchWeeks = async () => {
			try {
				const response = await fetch(`http://localhost:4000/api/weeks/year/${year}`, {
					headers: { 'Authorization': `Bearer ${user.token}` }
				});
				const json = await response.json();
					if (response.ok) {
						setIsLoading(false);
						setWeeks(json)
					} else {
						setIsLoading(false);
						setError(json.error);
					}
			} catch {
				setIsLoading(false);
				setError("Failed to fetch weeks");
			}
		}
		if (user && year) {
			fetchWeeks();
		}
	}, [user, year])
	if (isLoading) {
		return (
			<div className="loading">Loading...</div>
		)
	}
	return ( 
		<div className="main-content">
			<div className="yearWeeks">
				{weeks?.map((week) => {
					const currentWeek = isCurrentWeek(week.weekID);

					return (
						<div key={week._id} className="weekNumber">
							<div className={week.done ? "doneWeek" : ""}>
								<a className={currentWeek ? "currentWeek" : ""} href={`/week/${week.weekID}`}>{week.weekNumber}</a>
							</div>
						</div>
					)
				})}
			</div>
			{error && <p className="error-message">{error}</p>}
		</div>
	);
}
 
export default YearWeeks;