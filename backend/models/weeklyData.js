const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyDataSchema = new Schema({
	minutesDoneToday: {
		type: Number,
		max: 1440, 
		default: 0
	},
	dailyImbalance: {
		type: Number,
		default: 0
	}
});

const weeklyDataSchema = new Schema({
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	habitID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Habit',
		required: true
	},
	weekObjectID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Week',
		required: true
	},
	minutesGoalWeek: {
		type: Number,
		max: 10080,
		default: 0
	},
	minutesDoneWeek: {
		type: Number,
		max: 10080,
		default: 0
	},
	weeklyImbalance: {
		type: Number,
		default: 0
	},
	dailyGoal: {
		type: Number,
		max: 1440,
		default: 0
	},
	days: {
		Monday: { type: dailyDataSchema, default: () => ({}) },
		Tuesday: { type: dailyDataSchema, default: () => ({}) },
		Wednesday: { type: dailyDataSchema, default: () => ({}) },
		Thursday: { type: dailyDataSchema, default: () => ({}) },
		Friday: { type: dailyDataSchema, default: () => ({}) },
		Saturday: { type: dailyDataSchema, default: () => ({}) },
		Sunday: { type: dailyDataSchema, default: () => ({}) }
	}
});

module.exports = mongoose.model("WeeklyData", weeklyDataSchema);