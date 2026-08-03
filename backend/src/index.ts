import express from "express" 
import cors from "cors" ;
import { clerkMiddleware } from "@clerk/express" ;
import { clerkWebhookHandler } from "./webhooks/clerk";
import { getEnv } from "./lib/env";



const env = getEnv( ) ;
const app = express() ;


app.use(cors());

  app.post(
  "/webhook/clerk",
  express.raw({ type: "application/json" }),
  (req, res) => {
    void clerkWebhookHandler(req, res);
  }
);

app.use(express.json());
app.use(clerkMiddleware());

app.listen(env.PORT, () => {
  console.log(`listening on port ${env.PORT}`);
});