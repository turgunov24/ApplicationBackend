import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

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
		path.join(__dirname, '../**/handlers/*.ts'),
		path.join(__dirname, '../**/handlers/*.js'),
		path.join(__dirname, '../**/handlers.ts'),
		path.join(__dirname, '../**/handlers.js'),
	], // Paths to files containing Swagger annotations - only matching specific handler files
});

// Export serve and setup for direct mounting on app
export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(swaggerSpec);
