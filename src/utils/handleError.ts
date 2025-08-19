import { Response } from 'express';
import { generateErrorMessage } from './generateErrorMessage';

interface CustomErrorCause {
	detail?: string;
}

export function handleError(res: Response, error: unknown): void {
	// Handle non-Error objects
	if (!(error instanceof Error)) {
		res.status(500).json(generateErrorMessage('Internal server error'));
		return;
	}

	// Handle errors with a cause object containing a detail property
	if ('cause' in error && error.cause && typeof error.cause === 'object') {
		const cause = error.cause as CustomErrorCause;
		if ('detail' in cause && typeof cause.detail === 'string') {
			res.status(400).json(generateErrorMessage(cause.detail));
			return;
		}
	}

	// Fallback for standard errors
	res.status(400).json(generateErrorMessage(error.message));
}
