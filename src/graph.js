const db = require('./db.js')
const timeChart = document.getElementById('timeChart')
const svgns = "http://www.w3.org/2000/svg"
const timeContainer = document.createElementNS(svgns, 'rect')
const colors = []

const randColor = () => '#' + Math.floor(Math.random() * 9) + '' + Math.floor(Math.random() * 9) + '' + Math.floor(Math.random() * 9)
const clearChart = () => timeChart.innerHTML = null
const clearLegend = () => timeLegend.innerHTML = null
const renderBlock = (block) => {
  let rect = document.createElementNS(svgns, 'rect')
  rect.setAttributeNS(null, 'x', block.x + '%')
  rect.setAttributeNS(null, 'y', 0)
  rect.setAttributeNS(null, 'width', block.width + '%')
  rect.setAttributeNS(null, 'height', '100%')
  rect.setAttributeNS(null, 'fill', block.__color)
  timeChart.appendChild(rect)
}

const renderOneDate = app => {
  const dateItem = document.createElementNS(svgns, 'text')
  dateItem.setAttributeNS(null, 'font-size', 12)
  dateItem.setAttributeNS(null, 'fill', '#fff')
  dateItem.append(app)
  timeContainer.appendChild(dateItem)
}
const renderTime = apps => {
  timeContainer.setAttributeNS(null, 'width', '100%')
  timeContainer.setAttributeNS(null, 'height', 10)
  timeContainer.setAttributeNS(null, 'fill', '#000')
  timeContainer.setAttributeNS(null, 'id', 'timeContainer')

  apps = apps.map(app => app = new Date(new Number(app.__now)).toTimeString())
  apps.map(app => renderOneDate(app))

  timeChart.appendChild(timeContainer)
}

const renderLegend = apps => {
  const legendContainer = document.createElementNS(svgns, 'g'),
        legendBgRect = document.createElementNS(svgns, 'rect')
  legendBgRect.setAttributeNS(null, 'fill', 'rgba(0,0,0,0.4)')
  let itemY = 40
  for (let app in apps) {
    let legendItem = document.createElementNS(svgns, 'svg'),
        itemTitle = document.createElementNS(svgns, 'text'),
        itemColor = document.createElementNS(svgns, 'rect')
    itemTitle.append(app.split(',')[1])
    itemColor.append(apps[app])
    //
    legendItem.setAttributeNS(null, 'x', 10)
    legendItem.setAttributeNS(null, 'y', itemY)
    legendItem.setAttributeNS(null, 'height', 50)
    //
    itemTitle.setAttributeNS(null, 'font-size', 12)
    itemTitle.setAttributeNS(null, 'x', 32)
    itemTitle.setAttributeNS(null, 'y', 12)
    itemTitle.setAttributeNS(null, 'fill', '#fff')
    //
    itemColor.setAttributeNS(null, 'fill', apps[app])
    itemColor.setAttributeNS(null, 'width', 30)
    itemColor.setAttributeNS(null, 'height', 15)
    //
    legendItem.appendChild(itemColor)
    legendItem.appendChild(itemTitle)
    //
    legendContainer.setAttributeNS(null, 'class', 'legendContainer')
    legendContainer.appendChild(legendItem)
    //
    itemY += 15
  }
  timeChart.appendChild(legendContainer)
  legendBgRect.setAttributeNS(null, 'width', legendContainer.getBBox().width + 15)
  legendBgRect.setAttributeNS(null, 'height', legendContainer.getBBox().height + 6)
  legendBgRect.setAttributeNS(null, 'x', 7)
  legendBgRect.setAttributeNS(null, 'y', 37)
  legendContainer.insertAdjacentElement('afterbegin', legendBgRect)
}

const setColors = data => {
  let uniqueApps = {}
  data.map(item => !uniqueApps[item.__app] && ((app) => {uniqueApps[app] = randColor()})(item.__app))
  data.map(item => item.__color = uniqueApps[item.__app])
  return {data, uniqueApps}
}

const parseStroke = stroke => {
  let strokeObj = {}
  stroke = stroke
  .split(' ||| ')
  .map(key => key.split('::: '))
  stroke.map((key, i) => {
    strokeObj[key[0]] = key[0] == '__time' ? Number(key[1]) : key[1]
  })
  return strokeObj
}

const renderTimeChart = data => {
  data.pop()
  apps = setColors(data)
  let totalTime = 0
  apps.data.map(item => {
    item.x = totalTime
    totalTime += !!item.__time && item.__time
  })
  apps.data.map(item => {
    item.width = (item.__time * 100) / totalTime
    item.x = (item.x * 100) / totalTime
  })
  clearChart()
  apps.data.map(item => renderBlock(item))
  renderLegend(apps.uniqueApps)
}

exports.updateTimeChart = () => {
  db.getDb()
    .then(data => {
      data = data
      .split('\n')
      .map(item => parseStroke(item))
      data.shift()

      renderTimeChart(data)
      renderTime(data)
    })
}
