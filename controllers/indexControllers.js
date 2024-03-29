import mongoose from 'mongoose';
const index=mongoose.model('index');

const indexControl={
    create:(req,res)=>{
        index
            .create({
                title: req.body.title,
                content: req.body.content,
            })
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
export default indexControl;