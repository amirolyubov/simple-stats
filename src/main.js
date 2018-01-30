// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const monitor = require('active-window')
const name = document.getElementById('name')
const title = document.getElementById('title')
const time = document.getElementById('time')

const db = require('./db.js')
const graph = require('./graph.js')

const prepareDataForDb = data => '__app::: ' + data.app + ' ||| ' + '__title::: ' + data.title + ' ||| ' + '__time::: ' + data.time + ' ||| ' + '__now::: ' + Date.now() + '\n'
const getSessionStartTime = () => '__start:::' + Date.now() + '\n'
const getSessionEndTime = () => '__end:::' + Date.now() + '\n' + '====' + '\n'

db.writeOne(getSessionStartTime())

const Timer = () => {
  let shoot = Date.now()
  return {
    getSeconds: () => Math.floor((Date.now() - shoot) / 1000),
    updateShoot: () => shoot = Date.now()
  }
}
let timer = Timer()



let previousProcess = {}
setInterval(() => {
  monitor.getActiveWindow(win => {
    win.app != previousProcess.app && timer.updateShoot() && previousProcess.app && db.writeOne(prepareDataForDb(previousProcess))
    win.app != previousProcess.app && graph.updateTimeChart()
    previousProcess = {app: win.app, title: win.title, time: timer.getSeconds()}

    name.innerHTML = previousProcess.app
    title.innerHTML = previousProcess.title
    time.innerHTML = previousProcess.time
  })
}, 1000)
