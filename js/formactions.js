let checkboxEntered = false;
let monitorCount = 0;
let monitorAbsCount = 0;
let actionCount = 0;
let actionAbsCount = 0;
let editing = false;

var ACTIONTYPES = {
	button: "button",
	toggle: "toggle",
	input: "input"
};

function load() {

	document.getElementById("HighLevelDataMessage").style.display = "";
	document.getElementById("HighLevelDataToggle").style.display = "none";
	document.getElementById("HighLevelDataPushButton").style.display = "none";
	document.getElementById("deviceMessagePreview").style.display = "";
	document.getElementById("deviceTogglePreview").style.display = "none";
	document.getElementById("deviceButtonPreview").style.display = "none";

	// Action Bar header name, fill in preview title as user is typing
	document.getElementById("actionBarHeaderName").addEventListener("keyup", function() {
		document.getElementById("previewDeviceName").innerHTML = this.value;
		if ( this.value === "" ) {
			document.getElementById("previewDeviceName").innerHTML = "-";
		}
	});

	// Action bar name color, update color as the user is typing
	document.getElementById("actionBarHeaderColor").addEventListener("keyup", function() {
		var valid = validHexColor(this.value);
		if ( valid["valid"] ) {
			document.getElementById("previewDeviceName").style.color = valid["color"];
		} else {
			document.getElementById("previewDeviceName").style.color = "#c5c6c7";
		}
	});

	// action bar, change checkbox style when clicked
	document.getElementById("highLevelDataLabel").addEventListener("click", function() {

		checkboxEntered = true;

		if ( document.getElementById("highLevelDataCheckbox").getAttribute("checked") == "false" ) {
			document.getElementById("highLevelDataCheckbox").setAttribute("checked", "true");
			document.getElementById("highLevelDataSection").style.opacity = 1;
			document.getElementById("highLevelDataCheckbox").classList.remove("unchecked");
			document.getElementById("highLevelDataCheckbox").classList.add("checked");
			document.getElementById("deviceHighLevelPreview").style.display = "";

			if ( document.getElementById("highLevelDataOptions").value == "message" ) {
				document.getElementById("deviceMessagePreview").style.display = "";
				document.getElementById("deviceTogglePreview").style.display = "none";
				document.getElementById("deviceButtonPreview").style.display = "none";
			} else if ( document.getElementById("highLevelDataOptions").value == "toggle" ) {
				document.getElementById("deviceMessagePreview").style.display = "none";
				document.getElementById("deviceTogglePreview").style.display = "";
				document.getElementById("deviceButtonPreview").style.display = "none";
			} else if ( document.getElementById("highLevelDataOptions").value == "push" ) {
				document.getElementById("deviceMessagePreview").style.display = "none";
				document.getElementById("deviceTogglePreview").style.display = "none";
				document.getElementById("deviceButtonPreview").style.display = "";
			}

		} else {
			document.getElementById("highLevelDataCheckbox").setAttribute("checked", "false");
			document.getElementById("highLevelDataSection").style.opacity = 0.4;
			document.getElementById("highLevelDataCheckbox").classList.add("unchecked");
			document.getElementById("highLevelDataCheckbox").classList.remove("checked");
			document.getElementById("deviceHighLevelPreview").style.display = "none";
		}
	});

	// action bar, change checkbox style when clicked
	document.getElementById("highLevelDataCheckbox").addEventListener("click", function() {

		checkboxEntered = true;

		if ( document.getElementById("highLevelDataCheckbox").getAttribute("checked") == "false" ) {
			document.getElementById("highLevelDataCheckbox").setAttribute("checked", "true");
			document.getElementById("highLevelDataSection").style.opacity = 1;
			document.getElementById("highLevelDataCheckbox").classList.remove("unchecked")
			document.getElementById("highLevelDataCheckbox").classList.add("checked")
		} else {
			document.getElementById("highLevelDataCheckbox").setAttribute("checked", "false");
			document.getElementById("highLevelDataSection").style.opacity = 0.4;
			document.getElementById("highLevelDataCheckbox").classList.add("unchecked")
			document.getElementById("highLevelDataCheckbox").classList.remove("checked")
		}
	});

	document.getElementById("deviceToggleInputPreview").addEventListener("click", function() {
		if ( this.checked ) {
			document.getElementById("deviceToggleLabelPreview").innerHTML = this.getAttribute("_on");
		} else {
			document.getElementById("deviceToggleLabelPreview").innerHTML = this.getAttribute("_off");
		}
	})

	document.getElementById("highLevelDataOptions").addEventListener("change", function() {
		var showPreview = (document.getElementById("highLevelDataCheckbox").getAttribute("checked") == "false" ? false : true);

		if ( this.value == "message" ) {
			document.getElementById("HighLevelDataMessage").style.display = "";
			document.getElementById("HighLevelDataToggle").style.display = "none";
			document.getElementById("HighLevelDataPushButton").style.display = "none";
			if ( showPreview ) {
				document.getElementById("deviceMessagePreview").style.display = "";
				document.getElementById("deviceTogglePreview").style.display = "none";
				document.getElementById("deviceButtonPreview").style.display = "none";
			}
		} else if ( this.value == "toggle" ) {
			document.getElementById("HighLevelDataMessage").style.display = "none";
			document.getElementById("HighLevelDataToggle").style.display = "";
			document.getElementById("HighLevelDataPushButton").style.display = "none";
			if ( showPreview ) {
				document.getElementById("deviceMessagePreview").style.display = "none";
				document.getElementById("deviceTogglePreview").style.display = "";
				document.getElementById("deviceButtonPreview").style.display = "none";
			}
		} else if ( this.value == "push" ) {
			document.getElementById("HighLevelDataMessage").style.display = "none";
			document.getElementById("HighLevelDataToggle").style.display = "none";
			document.getElementById("HighLevelDataPushButton").style.display = "";
			if ( showPreview ) {
				document.getElementById("deviceMessagePreview").style.display = "none";
				document.getElementById("deviceTogglePreview").style.display = "none";
				document.getElementById("deviceButtonPreview").style.display = "";
			}
		}
	});

	document.getElementById("highLevelDataToggleLabelOff").addEventListener("keyup", function() {
		if ( this.value == "" ) {
			document.getElementById("deviceToggleInputPreview").setAttribute("_off", "-" );
		} else {
			document.getElementById("deviceToggleInputPreview").setAttribute("_off", this.value );
		}

		if ( !document.getElementById("deviceToggleInputPreview").checked ) {
			document.getElementById("deviceToggleLabelPreview").innerHTML = document.getElementById("deviceToggleInputPreview").getAttribute("_off");
		}
	});

	document.getElementById("highLevelDataToggleLabelOn").addEventListener("keyup", function() {
		if ( this.value == "" ) {
			document.getElementById("deviceToggleInputPreview").setAttribute("_on", "-" );
		} else {
			document.getElementById("deviceToggleInputPreview").setAttribute("_on", this.value );
		}

		if ( document.getElementById("deviceToggleInputPreview").checked ) {
			document.getElementById("deviceToggleLabelPreview").innerHTML = document.getElementById("deviceToggleInputPreview").getAttribute("_on");
		}
	});

	document.getElementById("highLevelDataButtonText").addEventListener("keyup", function() {
		document.getElementById("deviceButtonPreview").value = this.value;
	});

	document.getElementById("monitorCreate").addEventListener("click", function(){buildMonitorForm()});

	document.getElementById("actionCreateButton").addEventListener("click", function() { buildActionForm(ACTIONTYPES.button); });
	document.getElementById("actionCreateToggle").addEventListener("click", function() { buildActionForm(ACTIONTYPES.toggle); });
	document.getElementById("actionCreateInput").addEventListener("click", function() { buildActionForm(ACTIONTYPES.input); });

	document.getElementById("saveForm").addEventListener("click", saveForm);
	document.getElementById("jsonCopy").addEventListener("click", function() {
		document.getElementById("jsonObj").select();
		document.execCommand("copy");
		this.innerHTML = "Copied!";
		document.getElementById("jsonCopy").style.color = "#2ecc71";
		setTimeout( function() {
			document.getElementById("jsonCopy").innerHTML = "Copy JSON";
			document.getElementById("jsonCopy").style.color = "#c5c6c7";
		}, 3000);
	});

	// check if we are editing
	const urlParams = new URLSearchParams(window.location.search);
	const myParam = urlParams.get('editing');
	if ( myParam == 'true' ) {
		editing = true;
		// console.log("editing " + sessionStorage.device);

		document.getElementById("newDeviceTab").innerHTML = "Device";
		document.getElementById("newDeviceTab")
		document.getElementById("jsonTab").classList.remove("hide");

		document.getElementById("newDeviceTab").addEventListener("click", function() {
			document.getElementById("jsonTab").classList.remove("mainHeaderActive");
			document.getElementById("jsonTab").classList.add("mainHeaderUnactive");
			this.classList.remove("mainHeaderUnactive");
			this.classList.add("mainHeaderActive");

			document.getElementById("jsonExpected").classList.add("hide");
			document.getElementById("deviceForm").classList.remove("hide");
		});

		document.getElementById("jsonTab").addEventListener("click", function() {
			document.getElementById("newDeviceTab").classList.remove("mainHeaderActive");
			document.getElementById("newDeviceTab").classList.add("mainHeaderUnactive");
			this.classList.remove("mainHeaderUnactive");
			this.classList.add("mainHeaderActive");

			document.getElementById("jsonExpected").classList.remove("hide");
			document.getElementById("deviceForm").classList.add("hide");

			saveForm(false);
		});

		var activeDevice = null;
		var json = JSON.parse(localStorage.devices);
		for ( var i = 0; i < json.devices.length; ++i ) {
			if ( json.devices[i].header.name == sessionStorage.device ) {
				activeDevice = json.devices[i];
				break;
			}
		}

		console.log(activeDevice);

		document.getElementById("initialCall").value = activeDevice.initialCall;
		document.getElementById("actionBarHeaderName").value = activeDevice.header.name;
		triggerEvent(document.getElementById("actionBarHeaderName"), "keyup");
		document.getElementById("actionBarHeaderColor").value = activeDevice.header.color;
		triggerEvent(document.getElementById("actionBarHeaderColor"), "keyup");

		if ( activeDevice.header.displayHighLevel == true ) {
			document.getElementById("highLevelDataCheckbox").checked = "true";
			document.getElementById("highLevelDataOptions").value = activeDevice.header.highlevel.type;
			triggerEvent(document.getElementById("highLevelDataOptions"), "change");

			if ( activeDevice.header.highlevel.type == "message" ) {

			}
			else if ( activeDevice.header.highlevel.type == "toggle" ) {
				document.getElementById("highLevelDataToggleLabelOff").value = activeDevice.header.highlevel.options.offLabel;
				document.getElementById("highLevelDataToggleLabelOn").value = activeDevice.header.highlevel.options.onLabel;
				document.getElementById("highLevelDataToggleCall").value = activeDevice.header.highlevel.options.call;
				triggerEvent(document.getElementById("highLevelDataToggleLabelOff"), "keyup");
				triggerEvent(document.getElementById("highLevelDataToggleLabelOn"), "keyup");
			}
		} 
		else {
			document.getElementById("highLevelDataCheckbox").checked = "false";
			document.getElementById("highLevelDataOptions").value = activeDevice.header.highlevel.type;
			triggerEvent(document.getElementById("highLevelDataOptions"), "change");
		}

		for ( var i = 0; i < activeDevice.monitors.length; ++i ) {
			buildMonitorForm(activeDevice.monitors[i]);
		}

		for ( var i = 0; i < activeDevice.actions.length; ++i ) {
			buildActionForm(activeDevice.actions[i].type, activeDevice.actions[i]);
			console.log(activeDevice.actions[i]);
		}

		document.getElementById("deleteForm").classList.remove("hide");
		document.getElementById("deleteForm").addEventListener("click", function() {
			// alert("DELETE " + sessionStorage.device + "\n" + sessionStorage.deviceID);
			var r = confirm("Delete " + sessionStorage.device + "?");

			if ( r == false ) return;

			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					alert(this.responseText);
					window.location.href = "device.html?editing=true";
				}
			};
			xhttp.open("DELETE", "https://hap-api.herokuapp.com/devices?id=" + sessionStorage.deviceID, true);
			xhttp.setRequestHeader("Content-Type", "application/json");
			xhttp.send();
		});
	}
}

