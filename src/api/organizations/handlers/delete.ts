import { Request, Response } from 'express'
import { districtsTable } from '../../../db/schemas/districts'
import db from '../../../db'
import { eq } from 'drizzle-orm'

export const deleteHandler = async (req: Request, res: Response) => {
	try {
		const { id } = req.query

		const result = await db
			.delete(districtsTable)
			.where(eq(districtsTable.id, parseInt(String(id))))
			.returning()
		if (result.length === 0) {
			res.status(404).json({ message: 'District not found' })
		} else {
			res.json({ message: 'District deleted successfully' })
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Failed to delete district' })
	}
}
