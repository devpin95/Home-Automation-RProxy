var DEAFULT_HEADER_COLOR = "#c5c6c7";
var ACTIONTYPES = {
	button: "button",
	toggle: "toggle",
	input: "input"
};
var HIGHLEVELTYPES = {
	button: "push",
	toggle: "toggle",
	message: "message"
};

function load() {
	var deviceListJson = getDeviceList();
	// console.log(deviceListJson);
	//buildDeviceList(deviceListJson);
}

	// var json = '{"devices": [{"initialCall":"www.dpcloud.com/api/init","header":{"name":"Home Server","color":"#3498db","displayHighLevel":true,"highlevel":{"type":"toggle","options":{"offLabel":"Off","onLabel":"On","call":"www.dpcloud.com/api/power"}}},"monitors":[{"label":"Status","call":""},{"label":"Outages (24h)","call":""},{"label":"Temperature","call":""},{"label":"Memory Usage","call":""}],"actions":[{"type":"button","call":"www.dpcloud.com/api/powercycle","value":"start","label":"Power Cycle"},{"type":"button","call":"www.dpcloud.com/api/dump","value":"dump","label":"Dump Env"},{"type":"input","call":"www.dpcloud.com/api/notifications","label":"Notify @ Temp (C)","pattern":"[0-9]{1,3}"},{"type":"input","call":"www.dpcloud.com/api/notifications","label":"Notify @ Memory Usage (GB)","pattern":"[1-9]\d*(\.\d+)?"},{"type":"toggle","call":"www.dpcloud.com/api/notifications","label":"Notify Outages"}]}, {"initialCall":"","header":{"name":"Push Buttn","color":"","displayHighLevel":true,"highlevel":{"type":"push","options":{"value":"Button","call":""}}},"monitors":[],"actions":[]}]}'
	// localStorage.setItem("devices", json);

function getDeviceList() {

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("loading").classList.add("hide");
			var json = JSON.parse(this.responseText);
			// console.log(json);
			localStorage.setItem("devices", this.responseText);
			buildDeviceList(JSON.parse(localStorage.devices));
		}
	};
	xhttp.open("GET", "https://hap-api.herokuapp.com/devices", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();

	// console.log(JSON.parse(localStorage.devices));

	// return JSON.parse(localStorage.devices);
}

