function init_upload_csv()
{
    $("#csv_file").bind('change',upload_csv);
    return (window.File && window.FileReader && window.FileList && window.Blob);
}

function upload_csv(evt)
{
    var data=null;
    var file=evt.target.files[0];
    var reader= new FileReader();
    reader.readAsText(file);
    reader.onload = function(event)
    {
        var csvData = event.target.result;
        d3.csv(csvData,function(data){});
        if (data && data.length > 0)
        {
            $("#csv_file_output").append("Imported " + data.length + " rows successfully!<br />");
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
