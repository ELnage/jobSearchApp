import express from "express"
import { config } from "dotenv";
import {db_connection} from "./DB/connection.js";
import { globalResponse } from "./src/middlewares/error-handling.middleware.js";
import userRouter from "./src/modules/user/user.router.js"
import companyRouter from "./src/modules/company/company.router.js"
import jobRouter from "./src/modules/job/job.router.js"
config()
const port = process.env.PORT

const app = express()


app.use(express.json())

app.use("/user" , userRouter)

app.use("/company" , companyRouter)

app.use("/job" , jobRouter)

app.use(globalResponse)

db_connection()
app.listen(port, () => console.log(`server is running on port ${port}`));