import mongoose, { Schema } from 'mongoose';
import { IColumn } from '../types/index';

const columnSchema = new Schema<IColumn>(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Column = mongoose.model<IColumn>('Column', columnSchema);
