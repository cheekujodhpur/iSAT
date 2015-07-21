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
