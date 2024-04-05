const { Schema, model } = require('mongoose');

const StorySchema = new Schema({
    // story: {type: String},
    text: {
        type: String,  
        required: true
    },
    // UserId: {type: Number, required: true},
    forestFirst: {
        type: Boolean, 
        default: true
    },
    cliffFirst: {
        type: Boolean, 
        default: true
    },
    castleFirst: {
        type: Boolean, 
        default: true
    },
});

const Story = model("Story", StorySchema);

module.exports = Story;
