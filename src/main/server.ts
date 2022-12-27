import app from './config/app';

const PORT = 5050;

app.listen(PORT, () => {
	console.log(`listening at: http://localhost:${PORT}`);
});
