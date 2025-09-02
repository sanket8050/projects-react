import express from "express";
import { checkout,paymentVerification } from "../controller/pamentrouteController.js";

const router = express.Router();
router.route("/checkout").post(checkout);
// Standardized lowercase path to mirror reference repo
router.route("/paymentverification").post(paymentVerification);
// Backward compatibility for existing frontend calls
router.route("/paymentVerification").post(paymentVerification);
export default router;
