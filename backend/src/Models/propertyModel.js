import slugify from 'slugify';
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: [true, 'PLease enter your Property name '],
    },
    description: {
        type: String,
        required: [true, 'Please enter your Property description'],
    },
    extraInfo: {
        type: String,
        default: 'No extra information provided'
    },
    propertyType: {
        type: String,
        enum: ["House", "Flat", "Guest House", "Hotel"],
        default: "House"
    },
    roomType: {
        type: String,
        enum: ["Anytype", "Room", "Entire Room"],
        default: "Anytype"
    },
    maximumGuests: {
        type: Number,
        required: [true, 'Please enter maximum number of guests'],
    },

    amenities: [
        {
            name: {
                type: String,
                required: true,
                enum: ["Wifi", "TV", "Air Conditioning", "Heating", "Kitchen", "Washer", "Dryer", "Free Parking on Premises", "Gym", "Pool", "Hot Tub", "Breakfast", "Pets Allowed"],
            },
            icon: {
                type: String,
                required: true,
            }
        }
    ],
    images: {
        type: [
            {
                public_id: {
                    type: String,
                },
                url: {
                    type: String,
                    required: true,
                }
            }
        ],
        validate:
        {
            validator: function (arr) {
                return arr.length >= 6;
            },
            message: 'Please provide at least 6 images for the property'
        }

    },
    price: {
        type: Number,
        reuired: [true, 'Please enter the price per night value'],
        default: 500
    },
    address: {
        area: String,
        city: String,
        state: String,
        pincode: Number
    },

    currentBookings: [
        {
            bookingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking"
            },
            fromDate: {
                type: Date
            },
            toDate: {
                type: Date,
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId, // user Schema imported directly from userModel.js
        ref: "User",
    },
    slug: String,
    checkInTime: { type: String, default: "11:00" },
    checkOutTime: { type: String, default: "13:00" }

})

propertySchema.pre("save", function () {
    this.slug = slugify(this.propertyName, { lower: true });
    
})

propertySchema.pre("save", function () {
    this.address.city = this.address.city.toLowerCase().replaceAll(" ", "")
    
})

//const Property = mongoose.model("Property", propertySchema);

const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);

export { Property };




