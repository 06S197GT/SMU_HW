$(document).ready(function() {
    readData();
});


function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
};

function readData() {
    $.ajax({
        url: "data/samples.json",
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data);
            data.names.forEach(function(id) {
                let option = `<option>${id}</option>`;
                $("#selDataset").append(option);
            });
            loadSubjectData(data.names[0]);

        }
    });
};

function loadSubjectData(id) {
    $.ajax({
        url: "data/samples.json",
        type: 'GET',
        dataType: 'json',
        success: function(data) {

            let subject = data.metadata.filter(x => x.id == id)[0];

            let sampleData = data.samples.filter(x => x.id == id)[0]
            $('#sample-metadata').empty();

            Object.entries(subject).forEach(function([key, value]) {
                let miniTable = `<p style="overflow-wrap: break-word"><b>${key}:</b> ${value}</p>`;
                $("#sample-metadata").append(miniTable);
            });
            var sampleVal = {};
            var otuLabels = {};

            sampleData.otu_ids.forEach((k, i) => sampleVal[k] = sampleData.sample_values[i]);

            sampleData.otu_labels.forEach((k, i) => otuLabels[k] = sampleData.otu_labels[i]);

            var wFreq = data.metadata.map(x => x.wfreq);

            //Removed null values
            var wFreqfiltered = wFreq.filter(function(el) {
                return el != null;
            });

            var plotData = sampleData.otu_ids.map(function(e, i) {
                return [e, sampleData.sample_values[i], sampleData.otu_labels[i].split(';').pop()];
            });



            var newSort = Object.entries(sampleVal).sort((a, b) => b[1] - a[1]);


            var trace = [{
                x: newSort.map(x => x[1]).slice(0, 10).reverse(),
                y: newSort.map(x => `OTU ${x[0]}`).slice(0, 10).reverse(),
                text: plotData.map(x => x[2]).slice(0, 10).reverse(),
                type: "bar",
                orientation: "h",
                marker: {
                    color: "green"
                }
            }];

            Plotly.newPlot("bar", trace);

            var trace1 = [{
                x: sampleData.otu_ids,
                y: sampleData.sample_values,
                text: plotData.map(x => x[2]),
                mode: "markers",
                marker: {
                    size: sampleData.sample_values,
                    color: sampleData.sample_values,
                    colorscale: [
                        [0, 'rgb(200, 255, 200)'],
                        [1, 'rgb(0, 100, 0)']
                    ],
                    type: 'heatmap'

                },
            }];
            var layout1 = {
                hovermode: 'closest',
                title: "<b>OTU Data</b>",
                xaxis: {
                    title: {
                        text: "<b>OTU-IDs</b>"
                    }
                }
            }
            Plotly.newPlot("bubble", trace1, layout1);


            var trace2 = [{
                type: "indicator",
                mode: "gauge+number+delta",
                value: subject.wfreq,
                title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week", font: { size: 24 } },
                delta: { reference: wFreqfiltered.reduce((a, b) => a + b, 0) / wFreqfiltered.length, increasing: { color: "green" } },
                gauge: {
                    axis: { range: [0, 10], tickwidth: 1, tickcolor: "black" },
                    bar: { color: "lightgreen" },
                    bgcolor: "white",
                    borderwidth: 1,
                    bordercolor: "black",
                    steps: [
                        { range: [0, 10], color: "lightslategrey" },

                    ],
                    threshold: {
                        line: { color: "red", width: 4 },
                        thickness: 0.75,
                        value: .005
                    }
                }
            }];

            Plotly.newPlot("gauge", trace2);
        }


    });
};