function buildDeviceList(json) {
	console.log("DEVICE LIST", json);

	var deviceList = document.getElementById("device_list");

	if ( json["devices"].length == 0 ) 
	{
		// make the default div that says to make a new device
		var device = document.createElement("div");
		device.classList.add("device");
		device.classList.add("clearfix");

		var deviceTitle = document.createElement("div");
		deviceTitle.classList.add("deviceTitle");
		deviceTitle.innerHTML = "Home Automation RProxy";
		deviceTitle.style.color = "#66fcf1";

		var deviceHighLevel = document.createElement("div");
		deviceHighLevel.classList.add("deviceHighLevel");
		deviceHighLevel.innerHTML = "To continue: Add a new device ^";

		device.appendChild(deviceTitle);
		device.appendChild(deviceHighLevel);

		deviceList.appendChild(device);
	}
	else 
	{
		for ( var i = 0; i < json.devices.length; ++i ) {
			var device = document.createElement("div");
			device.classList.add("device");
			// device.classList.add("clearfix");

			var deviceHeader = document.createElement("div");
			deviceHeader.classList.add("deviceHeader");
			deviceHeader.classList.add("clearfix");

			var deviceTitle = document.createElement("div");
			deviceTitle.classList.add("deviceTitle");
			deviceTitle.innerHTML = json.devices[i].header.name;
			deviceTitle.setAttribute("_id", json.devices[i]._id);
			deviceTitle.addEventListener("click", function() {
				sessionStorage.setItem("device", this.innerHTML);
				sessionStorage.setItem("deviceID", this.getAttribute("_id"));
				window.location.href = "device.html?editing=true";
			})

			if ( json.devices[i].header.color == "" ) {
				deviceTitle.style.color = DEAFULT_HEADER_COLOR;
			} else {
				deviceTitle.style.color = json.devices[i].header.color;
			}

			if ( json.devices[i].header.displayHighLevel == true ) {

				var highLevelWrapper = document.createElement("div");
				highLevelWrapper.setAttribute("name", "highlevel");


				// Status message
				if ( json.devices[i].header.highlevel.type == "message" ) 
				{
					highLevelWrapper.setAttribute("_type", "message");
					var status = document.createElement("div");
					status.name = "highlevel";
					status.classList.add("deviceHighLevel");
					status.innerHTML = "-";
					status.setAttribute("name", "highlevelmessage");

					highLevelWrapper.appendChild(status);
					deviceHeader.appendChild(highLevelWrapper);
				}

				// toggle button
				else if ( json.devices[i].header.highlevel.type == "toggle" ) 
				{
					highLevelWrapper.classList.add("deviceHighLevel");
					highLevelWrapper.setAttribute("_type", "toggle");

					var label = document.createElement("div");
					label.innerHTML = json.devices[i].header.highlevel.options.onLabel;
					label.classList.add("highLevelToggleLabel");
					var toggle = buildToggleButton(json.devices[i].header.highlevel.options);
					toggle.name = "highlevel";

					highLevelWrapper.appendChild(label);
					highLevelWrapper.appendChild(toggle);
					deviceHeader.appendChild(highLevelWrapper);
				}

				// push button
				else if ( json["devices"][i]["header"]["highlevel"]["type"] == "push" ) 
				{
					highLevelWrapper.setAttribute("_type", "push");
					highLevelWrapper.classList.add("deviceHighLevel");

					var button = document.createElement("input");
					button.type = "button";
					button.value = json.devices[i].header.highlevel.options.value;
					button.name = "highlevel";
					button.setAttribute("_call", json.devices[i].header.highlevel.options.call)

					button.addEventListener("click", function() {
						// alert("GET on " + this.getAttribute("_call"));
						var call = this.getAttribute("_call");
						var button = this;

						var xhttp = new XMLHttpRequest();
						xhttp.onreadystatechange = function() {
							if (this.readyState == 4 && this.status == 200) {
								console.log("BUTTON", button, call, this.responseText);
							}
						};
						xhttp.open("POST", call, true);
						xhttp.setRequestHeader("Content-Type", "application/json");
						xhttp.send();
					})

					highLevelWrapper.appendChild(button);
					deviceHeader.appendChild(highLevelWrapper);
				}
			}

			deviceHeader.appendChild(deviceTitle);
			device.appendChild(deviceHeader);
			deviceList.appendChild(device);


			if ( json.devices[i].monitors.length > 0 ) {
				var monitorList = document.createElement("div");
				monitorList.classList.add("deviceMonitors");

				var table = document.createElement("table");

				for ( var j = 0; j < json.devices[i].monitors.length; ++j ) {
					var row = document.createElement("tr");
					row.setAttribute("call", json.devices[i].monitors[j].call)

					var label_column = document.createElement("th");
					label_column.innerHTML = json.devices[i].monitors[j].label;

					var value_column = document.createElement("th");
					value_column.innerHTML = '-';
					value_column.setAttribute("name", cleanValue(json.devices[i].monitors[j].label));

					
					var call = json.devices[i].monitors[j].call;
					var interval = 1;

					if ( call !== '' ) {
						(function(call, interval, column){
							setInterval( function(){
								column.style.color = "#27ae60";
								var xhttp = new XMLHttpRequest();
								xhttp.onreadystatechange = function() {
									if (this.readyState == 4 && this.status == 200) {
										var json = JSON.parse(this.responseText);
										console.warn("Updating monitor: " + call, column, json);
										column.innerHTML = json.value;
										column.style.color = "";
									}
								};
								xhttp.open("GET", call, true);
								xhttp.setRequestHeader("Content-Type", "application/json");
								xhttp.send();

							}, interval * 60000 );
						})(call, interval, value_column);
					}

					row.appendChild(label_column);
					row.appendChild(value_column);
					table.appendChild(row);
				}

				monitorList.appendChild(table);
				device.appendChild(monitorList);
			}

			if ( json.devices[i].actions.length > 0 ) {
				var actionList = document.createElement("div");
				actionList.classList.add("deviceActions");
				actionList.classList.add("clearfix");
				actionList.setAttribute("_name", "ActionList");

				var leftList = document.createElement("div");
				leftList.classList.add("deviceActionsLeft");

				var rightList = document.createElement("div");
				rightList.classList.add("deviceActionsRight")

				var count = 0;
				for ( var j = 0; j < json.devices[i].actions.length; ++j ) {
					var action = buildAction(json.devices[i].actions[j])
					action.parent.setAttribute("name", cleanValue(json.devices[i].actions[j].label));
					action.parent.setAttribute("_type", cleanValue(json.devices[i].actions[j].type));

					if ( count % 2 == 0 ) {
						leftList.appendChild(action.parent);
					} else {
						rightList.appendChild(action.parent);
					}

					++count;
				}

				actionList.appendChild(leftList);
				actionList.appendChild(rightList);
				device.appendChild(actionList);

			}

			if ( json.devices[i].initialCall != '' ) {
				initDevice(device, json.devices[i].initialCall);
			}
		}
	}
}

