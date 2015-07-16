//global variable
var uploaded_data = [];


function process_for_histogram(data)
{
    for(var i in data[0])
    {
        var tmp_data_list = [];
        for(var j = 0;j<data.length;j++)
        {
            tmp_data_list.push(data[j][i]);
        }
        uploaded_data.push(tmp_data_list);
    }
}


function show_histogram()
{
    var values = uploaded_data[1];

    var margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = 960 - margin.left - margin.right;
        height = 500 - margin.top - margin.bottom;

    var y = d3.scale.linear()
        .domain([0,10])
        .range([0,height]);

    var data = d3.layout.histogram()
        .bins(y.ticks(10))
        (values);

    var x = d3.scale.linear()
        .domain([0, d3.max(data,function(d) {return d.y; })])
        .range([0,width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var svg = d3.select("body").append("svg")
        .attr("width",width+margin.left+margin.right)
        .attr("height", height+margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate("+margin.left + "," + margin.top + ")");

    
    var bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class","bar")
        .attr("transform", function(d) {return "translate(" + 0 + "," + (d.x) + ")"; });

    bar.append("rect")
      .attr("x",1)
      .attr("width", function(d) {return x(d.y);})
      .attr("height", function(d) {return y(1)});

    bar.append("text")
      .attr("dy", ".75em")
      .attr("y", 6)
      .attr("x", x(data[0].dx)/2)
      .attr("text-anchor", "middle")
      .text(function(d){if(d.y==0) return ''; else return (d.y); });

    svg.append("g")
      .attr("class","x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);      
}
