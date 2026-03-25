// import mongoose from 'mongoose';
// import { IProject } from '../types/index';

// const projectSchema = new mongoose.Schema<IProject>(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       default: '',
//     },
//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     members: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//       },
//     ],
//     columns: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Column',
//       },
//     ],
//     status: {
//       type: String,
//       enum: ['active', 'archived', 'completed'],
//       default: 'active',
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const Project = mongoose.model<IProject>('Project', projectSchema);

import mongoose, { Schema, Types } from 'mongoose'; // 👈 Import Types
import { IProject } from '../types/index';

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    owner: {
      type: Schema.Types.ObjectId, // ✅ Now matches 'Types.ObjectId' in interface
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    columns: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Column',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'archived', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model<IProject>('Project', projectSchema);