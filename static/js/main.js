$(document).ready(function(){
    if(!init_upload_csv())
    {
       $("#upload_csv").html('Your browser is not supported'); 
    }
});

function init_upload_csv()
{
    $("#csv_file").bind('change',upload_csv);
    return (window.File && window.FileReader && window.FileList && window.Blob);
}

//upload csv event handler
function upload_csv(evt)
{
    var data=null;
    var file=evt.target.files[0];
    var reader= new FileReader();
    reader.readAsText(file);
    reader.onload = function(event)
    {
        var csvData = event.target.result;
        var data = parse_csv(csvData);
        if (data && data.length > 0)
        {
            $("#csv_file_output").append("Imported " + data.length + " rows successfully!<br />");
            display_csv(data);
            var processed_data = process_for_histogram(data);
            show_histogram(processed_data[1]);
        }
        else
        {
            $("#csv_file_output").append("No data to import!<br />");
        }
    }
    reader.onerror = function()
    {
        $("#csv_file_output").append("Unable to read " + file.fileName + "<br />");
    }
}

//parse csv
function parse_csv(csvData)
{
    var data = [];
    var allTextLines = csvData.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');

    for(var i =1;i<allTextLines.length;i++)
    {
        var dataLine = allTextLines[i].split(',');
        if(dataLine.length == headers.length)
        {
            var tarr = {};
            for(var j = 0;j<headers.length;j++)
            {
                tarr[headers[j]] = dataLine[j];
            }
            data.push(tarr);
        }
    }
    return data;
}

function display_csv(data)
{
    //TODO:show loading gif
    var display_csv_table = $("#display_csv_table");
    var table_head = display_csv_table.find('thead');
    var table_body = display_csv_table.find('tbody');
    
    var table_head_content = '';
    var table_body_content = '';

    table_head_content = '<tr>';
    for(var i in data[0])
    {
        table_head_content += '<th>' + i + '</th>';
    }
    table_head_content += '</tr>';
    table_head.append(table_head_content);

    for(var i in data)
    {
        table_body_content = '<tr>';
        for(var j in data[i])
        {
            table_body_content += '<td>' + data[i][j] + '</td>';
        }
        table_body_content += '</tr>';
        table_body.append(table_body_content);
    }
    $("#tabpill_view_csv").removeClass("hidden");
    $('#nemo a[href="#view_csv"]').tab('show');
}

function process_for_histogram(data)
{
    var proc_data = [];
    for(var i in data[0])
    {
        var tmp_data_list = [];
        for(var j = 0;j<data.length;j++)
        {
            tmp_data_list.push(data[j][i]);
        }
        proc_data.push(tmp_data_list);
    }
    return proc_data;
}

var y_inv;

function show_histogram(values)
{
    var margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = 960 - margin.left - margin.right;
        height = 500 - margin.top - margin.bottom;

    var y = d3.scale.linear()
        .domain([0,10])
        .range([0,height]);

    y_inv = d3.scale.linear()
        .domain([0,height])
        .range([0,10]);

    var data = d3.layout.histogram()
        .bins(y.ticks(10))
        (values);

    var x = d3.scale.linear()
        .domain([0, d3.max(data,function(d) {return d.y; })])
        .range([0,width]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#bin").append("svg")
        .attr("width",width+margin.left+margin.right)
        .attr("height", height+margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate("+margin.left + "," + margin.top + ")");

    
    var bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class","bar")
        .attr("transform", function(d) {return "translate(" + 0 + "," + (height-y(d.x)-margin.top-margin.bottom).toString() + ")"; });

    bar.append("rect")
      .attr("x",1)
      .attr("width", function(d) {return x(d.y);})
      .attr("height", function(d) {return y(1)});

    bar.append("text")
      .attr("dy", ".75em")
      .attr("y", y(data[0].dx/2))
      .attr("x", function(d){return 20+x(d.y); })
      .attr("text-anchor", "middle")
      .text(function(d){if(d.y==0) return ''; else return (d.y); });

    var drag = d3.behavior.drag()
        .on("drag",dragmove);

    var line = svg.append("line")
        .attr("x1",0)
        .attr("y1",y(data[0].dx))
        .attr("x2",width)
        .attr("y2",y(data[0].dx))
        .attr("stroke-width",2)
        .attr("stroke","black")
        .call(drag);

    svg.append("g")
      .attr("class","y axis")
      .attr("transform", "translate(0," + y(data[0].dx).toString() + ")")
      .call(yAxis);      
    
}
var transY = 0;
function dragmove(d)
{
    transY += d3.event.dy;
    d3.select(this).attr('transform', "translate(" + 0 + "," + transY + ")");
    console.log(y_inv(transY));
}