function validHexColor(color) {
	var validChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F', '#'];
	for ( var i = 0; i < color.length; ++i ) {
		if ( !validChars.includes(color[i]) ) {
			return {valid: false};
		}
	}

	if ( color[0] == '#' ) {
		if ( color.length == 4 || color.length == 7 ) {
			return {valid: true, color: color};
		} else {
			return {valid: false};
		}
	} else {
		if ( color.length == 3 || color.length == 6 ) {
			return {valid: true, color: "#" + color};
		} else {
			return {valid: false};
		}
	}
}

function addClassesToElement(ele, classes) {
	for ( var i = 0; i < classes.length; ++i ) {
		ele.classList.add(classes[i]);
	}
}


function buildMonitorForm(fill=null) {
	/**
	<div class="formMonitorGroup formSubSection">
		<div class="formMonitorGroupDelete">delete</div>
		Label<br/>
		<input id="" type="text" name="" value="" placeholder="">
		Call<br/>
		<input id="" type="text" name="" placeholder="-">
	</div>
	**/
	++monitorCount;
	++monitorAbsCount;

	var newrow = buildMonitor();
	document.getElementById("deviceMonitorListPreview").appendChild(newrow.row);
	// console.log(newrow.row);
	// console.log(newrow.label);

	if ( monitorCount > 0 ) {
		document.getElementById("deviceMonitorsPreview").classList.remove("hide");
	}

	var formgroup = document.createElement("div");
	formgroup.classList.add("formMonitorGroup");
	formgroup.classList.add("formSubSection");
	formgroup.setAttribute("name", "monitor");

	var formgroupdelete = document.createElement("div");
	formgroupdelete.classList.add("formMonitorGroupDelete");
	formgroupdelete.innerHTML = "delete";

	formgroupdelete.addEventListener("click", function(){
		--monitorCount;
		// console.log(newrow.row);
		if ( monitorCount == 0 ) {
			document.getElementById("deviceMonitorsPreview").classList.add("hide");
		}

		// console.log(monitorCount);
		this.parentNode.parentNode.removeChild(this.parentNode);

		var activeMonitorsList = document.getElementById("deviceMonitorListPreview").children;
		console.log(activeMonitorsList);
		for ( var i = 0; i < activeMonitorsList.length; ++i ) {
			if ( activeMonitorsList[i] === newrow.row ) {
				console.log("remove");
				newrow["row"].parentNode.removeChild(newrow["row"]);
				break;
			}
		}
	});

	formgroupdelete.addEventListener("mouseover", function(){
		this.parentNode.style.border = "1px solid #e74c3c";
		newrow["row"].style.color = "#e74c3c";
	});
	formgroupdelete.addEventListener("mouseout", function(){
		this.parentNode.style.border = "1px solid #0b0c10";
		this.parentNode.style.borderBottom = "1px solid #2f3c4d";
		newrow["row"].style.color = "";
	});

	var label1 = document.createElement("label");
	label1.innerHTML = "Label";
	var label2 = document.createElement("label");
	label2.innerHTML = "Call";

	var labelInput = document.createElement("input");
	labelInput.type = "text";
	labelInput.placeholder = "Label " + monitorAbsCount;
	labelInput.name = "monitorLabel";

	labelInput.addEventListener("keyup", function(){
		if ( this.value == "" ) {
			newrow["label"].innerHTML = this.getAttribute("placeholder");
		} else {
			newrow["label"].innerHTML = this.value;
		}
	});

	var callInput = document.createElement("input");
	callInput.type = "text";
	callInput.placeholder = "-";
	callInput.name = "monitorCall";

	formgroup.appendChild(formgroupdelete);
	formgroup.appendChild(label1);
	formgroup.appendChild(labelInput);
	formgroup.appendChild(label2);
	formgroup.appendChild(callInput);

	formgroup.addEventListener("mouseover", function() {
		newrow["row"].style.color = "#e67e22";
	}, true)
	formgroup.addEventListener("mouseout", function() {
		newrow["row"].style.color = "";
	}, true)

	document.getElementById("monitorList").appendChild(formgroup);

	if ( fill !== null ) {
		labelInput.value = fill.label;
		callInput.value = fill.call;
		triggerEvent(labelInput, "keyup");
	}
}

