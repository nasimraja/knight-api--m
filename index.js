const express = require('express');
const multer  = require('multer')
const cors = require('cors')
const bodyParser = require('body-parser')
require('./db/Config')
const User = require("./model/User");
const Slider = require("./model/Slider")
const Timer = require("./model/timer")
const Uploadslider = require ("./model/uploadslider")
const Jwt = require("jsonwebtoken");
// const { validate } = require('./db/User');
const JwtKey = "knight-k";
const app = express();
app.use(cors());

app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(express.json());



// app.use('uploads', express.static('uploads'))

// const profileStorage = multer.diskStorage({
//     destination: 'uploads',
//     filename:(req,file, cb) =>{
//         return cb(null, `${file.fieldname}_${Date.now()}${paths.extname(file.originalname)}`)
//     }
// })

// const profileupload = multer({
//     storage: profileStorage,
//     limits: {fileSize: 2000000},
// })



 app.post('/api/upload/slide',(req,resp)=>{
    upload(req, resp,(err)=>{
        if(err){
            console.log(err)
        }
        else{
            const newImage = new uploadslider({
                userid: req.body.userid,
                link: req.body.link,
                slideimg: req.file.originalname
            })
            newImage.save()
                .then(()=>resp.send("successfully uploaded")).catch(err=>console.log(err));
        }
    })
 })


app.post("/api/resigster", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    resp.send(result);
})

app.post("/api/login", async (req, resp) => {

    if (req.body.password && req.body.email) {

        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, JwtKey, { expiresIn: "24h" }, (err, token) => {
                resp.send({ user, auth: token })
            })

        }
        else {
            // resp.send({ result: "No user found" });
            resp.status(501).json({
                message: "No user found"
            })
        }

    }
    else {
        resp.status(501).json({
            message: "No user found"
        })
    }


})


app.post('/api/add/slider/name', verifyToken, (req, res) => {
    const slider = new Slider({
        name: req.body.name,
        userid: req.body.userid,
        uploadimg: req.body.uploadimg,
        link: req.body.link
    })
    slider.save()
        .then(result => {
            res.status(200).json({
                message: "slider name inserted successfully"
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "error"
            })
        })
})

app.get('/api/get/slidername',verifyToken, async (req,resp)=>{
    const sliderNamelist = await Slider.find();
    if(sliderNamelist.length > 0){
        resp.status(200).json({
            data: sliderNamelist
        })
    }else
    {
        resp.send({result: "No product found"})
    }
})

app.post('/api/add/slider',verifyToken, (req, res) => {
    const uploadslider = new Uploadslider({
        userid: req.body.userid,
        slidernameId: req.body.slidernameId,
        link: req.body.link,
        slideimg: req.body.slideimg
       
    })
    uploadslider.save()
        .then(result => {
            res.status(200).json({
                message: "slider inserted successfully"
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "error"
            })
        })
})

app.post("/api/update/slidername/:id",verifyToken, async(req, resp)=>{
    const sliderResult = await Slider.updateOne(
        {_id: req.params.id},
        {$set: req.body}
    );
    resp.send(sliderResult)
})

app.post("/api/delete/slidername/:id",verifyToken, async(req, resp)=>{
    const sliderResult = await Slider.deleteOne(
        {_id: req.params.id},
       
    );
    resp.send(sliderResult)
})


app.get("/api/get/slider/:id", async(req, resp)=>{
    
    const sliderResult = await Uploadslider.findOne(
        {_id: req.params.id},
    );
    
    if(sliderResult){
        resp.status(200).json({
            data: sliderResult
        })
    }else
    {
        resp.send({result: "No slide found"})
    }
    
})

app.post("/api/delete/slider/:id", async(req, resp)=>{
    
    const sliderResult = await Uploadslider.deleteOne(
        {_id: req.params.id},
    );
    
    if(sliderResult){
        resp.status(200).json({
            data: sliderResult
        })
    }else
    {
        resp.send({result: "No slide found"})
    }
    
})

app.post("/api/update/slider/by/:id",verifyToken, async(req, resp)=>{
    const sliderResult = await Uploadslider.updateOne(
        {_id: req.params.id},
        {$set: req.body}
    );
    resp.send(sliderResult)
})


app.get("/api/get/slider/by/:id", async(req, resp)=>{
    console.log(req.params.id)
    const sliderResult = await Uploadslider.find(
        {slidernameId: req.params.id},
    );
    
    if(sliderResult){
        resp.status(200).json({
            data: sliderResult
        })
    }else
    {
        resp.send({result: "No slider found"})
    }
    
})

app.get('/api/get/timer', async (req,resp)=>{
    const timerlist = await Timer.find();
    if(timerlist.length > 0){
        resp.status(200).json({
            data: timerlist
        })
    }else
    {
        resp.send({result: "No timer found"})
    }
})



function verifyToken(req, resp, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1];
        Jwt.verify(token, JwtKey, (err, valid) => {
            if (err) {
                resp.status(401).send({ result: "Please provide valid token" })
            } else {
                next();
            }
        })
    } else {
        resp.status(403).send({ result: "Please add token with headers" })
    }
}

app.listen(3800)