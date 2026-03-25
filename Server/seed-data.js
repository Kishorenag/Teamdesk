const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const mongodbUri = 'mongodb://localhost:27017/project-manager';

// Connect to MongoDB
mongoose.connect(mongodbUri, {
  retryWrites: true,
  w: 'majority',
}).then(() => {
  console.log('✅ Connected to MongoDB');
  seedData();
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

async function seedData() {
  try {
    // Clear existing data
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️  Cleared database');

    // Create User
    const userCollection = mongoose.connection.db.collection('users');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const userResult = await userCollection.insertOne({
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
      avatar: 'https://avatar.example.com/demo.jpg',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const userId = userResult.insertedId;
    console.log('👤 Created user:', userId);

    // Create Columns
    const columnCollection = mongoose.connection.db.collection('columns');
    const columns = [
      { name: 'Todo', position: 0 },
      { name: 'In Progress', position: 1 },
      { name: 'Review', position: 2 },
      { name: 'Done', position: 3 },
    ];

    const columnResults = await columnCollection.insertMany(
      columns.map((col) => ({
        ...col,
        projectId: null, // Will be set after project creation
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
    
    console.log('📋 Created columns:', columnResults.insertedIds);

    // Create Project
    const projectCollection = mongoose.connection.db.collection('projects');
    const projectResult = await projectCollection.insertOne({
      name: 'Website Redesign',
      description: 'Complete redesign of the company website with modern UI/UX',
      owner: userId,
      members: [userId],
      columns: Object.values(columnResults.insertedIds),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const projectId = projectResult.insertedId;
    console.log('📊 Created project:', projectId);

    // Update columns with projectId
    await columnCollection.updateMany(
      { _id: { $in: Object.values(columnResults.insertedIds) } },
      { $set: { projectId: projectId } }
    );

    // Create Tasks
    const taskCollection = mongoose.connection.db.collection('tasks');
    const tasks = [
      {
        title: 'Design Homepage Layout',
        description: 'Create wireframes and mockups for the new homepage',
        status: 'done',
        priority: 'high',
        columnId: Object.values(columnResults.insertedIds)[3], // Done column
        projectId: projectId,
        assignedTo: userId,
        dueDate: new Date('2026-02-10'),
        subtasks: [
          { title: 'Wireframes', completed: true },
          { title: 'High-fidelity mockups', completed: true },
        ],
        attachments: ['design-mockup-v1.figma'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Setup React Project',
        description: 'Initialize React project with TypeScript and necessary dependencies',
        status: 'done',
        priority: 'high',
        columnId: Object.values(columnResults.insertedIds)[3], // Done column
        projectId: projectId,
        assignedTo: userId,
        dueDate: new Date('2026-02-05'),
        subtasks: [
          { title: 'Create React app', completed: true },
          { title: 'Configure TypeScript', completed: true },
          { title: 'Install Material-UI', completed: true },
        ],
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Create Dashboard Component',
        description: 'Build the main dashboard with stats cards and project grid',
        status: 'in-progress',
        priority: 'high',
        columnId: Object.values(columnResults.insertedIds)[1], // In Progress column
        projectId: projectId,
        assignedTo: userId,
        dueDate: new Date('2026-02-15'),
        subtasks: [
          { title: 'Stats cards component', completed: true },
          { title: 'Project grid layout', completed: false },
          { title: 'Add filtering options', completed: false },
        ],
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Implement Authentication',
        description: 'Create login and registration pages with JWT authentication',
        status: 'in-progress',
        priority: 'urgent',
        columnId: Object.values(columnResults.insertedIds)[1], // In Progress column
        projectId: projectId,
        assignedTo: userId,
        dueDate: new Date('2026-02-12'),
        subtasks: [
          { title: 'Login page UI', completed: true },
          { title: 'Backend authentication endpoint', completed: true },
          { title: 'Token storage and refresh logic', completed: false },
        ],
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Setup Backend API',
        description: 'Create Express server with MongoDB integration',
        status: 'done',
        priority: 'high',
        columnId: Object.values(columnResults.insertedIds)[3], // Done column
        projectId: projectId,
        assignedTo: userId,
        dueDate: new Date('2026-02-05'),
        subtasks: [
          { title: 'Express setup', completed: true },
          { title: 'MongoDB connection', completed: true },
          { title: 'User model and routes', completed: true },
        ],
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Create Kanban Board',
        description: 'Implement draggable Kanban board with columns and cards',
        status: 'todo',
        priority: 'high',
        columnId: Object.values(columnResults.insertedIds)[0], // Todo column
        projectId: projectId,
        assignedTo: userId,
        dueDate: new Date('2026-02-20'),
        subtasks: [
          { title: 'Design Kanban UI', completed: false },
          { title: 'Implement drag and drop', completed: false },
          { title: 'Add animations', completed: false },
        ],
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Add Analytics Dashboard',
        description: 'Create analytics page with charts and project statistics',
        status: 'todo',
        priority: 'medium',
        columnId: Object.values(columnResults.insertedIds)[0], // Todo column
        projectId: projectId,
        assignedTo: userId,
        dueDate: new Date('2026-02-25'),
        subtasks: [
          { title: 'Design analytics page', completed: false },
          { title: 'Implement charts', completed: false },
          { title: 'Create statistics queries', completed: false },
        ],
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Code Review',
        description: 'Review all code changes and merge to main branch',
        status: 'review',
        priority: 'medium',
        columnId: Object.values(columnResults.insertedIds)[2], // Review column
        projectId: projectId,
        assignedTo: userId,
        dueDate: new Date('2026-02-13'),
        subtasks: [
          { title: 'Review PR #1', completed: false },
          { title: 'Review PR #2', completed: false },
        ],
        attachments: ['pr-summary.md'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const taskResults = await taskCollection.insertMany(tasks);
    console.log('✅ Created', tasks.length, 'tasks');

    // Update columns with task references
    const taskIds = Object.values(taskResults.insertedIds);
    for (let i = 0; i < columns.length; i++) {
      const columnId = Object.values(columnResults.insertedIds)[i];
      const columnTasks = taskIds.filter((_, idx) => {
        const task = tasks[idx];
        return task.columnId.toString() === columnId.toString();
      });
      
      await columnCollection.updateOne(
        { _id: columnId },
        { $set: { tasks: columnTasks } }
      );
    }

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📊 Test Credentials:');
    console.log('   Email: demo@example.com');
    console.log('   Password: password123');
    console.log('\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
}
