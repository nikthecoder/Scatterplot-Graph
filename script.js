document.addEventListener('DOMContentLoaded', function () {
  const margin = { top: 100, right: 100, bottom: 150, left: 150 }, // Adjusted margins
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const svg = d3.select("#scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then(data => {
    const parseTime = d3.timeParse("%M:%S");

    const xScale = d3.scaleTime()
      .domain([new Date(1993, 0), new Date(2016, 0)]) // Adjusted the year range
      .range([0, width]);

    const yScale = d3.scaleTime()
      .domain([parseTime("37:00"), parseTime("39:45")]) // Adjust the time range and invert it
      .range([0, height]);

    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .style("fill", d => d.Doping ? "red" : "green")
      .attr("cx", d => xScale(new Date(d.Year, 0)))
      .attr("cy", d => yScale(parseTime(d.Time)))
      .attr("data-xvalue", d => d.Year)
      .attr("data-yvalue", d => parseTime(d.Time).toISOString())
      .on("mouseover", function (event, d) {
        const tooltip = d3.select("#tooltip")
          .style("display", "block");

        tooltip.html(
          `${d.Name}: ${d.Nationality}<br>${d.Year} - ${d.Time}<br>${d.Doping ? d.Doping : "No allegations"}`
        )
          .attr("data-year", d.Year);

        tooltip.style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        const tooltip = d3.select("#tooltip");
        tooltip.style("display", "none");
        tooltip.attr("data-year", "");
      });

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
    svg.append("g")
      .attr("id", "y-axis")
      .call(yAxis);

    svg.append("text")
      .attr("id", "title")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .text("Doping in Professional Bicycle Racing");

    const legend = svg.append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${width - 250}, 20)`);

    legend.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 5)
      .style("fill", "red");

    legend.append("text")
      .attr("x", 10)
      .attr("y", 5)
      .text("Riders with doping allegations");

    legend.append("circle")
      .attr("cx", 0)
      .attr("cy", 20)
      .attr("r", 5)
      .style("fill", "green");

    legend.append("text")
      .attr("x", 10)
      .attr("y", 25)
      .text("Riders without doping allegations");
    
    // Add "Time in Minutes" label to the left of the y-axis
    svg.append("text")
      .attr("x", -margin.left / 1)
      .attr("y", -margin.top / 2)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Time in Minutes");
  });
});
