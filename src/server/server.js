const PORT = 3000;
const express = require('express');
const app = express();
let objectEndpoint = {}
// Middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());
app.use(express.static('dist'));
app.get('/', (req, res) => {
    res.sendFile('dist/index.html')
})

app.post('/add', (req, res) => {
    objectEndpoint.low_temp = req.body.low_temp;
    objectEndpoint.max_temp = req.body.max_temp;
    objectEndpoint.leave_time = req.body.leave_time;
    objectEndpoint.weather_des = req.body.weather_des;
    objectEndpoint.city_name = req.body.city_name;
    objectEndpoint.days_left = req.body.days_left;
    res.send(objectEndpoint)
})
app.get('/get-back-data', (req, res) => {
    res.send(objectEndpoint)
})
app.listen(PORT, function() {
    console.log('app running on: '+ PORT)
})


