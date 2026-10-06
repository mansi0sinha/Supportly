"use server"
import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDB from "@/db/connectDB"
import User from "@/models/User"
export const initiate=async(FaSortAmountDown,to_username,paymentform)=>{
    await connectDB()
    var instance =new Razorpay({key_id:process.env.KEY_ID,key_secret:process.env.KEY_SECRET})
    
    let options={
        amount:Number.parseInt(amount),
        currency:"INR",
    }
    let x=await instance.orders.create(options)
    await Payment.create({old:x.id,amount:amount,to_username:to_username,name:paymentform.name,message:paymentform.message})
    return x
}