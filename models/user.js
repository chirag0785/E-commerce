const mongoose=require('mongoose');
const {Schema}=mongoose;

let userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:String,
    cart:[
        {
            id:{
                type:Schema.Types.ObjectId,
                required:true,
                ref:'products'
            },
            quantity:Number
        }
    ],
    orders:[
        {
            products:[
                {
                    product:{
                        id:{
                            type:Schema.Types.ObjectId,
                            required:true,
                            ref:'products'
                        }
                    },
                    quantity:Number,
                    totalPrice:Number,
                }
            ],
            date:{
                type:Date,
                default:Date.now
            }
        }
    ],
    role:{
        type:String,
        default:'user'
    }
})

module.exports=mongoose.model('users',userSchema);


// let users=[
//     {
//         "name":"Pratik",
//         "email":"pratik@gmail.com",
//         "passowrd":"123456",
//         "cart":[]
//     },
//     {
//         "name":"Dhairya",
//         "email":"dhairya@gmail.com",
//         "passowrd":"654321",
//         "cart":[]
//     },
//     {
//         "name":"Raman",
//         "email":"raman@gmail.com",
//         "passowrd":"abc@gmail.com",
//         "cart":[]
//     }
// ]