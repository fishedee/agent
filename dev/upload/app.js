var files = [];

function uploadHandler(path, status, xhr) {
  var file_parts = path.split(".");
  var extension = file_parts[file_parts.length - 1];
  if(["jpg", "png", "gif"].indexOf(extension.toLowerCase()) >= 0) {
    $("#file-listing").append("<li><img src='" + path + "' /></li>");
  } else {
    $("#file-listing").append("<li><a href='" + path + "' target='_blank'>" + path + "</a></li>");
  }
}

$(function(){

  $("#attachment").change(function(event) {
    $.each(event.target.files, function(index, file) {
      var reader = new FileReader();
      reader.onload = function(event) {  
        object = {};
        object.filename = file.name;
        object.data = event.target.result;
        files.push(object);
      };  
      reader.readAsDataURL(file);
    });
  });

  $("#ajax-attachment-upload-form").submit(function(form) {
  	$("#jj").text("I am uploading, please don't touch any button");
    $.each(files, function(index, file) {
      $.ajax({url: "/json.php/Man/UploadImage2",
            type: 'POST',
            data: {filename: file.filename, imageUrl: file.data},
            success: function( data ){
				if( data.retCode == 0 )
  					$("#jj").text("uploading succuess");
				else
  					$("#jj").text("uploading fail , interface error");
			},
			error:function( msg ){
  				$("#jj").text("uploading fail , network error");
			}
      });      
    });
    files = [];
    form.preventDefault();
  });

});

