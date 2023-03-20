function spice_form(str){
    console.log("spice orbit function entered")
    var newCoordinates = []; //new coordinates
    // var data = $("model_update").serialize()
    console.log(str)
    $.ajax({
      url:'https://spice-api.herokuapp.com/form_data?'+str,
      type: 'GET',
      dataType:'JSON',
      crossDomain: true,
      success:function(data){
        alert("FORM FUNCTION: "+" orbit updated: " + data.x +", " + data.y +", "+ data.z);
        newCoordinates[0] = data.x;
        newCoordinates[1] = data.y;
        newCoordinates[2] = data.z;
      },
      error:function(xhr,status,error){
        var errorMessage = xhr.status + ':' + xhr.statusText
        alert('Error - ' + errorMessage);
      }
    }); 
    return newCoordinates;
}
window.spice_form = spice_form;