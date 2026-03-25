import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import 'express-async-errors';

import { config, isDevelopment } from './config/environment';
import { connectDatabase, disconnectDatabase } from './config/database';
import { apiRoutes } from './routes/index';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS middleware
    this.app.use(
      cors({
        origin: config.frontendUrl,
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    this.app.use(morgan(isDevelopment ? 'dev' : 'combined'));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ limit: '10mb', extended: true }));

    // Health check endpoint
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
      });
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api', apiRoutes);

    // Root endpoint
    this.app.get('/', (_req: Request, res: Response) => {
      res.status(200).json({
        message: 'SaaS Project Management API',
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          projects: '/api/projects',
          tasks: '/api/projects/:projectId/tasks',
          health: '/health',
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler (must be before error handler)
    this.app.use(notFoundHandler);

    // Global error handler (must be last)
    this.app.use(errorHandler);
  }

  public getApp(): Express {
    return this.app;
  }

  public async listen(): Promise<void> {
    try {
      // Connect to database
      console.log('📡 Connecting to MongoDB...');
      await connectDatabase();
      console.log('✅ MongoDB connected');

      // Start server
      this.app.listen(config.port, () => {
        console.log(`\n🚀 Server running on http://localhost:${config.port}`);
        console.log(`📝 Environment: ${config.nodeEnv}`);
        console.log(`🔗 Frontend: ${config.frontendUrl}\n`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  public async shutdown(): Promise<void> {
    try {
      console.log('\n📴 Shutting down gracefully...');
      await disconnectDatabase();
      console.log('✅ MongoDB disconnected');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Create and export app instance
const app = new App();

// Handle graceful shutdown
process.on('SIGTERM', () => app.shutdown());
process.on('SIGINT', () => app.shutdown());

// Start server if this is the main module
if (require.main === module) {
  app.listen();
}

export default app.getApp();
