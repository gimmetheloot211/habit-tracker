const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const habitSchema = new Schema({
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	activity: {
		type: String,
		maxlength: 20,
		required: true
	},
	totalMinutesDone: {
		type: Number,
		default: 0
	}
}, { timestamps: true });

habitSchema.index({ userID: 1, activity: 1 }, { unique: true });

habitSchema.post('findOneAndDelete', async function(habit) {
	if (habit) {
		try {
			const weeklyDataList = await mongoose.model('WeeklyData').find({ habitID: habit._id });

			for (const weeklyData of weeklyDataList) {
				await mongoose.model('Week').updateOne(
					{ _id: weeklyData.weekObjectID },
					{ $pull: { weekData: weeklyData._id }}
				)
			}

			await mongoose.model('WeeklyData').deleteMany({ habitID: habit._id });

			await mongoose.model('Week').updateMany(
				{ userID: habit.userID },
				{ $pull: { habits: { _id: habit._id, activity: habit.activity }}}
			);

		} catch (error) {
			console.log(error);
		}
	}
})

module.exports = mongoose.model('Habit', habitSchema);

