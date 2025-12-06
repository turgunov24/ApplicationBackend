export interface PaginationParams {
	currentPage: string;
	dataPerPage: string;
}

export interface PaginationResult {
	currentPage: number;
	dataPerPage: number;
	offset: number;
}

export interface PaginationMeta {
	currentPage: number;
	dataPerPage: number;
	totalData: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

/**
 * Normalizes pagination parameters and calculates offset
 * @param currentPage - Current page number as string (default: '0')
 * @param dataPerPage - Number of items per page as string (default: '5', max: 100)
 * @returns Normalized pagination parameters with offset
 */
export const normalizePagination = (
	currentPage: string = '0',
	dataPerPage: string = '5'
): PaginationResult => {
	const _currentPage = Math.max(0, parseInt(currentPage, 10));
	const _dataPerPage = Math.min(100, Math.max(1, parseInt(dataPerPage, 10)));
	const offset = _currentPage * _dataPerPage;

	return {
		currentPage: _currentPage,
		dataPerPage: _dataPerPage,
		offset,
	};
};

/**
 * Calculates pagination metadata
 * @param currentPage - Normalized current page number
 * @param dataPerPage - Normalized data per page
 * @param totalCount - Total number of items
 * @returns Pagination metadata object
 */
export const calculatePaginationMeta = (
	currentPage: number,
	dataPerPage: number,
	totalCount: number
): PaginationMeta => {
	const totalPages = Math.ceil(totalCount / dataPerPage);
	const hasNextPage = currentPage + 1 < totalPages;
	const hasPrevPage = currentPage > 0;

	return {
		currentPage,
		dataPerPage,
		totalData: totalCount,
		totalPages,
		hasNextPage,
		hasPrevPage,
	};
};
