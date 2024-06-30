import * as dotenv from "dotenv";
import app from "./server";
dotenv.config();

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
	console.log(`server is listening on ${PORT}`);
});
