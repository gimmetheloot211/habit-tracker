const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weekdaySchema = new Schema({
	Monday: {
		type: Date,
	},
	Tuesday: {
		type: Date,
	},
	Wednesday: {
		type: Date,
	},
	Thursday: {
		type: Date,
	},
	Friday: {
		type: Date,
	},
	Saturday: {
		type: Date,
	},
	Sunday: {
		type: Date,
	},
})
const weekSchema = new Schema({
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	weekID: {
		type: String, 
		required: true
	},
	habits: [{
		_id: { 
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'Habit' 
		},
		activity: { 
			type: String, 
			required: true
		}
	}],
	weekData: [{ 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'WeeklyData' 
	}],
	days: weekdaySchema,
	done: {
		type: Boolean,
		default: false
	},
	description: {
		type: String
	}
});

weekSchema.index({ userID: 1, weekID: 1 }, { unique: true });

weekSchema.virtual('weekNumber').get(function(){
	return parseInt(this.weekID.split("-")[1], 10);
})

weekSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Week', weekSchema);
