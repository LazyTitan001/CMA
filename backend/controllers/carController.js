const Car = require('../models/Car');
const ApiResponse = require('../utils/apiResponse');
const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;

exports.createCar = async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const uploadPromises = req.files.map(file => 
            cloudinary.uploader.upload(file.path, {
                folder: 'cars'
            })
        );

        const uploadResults = await Promise.all(uploadPromises);
        
        for (const file of req.files) {
            await fs.unlink(file.path);
        }

        const images = uploadResults.map(result => ({
            url: result.secure_url,
            public_id: result.public_id
        }));

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
                    await cloudinary.uploader.destroy(image.public_id);
                }

                const uploadPromises = req.files.map(file =>
                    cloudinary.uploader.upload(file.path, {
                        folder: 'cars'
                    })
                );

                const uploadResults = await Promise.all(uploadPromises);
                car.images = uploadResults.map(result => ({
                    url: result.secure_url,
                    public_id: result.public_id
                }));

                for (const file of req.files) {
                    await fs.unlink(file.path);
                }
            } else {
                const uploadPromises = req.files.map(file =>
                    cloudinary.uploader.upload(file.path, {
                        folder: 'cars'
                    })
                );

                const uploadResults = await Promise.all(uploadPromises);
                const newImages = uploadResults.map(result => ({
                    url: result.secure_url,
                    public_id: result.public_id
                }));

                car.images = [...car.images, ...newImages];

                for (const file of req.files) {
                    await fs.unlink(file.path);
                }
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
            await cloudinary.uploader.destroy(image.public_id);
        }

        await car.deleteOne(); 
        ApiResponse.success(res, null, 'Car deleted successfully');
    } catch (error) {
        ApiResponse.error(res, error.message, 500);
    }
};