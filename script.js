const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

const h = 460
const w = 860
const padding = 45
let xScale
let yScale
let xAxisScale
let yAxisScale
let xAxis
let yAxis

let tooltip = d3
  .select("section")
  .append("div")
  .attr("id", "tooltip")
  .style("visibility", "hidden")
  .style("width", "auto")
  .style("height", "auto")

const drawCanvas = () => {
  const svg = d3
    .select("svg")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "rgb(255, 225, 230)")
    .style("border-radius", "10px")
  return svg
}

const scalesAxesBars = (dataset, svg) => {
  const dateArr = dataset.map((item) => new Date(item[0]))
  console.log(`date array is: ${dateArr}`)

  xScale = d3
    .scaleLinear()
    .domain([0, dataset.length - 1])
    .range([padding, w - padding])
  yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([0, h - 2 * padding])

  xAxisScale = d3
    .scaleTime()
    .domain([d3.min(dateArr), d3.max(dateArr)])
    .range([padding, w - padding])
  yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h - padding, padding])

  xAxis = d3.axisBottom(xAxisScale)
  yAxis = d3.axisLeft(yAxisScale)

  svg
    .append("g")
    .attr("transform", `translate(0,${h - padding})`)
    .attr("id", "x-axis")
    .call(xAxis)
  svg
    .append("g")
    .attr("transform", `translate(${padding},0)`)
    .attr("id", "y-axis")
    .call(yAxis)

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("width", (w - padding * 2) / dataset.length)
    .attr("class", "bar some")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("height", (d) => yScale(d[1]))
    .attr("x", (d, i) => xScale(i))
    .attr("y", (d) => h - padding - yScale(d[1]))
    .on("mouseover", (d) => {
      tooltip.transition().style("visibility", "visible")
      tooltip.attr("data-date", d[0]).text(d[0])
    })
    .on("mouseout", (d) => {
      tooltip.transition().style("visibility", "hidden")
    })
}

fetch(url)
  .then((resp) => resp.json())
  .then((dataObj) => {
    const svg = drawCanvas()
    scalesAxesBars(dataObj.data, svg)
  })
  .catch((err) => console.log(err))
