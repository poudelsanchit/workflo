import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for PrivatePage model
export interface IPrivatePage extends Document {
  title: string; // Only title is required
}

// Interface for TeamspacePage model
export interface ITeamspacePage extends Document {
  title: string; // Only title is required
}

// Schema for PrivatePage model
const PrivatePageSchema: Schema<IPrivatePage> = new Schema(
  {
    title: { type: String, required: true }, // Title field
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Schema for TeamspacePage model
const TeamspacePageSchema: Schema<ITeamspacePage> = new Schema(
  {
    title: { type: String, required: true }, // Title field
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Models for PrivatePage and TeamspacePage
const PrivatePageModel: Model<IPrivatePage> =
  mongoose.models.PrivatePage || mongoose.model<IPrivatePage>("PrivatePage", PrivatePageSchema);

const TeamspacePageModel: Model<ITeamspacePage> =
  mongoose.models.TeamspacePage || mongoose.model<ITeamspacePage>("TeamspacePage", TeamspacePageSchema);

export { PrivatePageModel, TeamspacePageModel };
