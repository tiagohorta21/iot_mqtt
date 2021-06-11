const express = require('express')
const app = express()
const port = 3000
let startTimer = false;
let timer = 0;

function updateTimer() {
  if(startTimer) {
    timer+= 1000;
  }
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  startTimer = true;
  const voltage = 1;
  const maxVoltageTimer = 0;

  res.render('index', { 
     voltage:voltage, 
     timer: millisToMinutesAndSeconds(timer),
     maxVoltageTimer: maxVoltageTimer
  })
})

app.get('/values', (req, res) => {
  const voltage = 1;
  const maxVoltageTimer = 0;

  console.log(millisToMinutesAndSeconds(timer), timer)

  res.send({
    voltage,
    maxVoltageTimer,
    timer: millisToMinutesAndSeconds(timer),
  })
})

app.get('/on', (req, res) => {
  startTimer = true;
  res.status(200).send()
})

app.get('/off', (req, res) => {
  startTimer = false;
  timer = 0;

  res.status(200).send()
})

app.listen(port, () => {
  setInterval(updateTimer, 1000);
  console.log(`Example app listening at http://localhost:${port}`)
})