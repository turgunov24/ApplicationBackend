import { Request, Response } from 'express';
import { handleError } from '../../../../utils/handleError';
import resources from '../../../../policy/resources';

export const indexHandler = async (req: Request, res: Response) => {
	try {
		res.json(resources);
	} catch (error: unknown) {
		handleError(res, error);
	}
};
