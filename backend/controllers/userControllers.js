const User = require('../models/userModel');
const Week = require('../models/weekModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

const createUserWeeks = async (userID, session) => {

    try {
        const currentYear = new Date().getFullYear();
        const promises = []
    
        for (let year = currentYear; year <= 2029; year++) {
    
            const firstDayOfYear = new Date(year, 0, 1);
            const dayOfWeek = firstDayOfYear.getDay();
    
            for (let weekNumber = 1; weekNumber <= 52; weekNumber++) {
    
                const weekID = `${year}-${weekNumber}`;
                const startOfWeek = new Date(year, 0, 1 + (weekNumber - 1) * 7 - dayOfWeek);
    
                
                const monday = new Date(startOfWeek);
                const tuesday = new Date(monday); tuesday.setDate(monday.getDate() + 1);
                const wednesday = new Date(monday); wednesday.setDate(monday.getDate() + 2);
                const thursday = new Date(monday); thursday.setDate(monday.getDate() + 3);
                const friday = new Date(monday); friday.setDate(monday.getDate() + 4);
                const saturday = new Date(monday); saturday.setDate(monday.getDate() + 5);
                const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
    
        
                const week = new Week({
                    weekID,
                    userID,
                    days: {
                        Monday: monday,
                        Tuesday: tuesday,
                        Wednesday: wednesday,
                        Thursday: thursday,
                        Friday: friday,
                        Saturday: saturday,
                        Sunday: sunday
                    }
                });
    
                promises.push(week.save({ session }));
            }
        }
    
        await Promise.all(promises);
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

const userSignup = async (req, res) => {
    const { username, password } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.signup({ username, password }, { session });

        await createUserWeeks(user._id, session);

        await session.commitTransaction();

        const token = createToken(user._id);

        res.status(201).json({username, token});
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({error: error.message});
    } finally {
        session.endSession();
    }
}

const userLogin = async (req, res) => {
    const { username, password} = req.body;

    try {

        const user = await User.login(username, password);

        const token = createToken(user._id);

        res.status(200).json({username, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    userSignup,
    userLogin
}