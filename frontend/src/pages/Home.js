import { useAuthContext } from "../hooks/useAuthContext";
import React, { useEffect, useState } from 'react';


const Home = () => {
	const { user } = useAuthContext();
  const [quote, setQuote] = useState();
	
  useEffect(() => {
	const fetchQuote = async () => {
	  try {
		const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=courage', {
		  headers: {
			'X-Api-Key': process.env.REACT_APP_API_KEY
		  }
		})
		const json = await response.json();

		if (response.ok) {
		  setQuote(json[0]);
		}

	  } catch (error) {
		
	  }
	}

	fetchQuote();
  }, [user])


	return (
		<div className="main-content">
			<div className="home">
				<div>
					<p className="welcome">Welcome, {user.username}</p>
					{quote && <div className="quote">
						<p className="quote-text">{quote?.quote} </p>
						<p className="quote-author">{quote?.author}</p>
					</div>}
				</div>
			</div>
		</div>
	);
};

export default Home;