function buildMonitor() {
	var row = document.createElement("tr");
	var labelColumn = document.createElement("th");
	labelColumn.innerHTML = "Label " + monitorAbsCount;
	var valueColumn = document.createElement("th");
	valueColumn.innerHTML = "--";

	row.appendChild(labelColumn);
	row.appendChild(valueColumn);

	return {
		row: row,
		label: labelColumn
	}
}

function buildActionForm(type, fill=null) {

	var actionList = document.getElementById("actionList");
	var leftList = document.getElementById("actionListLeft");
	var rightList = document.getElementById("actionListRight");

	++actionCount;
	++actionAbsCount;

	if ( actionCount > 0 ) {
		document.getElementById("actionListPreview").classList.remove("hide");
	}

	if ( type == ACTIONTYPES.button ) 
	{
		/*
			<div class="formActionGroup formSubSection actionButton clearfix">
				<div class="formActionTab formButtonTab">Button</div>
				<div class="formActionGroupDelete">delete</div>
				Action Label<br/>
				<input id="" type="text" name="deviceTitle" value="" placeholder="-">
				Value<br/>
				<input id="" type="text" name="deviceTitle" value="" placeholder="-">
				Call<br/>
				<input id="" type="text" name="deviceTitle" placeholder="-">
			</div>
		*/

		var actionEle = buildAction(type);
		actionEle.label.innerHTML = "BUTTON " + actionAbsCount;
		// console.log(actionEle);

		if ( actionCount % 2 == 0 ) {
			rightList.appendChild(actionEle.parent);
		} else {
			leftList.appendChild(actionEle.parent);
		}

		var formgroup = document.createElement("div");
		addClassesToElement(formgroup, ['formActionGroup', 'formSubSection', 'actionButton', 'clearfix']);
		formgroup.setAttribute("name", "action");
		formgroup.setAttribute("_type", "button");

		formgroup.addEventListener("mouseover", function() {
			actionEle.label.style.color = "#e67e22";
		}, true);
		formgroup.addEventListener("mouseout", function() {
			actionEle.label.style.color = '';
		}, true);
		
		var tab = document.createElement("div");
		addClassesToElement(tab, ['formActionTab', 'formButtonTab']);
		tab.innerHTML = "Button";

		//<div class="formActionGroupDelete">delete</div>
		var deletebutton = document.createElement("div");
		deletebutton.classList.add("formActionGroupDelete");
		deletebutton.innerHTML = "delete";

		deletebutton.addEventListener("click", function() {
			--actionCount;

			if ( actionCount == 0 ) {
				document.getElementById("actionListPreview").classList.add("hide");
			}

			this.parentNode.parentNode.removeChild(this.parentNode);
			rearangeActions(actionEle.parent);
			// actionEle.parent.parentNode.removeChild(actionEle.parent);
		});

		deletebutton.addEventListener("mouseover", function(){
			this.parentNode.style.border = "1px solid #e74c3c";
			actionEle.label.style.color = "#e74c3c";
		});
		deletebutton.addEventListener("mouseout", function(){
			this.parentNode.style.border = "1px solid #0b0c10";
			this.parentNode.style.borderBottom = "1px solid #2f3c4d";
			actionEle.label.style.color = "";
		});

		var actionlabel = document.createElement("label");
		actionlabel.innerHTML = "Action Label";
		var actioninput = document.createElement("input");
		actioninput.type = "text";
		actioninput.placeholder = "Button " + actionAbsCount;
		actioninput.name = "actionButtonLabel";

		actioninput.addEventListener("keyup", function(){
			actionEle.label.innerHTML = this.value;
			if ( this.value == '' ) {
				actionEle.label.innerHTML = '-';
			}
		});

		var valuelabel = document.createElement("label");
		valuelabel.innerHTML = "Value";
		var valueinput = document.createElement("input");
		valueinput.type = "text";
		valueinput.placeholder = "Button " + actionAbsCount;
		valueinput.name = "actionButtonInput";
		valueinput.addEventListener("keyup", function() {
			actionEle.input.value = this.value;
		})
		valueinput.addEventListener("mouseover", function() {
			actionEle.input.style.color = "#fff";
		});
		valueinput.addEventListener("mouseout", function() {
			actionEle.input.style.color = '';
		});
		valueinput.addEventListener("focus", function() {
			actionEle.input.style.color = "#fff";
		});
		valueinput.addEventListener("blur", function() {
			actionEle.input.style.color = '';
		});

		var calllabel = document.createElement("label");
		calllabel.innerHTML = "Call";
		var callinput = document.createElement("input");
		callinput.type = "text";
		callinput.placeholder = "-";
		callinput.name = "actionButtonCall";

		formgroup.appendChild(tab);
		formgroup.appendChild(deletebutton);
		formgroup.appendChild(actionlabel);
		formgroup.appendChild(actioninput);
		formgroup.appendChild(valuelabel);
		formgroup.appendChild(valueinput);
		formgroup.appendChild(calllabel);
		formgroup.appendChild(callinput);
		actionList.appendChild(formgroup);

		if ( fill != null ) {
			actioninput.value = fill.label;
			valueinput.value = fill.value;
			callinput.value = fill.call;
			triggerEvent(actioninput, "keyup");
			triggerEvent(valueinput, "keyup");
		}

	}
	else if ( type == ACTIONTYPES.toggle ) 
	{
		/*
			<div class="formActionGroup formSubSection actionButton">
				<div class="formActionTab formToggleTab">Toggle</div>
				<div class="formActionGroupDelete">delete</div>
				<label>Action Label</label>
				<input id="" type="text" name="deviceTitle" value="" placeholder="-">
				<label>Call</label>
				<input id="" type="text" name="deviceTitle" placeholder="-">
			</div> 
		*/

		var actionEle = buildAction(type);
		actionEle.label.innerHTML = "TOGGLE " + actionAbsCount;

		if ( actionCount % 2 == 0 ) {
			rightList.appendChild(actionEle.parent);
		} else {
			leftList.appendChild(actionEle.parent);
		}

		var formgroup = document.createElement("div");
		formgroup.setAttribute("name", "action");
		formgroup.setAttribute("_type", "toggle");
		addClassesToElement(formgroup, ['formActionGroup', 'formSubSection', 'actionButton', 'clearfix']);
		formgroup.addEventListener("mouseover", function() {
			actionEle.label.style.color = "#e67e22";
		}, true);
		formgroup.addEventListener("mouseout", function() {
			actionEle.label.style.color = '';
		}, true);

		var tag = document.createElement("div");
		tag.innerHTML = "Toggle";
		addClassesToElement(tag, ['formActionTab', 'formToggleTab']);

		var formdelete = document.createElement("div");
		formdelete.classList.add("formActionGroupDelete");
		formdelete.innerHTML = "delete";

		formdelete.addEventListener("click", function() {
			--actionCount;

			if ( actionCount == 0 ) {
				document.getElementById("actionListPreview").classList.add("hide");
			}

			this.parentNode.parentNode.removeChild(this.parentNode);
			rearangeActions(actionEle.parent);
			// actionEle.parent.parentNode.removeChild(actionEle.parent);
		});

		formdelete.addEventListener("mouseover", function(){
			this.parentNode.style.border = "1px solid #e74c3c";
			actionEle.label.style.color = "#e74c3c";
		});
		formdelete.addEventListener("mouseout", function(){
			this.parentNode.style.border = "1px solid #0b0c10";
			this.parentNode.style.borderBottom = "1px solid #2f3c4d";
			actionEle.label.style.color = "";
		});

		var actionlabel = document.createElement("label");
		actionlabel.innerHTML = "Action Label";
		var actioninput = document.createElement("input");
		actioninput.type = "text";
		actioninput.placeholder = "Toggle " + actionAbsCount;
		actioninput.name = "actionToggleLabel"

		actioninput.addEventListener("keyup", function() {
			actionEle.label.innerHTML = this.value;
		});
		actioninput.addEventListener("mouseover", function() {
			actionEle.label.style.color = "#e74c3c";
		});
		actioninput.addEventListener("mouseout", function() {
			actionEle.label.style.color = '';
		});

		var calllabel = document.createElement("label");
		calllabel.innerHTML = "Call";
		var callinput = document.createElement("input");
		callinput.type = "text";
		callinput.placeholder = '-';
		callinput.name = 'actionToggleCall';

		formgroup.appendChild(tag);
		formgroup.appendChild(formdelete);
		formgroup.appendChild(actionlabel);
		formgroup.appendChild(actioninput);
		formgroup.appendChild(calllabel);
		formgroup.appendChild(callinput);

		actionList.appendChild(formgroup);

		if ( fill != null ) {
			actioninput.value = fill.label;
			callinput.value = fill.call;
			triggerEvent(actioninput, "keyup");
		}
	}
	else if ( type == ACTIONTYPES.input )
	{
		/*
			<div class="formActionGroup formSubSection actionButton">
				<div class="formActionTab formInputTab">Input</div>
				<div class="formActionGroupDelete">delete</div>
				<label>Action Label</label>
				<input id="" type="text" name="deviceTitle" value="" placeholder="-">
				<label>Placeholder Text</label>
				<input id="" type="text" name="deviceTitle" value="" placeholder="-">
				<label>Validation</label>
				<input id="" type="text" name="deviceTitle" value="" placeholder="Regex">
				<label>Call</label>
				<input id="" type="text" name="deviceTitle" placeholder="-">
			</div>
		*/

		var actionEle = buildAction(type);
		actionEle.label.innerHTML = "INPUT " + actionAbsCount;

		if ( actionCount % 2 == 0 ) {
			rightList.appendChild(actionEle.parent);
		} else {
			leftList.appendChild(actionEle.parent);
		}

		var formgroup = document.createElement("div");
		addClassesToElement(formgroup, ['formActionGroup', 'formSubSection', 'actionButton', 'clearfix']);
		formgroup.setAttribute("name", "action");
		formgroup.setAttribute("_type", "input");
		formgroup.addEventListener("mouseover", function() {
			actionEle.label.style.color = "#e67e22";
		}, true);
		formgroup.addEventListener("mouseout", function() {
			actionEle.label.style.color = '';
		}, true);

		var tag = document.createElement("div");
		tag.innerHTML = "Input";
		addClassesToElement(tag, ['formActionTab', 'formInputTab']);

		var formdelete = document.createElement("div");
		formdelete.classList.add("formActionGroupDelete");
		formdelete.innerHTML = "delete";

		formdelete.addEventListener("click", function() {
			--actionCount;

			if ( actionCount == 0 ) {
				document.getElementById("actionListPreview").classList.add("hide");
			}

			this.parentNode.parentNode.removeChild(this.parentNode);
			rearangeActions(actionEle.parent);
			// actionEle.parent.parentNode.removeChild(actionEle.parent);
		});

		formdelete.addEventListener("mouseover", function(){
			this.parentNode.style.border = "1px solid #e74c3c";
			actionEle.label.style.color = "#e74c3c";
		});
		formdelete.addEventListener("mouseout", function(){
			this.parentNode.style.border = "1px solid #0b0c10";
			this.parentNode.style.borderBottom = "1px solid #2f3c4d";
			actionEle.label.style.color = "";
		});

		var actionlabel = document.createElement("label");
		actionlabel.innerHTML = "Action Label";
		var actioninput = document.createElement("input");
		actioninput.type = "text";
		actioninput.placeholder = "Input " + actionAbsCount;
		actioninput.name = "actionInputLabel";

		actioninput.addEventListener("keyup", function() {
			actionEle.label.innerHTML = this.value;
		});
		actioninput.addEventListener("mouseover", function() {
			actionEle.label.style.color = "#e74c3c";
		});
		actioninput.addEventListener("mouseout", function() {
			actionEle.label.style.color = '';
		});

		var patternlabel = document.createElement("label");
		patternlabel.innerHTML = "Pattern";
		var patterninput = document.createElement("input");
		patterninput.type = "text";
		patterninput.placeholder = "*";
		patterninput.name = "actionInputPattern";

		patterninput.addEventListener("keyup", function() {
			actionEle.input.pattern = this.value;
			if ( this.value == "" ) {
				actionEle.input.pattern = '*';
				actionEle.input.required = null;
			} else {
				actionEle.input.required = true;
			}
		})


		var calllabel = document.createElement("label");
		calllabel.innerHTML = "Call";
		var callinput = document.createElement("input");
		callinput.type = "text";
		callinput.placeholder = '-';
		callinput.name = "actionInputCall"

		formgroup.appendChild(tag);
		formgroup.appendChild(formdelete);
		formgroup.appendChild(actionlabel);
		formgroup.appendChild(actioninput);
		formgroup.appendChild(patternlabel);
		formgroup.appendChild(patterninput);
		formgroup.appendChild(calllabel);
		formgroup.appendChild(callinput);

		actionList.appendChild(formgroup);

		if ( fill != null ) {
			actioninput.value = fill.label;
			patterninput.value = fill.pattern;
			callinput.value = fill.call;
			triggerEvent(actioninput, "keyup");
			triggerEvent(patterninput, "keyup");
		}
	}
}

