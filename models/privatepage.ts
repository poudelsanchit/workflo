import { Column } from "@/types/types";
import mongoose, { Schema, Document, Model } from "mongoose";
// Interface for PrivatePage model
export interface IPrivatePage extends Document {
  title: string;
  column: Column[];
}

// Schema for PrivatePage model
const PrivatePageSchema: Schema<IPrivatePage> = new Schema(
  {
    title: { type: String, required: true }, // Title field
    column: [
      {
        id: {
          type: String || Number,
        },
        title: {
          type: String,
        },
        color: {
          type: String,
        },
        tasks: {
          type: [
            {
              id: {
                type: String,
              },
              columnId: {
                type: String,
              },
              content: {
                type: String,
              },
            },
          ],
          default: [],
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Models for PrivatePage and TeamspacePage
const PrivatePageModel: Model<IPrivatePage> =
  mongoose.models.PrivatePage ||
  mongoose.model<IPrivatePage>("PrivatePage", PrivatePageSchema);

export { PrivatePageModel };
