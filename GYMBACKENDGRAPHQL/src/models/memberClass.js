const mongoose = require('mongoose');

const memberClassSchema = new mongoose.Schema({
     // Add schema properties.

  namemember:        {type: String},
  client_CI:         {type: String, require: true },
  email:             {type: String, require: true },
  phone:             {type: String, require: true },
  classname:         {type: String, require: true},
  timedays:          {type: Number, require: true },
  cost:              {type: Number, require: true },
  code:              {type: String, require: true },
  status:            {type: String, require: true },
  leftdays:          {type: Number, require: true },
  createdAt:         {type: Date, default: Date.now},
  imageUser:         {type: String, require: true },
  finishAt:          {type: Date, default: Date.now},
  
});

module.exports = mongoose.model('MemberClass', memberClassSchema);