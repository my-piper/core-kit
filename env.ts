import dotenv from "dotenv";
const { parsed } = dotenv.config();

export default parsed;

// console.info(`Load: ${Object.keys(parsed).join(", ")}`);
