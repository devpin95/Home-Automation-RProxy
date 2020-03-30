function load() {
	var deviceListJson = getDeviceList();
	// console.log(deviceListJson);
	buildDeviceList(deviceListJson);
}

function getDeviceList() {

	var json = {
		"devices": [
			{
				"header": {
					"name": "Thermostat",
					"color": "#2980b9",
					"displayhighlevel": true,
					"highlevel": {
						"type": "status",
						"label": "Current Temp",
						"call": "https://www.mydomain.com/api/status/",
						"repeat": true,
						"interval": 5 
					}
				},

				"monitors": [
					{
						"label": "Humidity",
						"call": "https://www.mydomain.com/api/humidity",
						"repeat": true,
						"interval": 5
					},
					{
						"label": "Pressure",
						"call": "https://www.mydomain.com/api/pressure",
						"repeat": true,
						"interval": 1
					}
				]
			},
			{
				"header": {
					"name": "Kitchen",
					"color": "#e74c3c",
					"displayhighlevel": true,
					"highlevel": {
						"type": "toggle",
						"parameter": "toggle",
						"label": {
							"on": "Lights On",
							"off": "Lights Off"
						},
						"call": "https://www.mydomain.com/api/kitchen"
					}
				},
				"monitors": []
			}
		]
	}

	// var json = {
	// 	"devices": []
	// }

	return json
}

function buildDeviceList(json) {

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
		for ( var i = 0; i < json["devices"].length; ++i ) {
			var device = document.createElement("div");
			device.classList.add("device");
			// device.classList.add("clearfix");

			var deviceHeader = document.createElement("div");
			deviceHeader.classList.add("deviceHeader");
			deviceHeader.classList.add("clearfix");

			var deviceTitle = document.createElement("div");
			deviceTitle.classList.add("deviceTitle");
			deviceTitle.innerHTML = json["devices"][i]["header"]["name"];
			deviceTitle.style.color = json["devices"][i]["header"]["color"];

			if ( json["devices"][i]["header"]["displayhighlevel"] == true ) {
				// Status message
				if ( json["devices"][i]["header"]["highlevel"]["type"] == "status" ) 
				{
					var status = document.createElement("div");
					status.classList.add("deviceHighLevel");
					status.innerHTML = json["devices"][i]["header"]["highlevel"]["label"] + ":" + "&nbsp;&nbsp;&nbsp;-";

					deviceHeader.appendChild(status);
				}

				// toggle button
				else if ( json["devices"][i]["header"]["highlevel"]["type"] == "toggle" ) 
				{
					var highlevel = document.createElement("div");
					highlevel.classList.add("deviceHighLevel");

					var label = document.createElement("div");
					label.innerHTML = json["devices"][i]["header"]["highlevel"]["label"]["on"];
					label.classList.add("highLevelToggleLabel");
					var toggle = buildToggleButton(json["devices"][i]["header"]["highlevel"]);

					highlevel.appendChild(label);
					highlevel.appendChild(toggle);
					deviceHeader.appendChild(highlevel);
				}
			}

			deviceHeader.appendChild(deviceTitle);
			device.appendChild(deviceHeader);
			deviceList.appendChild(device);


			if ( json["devices"][i]["monitors"].length > 0 ) {
				var monitorList = document.createElement("div");
				monitorList.classList.add("deviceMonitors");

				var table = document.createElement("table");

				for ( var j = 0; j < json["devices"][i]["monitors"].length; ++j ) {
					var row = document.createElement("tr");
					row.setAttribute("call", json["devices"][i]["monitors"][j]["call"])

					var label_column = document.createElement("th");
					label_column.innerHTML = json["devices"][i]["monitors"][j]["label"];

					var value_column = document.createElement("th");
					value_column.innerHTML = json["devices"][i]["monitors"][j]["call"];

					
					if ( json["devices"][i]["monitors"][j]["repeat"] == true ) {
						var call = json["devices"][i]["monitors"][j]["call"];
						var interval = json["devices"][i]["monitors"][j]["interval"];

						(function(call, interval){
							setInterval( function(){
								console.log(call);
							}, interval * 60000 );
						})(call, interval);
					}

					row.appendChild(label_column);
					row.appendChild(value_column);
					table.appendChild(row);
				}

				monitorList.appendChild(table);
				device.appendChild(monitorList);
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
	console.log(metadata);

	var label = document.createElement("label");
	label.classList.add("switch");

	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = true;
	checkbox.setAttribute("_on", metadata["label"]["on"]);
	checkbox.setAttribute("_off", metadata["label"]["off"]);
	checkbox.setAttribute("_domain", metadata["call"])
	checkbox.setAttribute("_parameter", metadata["parameter"])
	checkbox.addEventListener("click", highLevelToggleClick);

	var span = document.createElement("span");
	span.classList.add("slider");
	span.classList.add("round")

	label.appendChild(checkbox);
	label.appendChild(span);

	return label;
}

function highLevelToggleClick() {
	var label = this.parentNode.parentNode.childNodes[0];
	var ischecked = this.checked;
	if ( ischecked ) {
		label.innerHTML = this.getAttribute("_on");
	}
	else {
		label.innerHTML = this.getAttribute("_off");
	}

	// build url
	var url = this.getAttribute("_domain") + "?" + this.getAttribute("_parameter") + "=" + ischecked;
	console.log("PUT on " + url);

}