function buildAction(type) {
	if ( type == ACTIONTYPES.button ) 
	{
		/*
			<div class="deviceActionGroup">
				<div class="deviceActionLabel">Label Toggle Switch</div>
				<input type="button" name="short text" value="button">
			</div>
		*/

		var parent = document.createElement("div");
		parent.classList.add("deviceActionGroup");

		var label = document.createElement("div");
		label.classList.add("deviceActionLabel");

		var input = document.createElement("input");
		input.type = "button";
		input.value = "button";

		parent.appendChild(label);
		parent.appendChild(input);

		return {
			parent: parent,
			label: label,
			input: input
		};
	} 
	else if ( type == ACTIONTYPES.toggle ) 
	{
		/*
			<div class="deviceActionGroup">
				<div class="deviceActionLabel">Label Toggle Switch</div>
				<div class="deviceActionSwitchWrapper">
					<label class="switch">
						<input type="checkbox">
						<span class="slider round"></span>
					</label>
				</div>
			</div>
		*/
		var parent = document.createElement("div");
		parent.classList.add("deviceActionGroup");

		var label = document.createElement("div");
		label.classList.add("deviceActionLabel");

		var switchWrapper = document.createElement("div");
		switchWrapper.classList.add("deviceActionSwitchWrapper");

		var switchLabel = document.createElement("label");
		switchLabel.classList.add("switch");
		var switchInput = document.createElement("input");
		switchInput.type = "checkbox";
		var switchSpan = document.createElement("span");
		addClassesToElement(switchSpan, ['slider', 'round']);

		switchLabel.appendChild(switchInput);
		switchLabel.appendChild(switchSpan);
		switchWrapper.appendChild(switchLabel);

		parent.appendChild(label);
		parent.appendChild(switchWrapper);

		return {
			parent: parent,
			label: label,
			checkbox: switchInput
		};
	} 
	else if ( type == ACTIONTYPES.input ) 
	{
		/*
			<div class="deviceActionGroup">
				<div class="deviceActionLabel">Label Text Input Short</div>
				<input type="text" name="short text" value="-">
			</div>
		*/

		var parent = document.createElement("div")
		parent.classList.add("deviceActionGroup");

		var label = document.createElement("div");
		label.classList.add("deviceActionLabel");

		var input = document.createElement("input");
		input.type = "text";
		input.placeholder = "-";
		input.pattern = "*";

		parent.appendChild(label);
		parent.appendChild(input);

		return {
			parent: parent,
			label: label,
			input: input
		};
	}
}

