const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: [{
        type: Buffer,
        default: null,
      }],
    date:{
        type: String,
        default: Date.now,
    }
    
  });
  module.exports = mongoose.model('notes', NotesSchema);
  