import mongoose, { Document, Schema, ObjectId } from "mongoose";

// Define the User model interface
export interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  googleId: string;
  isActive: boolean;
  pages: {
    private: { pageId: ObjectId; title: string }[]; // Array of references to private pages
    teamspace: { pageId: ObjectId; title: string }[]; // Array of references to teamspace pages
  };
}

// User schema definition
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
      private: [
        {
          pageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PrivatePage",
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
        },
      ],
      teamspace: [
        {
          pageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TeamspacePage",
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
