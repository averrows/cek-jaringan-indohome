const express = require("express")
const fs = require('fs')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://averus:gzEqw8fOLEJcBVwp@cluster0.qsqin.mongodb.net/cekJaringan?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html')
})

app.post('/data-perProvinsi',(req,res)=>{
    client.connect((err,db)=>{
        if(err) throw err
        var dbo = db.db('cekJaringan')
        console.log(req.body['provinsi'])
        dbo.collection("statusLokasi").find({provinsi:req.body['provinsi']}).toArray((err,result)=>{
            if(err) throw err
            console.log(result)
            res.json(result)
        })
    })
})

app.post('/status-lokasi', (req, res) => {
    console.log(req.body['lokasi'])
    client.connect((err, db) => {
        if (err) throw err
        var dbo = db.db("cekJaringan")
        var myquery = req.body['lokasi']
        dbo.collection("statusLokasi").findOne(myquery, (err, hasil) => {
            if (err) throw err
            console.log(hasil.status)
            res.json({status:hasil.status})
        })
    })
})


app.put("/ubah-status", (req, res) => {
    client.connect((err, db) => {
        if (err) throw err
        let dbo = db.db("cekJaringan")
        // query permintaan
        // {
        //  lokasi:{
        //     provinsi: xxx,
        //     kota: xxx},
        //  statusBaru:xxx,
        // }
        let myquery = req.body['lokasi']
        let newvalues = { $set: { provinsi: req.body['lokasi']['provinsi'], kota: req.body['lokasi']['kota'], status: req.body['statusBaru'] } }
        dbo.collection("statusLokasi").updateOne(myquery, newvalues, (err, res) => {
            if (err) throw err;
            console.log("Statsus sudah diubah")
        })
    })
    res.send("gg")
})

app.get("/admin", (req, res) => {
    res.sendFile(__dirname+"/admin/index.html")
})
app.get("/data-lokasi", (req, res) => {
    const lokasi = JSON.parse(fs.readFileSync('./data/regions.json', 'utf-8'))
    res.json(lokasi)
})

app.listen(process.env.PORT||3000, () => console.log("connected"))
