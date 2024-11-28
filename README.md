# Habit Tracker

A simple habit tracking web application which allows you to track habits, set weekly goals, and monitor 
progress over time.

### Features

- **Habit Tracking:** Add, view, and manage habits with weekly goals and daily progress tracking.
- **Weekly Overview:** See progress for each week, including daily goals and imbalances.

### Technologies Used
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React.js and basic CSS

### Installation
1. Clone the repository
```bash
git clone https://github.com/gimmetheloot211/habit-tracker.git
```
2. Install dependencies
```bash
npm install
```
3. Set up env file in backend:
```env
#.env file example
BPORT=(Your backend port)
FPORT=(Your frontend port)
MONGO_URI=(Your MongoDB database key)
SECRET=(Your JWT secret)
```
4. Set up env file in frontend:
```env
#Get your API key from api-ninjas.com
REACT_APP_API_KEY=(Your API key)
```
5. Open a terminal to run the backend server
```bash
cd backend
npm run dev
```
6. Open a terminal to run the frontend server
```bash
cd frontend
npm run start
```
7. Navigate to your localhost server in the browser (e.g. ***http://localhost:3000***)

### Future Improvements
I plan to improve the UI in the future and add charts to visualize progress over time. I'm relatively
new to web development, so feel free to let me know if you have any suggestions :)