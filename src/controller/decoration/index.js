const decorationCollection = require("../../db/model/decoration")

const saveDecoration = async (req,res) => {
    try{
       if(req.body){
            const newDecoration = new decorationCollection(req.body);
            const saved = await newDecoration.save();
            console.log("Saved Decoration ====> ",saved);
            res.status(200).json({
                status:200,
                success:true,
                message:"Decoration Saved Successfully"
            });
       }else{
        res.status(400).json({
            status:400,
            success:false,
            message:"Please fill all the fields."
        })
       }
    } catch (err) {
        console.log("Save Decoratioon Error ====> ",err)
        res.status(400).json({
            status:400,
            success:false,
            message:"Something Went Wrong"
        })
    }
}

const updateDecoration = async (req,res) => {
    try{
        const id = req.params.id;
        const decoration = await decorationCollection.findByIdAndUpdate(id,req.body)
        res.status(200).json({
            status:200,
            success:true,
            message:"Decoration Updated Successfully"
        });
    } catch (err) {
        res.status(400).json({
            status:400,
            success:false,
            message:"Something Went Wrong"
        })
    }
}

const getDecoration = async (req,res) => {
    try{
        const id = req.params.id;
        const decoration = await decorationCollection.find({_id:id});
        res.status(200).json(decoration);
    } catch (err) {
        res.status(400).json({
            status:400,
            success:false,
            message:"Something Went Wrong"
        })
    }
}

const getDecorations = async (req,res) => {
    try{
        const type = req.params.type;
         switch(type){
            case "birthday-decorations":
                const birthdayDecorations = await decorationCollection.find({type:"birthday"});
                res.status(200).json(birthdayDecorations.reverse());
                break;
            case "anniversary-decorations":
                const anniversaryDecorations = await decorationCollection.find({type:"anniversary"});
                res.status(200).json(anniversaryDecorations.reverse());
                break;
            case "baby-shower":
                const babyShowerDecorations = await decorationCollection.find({type:"baby-shower"});
                res.status(200).json(babyShowerDecorations.reverse());
                break;
            case "banquet-hall":
                const banquetHallDecorations = await decorationCollection.find({type:"banquet-hall"});
                res.status(200).json(banquetHallDecorations.reverse());
                break;
            case "others":
                const otherDecorations = await decorationCollection.find({type:"others"});
                res.status(200).json(otherDecorations.reverse());
                break;
            default :
                res.status(404).json({
                    status:404,
                    success:false,
                    msg: "Category Not Found"
                });
         }
        
    } catch (err) {
        console.log("GET Decorations Error ====> ",err)
        res.status(400).json({
            status:400,
            success:false,
            message:"Something Went Wrong"
        })
    }
}

const deleteDecoration = async (req,res) => {
    try{
        const id = req.params.id;
        // idList.forEach(async (element) => {
        const deleted = await decorationCollection.findByIdAndDelete(id);
        // });
        res.status(200).json({
            status:200,
            success:true,
            message:"Decoration Deleted Successfully"
        })
    } catch (err) {
        console.log("Decoration Delete Error ====> ",err.message)
        res.status(400).json({
            status:400,
            success:false,
            message:"Something Went Wrong"
        })
    }
}


const getAllDecorations = async (req,res) => {
    try{
        const allDecoration = await decorationCollection.find();
        res.status(200).json({
            status:200,
            success:true,
            data: allDecoration
        })
        
    } catch (err) {
        console.log("GET All Decorations Error ====> ",err)
        res.status(400).json({
            status:400,
            success:false,
            message:"Something Went Wrong"
        })
    }
}


const decorationOverview = async (req,res) => {
    try{
        const birthdayDecorations = await decorationCollection.find({type:"birthday"});
        const anniversaryDecorations = await decorationCollection.find({type:"anniversary"});
        const babyShowerDecorations = await decorationCollection.find({type:"baby-shower"});
        const banquetHallDecorations = await decorationCollection.find({type:"banquet-hall"});
        const otherDecorations = await decorationCollection.find({type:"others"});

        res.status(200).json({
            status:200,
            success:true,
            data:{
                birthday:birthdayDecorations.length,
                anniversary: anniversaryDecorations.length,
                babyShower: babyShowerDecorations.length,
                banquetHall: banquetHallDecorations.length,
                others: otherDecorations.length
            }
        })
    } catch (err) {
        res.status(400).json({
            status:400,
            success:false,
            message:"Something Went Wrong"
        })
    }
}


module.exports = {
    getDecoration,getDecorations,saveDecoration,updateDecoration,deleteDecoration, decorationOverview, getAllDecorations
}