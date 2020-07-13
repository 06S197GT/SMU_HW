//Wait for page load then run script
document.addEventListener("DOMContentLoaded", function(e) {
    //Select table bdody in html to render table
    var tbody = d3.select("tbody");

    //Select button class from HTML
    var resetButton = d3.select("#reset-btn");

    //Select form class from HTML
    var inputField = d3.select("#form");

    //Select dropdown classess from HTML
    var country_list = d3.select("#country-list");
    var state_list = d3.select("#state-list");
    var shape_list = d3.select("#shape-list");

    //Event listeners
    //Run function on button, dropdown click or form submition

    inputField.on("submit", runEnter);
    country_list.on("click", countryFound);
    state_list.on("click", stateFound);
    shape_list.on("click", shapeFound);
    resetButton.on("click", defaultTable);


    function runEnter() {

        //Prevent screen from refreshing
        d3.event.preventDefault();

        //Select input element
        var inputText = d3.select("#datetime");
        //Get value of input
        var userInput = inputText.property("value");
        //filer the data based on input value
        var filteredData = data.filter(date => date.datetime === userInput);
        //remove all rows and recreate table
        if (userInput !== " ") {
            d3.selectAll("td").remove();
            filteredData.forEach((UFOsighting) => {
                var row = tbody.append("tr");
                Object.entries(UFOsighting).forEach(([key, value]) => {
                    var cell = row.append("td");
                    cell.text(value);
                });
            });
        };
    };

    function countryFound() {

        d3.event.preventDefault();

        var countryFilter = d3.select("#countryFilter");

        var ctOption = countryFilter.property("value");

        var ctFound = data.filter(x => x.country === ctOption);
        if (ctOption !== "") {
            d3.selectAll("td").remove();
            ctFound.forEach((UFOsighting) => {
                var row = tbody.append("tr");
                Object.entries(UFOsighting).forEach(([key, value]) => {
                    var cell = row.append("td");
                    cell.text(value);
                });
            });
        } else {
            data.forEach((UFOsighting) => {
                var sighting = tbody.append("tr");
                Object.entries(UFOsighting).forEach(([key, value]) => {
                    var cell = sighting.append("td");
                    cell.text(value);
                });
            });
        }
    };

    function stateFound() {

        d3.event.preventDefault();

        var stateFilter = d3.select("#stateFilter");

        var stOption = stateFilter.property("value");

        var stFound = data.filter(x => x.state === stOption);
        if (stOption !== "") {
            d3.selectAll("td").remove();
            stFound.forEach((UFOsighting) => {
                var row = tbody.append("tr");
                Object.entries(UFOsighting).forEach(([key, value]) => {
                    var cell = row.append("td");
                    cell.text(value);
                });
            });
        } else {
            data.forEach((UFOsighting) => {
                var sighting = tbody.append("tr");
                Object.entries(UFOsighting).forEach(([key, value]) => {
                    var cell = sighting.append("td");
                    cell.text(value);
                });
            });
        }
    };

    function shapeFound() {

        d3.event.preventDefault();

        var shapeFilter = d3.select("#shapeFilter");

        var shOption = shapeFilter.property("value");

        var shFound = data.filter(x => x.shape === shOption);
        if (shOption !== "") {
            d3.selectAll("td").remove();
            shFound.forEach((UFOsighting) => {
                var row = tbody.append("tr");
                Object.entries(UFOsighting).forEach(([key, value]) => {
                    var cell = row.append("td");
                    cell.text(value);
                });
            });
        } else {
            data.forEach((UFOsighting) => {
                var sighting = tbody.append("tr");
                Object.entries(UFOsighting).forEach(([key, value]) => {
                    var cell = sighting.append("td");
                    cell.text(value);
                });
            });
        }
    };

    function defaultTable() {
        d3.selectAll("td").remove();
        data.forEach((UFOsighting) => {
            var sighting = tbody.append("tr");
            Object.entries(UFOsighting).forEach(([key, value]) => {
                var cell = sighting.append("td");
                cell.text(value);
            });
        });
    };

    //display default table on page load
    defaultTable();
});