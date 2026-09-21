import { Property } from "../Models/propertyModel.js"
import { Booking } from "../Models/bookingModel.js"

//create order
const createOrder = async (req, res) => {
    const { amount, propertyId, fromDate, toDate, guests } = req.body;

    //orderID=order_1224097413
    const orderId = "order_" + Date.now();
    res.json({
        success: true,
        message: "Order created succesfully",
        orderId,
        amount,
        propertyId,
        fromDate,
        toDate,
        guests
    })



}

//verify payment function
//1.save the booking
//2.Block these dates

const verifyPayment = async (req, res) => {
    const { orderId, bookingDetails, forceStatus } = req.body;

    if (forceStatus == "success") {
        const paymentId = "pay_" + Date.now();

        //save booking
        const newBooking = await Booking.create({
            user: req.user._id,
            property: bookingDetails.propertyId,
            price: bookingDetails.price,
            fromDate:bookingDetails.fromDate,
            toDate: bookingDetails.toDate,
            guests: bookingDetails.guests,
            numberOfnights: bookingDetails.nights,
            paid: true
        });

        //tell property those date are already booked 

        const updatedProperty = await Property.findByIdAndUpdate(
            bookingDetails.propertyId, {
            $push: {
                currentBookings: {
                    bookingId: newBooking._id,
                    fromDate: bookingDetails.fromDate,
                    toDate: bookingDetails.toDate,
                    userId: req.user._id
                }
            }
        },
            { new: true }
        );
        res.json({
            success: true,
            message: "Payment ssuccessful,booking confirmed!!",
            paymentId,
            orderId,
            booking: newBooking
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Payment failed!",
            orderId
        })
    }
}


//get my bookings (just like  booking history)

const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })

        res.status(200).json({
            status: "success",
            data: {
                bookings
            }
        })
    } catch (error) {
        res.status(401).json({
            status: "fail",
            message: error.message
        })


    }
}

//get one booking details 

const getBookingDetails=async(req,res)=>{
    try{
      const bookings=await Booking.findById(req.params.bookingId)
    
    
        res.status(200).json({
            status: "success",
            data: {
                bookings
            }
        })
    }catch(error){

        res.status(401).json({
            status: "fail",
            message: error.message
        })
    }
}

export {getBookingDetails,getUserBookings,createOrder,verifyPayment}
