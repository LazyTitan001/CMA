const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    tags: {
        car_type: String,
        company: String,
        dealer: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

carSchema.index({ 
    title: 'text', 
    description: 'text',
    'tags.car_type': 'text',
    'tags.company': 'text',
    'tags.dealer': 'text'
});

module.exports = mongoose.model('Car', carSchema);