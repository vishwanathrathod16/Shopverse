import mongoose, { Document, Schema, Types } from 'mongoose'; // 1. Import Types
import bcrypt from 'bcryptjs';

// Interface for the User document
export interface IUser extends Document {
  _id: Types.ObjectId; // 2. Add this line
  name: string;
  email: string;
  passwordHash: string;
  googleId?: string;
  // Methods
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    googleId: { type: String, unique: true, sparse: true }, // sparse allows multiple nulls
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Middleware to hash password before saving (for register)
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;