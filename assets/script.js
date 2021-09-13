var fileUpload = document.querySelector("#fileUpload");
var URL_Input = document.querySelector("#urlInput > input");
var textarea = document.querySelector("#result > textarea");
var preview = document.querySelector("#preview");
var btnCopy = document.querySelector("button.btn-copy");
var btnBgOnly = document.querySelector('#result .btn-bg input[name="bgOnly"]');

// Declare file input event listeners
fileUpload.addEventListener("change", handleUpload);

function handleUpload (event){
	var file = event.target.files[0];
	var reader = new FileReader();
	reader.onload = (e) => { 
		var resultVal = '';
		resultVal += 'content: "";\n';
		resultVal += 'padding: 30px;\n';
		resultVal += 'background-size: contain;\n';
		resultVal += 'background-repeat: no-repeat;\n';
		resultVal += 'background-position: center center;\n';
		resultVal += 'background-image: url("data:image/svg+xml,' + encodeURIComponent(e.target.result) + '");';
		textarea.value = resultVal;
		if ( btnBgOnly.checked ) {
			textarea.value = 'background-image: url("data:image/svg+xml,' + encodeURIComponent(e.target.result) + '");';
		}
		preview.innerHTML = e.target.result;
		
	};
	reader.readAsText(file);
	btnCopy.innerHTML = "Copy";
}

// Declare URL input event listeners
URL_Input.addEventListener("change", handleURL);

function handleURL() {
	var request = new XMLHttpRequest();
	request.open('GET', URL_Input.value, true);
	request.responseType = 'blob';
	request.onload = function() {
		var reader = new FileReader();
		reader.readAsDataURL(request.response);
		reader.onload =  function(e){
			var resultVal = '';
			resultVal += 'content: "";\n';
			resultVal += 'padding: 30px;\n';
			resultVal += 'background-size: contain;\n';
			resultVal += 'background-repeat: no-repeat;\n';
			resultVal += 'background-position: center center;\n';
			resultVal += 'background-image: url("' + e.target.result + '");';;
			textarea.value = resultVal;
			if ( btnBgOnly.checked ) {
				textarea.value = 'background-image: url("data:image/svg+xml,' + encodeURIComponent(e.target.result) + '");';
			}
			preview.innerHTML = "<img src='" + e.target.result + "'>";
		};
	};
	request.send();
	btnCopy.innerHTML = "Copy";
	URL_Input.value = URL_Input.value + "?";  // perform onchange
}

// Focus blur
function focusOut(){
	setTimeout( function() {
		URL_Input.blur();
	}, 10);
}

/* Drag and drop file */
const dropArea = document.querySelector("#dropArea");

const preventDefaults = e => {
	e.preventDefault();
	e.stopPropagation();
};
const active = e => {
	dropArea.classList.add("active");
};
const deactive = e => {
	dropArea.classList.remove("active");
};

const handleDrop = e => {
	const files = e.dataTransfer.files;
	const dT = new DataTransfer();
	dT.items.add(e.dataTransfer.files[0]);
	fileUpload.files = dT.files;
	
	var tempEvent = new Event('change');
	fileUpload.dispatchEvent(tempEvent);
};

["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
	dropArea.addEventListener(eventName, preventDefaults, false);
});
["dragenter", "dragover"].forEach(eventName => {
	dropArea.addEventListener(eventName, active, false);
});
["dragleave", "drop"].forEach(eventName => {
	dropArea.addEventListener(eventName, deactive, false);
});

dropArea.addEventListener("drop", handleDrop, false);


/* Click to copy */ 

btnCopy.onclick = function(){
    textarea.select();
    document.execCommand('copy');
	btnCopy.innerHTML = "Copied";
}