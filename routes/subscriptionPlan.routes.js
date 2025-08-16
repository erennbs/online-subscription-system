import { Router } from "express";
import {createSubscriptionPlan, deleteSubscriptionPlan, getSubscriptionPlan, getSubscriptionPlans, updateSubscriptionPlan} from "../controllers/subscriptionPlan.controller.js"

const subscriptionPlanRouter = Router();

subscriptionPlanRouter.get("/", getSubscriptionPlans);

subscriptionPlanRouter.get("/:id", getSubscriptionPlan);

subscriptionPlanRouter.post("/", createSubscriptionPlan);

subscriptionPlanRouter.put("/:id", updateSubscriptionPlan);

subscriptionPlanRouter.delete("/:id", deleteSubscriptionPlan);

export default subscriptionPlanRouter;
