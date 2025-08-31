import { instance } from "../index.js";
export const checkout = async (req,res)=>{

    const options = {
        amount: 50000,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
          
    };
    const order = await instance.orders.create(options)

    console.log(order);
    res.status(200).json({
        success : true,
    });
}; 
