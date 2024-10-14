const Habit = require('../models/habitModel');
const Week = require('../models/weekModel');
const WeeklyData = require('../models/weeklyData');
const mongoose = require('mongoose');

const updateWeekData = async (req, res) => {
    const { habitID, updatedDays, minutesGoalWeek, weekObjectID } = req.body;
    const userID = req.user._id;

    if (!habitID || !mongoose.Types.ObjectId.isValid(habitID)) {
        return res.status(400).json({ error: "Invalid habit"});
    }

    if (updatedDays && typeof updatedDays !== 'object') {
        return res.status(400).json({ error: "Invalid data input" });
    }

    if (minutesGoalWeek < 0) {
        return res.status(400).json({ error: "Weekly goal cannot be negative"});
    }
    try {
        const week = await Week.findById(weekObjectID);
        if (!week) {
            return res.status(404).json({ error: "Week not found" });
        }
        
        const habit = await Habit.findById(habitID);
        if (!habit) {
            return res.status(404).json({ error: "Habit not found"});
        }
        
        let weeklyData = await WeeklyData.findOne({ userID, habitID, weekObjectID: week._id });

        if (!weeklyData) {
            
            weeklyData = new WeeklyData({
                userID,
                habitID,
                weekObjectID: week._id,
                minutesGoalWeek: minutesGoalWeek || 0,
                dailyGoal: minutesGoalWeek ? Math.floor(minutesGoalWeek / 7) : 0,
                minutesDoneWeek: 0,
                days: {
                    Monday: { minutesDoneToday: 0, dailyImbalance: 0},
                    Tuesday: { minutesDoneToday: 0, dailyImbalance: 0},
                    Wednesday: { minutesDoneToday: 0, dailyImbalance: 0},
                    Thursday: { minutesDoneToday: 0, dailyImbalance: 0},
                    Friday: { minutesDoneToday: 0, dailyImbalance: 0},
                    Saturday: { minutesDoneToday: 0, dailyImbalance: 0},
                    Sunday: { minutesDoneToday: 0, dailyImbalance: 0},
                }
            });
            await weeklyData.save();

            week.weekData.push(weeklyData._id);
            await week.save();
        }

        if (minutesGoalWeek !== undefined) {
            weeklyData.minutesGoalWeek = minutesGoalWeek;
            weeklyData.dailyGoal = Math.floor(minutesGoalWeek / 7);
        }

        if (updatedDays && Object.keys(updatedDays).length > 0) {
            for (const day in updatedDays) {
                if (weeklyData.days[day]) {
                    if (updatedDays[day].minutesDoneToday !== undefined) {
                        if (updatedDays[day].minutesDoneToday < 0) {
                            return res.status(400).json({ error: `Activity time for ${day} cannot be negative`})
                        }
                        weeklyData.days[day].minutesDoneToday = updatedDays[day].minutesDoneToday; 
                        weeklyData.days[day].dailyImbalance = weeklyData.days[day].minutesDoneToday - weeklyData.dailyGoal;
                    }
    
                }
            }
        }

        const updatedMinutesDoneWeek = Object.values(weeklyData.days)
            .reduce((sum, day) => sum + day.minutesDoneToday, 0);

        const mdwChange = updatedMinutesDoneWeek - weeklyData.minutesDoneWeek;

        weeklyData.minutesDoneWeek = updatedMinutesDoneWeek;

        weeklyData.weeklyImbalance = weeklyData.minutesDoneWeek - weeklyData.minutesGoalWeek;

        await weeklyData.save();

        if (mdwChange !== 0) {
            habit.totalMinutesDone += mdwChange;
            await habit.save();
        }
        await week.populate({ path: 'weekData' });

        res.status(200).json(week);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getWeeks = async (req, res) => {
    const { year } = req.params;

    if (!year || isNaN(year) || year.toString().length !== 4) {
        return res.status(400).json({ error: "Page not found"})
    }

    try {
        const userID = req.user._id;
        const weeks = await Week.find({
            userID,
            weekID : { $regex: `^${year}-`}
        }).sort({ weekNumber: 1});

        if (!weeks || weeks.length === 0) {
            return res.status(404).json({ message: "Weeks not found"});
        }
        weeks.sort((a, b) => a.weekNumber - b.weekNumber);

        return res.status(200).json(weeks);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getWeek = async (req, res) => {
    const weekID = req.params.id;

    try {
        const userID = req.user._id
        const week = await Week.findOne({ userID, weekID })
            .populate({ path: 'weekData' })

        if (!week) {
            return res.status(404).json({error: "Week not found"});
        }

        res.status(200).json(week);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const updateWeek = async (req, res) => {
    const { updatedDone = null, description = null, _id } = req.body;

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ error: "Invalid week"});
    }

    try {
        const week = await Week.findById(_id);

        if(!week) {
            return res.status(404).json({error: "Week not found"});
        }

        week.done = updatedDone !== null ? updatedDone : week.done;
        week.description = description !== null ? description : week.description;

        const updatedWeek = await week.save();
        await updatedWeek.populate({ path: 'weekData'})

        return res.status(200).json(updatedWeek);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    updateWeekData,
    getWeeks,
    getWeek,
    updateWeek
}