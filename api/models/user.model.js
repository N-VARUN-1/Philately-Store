import mongoose from 'mongoose';
const { Schema } = mongoose;

const userIdValidator = function (value) {
  return mongoose.Types.ObjectId.isValid(value) || typeof value === 'string';
};

const UserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: [userIdValidator, 'userId must be an ObjectId or a String'],
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  applicantName: {
    type: String,
    required: true,
    trim: true,
  },
  mailingAddress: {
    type: String,
    required: true,
    trim: true,
  },
  pin: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{6}$/, // Assuming pin code is a 6-digit number
  },
  recipientName: {
    type: String,
    trim: true,
  },
  recipientAddress: {
    type: String,
    trim: true,
  },
  customerType: {
    type: String,
    enum: ['privateIndividual', 'stampDealer', 'company'], // Enum for customer types
    required: true,
  },
  subscriptionFrequency: {
    type: String,
    enum: ['onceAYear', 'twiceAYear', 'fourTimesAYear', 'sixTimesAYear'], // Enum for subscription frequencies
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profilePicture: {
    type: String
  }
}, { timestamps: true });

// Export the model
const User = mongoose.model("User ", UserSchema);

export default User;
