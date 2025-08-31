import express from "express";
import { checkout } from "../controller/pamentrouteController.js";

const router = express.Router();
router.route("/checkout").post(checkout);
export default router;
