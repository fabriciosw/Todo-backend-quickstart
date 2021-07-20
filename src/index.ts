import express from "express";

const app = express();

app.get("*", (_, res) => res.status(200).send({ success: true }));

app.listen(8080, () => console.log("Server running!"));
