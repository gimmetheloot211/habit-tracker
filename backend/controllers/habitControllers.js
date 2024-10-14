const Habit = require('../models/habitModel');
const mongoose = require('mongoose');
const Week = require('../models/weekModel');

const getAllHabits = async (req, res) => {
    
    try {
        const userID = req.user._id;
        const habits = await Habit.find({ userID });

        res.status(200).json(habits);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const createHabit = async (req, res) => {
    const { activity, totalMinutesDone = 0 } = req.body

    if (!activity || typeof activity !== 'string') {
        return res.status(400).json({ error: "Invalid or missing activity" });
    }

    if (activity.trim().length === 0) {
        return res.status(400).json({ error: "Activity cannot be empty or just spaces" });
    }

    if (activity.length > 20) {
        return res.status(400).json({ error: "Activity name is too long"})
    }

    if (totalMinutesDone < 0 || typeof totalMinutesDone !== "number") {
        return res.status(400).json({ error: "Total minutes done must be a non-negative number" });
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userID = req.user._id;

        const habitExists = await Habit.findOne({ userID, activity });
        if (habitExists) {
            return res.status(400).json({ error: "Habit already exists "});
        }
        
        const habit = new Habit({ userID, activity, totalMinutesDone });

        await Week.updateMany(
            { userID },
            { $push: { habits: { _id: habit._id, activity: habit.activity }}},
            { session }
        );
        
        await habit.save({ session });

        await session.commitTransaction();

        res.status(201).json(habit);
    } catch (error) {
        await session.abortTransaction();

        res.status(500).json({ error: error.message });
    } finally {
        session.endSession();
    }
}

const getHabit = async (req, res) => {
    const id = req.params.id;
    const userID = req.user._id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "Habit not found"});
    }
    try {
        const habit = await Habit.findOne({_id: id, userID});
        
        if (!habit) {
            return res.status(404).json({error: "Habit not found"});
        }
    
        res.status(200).json(habit);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteHabit = async (req, res) => {
    const id = req.params.id;
    const userID = req.user._id;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "Habit not found"});
    }

    try {

        const habit = await Habit.findOneAndDelete({ _id: id, userID });
    
        if (!habit) {

            return res.status(404).json({error: "Habit not found"});
        }
    
        res.status(200).json(habit);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getAllHabits,
    createHabit,
    getHabit,
    deleteHabit
}