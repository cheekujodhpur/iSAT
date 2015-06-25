function display_csv(data)
{
    var upload_csv_container = $("#upload_csv_container");
    var display_csv_container = $("#display_csv_container");
    upload_csv_container.addClass('hidden');
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
    display_csv_table.removeClass('hidden');
}
