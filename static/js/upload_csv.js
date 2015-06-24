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
            alert(data[0]);
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
