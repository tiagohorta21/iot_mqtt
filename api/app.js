// Modules
const express = require('express')
const mqtt = require('mqtt')
const app = express()
// MQTT
const client  = mqtt.connect('mqtt://192.168.1.202')
const port = 3000

app.set('view engine', 'pug')
const TOPIC_COMMANDS = 'commands'
const TOPIC_VALUES = 'values'

let startTimer = false;
let timer = 0;
const messages = [];

function updateTimer() {
  if(startTimer) {
    timer+= 1000;
  }
}

function millisToMinutesAndSeconds(millis) {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

app.get('/', (req, res) => {
  startTimer = true;
  const voltage = 1;

  res.render('index', { 
     voltage:voltage, 
     timer: millisToMinutesAndSeconds(timer)
  })
})

app.get('/values', (req, res) => {
  const voltage = 1;

  res.send({
    voltage,
    timer: millisToMinutesAndSeconds(timer)
  })
})

app.get('/on', (req, res) => {
  client.publish(TOPIC_COMMANDS, "1")
  startTimer = true;
  res.status(200).send()
})

app.get('/off', (req, res) => {
  client.publish(TOPIC_COMMANDS, "0")
  startTimer = false;
  timer = 0;

  res.status(200).send()
})

app.listen(port, () => {
  client.on('connect', function (response) {
    if(response.cmd === 'connack') {
      console.info('MQTT: Connected sucessfully')
    } else {
      console.error('MQTT: Error', response)
    }

    client.subscribe(TOPIC_VALUES, function (err) {
      if (err) {
        console.error(err)
      }
    })

    client.subscribe(TOPIC_COMMANDS, function (err) {
      if (err) {
        console.error(err)
      }
    })
  })
   
  client.on('message', function (topic, message) {
    switch (topic) {
      case TOPIC_VALUES:
        messages.push(message.toString())
        break;
      case TOPIC_COMMANDS:
        console.log(message.toString())
      default:
        console.log(message.toString())
        break;
    }
  })
  setInterval(updateTimer, 1000);
  console.log(`Example app listening at http://localhost:${port}`)
})