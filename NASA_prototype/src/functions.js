// planets from scripts.js is the objects 
// import * as planets from './script';

export function searchObjects(){
    // Get input value
    var input = document.getElementById("objectInput").value.toLowerCase();
    // Get remaining button div
    var remainingButtons = document.getElementById("object_library").getElementsByTagName("button");
    // Loop through remaining buttons and check if button text includes input string
    for (var i = 0; i < remainingButtons.length; i++) {
        var buttonText = remainingButtons[i].textContent.toLowerCase();
        if (buttonText.includes(input)) {
        remainingButtons[i].style.display = "block";
        } else {
        remainingButtons[i].style.display = "none";
        }
    }
}

export function searchMissions(){
    // Get input value
    var input = document.getElementById("missionInput").value.toLowerCase();
    // Get remaining button div
    var remainingButtons = document.getElementById("mission_library").getElementsByTagName("button");
    // Loop through remaining buttons and check if button text includes input string
    for (var i = 0; i < remainingButtons.length; i++) {
        var buttonText = remainingButtons[i].textContent.toLowerCase();
        if (buttonText.includes(input)) {
        remainingButtons[i].style.display = "block";
        } else {
        remainingButtons[i].style.display = "none";
        }
    }
}

// $(document).ready(function mission_data(mission, utc){
//   $("#VOYAGER 1").on('click',function)
//   $.ajax({
//     url:'https://spice-api.herokuapp.com/mission?mission=' + mission + '&utc='+utc,
//     type: 'GET',
//     dataType:'JSON',
//     crossDomain: true,
//     success:function(data){
//       alert(data);
//     },
//     error:function(xhr,status,error){
//       var errorMessage = xhr.status + ':' + xhr.statusText
//       alert('Error - ' + errorMessage);
//     }
//   })
// })


var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

export function uploadFile(form)
{
    const formData = new FormData(form);
    var oOutput = document.getElementById("static_file_response");
    var oReq = new XMLHttpRequest();
    oReq.open("POST", "https://spice-api.herokuapp.com/upload_static_file", true);
    oReq.onload = function(oEvent) {
        if (oReq.status == 200) {
            oOutput.innerHTML = "Uploaded!";
            console.log(oReq.response);
        }
        else {
            oOutput.innerHTML = "Error occurred when trying to upload your file.<br \/>";
        }
    };
    oOutput.innerHTML = "Sending file!";
    console.log("Sending file!")
    oReq.send(formData);
 }

// function to add buttons to collapsible
export function addButtons(objects, id, pinned, planets) {
  var buttonsContainer = document.getElementById(id);
  i = 0;
  objects.forEach(function(objects) {
    var button = document.createElement("button");
    button.innerHTML = objects.replace(" BARYCENTER","");
    button.type = "button";
    button.classList.add("collapsible");

    // create content div
    var content = document.createElement("div");
    content.classList.add("content");

    // create pin checkbox
    var pinCheckbox = document.createElement("input");
    pinCheckbox.type = "checkbox";
    pinCheckbox.id = "pin_checkbox";
    pinCheckbox.checked = false;
    pinCheckbox.classList.add("pinCheckbox");
    pinCheckbox.addEventListener("click", function() {
      var parent = button.parentNode;
      var parent_content = content.parentNode;
      if (this.checked) {
        button.classList.add("pinned");
      } else {
        button.classList.remove("pinned");
      }
      if (this.checked){
        // send it to the pinned list 
        parent_content.removeChild(content);
        parent.removeChild(button);

        document.getElementById(pinned).appendChild(button);
        document.getElementById(pinned).appendChild(content);
      }else{
        // send it to the library list 
        parent_content.removeChild(content);
        parent.removeChild(button);

        document.getElementById(id).appendChild(button);
        document.getElementById(id).appendChild(content);
      }
    });
    var label = document.createElement("label");
    label.htmlFor = "pin_checkbox";
    label.innerHTML = " Pin";
    content.appendChild(pinCheckbox);
    content.appendChild(label);
    content.appendChild(document.createElement("br"));

    // add checkboxes to content div
    // BODY
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = objects + "_body";
    checkbox.value = "Body";
    checkbox.name = "showBody";
    checkbox.checked = true;
    var label = document.createElement("label");
    label.htmlFor = "env_body";
    label.innerHTML = " Body";
    content.appendChild(checkbox);
    content.appendChild(label);
    content.appendChild(document.createElement("br"));
    
    // TRAJECTORY
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = objects + "_traj";
    checkbox.value = "Trajectory";
    checkbox.name = "showTraj";
    checkbox.checked = true;
    var label = document.createElement("label");
    label.htmlFor = "env_traj";
    label.innerHTML = " Show Trajectory";
    content.appendChild(checkbox);
    content.appendChild(label);
    content.appendChild(document.createElement("br"));
    
    // SPEED GRADIENT
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = objects + "_grad";
    checkbox.value = "Gradient";
    checkbox.name = "showGrab";
    checkbox.checked = true;
    var label = document.createElement("label");
    label.htmlFor = "env_grad";
    label.innerHTML = " Speed Gradient";
    content.appendChild(checkbox);
    content.appendChild(label);
    content.appendChild(document.createElement("br"));

    // add button and content to the document
    buttonsContainer.appendChild(button);
    buttonsContainer.appendChild(content);

      // add event listener to button
    button.addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });

    i += 1;
  });
}