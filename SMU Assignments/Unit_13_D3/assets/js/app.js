// @TODO: YOUR CODE HERE!


//Designate HTML div for svg
var svgArea = d3.select("#scatter").select("svg");

//If SVG exists, remove it
if (!svgArea.empty()) {
    svgArea.remove();
}

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 80,
    bottom: 100,
    left: 110
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//SVG wrapper
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//Append SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial parameter
var chosenXAxis = "poverty";

//Function updates X-scale var upon clicking on axis label
function xScale(povertyData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(povertyData, d => d[chosenXAxis]) * 0.8,
            d3.max(povertyData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;
}

//Initial parameter
var chosenYAxis = "healthcare";

//Function updates Y-scale var upon clicking on axis label
function yScale(povertyData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(povertyData, d => d[chosenYAxis])])
        .range([height, 0]);

    return yLinearScale;
}

//Function that is used for updating xAxis var upon clicking on axis label
function renderXScale(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderYScale(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

//Function used to render circles when axis label is clicked

function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))


    return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

//State abbr updater
function renderXAbbr(textGroup, newXScale, chosenXAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("dx", d => newXScale(d[chosenXAxis]))

    return textGroup;
}

function renderYAbbr(textGroup, newYScale, chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("dy", d => newYScale(d[chosenYAxis]))

    return textGroup;
}

//Function used for updating circles group with new tooltip
function updatecircleToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel;
    if (chosenXAxis === "poverty") {
        xlabel = "In Poverty %:";
    } else if (chosenXAxis === "age") {
        xlabel = "Age (Median):";
    } else {
        xlabel = "Median Household Income in $:"
    }

    var ylabel;
    if (chosenYAxis === "healthcare") {
        ylabel = "Healthcare Coverage %:";
    } else if (chosenYAxis === "smokes") {
        ylabel = "Smokers %:";
    } else {
        ylabel = "Obesity %:"
    }

    //Initiallize tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`<b>${d.state}</b><hr>${xlabel} ${d[chosenXAxis]} & ${ylabel}: ${d[chosenYAxis]}`);
        });

    //Create tooltip in chart
    circlesGroup.call(toolTip);

    //Create event listeners to display and hide tooltip
    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

function renderStateAbbr(chosenXAxis, chosenYAxis, textGroup) {

    var xlabel;
    if (chosenXAxis === "poverty") {
        xlabel = "In Poverty(%):";
    } else if (chosenXAxis === "age") {
        xlabel = "Age (Median):";
    } else {
        xlabel = "Median Household Income in $:";
    }

    var ylabel;
    if (chosenYAxis === "healthcare") {
        ylabel = "Healthcare Coverage (%):";
    } else if (chosenYAxis === "smokes") {
        ylabel = "% Smokers:";
    } else {
        ylabel = "Obesity (%):";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`<b>${d.state}</b><hr>${xlabel} ${d[chosenXAxis]} & ${ylabel}: ${d[chosenYAxis]}`);
        });

    textGroup.call(toolTip);

    //Create event listeners to display and hide tooltip
    textGroup.on("mouseover", function(data) {
            toolTip.show(data, this);


            d3.select(this)
                .attr("cursor", "default");
        })
        // onmouseout event
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });

    return textGroup;

}
//Import Data Source
d3.csv("assets/data/data.csv").then(function(povertyData, err) {
    if (err) throw err;
    //Parse data from source and cast them as Int using "+"
    povertyData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    //Create X-Scale
    var xLinearScale = xScale(povertyData, chosenXAxis);

    //Create Y-Scale
    var yLinearScale = yScale(povertyData, chosenYAxis);

    //Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append X-axis to chart
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    //Append Y-axis to chart
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    //Append circles to chart

    var chartMarkers = chartGroup.selectAll("circle")
        .data(povertyData)
        .enter();

    var circlesGroup = chartMarkers
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("class", "stateCircle")
        .attr("opacity", ".5");

    var textGroup = chartMarkers
        .append("text")
        .text(function(d) {
            return d.abbr;
        })
        .attr("dx", function(d) {
            return xLinearScale(d[chosenXAxis]);
        })
        .attr("dy", function(d) {
            return yLinearScale(d[chosenYAxis]);
        })
        .attr("class", "stateText");

    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Age");

    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Yearly Income ($)");


    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    // append y axis
    var healthcareLabel = ylabelsGroup.append("text")
        .attr("y", 60 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Healthcare Coverage (%)");

    var smokeLabel = ylabelsGroup.append("text")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smoker Population (%)");

    var obeseLabel = ylabelsGroup.append("text")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obese Population(%)");

    circlesGroup = updatecircleToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    textGroup = renderStateAbbr(chosenXAxis, chosenYAxis, textGroup);

    xlabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(povertyData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXScale(xLinearScale, xAxis);

                //Updates circles with new x values
                circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
                //Update state abbreivation
                textGroup = renderXAbbr(textGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updatecircleToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                textGroup = renderStateAbbr(chosenXAxis, chosenYAxis, textGroup);

                // changes classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
    ylabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // replaces chosenYAxis with value
                chosenYAxis = value;

                // functions here found above csv import
                // updates y scale for new data
                yLinearScale = yScale(povertyData, chosenYAxis);

                // updates y axis with transition
                yAxis = renderYScale(yLinearScale, yAxis);

                //Updates circles with new y values
                circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

                //Update state abbreivation
                textGroup = renderYAbbr(textGroup, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updatecircleToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                textGroup = renderStateAbbr(chosenXAxis, chosenYAxis, textGroup);

                // changes classes to change bold text
                if (chosenYAxis === "healthcare") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenYAxis === "smokes") {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(function(error) {
    console.log(error);
});