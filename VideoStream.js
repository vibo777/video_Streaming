const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(cors());

// Create end point to read video file 
app.get("/video",(req,res)=>{
    const range = req.headers.range;
    if(!range){
        res.status(400).send({message:"Range header is required"});
    }    

    // determine the size of video 
    const videoSize = fs.statSync("./video.mp4").s;

    // start byte of the chunk 
    const start = Number(range.replace(/\D/g,""));

    // end byte of chunk
    const end = Math.min(start+10**6,videoSize-1);

    const contentlength = end - start + 1;

    let headers = {
        "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges" : "bytes",
        "Content-length" : contentlength,
        "content-Type" : "video/mp4"
    }

    res.writeHead(206,headers);

    let videoStream = fs.createReadStream("./video.mp4",{start,end});

    videoStream.pipe(res);
})
app.listen(3000);



