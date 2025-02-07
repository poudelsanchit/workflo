import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for TeamspacePage model
export interface ITeamspacePage extends Document {
  title: string; // Only title is required
}

// Schema for TeamspacePage model
const TeamspacePageSchema: Schema<ITeamspacePage> = new Schema(
  {
    title: { type: String, required: true }, // Title field
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);
const TeamspacePageModel: Model<ITeamspacePage> =
  mongoose.models.TeamspacePage ||
  mongoose.model<ITeamspacePage>("TeamspacePage", TeamspacePageSchema);

export { TeamspacePageModel };
