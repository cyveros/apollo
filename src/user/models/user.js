import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		require: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

UserSchema.statics = {
	all() {
		return this.find().select({password: 0}).exec();
	}
};

export default mongoose.model('User', UserSchema);