import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { useState } from 'react';


const Navbar = () => {
	const { logout } = useLogout();
	const { user } = useAuthContext();
	const [showDropdown, setShowDropdown] = useState(false);
	const d = new Date();
	const currentYear = d.getFullYear();

	const handleClick = () => {
		logout();
	}

	const showDropdownMenu = (e) => {
		e.preventDefault();
		setShowDropdown(true);
	};

	const hideDropdownMenu = (e) => {
		e.preventDefault();
		setShowDropdown(false);
	};

	return (  
		<header className='navbar'>
			<div className="container">
				<nav className="navbar-links">
					{!user && (
						<div className='links'>
							<Link to="/login">Login</Link>
							<Link to="/signup">Signup</Link>
						</div>
					)}
					{user && (
						<div className='links' onMouseLeave={hideDropdownMenu}>
							<Link to="/">Home</Link>
							<Link to="/habits">Habits</Link>

							<div className="dropdown">
								<Link to={`/weeks/${currentYear}`} className="dropdown-a">Tracker</Link>
								<button className="dropdown-toggle" onMouseEnter={showDropdownMenu}>⏷</button>
								{showDropdown && (
									<ul className={`dropdown-list ${showDropdown ? 'show' : ''}`}>
										<li><Link to="/weeks/2024">2024</Link></li>
										<li><Link to="/weeks/2025">2025</Link></li>
										<li><Link to="/weeks/2026">2026</Link></li>
										<li><Link to="/weeks/2027">2027</Link></li>
										<li><Link to="/weeks/2028">2028</Link></li>
										<li><Link to="/weeks/2029">2029</Link></li>
									</ul>
								)}

								<button onClick={handleClick} className='logout'>Logout</button>
							</div>
						</div>
						
					)}
				</nav>
			</div>
		</header>
	);
}
 
export default Navbar;