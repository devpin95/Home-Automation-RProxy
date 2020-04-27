var DEAFULT_HEADER_COLOR = "#c5c6c7";
var ACTIONTYPES = {
	button: "button",
	toggle: "toggle",
	input: "input"
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
	console.log(json);

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
			deviceTitle.addEventListener("click", function() {
				sessionStorage.setItem("device", this.innerHTML);
				window.location.href = "device.html?editing=true";
			})

			if ( json.devices[i].header.color == "" ) {
				deviceTitle.style.color = DEAFULT_HEADER_COLOR;
			} else {
				deviceTitle.style.color = json.devices[i].header.color;
			}

			if ( json.devices[i].header.displayHighLevel == true ) {
				// Status message
				if ( json.devices[i].header.highlevel.type == "status" ) 
				{
					var status = document.createElement("div");
					status.classList.add("deviceHighLevel");
					status.innerHTML = "-";

					deviceHeader.appendChild(status);
				}

				// toggle button
				else if ( json.devices[i].header.highlevel.type == "toggle" ) 
				{
					var highlevel = document.createElement("div");
					highlevel.classList.add("deviceHighLevel");

					var label = document.createElement("div");
					label.innerHTML = json.devices[i].header.highlevel.options.onLabel;
					label.classList.add("highLevelToggleLabel");
					var toggle = buildToggleButton(json.devices[i].header.highlevel.options);

					highlevel.appendChild(label);
					highlevel.appendChild(toggle);
					deviceHeader.appendChild(highlevel);
				}

				// push button
				else if ( json["devices"][i]["header"]["highlevel"]["type"] == "push" ) 
				{
					var highlevel = document.createElement("div");
					highlevel.classList.add("deviceHighLevel");

					var button = document.createElement("input");
					button.type = "button";
					button.value = json.devices[i].header.highlevel.options.value;
					button.setAttribute("_call", json.devices[i].header.highlevel.options.call)

					highlevel.appendChild(button);
					deviceHeader.appendChild(highlevel);
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
					value_column.innerHTML = json.devices[i].monitors[j].call;

					
					var call = json.devices[i].monitors[j].call;
					var interval = 1;

					(function(call, interval, column){
						setInterval( function(){
							column.innerHTML = "1000";
						}, interval * 60000 );
					})(call, interval, value_column);

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

				var leftList = document.createElement("div");
				leftList.classList.add("deviceActionsLeft");

				var rightList = document.createElement("div");
				rightList.classList.add("deviceActionsRight")

				var count = 0;
				for ( var j = 0; j < json.devices[i].actions.length; ++j ) {
					var action = buildAction(json.devices[i].actions[j])

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
		alert("PUT on " + this.getAttribute("_call") + "?" + this.getAttribute("_parameter") + "=" + this.checked);
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

		input.addEventListener("click", function() {
			alert("GET on " + this.getAttribute("_call"));
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

		switchInput.addEventListener("click", function() {
			alert("PUT on " + this.getAttribute("_call") + "?"+ metadata.label.replace(/ /g, '_').toLowerCase() + "=" + this.checked);
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

		input.addEventListener("keypress", function() {
			if ( event.keyCode === 13 && this.checkValidity() && this.value != '' ) {
				var body = {};
				var key = this.previousSibling.innerHTML.replace(/[^a-zA-Z ]/g, "").replace(/\s+/g,' ').replace(/ /g, '_').toLowerCase();
				body[key] = this.value;
				alert("PUT on " + this.getAttribute("_call") + '\nBody:' + JSON.stringify(body));
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