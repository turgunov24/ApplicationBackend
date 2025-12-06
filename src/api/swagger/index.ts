import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const router = Router();

export const swaggerSpec = swaggerJSDoc({
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'My API',
			version: '1.0.0',
			description: 'Express + TypeScript API docs',
		},
		servers: [
			{
				url: `http://localhost:${process.env.PORT || 3001}`,
				description: 'Development server',
			},
		],
	},
	apis: [
		path.join(__dirname, '../**/*.ts'),
		path.join(__dirname, '../**/*.js'),
	], // Paths to files containing Swagger annotations
});

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