function rearangeActions(skip) {
	var leftList = document.getElementById("actionListLeft");
	var rightList = document.getElementById("actionListRight");

	var left = leftList.childNodes;
	var leftActions = [];
	for ( var i = 0; i < left.length; ++i ) {
		if ( left[i].nodeType === 1 ) {
			leftActions.push(left[i]);
		}
	}

	var right = rightList.childNodes;
	var rightActions = [];
	for ( var i = 0; i < right.length; ++i ) {
		if ( right[i].nodeType === 1 ) {
			rightActions.push(right[i]);
		}
	}

	var allActions = [];
	var count = 0;
	var leftActionsLength = leftActions.length;

	for ( var i = 0; i < leftActionsLength * 2; ++i ) {
		if ( count % 2 == 0 ) {
			allActions.push(leftActions.shift())
			leftList.removeChild(allActions[allActions.length - 1]);
		} else {
			if ( rightActions.length > 0 ) {
				allActions.push(rightActions.shift())
				rightList.removeChild(allActions[allActions.length - 1]);
			}
		}
		++count;
	}


	if ( allActions.length == 1 ) {
		return;
	}

	count = 0;

	for ( var i = 0; i < allActions.length; ++i ) {
		if ( count % 2 == 0 ) {
			if ( allActions[i] !== skip ) {
				leftList.appendChild(allActions[i]);
			} else {
				continue;
			}
		} else {
			if ( allActions[i] !== skip ) {
				rightList.appendChild(allActions[i]);
			} else {
				continue;
			}
		}

		++count;
	}
}

