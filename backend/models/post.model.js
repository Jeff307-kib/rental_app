import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',    
        required: true,
    },

    type: {
        type: String,
        enum: ["Apartment", "House", "Hostel", "Shop Place"],
        required: [true, 'A Post must have a type.']
    },


    status: {
        type: String,
        enum: ["Available", "Rented"],
        default: "Available"
    },

    price: {
    type: Number,
    min: [0, 'Price must be a positive number'],
    required: true
    },


    locationName: {
        type: String,
        required: [true, 'A Post must have a location name.']
    },

    location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
    },

    photos: [String],

    video: {
        type: String
    },

    contact: {
        type: [String],
        validate: v => v.length > 0 || 'At least one contact is required.'
    },

    areaSize: {
        type: String,
        required: [true, 'A post must have area.'],
    },
    
    description: {
        type: String
    },

    facilities: {

    totalRooms: {
        type: Number
    },
    hasLift: {
        type: Boolean
    },

    parking: [
    {
    vehicleType: {
      type: String,
      enum: ["Car", "Motorcycle"]
    },
    quantity: {
      type: Number,
      min: 1
    },
    description: String
    }
   ],

 
    numLivingRooms: {
        type: Number,
    },

    numKitchens: {
        type: Number,
    },

    numBathrooms: {
        type: Number,
    },

    numBedrooms: {
        type: Number,
    },

    hasCompound: {
        type: Boolean,
    },

    compoundSize: {
        type: String,
    },

    cookingAllowed: { 
        canCookRice: Boolean,
        canFry: Boolean
    },
    },

    roomType: {
        type: String,
    },

    houseType: {
        type: String,
    },

    genderType: {
        type: String,
        enum: ["Male", "Female", "All"]
    },

    toiletType: {
        type: String,
    },
    
    rules: {
        type: String,
    },

    lastStatusChangedAt: {
        type: Date
    }
}, { timestamps: true })

postSchema.index({ location: '2dsphere' }); // Without this, location queries will be slow or impossible.


export default mongoose.model('Post', postSchema);


postSchema.pre('save', function (next) {
  // `this` = current document

  if (this.isModified('status') && this.status === 'Rented') {
    this.lastStatusChangedAt = new Date();
  }

  next();
});