function buildToggleButton(metadata) {
	/*
	<label class="switch">
		<input type="checkbox">
		<span class="slider round"></span>
	</label>
	*/

	var label = document.createElement("label");
	label.classList.add("switch");

	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = true;
	checkbox.setAttribute("_on", metadata.onLabel);
	checkbox.setAttribute("_off", metadata.offLabel);
	checkbox.setAttribute("_call", metadata.call);
	checkbox.setAttribute("_parameter", "highlevel");
	checkbox.addEventListener("click", function() {
		// alert("PUT on " + this.getAttribute("_call") + "?" + this.getAttribute("_parameter") + "=" + this.checked);

		var call = this.getAttribute("_call");
		var state = this.checked;
		var toggle = this;

		console.log(this.parentNode.parentNode.querySelector("div[class='highLevelToggleLabel'"));
		if ( state ) {
			this.parentNode.parentNode.querySelector("div[class='highLevelToggleLabel'").innerHTML = this.getAttribute("_on");
			console.log(this.getAttribute("_on"));
		} else {
			this.parentNode.parentNode.querySelector("div[class='highLevelToggleLabel'").innerHTML = this.getAttribute("_off");
			console.log(this.getAttribute("_off"));
		}

		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log("TOGGLE", toggle, call + "?state=" + state, this.responseText);
			}
		};
		xhttp.open("POST", call + "?state=" + state, true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send();
	});

	var span = document.createElement("span");
	span.classList.add("slider");
	span.classList.add("round")

	label.appendChild(checkbox);
	label.appendChild(span);

	return label;
}


function buildAction(metadata) {
	if ( metadata.type == ACTIONTYPES.button ) 
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
		label.innerHTML = metadata.label;

		var input = document.createElement("input");
		input.type = "button";
		input.value = "button";
		input.setAttribute("_call", metadata.call);
		input.setAttribute("name", cleanValue(metadata.label));
		input.setAttribute("_type", "button");

		input.addEventListener("click", function() {
			// alert("GET on " + this.getAttribute("_call"));
			var call = this.getAttribute("_call");
			var button = this;

			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					console.log("BUTTON", button, call, this.responseText);
				}
			};
			xhttp.open("POST", call, true);
			xhttp.setRequestHeader("Content-Type", "application/json");
			xhttp.send();
		});

		parent.appendChild(label);
		parent.appendChild(input);

		return {
			parent: parent,
			label: label,
			input: input
		};
	} 
	else if ( metadata.type == ACTIONTYPES.toggle ) 
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
		label.innerHTML = metadata.label;

		var switchWrapper = document.createElement("div");
		switchWrapper.classList.add("deviceActionSwitchWrapper");

		var switchLabel = document.createElement("label");
		switchLabel.classList.add("switch");
		var switchInput = document.createElement("input");
		switchInput.type = "checkbox";
		switchInput.setAttribute("_call", metadata.call);
		switchInput.setAttribute("name", cleanValue(metadata.label));
		switchInput.setAttribute("_type", "toggle");

		switchInput.addEventListener("click", function() {
			// alert("PUT on " + this.getAttribute("_call") + "?"+ metadata.label.replace(/ /g, '_').toLowerCase() + "=" + this.checked);
			var call = this.getAttribute("_call");
			var state = this.checked;
			var toggle = this;

			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					console.log("TOGGLE", toggle, call + "?state=" + state, this.responseText);
				}
			};
			xhttp.open("POST", call + "?state=" + state, true);
			xhttp.setRequestHeader("Content-Type", "application/json");
			xhttp.send();
		});

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
	else if ( metadata.type == ACTIONTYPES.input ) 
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
		label.innerHTML = metadata.label;

		var input = document.createElement("input");
		input.type = "text";
		input.placeholder = "-";
		input.pattern = metadata.pattern;
		input.setAttribute("_call", metadata.call);
		input.setAttribute("name", cleanValue(metadata.label));
		input.setAttribute("_type", "input");

		input.addEventListener("keypress", function() {
			if ( event.keyCode === 13 && this.checkValidity() && this.value != '' ) {
				var body = {};
				body.value = this.value;

				var call = this.getAttribute("_call");
				var input = this;

				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						console.log("INPUT", input, call, this.responseText);
					}
				};
				xhttp.open("POST", call, true);
				xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				xhttp.send(JSON.stringify(body));
			}
		})

		parent.appendChild(label);
		parent.appendChild(input);

		return {
			parent: parent,
			label: label,
			input: input
		};
	}
}

