import express from "express";
import { Application, Request, Response } from "express";
import userRouter from "./user/routes/user-routes";

const app: Application = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter)

app.get("/", (req: Request, res: Response) => {
  res.send("OK!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
