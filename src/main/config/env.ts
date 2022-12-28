// 'mongodb://melinski:secret@localhost:27017/course-goals?authSource=admin',
export default {
	MONGO_URL:
		process.env.MONGO_URL || 'mongodb://admin:admin@localhost:27017/node-api?authSource=admin',
	PORT: process.env.PORT || 5050,
};

