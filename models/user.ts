import mongoose, { Document,Model,Schema } from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  googleId: string;
  isActive: boolean;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
},
{
    timestamps: true
});


const UserModel :Model<IUser>  = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
export default UserModel;