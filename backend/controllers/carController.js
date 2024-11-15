const Car = require('../models/Car');
const ApiResponse = require('../utils/apiResponse');
const fs = require('fs').promises;
const path = require('path');

exports.createCar = async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const images = req.files.map(file => file.filename);

        if (images.length > 10) {
            for (let i = 10; i < images.length; i++) {
                await fs.unlink(path.join('uploads', images[i]));
            }
            images.length = 10;
        }

        const car = new Car({
            title,
            description,
            images,
            tags: JSON.parse(tags),
            user: req.user._id
        });

        await car.save();
        ApiResponse.success(res, car, 'Car created successfully', 201);
    } catch (error) {
        ApiResponse.error(res, error.message, 500);
    }
};

exports.getAllCars = async (req, res) => {
    try {
        const search = req.query.search;
        let query = { user: req.user._id };

        if (search) {
            query.$text = { $search: search };
        }

        const cars = await Car.find(query);
        ApiResponse.success(res, cars);
    } catch (error) {
        ApiResponse.error(res, error.message, 500);
    }
};

exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!car) {
            return ApiResponse.error(res, 'Car not found', 404);
        }

        ApiResponse.success(res, car);
    } catch (error) {
        ApiResponse.error(res, error.message, 500);
    }
};

exports.updateCar = async (req, res) => {
    try {
        const { title, description, tags, removeImages } = req.body;
        const car = await Car.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!car) {
            return ApiResponse.error(res, 'Car not found', 404);
        }

        if (title) car.title = title;
        if (description) car.description = description;
        if (tags) {
            try {
                car.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
            } catch (error) {
                return ApiResponse.error(res, 'Invalid tags format', 400);
            }
        }

        if (req.files && req.files.length > 0) {
            if (removeImages === 'true') {
                for (const image of car.images) {
                    try {
                        await fs.unlink(path.join('uploads', image));
                    } catch (error) {
                        console.error('Error deleting image:', error);
                    }
                }
                car.images = req.files.map(file => file.filename);
            } else {
                car.images = [...car.images, ...req.files.map(file => file.filename)];
            }
        }

        await car.save();
        ApiResponse.success(res, car, 'Car updated successfully');
    } catch (error) {
        console.error('Update car error:', error);
        ApiResponse.error(res, error.message, 500);
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!car) {
            return ApiResponse.error(res, 'Car not found', 404);
        }

        for (const image of car.images) {
            try {
                await fs.unlink(path.join('uploads', image));
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

        await car.remove();
        ApiResponse.success(res, null, 'Car deleted successfully');
    } catch (error) {
        ApiResponse.error(res, error.message, 500);
    }
};