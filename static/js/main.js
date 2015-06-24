$(document).ready(function(){
    //initialize upload csv
    if(!init_upload_csv())
    {
        $(body).innerHTML("<h3>You need to upgrade your browser</h3>");
        return;
    }

});
