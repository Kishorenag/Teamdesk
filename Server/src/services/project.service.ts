// import { Project, Column, Task } from '../models/index';
// import { ICreateProjectInput, ICreateColumnInput, ICreateTaskInput, IUpdateTaskInput } from '../types/index';

// export class ProjectService {
//   async getProjects(userId: string) {
//     return Project.find({
//       $or: [{ owner: userId }, { members: userId }],
//     })
//       .populate('owner', 'name email avatar')
//       .populate('members', 'name email avatar')
//       .populate({
//         path: 'columns',
//         populate: { path: 'tasks' },
//       })
//       .sort({ createdAt: -1 });
//   }

//   async getProjectById(projectId: string, userId: string) {
//     const project = await Project.findById(projectId)
//       .populate('owner', 'name email avatar')
//       .populate('members', 'name email avatar')
//       .populate({
//         path: 'columns',
//         populate: { path: 'tasks' },
//       });

//     if (!project) {
//       throw new Error('Project not found');
//     }

//     // Check authorization
//     const ownerId = typeof project.owner === 'string' ? project.owner : (project.owner as any)._id?.toString();
//     const isMember = project.members.some((m: any) => {
//       const memberId = typeof m === 'string' ? m : m._id?.toString();
//       return memberId === userId;
//     });

//     if (ownerId !== userId && !isMember) {
//       throw new Error('Unauthorized');
//     }

//     return project;
//   }

//   async createProject(data: ICreateProjectInput, userId: string) {
//     const project = await Project.create({
//       ...data,
//       owner: userId,
//       members: [userId],
//     });

//     // Create default columns
//     const columnNames = ['Todo', 'In Progress', 'Review', 'Done'];
//     const columns = await Promise.all(
//       columnNames.map((name, index) =>
//         Column.create({
//           name,
//           position: index,
//           projectId: project._id,
//           tasks: [],
//         })
//       )
//     );

//     project.columns = columns.map((c) => c._id);
//     await project.save();

//     return project.populate('owner', 'name email avatar');
//   }

//   async updateProject(projectId: string, data: Partial<any>, userId: string) {
//     const project = await Project.findById(projectId);

//     if (!project) {
//       throw new Error('Project not found');
//     }

//     if (project.owner.toString() !== userId) {
//       throw new Error('Unauthorized');
//     }

//     Object.assign(project, data);
//     await project.save();

//     return project;
//   }

//   async deleteProject(projectId: string, userId: string) {
//     const project = await Project.findById(projectId);

//     if (!project) {
//       throw new Error('Project not found');
//     }

//     if (project.owner.toString() !== userId) {
//       throw new Error('Unauthorized');
//     }

//     // Delete columns and tasks
//     await Column.deleteMany({ projectId });
//     await Task.deleteMany({ projectId });

//     await Project.findByIdAndDelete(projectId);
//   }
// }

// export const projectService = new ProjectService();

import { Project, Column, Task } from '../models/index';
import { ICreateProjectInput } from '../types/index';
import { Types } from 'mongoose';

export class ProjectService {
  async getProjects(userId: string) {
    return Project.find({
      $or: [{ owner: userId }, { members: userId }],
    })
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .populate({
        path: 'columns',
        populate: { path: 'tasks' },
      })
      .sort({ createdAt: -1 });
  }

  async getProjectById(projectId: string, userId: string) {
    const project = await Project.findById(projectId)
      .populate('owner', 'name email avatar') // 👈 Owner is now an OBJECT
      .populate('members', 'name email avatar')
      .populate({
        path: 'columns',
        populate: { path: 'tasks' },
      });

    if (!project) {
      throw new Error('Project not found');
    }

    // 🔍 FIX 1: Safe Authorization Check for Populated Fields
    // We cast to 'any' because at runtime, Mongoose swapped the ID for the User Object
    const owner = project.owner as any;
    const ownerId = owner._id ? owner._id.toString() : owner.toString();

    const isMember = project.members.some((member: any) => {
      const memberId = member._id ? member._id.toString() : member.toString();
      return memberId === userId;
    });

    if (ownerId !== userId && !isMember) {
      throw new Error('Unauthorized');
    }

    return project;
  }

  async createProject(data: ICreateProjectInput, userId: string) {
    const project = await Project.create({
      ...data,
      owner: userId,
      members: [userId],
    });

    // Create default columns
    const columnNames = ['Todo', 'In Progress', 'Review', 'Done'];
    const columns = await Promise.all(
      columnNames.map((name, index) =>
        Column.create({
          name,
          position: index,
          projectId: project._id,
          tasks: [],
        })
      )
    );

    project.columns = columns.map((c) => c._id as unknown as Types.ObjectId);
    await project.save();

    // 🔍 FIX 2: Await the populate call
    await project.populate('owner', 'name email avatar');
    
    return project;
  }

  async updateProject(projectId: string, data: Partial<ICreateProjectInput>, userId: string) {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error('Project not found');
    }

    // 🔍 FIX 3: Simplified Ownership Check (No populate here, so it's an ID)
    if (project.owner.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    Object.assign(project, data);
    await project.save();

    return project;
  }

  async deleteProject(projectId: string, userId: string) {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.owner.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    await Column.deleteMany({ projectId });
    await Task.deleteMany({ projectId });

    await Project.findByIdAndDelete(projectId);
  }
}

export const projectService = new ProjectService();