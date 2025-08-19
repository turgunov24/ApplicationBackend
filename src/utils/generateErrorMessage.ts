type ErrorMessage = { message: string };
type ErrorResponse = { errors: ErrorMessage[] };

export const generateErrorMessage = (errors: string | string[]): ErrorResponse => {
	return {
		errors: (Array.isArray(errors) ? errors : [errors]).map((message) => ({
			message,
		})),
	};
};
