function spice_form(){
    console.log("spice orbit function entered")
    var newCoordinates = []; //new coordinates
    var data = $("model_update").serialize()
    console.log(data)
    $.ajax({
      url:'https://spice-api.herokuapp.com/orbits?planet='+data,
      type: 'GET',
      dataType:'JSON',
      crossDomain: true,
      planet:document.getElementById("Target").value,
      success:function(data){
        alert("FORM FUNCTION: "+document.getElementById("Target").value+" orbit updated: " + data.x +", " + data.y +", "+ data.z);
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