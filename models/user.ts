import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPage {
  id: string;
  title: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  googleId: string;
  isActive: boolean;
  pages: {
    private: IPage[]; // Array to store private pages with title and id
    teamspace: IPage[]; // Array to store teamspace pages with title and id
  };
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
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
    pages: {
      private: {
        type: [
          {
            id: { type: String, required: true },
            title: { type: String, required: true },
          },
        ],
        default: [],
      },
      teamspace: {
        type: [
          {
            id: { type: String, required: true },
            title: { type: String, required: true },
          },
        ],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
