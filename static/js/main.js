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
            //TODO: Show for general
            show_histogram(processed_data[1]); //0th index holds the primary key
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

var scales = {x:"",y:"",y_inv:""};
var margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = 960 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;

function compute_scales(values)
{
  var sorted_values = values.sort(); //sort them
  var diff = parseFloat(sorted_values[sorted_values.length-1]);
  var min = parseFloat(sorted_values[0]);  //the range of numbers we have
  var max = diff;
  for(var i = 1;i<sorted_values.length;i++)
  {
    var tmp_diff = parseFloat(sorted_values[i])-parseFloat(sorted_values[i-1]);
    if(tmp_diff<diff && tmp_diff)diff=tmp_diff;
  }
  //diff is now the least count
  var number_of_ticks = (max-min)/diff;
  scales.y = d3.scale.linear()
          .domain([min,max])
          .range([0,height]);
  scales.y_inv = d3.scale.linear()
        .domain([0,height])
        .range([min,max]);
  var data = d3.layout.histogram()
        .bins(scales.y.ticks(number_of_ticks))
        (values);
  scales.x = d3.scale.linear()
      .domain([0, d3.max(data,function(d) {return d.y; })])
      .range([0,width]);
  return data;
}

var lines = [];
var transY = [];
var drag = d3.behavior.drag()
    .on("drag",dragmove);

function make_draggable_line(data,svg,num)
{
    //remove old
    svg.selectAll(".binner").remove(); 

    var y = scales.y;
    lines = [];
    transY = [];
    for(var i = 0;i<num-1;i++)
    {
      var random_height = Math.random()*height;
      var line = svg.append("line")
          .attr("x1",0)
          .attr("y1",random_height)
          .attr("x2",width)
          .attr("y2",random_height)
          .attr("stroke-width",2)
          .attr("stroke","black")
          .attr("class","binner")
          .attr("id","bin_"+i.toString())
          .call(drag);
      lines.push(line);
      transY.push(0);
    }
}

function show_histogram(values)
{
    var sorted_values = values.sort(); //sort them
    var data = compute_scales(values);
    var y = scales.y;
    var x = scales.x;
    var y_inv = scales.y_inv;

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left"); 
    var svg = d3.select("#histo").append("svg")
        .attr("width", width+margin.right)
        .attr("height", height + margin.bottom)
        .append("g")
        .attr("transform","translate("+margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class","bar")
        .attr("transform", function(d) {return "translate(" + 0 + "," + y(d.x).toString()+ ")"; });

    bar.append("rect")
      .attr("x",1)
      .attr("width", function(d) {return x(d.y);})
      .attr("height", function(d) {return y(1)});

    $("#num_of_bins").change(function(){make_draggable_line(data,svg,$(this).val());})
    //make_draggable_line(data,svg,1);

    $("#createBins").click(function(){
      var num_of_bins = parseInt($("#num_of_bins").val()); 
      var counts = [];
      for(var i = 0;i<num_of_bins;i++)
        counts.push(0);
      var i = 0,linei = 0;
      while(i<sorted_values.length)
      {
        if(sorted_values[i]>=y_inv(parseFloat(lines[linei].attr("y1"))+transY[linei]))
        {
          linei++;
          if(linei>=lines.length)break;
        }
        else
        {
          counts[linei]++;
          i++;
        }
      }
      var total = 0;
      $.each(counts,function(){total+=this});
      counts[counts.length-1]=sorted_values.length-total;
      console.log(counts);
    });

    svg.append("g")
      .attr("class","y axis")
      .attr("transform", "translate(0," +0 + ")")
      .call(yAxis);      
    
}

function dragmove(d)
{
    var id = parseInt(d3.select(this).attr("id").split("_")[1]);
    transY[id] += d3.event.dy;
    d3.select(this).attr('transform', "translate(" + 0 + "," + transY[id] + ")");
    console.log(scales.y_inv(parseFloat(d3.select(this).attr("y1"))+transY[id])); //margin.top just for calibration
}

