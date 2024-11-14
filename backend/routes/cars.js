const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * @swagger
 * /api/cars:
 *   post:
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     description: Create a new car
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - images
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               tags:
 *                 type: object
 *     responses:
 *       201:
 *         description: Car created successfully
 */
router.post('/', auth, upload.array('images', 10), carController.createCar);

/**
 * @swagger
 * /api/cars:
 *   get:
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     description: Get all cars
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of cars
 */
router.get('/', auth, carController.getAllCars);

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     description: Get car by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car details
 */
router.get('/:id', auth, carController.getCarById);

router.patch('/:id', auth, upload.array('images', 10), carController.updateCar);
router.delete('/:id', auth, carController.deleteCar);

module.exports = router;