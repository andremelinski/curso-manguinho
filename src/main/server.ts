import express from 'express';

const PORT = 5050;
const app = express();

app.listen(PORT, () => {
	console.log(`listening at: http://localhost:${PORT}`);
});