function addClassesToElement(ele, classes) {
	for ( var i = 0; i < classes.length; ++i ) {
		ele.classList.add(classes[i]);
	}
}

function initDevice(device, init) {
	/*
		{
		    "highlevel": {
		        "state": "BOOLEAN"
		    },
		    "monitors": {
		        "Temperature": "STRING | NUMBER | BOOLEAN",
		        "Oven": "STRING | NUMBER | BOOLEAN"
		    },
		    "actions": {
		        "Light Color": "STRING",
		        "Camera": "BOOLEAN"
		    }
		}
	*/

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var json = JSON.parse(this.responseText);
			console.log("INIT " + init, device);
			try 
			{
				if ( json.hasOwnProperty('highlevel') ) {
					var highlevel = device.querySelector('div[name="highlevel"]');
					var type = highlevel.getAttribute("_type");
					if ( type == HIGHLEVELTYPES.toggle ) {
						var toggle = device.querySelector('input[type="checkbox"]');
						toggle.checked = json.highlevel.state;
						device.querySelector('div[class="highLevelToggleLabel"]').innerHTML = ( (json.highlevel.state) ? toggle.getAttribute("_on") : toggle.getAttribute("_off") )
					}
					else if ( type == HIGHLEVELTYPES.message ) {
						var message = device.querySelector('div[name="highlevelmessage"]');
						message.innerHTML = json.highlevel.value;
					}
				}

				if ( json.hasOwnProperty('monitors') ) {
					for ( var monitor in json.monitors ) {
						if ( json.monitors.hasOwnProperty(monitor) ) {
							device.querySelector('th[name="' + monitor + '"]').innerHTML = json.monitors[monitor];
						}
					}
				}

				if ( json.hasOwnProperty('actions') ) {
					var list = device.querySelector('th[name="ActionList"]');
					for ( var action in json.actions ) {
						if ( json.actions.hasOwnProperty(action) ) {
							var actionGroup = device.querySelector('div[name="' + cleanValue(action) + '"]');

							if ( actionGroup.getAttribute("_type") == ACTIONTYPES.toggle ) {
								actionGroup.querySelector("input[type='checkbox']").checked = json.actions[action];
							} else if ( actionGroup.getAttribute("_type") == ACTIONTYPES.input ) {
								actionGroup.querySelector("input[type='text']").value = json.actions[action];
							}
						}
					}
				}
			} 
			catch ( err ) {
				console.error("Error calling " + init + " in ", device, err);
				device.style.border = "1px solid #e74c3c";
			}
		}
	};
	xhttp.open("GET", init, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

function cleanValue(string) {
	return string.replace(/[^\w\s]/gi, '').replace(/\s+/g,' ').replace(/ /g, "_").toLowerCase();
}