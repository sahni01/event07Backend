const userCollection = require("../../db/model/user");
const brcypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config()



const createUserController = async (req, res) => {
    try{
        const data = req.body;
        if(data.email && data.name && data.password && data.role){
            const userExists = await userCollection.findOne({ email: data.email });
            if(!userExists){
                const hashedPassword = await brcypt.hash(data.password, 10)
                const user = new userCollection({
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    role: data.role,
                    _id: mongoose.Types.ObjectId()
                })

                const savedUser = await user.save();

                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "User Created Successfully *",
                    data: savedUser
                })
            } else {
                res.status(409).json({
                    status: 409,
                    success: false,
                    message: "User Already Exists *"
                })
            }
        } else {
            res.status(409).json({
                status: 409,
                success: false,
                message: "All fields are required *"
            })
        }
    } catch (err) {
        console.log("Create User ERROR ====> ",err)
        res.status(400).json({
            status: 400,
            success: false,
            message: "Something Went Wrong *"
        })
    }
}


const adminLoginController = async (req, res) => {
    try {
        if (req.body.email && req.body.password) {
            const user = await userCollection.findOne({ email: req.body.email })
            const verify = await brcypt.compare(req.body.password, user.password)
            console.log(verify)
            if (verify) {
                let token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY)
                res.status(200).json(
                    {
                        status: 200,
                        success: true,
                        name: user.name,
                        email: user.email,
                        token: token,
                    }
                )
            } else {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: "Invalid Credentials"
                })
            }
        } else {
            res.status(400).json({
                status: 400,
                success: false,
                message: "Invalid Credentials"
            })
        }
    } catch (err) {
        console.log("Admin Login ERROR ====> ",err)
        res.status(400).json({
            status: 400,
            success: false,
            message: "Invalid Credentials"
        })
    }
}


const adminChangePasswordController = async (req, res) => {
    try {
        if (req.body.email && req.body.newPassword && req.body.password) {
            const user = await userCollection.findOne({ email: req.body.email });
            const verify = await brcypt.compare(req.body.password, user.password);
            if (verify) {
                const hashedPassword = await brcypt.hash(req.body.newPassword, 10)
                const updatedUser = await userCollection.findOneAndUpdate({ email: req.body.email }, { password: hashedPassword })
                console.log(updatedUser);
                res.status(200).json({
                    status:200,
                    success:true,
                    message:"Password Changed Successfully"
                });
            } else {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: "Invalid Credentials"
                })
            }
        } else {
            res.status(400).json({
                status: 400,
                success: false,
                message: "Invalid Credentials"
            })
        }
    } catch (err) {
        console.log("Change Password Error ====> ",err)
        res.status(400).json({
            status: 400,
            success: false,
            message: "Invalid Credentials"
        })
    }
}


const tokenVerifyController = async (req,res) => {
    try{
        const token = req.body.token;
        if(token){
            const userId = jwt.verify(token,process.env.JWT_SECRET_KEY).id;
            const user = await userCollection.findById(userId);
            if(user.role === "admin"){
                res.status(200).json(
                    {
                        status: 200,
                        success: true,
                        name: user.name,
                        email: user.email,
                    }
                )
            } else {
                res.status(401).json({
                    status:401,
                    success:false,
                    message:"You are not an authorized user"
                })
            }
        } else {
            res.status(401).json({
                status:401,
                success:false,
                message:"You are not an authorized user"
            })
        }

           
        
    } catch (err) {
        console.log("VERIFY TOKEN ERROR ====> ",err.message)
        res.status(401).json({
            status:401,
            success:false,
            message:"You are not an authorized user"
        })
    }
}



module.exports = {adminChangePasswordController,adminLoginController,tokenVerifyController,createUserController}