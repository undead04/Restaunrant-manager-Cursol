import { Router, RequestHandler } from "express";
import { AuthController } from "../controllers/auth.controller";

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "admin@example.com"
 *           description: Email address of the user
 *         password:
 *           type: string
 *           format: password
 *           example: "123456"
 *           description: User's password (min 6 characters)
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Login successful"
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             token:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               description: JWT access token
 *         statusCode:
 *           type: number
 *           example: 200
 */

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to get access token
 *     description: Authenticate user and return JWT token
 *     tags: [Auth]
 *     security: [] # Không cần authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password format"
 *                 data:
 *                   type: null
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 *                 data:
 *                   type: null
 *                 statusCode:
 *                   type: number
 *                   example: 401
 *       403:
 *         description: Account is inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Account is inactive"
 *                 data:
 *                   type: null
 *                 statusCode:
 *                   type: number
 *                   example: 403
 */
router.post(
  "/login",
  authController.login.bind(authController) as RequestHandler
);

export default router;
