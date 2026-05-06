import express, { Request, Response } from "express";


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.json());


// Simple route
app.get("/", (req: Request, res: Response) => {
 res.json({ message: "Hello from SonarQube Demo Express TS App!" });
});


// Health check
app.get("/health", (req: Request, res: Response) => {
 res.json({ status: "UP", timestamp: new Date().toISOString() });
});


// Echo endpoint
app.post("/echo", (req: Request, res: Response) => {
 const { data } = req.body;
 if (!data) {
   return res.status(400).json({ error: "No data provided" });
 }
 res.json({ echoed: data, receivedAt: new Date().toISOString() });
});


// Start server
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});


export default app;