function saveForm(save=true) {
	var json = {};
	var expected = {};
	var needInit = true;

	json.initialCall = document.getElementById("initialCall").value;
	if (json.initialCall == "") {
		needInit = false;
	}

	json.header = {};
	json.header.name = document.getElementById("actionBarHeaderName").value;
	json.header.color = document.getElementById("actionBarHeaderColor").value;
	json.header.displayHighLevel = document.getElementById("highLevelDataCheckbox").getAttribute("checked") == 'true';

	if ( json.header.displayHighLevel == true ) {
		json.header.highlevel = {};
		json.header.highlevel.type = document.getElementById("highLevelDataOptions").value;

		json.header.highlevel.options = {};
		if ( json.header.highlevel.type == "message" ) {
			json.header.highlevel.options.call = document.getElementById("HighLevelDataMessageCall").value;
			expected.highlevel = {};
			expected.highlevel.value = "STRING";
		} 
		else if ( json.header.highlevel.type == "toggle" ) {
			json.header.highlevel.options.offLabel = document.getElementById("highLevelDataToggleLabelOff").value;
			json.header.highlevel.options.onLabel = document.getElementById("highLevelDataToggleLabelOn").value;
			json.header.highlevel.options.call = document.getElementById("highLevelDataToggleCall").value;
			expected.highlevel = {};
			expected.highlevel.state = "BOOLEAN";
		}
		else if ( json.header.highlevel.type == "push" ) {
			json.header.highlevel.options.value = document.getElementById("highLevelDataButtonText").value;
			json.header.highlevel.options.call = document.getElementById("highLevelDataButtonCall").value;
		}
	}

	json.monitors = [];
	var monitors = document.getElementsByName("monitor");
	if ( monitors.length > 0 ) {
		expected.monitors = {};
	}
	for ( var i = 0; i < monitors.length; ++i ) {
		//querySelectorAll
		var monitor = {}
		var expectedM = {}
		monitor.label = monitors[i].querySelector("input[name='monitorLabel']").value;
		if ( monitor.label == "" ) monitor.label = monitors[i].querySelector("input[name='monitorLabel']").getAttribute("placeholder");
		monitor.label = cleanValue(monitor.label);
		monitor.call = monitors[i].querySelector("input[name='monitorCall']").value;
		json.monitors.push(monitor);
		expected.monitors[monitor.label] = "STRING | NUMBER | BOOLEAN";
	}

	json.actions = [];
	var actions = document.getElementsByName("action");
	if ( actions.length > 0 ) {
		expected.actions = {};
	}
	for ( var i = 0; i < actions.length; ++i ) {
		var action = {};
		action.type = actions[i].getAttribute("_type");

		if ( action.type == "button" ) {
			action.call = actions[i].querySelector("input[name='actionButtonCall']").value;
			action.value = actions[i].querySelector("input[name='actionButtonInput']").value;
			action.label = actions[i].querySelector("input[name='actionButtonLabel']").value;
			if ( action.label == "" ) action.label = actions[i].querySelector("input[name='actionButtonInput']").getAttribute("placeholder");
			action.label = cleanValue(action.label);
		}
		else if ( action.type == "toggle" ) {
			action.call = actions[i].querySelector("input[name='actionToggleCall']").value;
			action.label = actions[i].querySelector("input[name='actionToggleLabel']").value;
			if ( action.label == "" ) action.label = actions[i].querySelector("input[name='actionToggleLabel']").getAttribute("placeholder");
			action.label = cleanValue(action.label);
			expected.actions[action.label] = "BOOLEAN";
		}
		else if ( action.type == "input" ) {
			action.call = actions[i].querySelector("input[name='actionInputCall']").value;
			action.label = actions[i].querySelector("input[name='actionInputLabel']").value;
			if ( action.label == "" ) action.label = actions[i].querySelector("input[name='actionInputLabel']").getAttribute("placeholder");
			action.label = cleanValue(action.label);
			action.pattern = actions[i].querySelector("input[name='actionInputPattern']").value;
			expected.actions[action.label] = "STRING";
		}

		json.actions.push(action);
	}

	if ( needInit ) {
		if ( save ) {
			document.getElementById("deviceForm").classList.add("hide");
			document.getElementById("jsonExpected").classList.remove("hide");
		}
		document.getElementById("jsonObj").innerHTML = JSON.stringify(expected, undefined, 4);
		document.getElementById("jsonObj").style.height = document.getElementById("jsonObj").scrollHeight + "px";
		document.getElementById("jsonObj").style.minHeight = document.getElementById("jsonObj").scrollHeight + "px";
		document.getElementById("jsonObj").style.maxHeight = document.getElementById("jsonObj").scrollHeight + "px";
	} else {
		if ( save ) {
			document.getElementById("deviceForm").classList.add("hide");
			document.getElementById("jsonExpected").classList.remove("hide");
		}
		document.getElementById("jsonInstruct").innerHTML = "No initial call provided."
		document.getElementById("jsonObj").style.display = "none";
		document.getElementById("jsonCopy").style.display = "none";
		document.getElementById("backHome").style.float = "left";
	}

	if ( save ) {
		submitDevice(json);
	}
}

function triggerEvent(el, type) {
	if ('createEvent' in document) {
        // modern browsers, IE9+
	    var e = document.createEvent('HTMLEvents');
	    e.initEvent(type, false, true);
	    el.dispatchEvent(e);
	} else {
	    // IE 8
	    var e = document.createEventObject();
	    e.eventType = type;
	    el.fireEvent('on'+e.eventType, e);
	}
}

function cleanValue(string) {
	return string.replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').replace(/ /g, "_").toLowerCase();
}

function submitDevice( device ) {
	console.log(JSON.stringify(device));

	if ( editing ) {
		device._id = sessionStorage.deviceID;
		
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
			}
		};
		xhttp.open("PUT", "https://hap-api.herokuapp.com/devices", true);
		xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhttp.send(JSON.stringify(device));
	} 
	else {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
			}
		};
		xhttp.open("POST", "https://hap-api.herokuapp.com/devices", true);
		xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhttp.send(JSON.stringify(device));
	}
	
}