import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadsDir = 'uploads/espKeys';
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadsDir);
	},
	filename: function (req, file, cb) {
		// Create unique filename with timestamp
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
		);
	},
});

const uploadEspKey = multer({
	storage: storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit for any ESP key files
	},
	// No fileFilter implies all file types are accepted as requested
});

export default uploadEspKey;
