let checkboxEntered = false;
let monitorCount = 0;
let monitorAbsCount = 0;


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
	})

	document.getElementById("highLevelDataButtonText").addEventListener("keyup", function() {
		document.getElementById("deviceButtonPreview").value = this.value;
	});

	document.getElementById("monitorCreate").addEventListener("click", buildMonitorForm);

}

function validHexColor(color) {
	var validChars = ['0', '1', '2', '3', '4', '5', '6', 'a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F', '#'];
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

function buildMonitorForm() {
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

	var formgroupdelete = document.createElement("div");
	formgroupdelete.classList.add("formMonitorGroupDelete");
	formgroupdelete.innerHTML = "delete";

	formgroupdelete.addEventListener("click", function(){
		--monitorCount;
		console.log(newrow.row);
		if ( monitorCount == 0 ) {
			document.getElementById("deviceMonitorsPreview").classList.add("hide");
		}

		console.log(monitorCount);
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