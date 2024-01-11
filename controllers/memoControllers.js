import memoModel from "../models/memo.js";
const memoControl = {
    hello: (req, res) => {
        res.json({
            "success": "i love you"
        })
    },
    getAll: async(req, res) => {

        try{
            const memo=await memoModel.find()
            res.status(200).json(memo)
        }catch(err){
            res.status(500).json(err)
        }
    },
    create:(req,res)=>{
        memo.create({
            title:req.body.title,
            content:req.body.content
        },(err)=>{
            if(err)res.status(400).json(err)
            else{
                res.status(201).json({message:'create schema success'})
            }
        })
    },
    delete:async (req,res)=>{
        try{
            const id=req.params.id
            const deleted=await memo.findByIdAndDelete({_id:id})
            if(deleted){
                return res.status(200).json({message:'Deleted Successfully', deleted})
            }else{
                return res.status(404).json({message:'not found', id:id})
            }
        }catch(err){
            return res.status(500).json({message:'error'}, err)
        }
    },
    update:(req,res)=>{
        memo.findByIdAndUpdate(req.params.id, {$set:req.body}, (err, memo)=>{
            if(err) res.json(err)
            else res.json(memo)
        })
    }
}
export default memoControl;