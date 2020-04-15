# Home Automation RProxy

When building API’s to control multiple home-automation systems, a major roadblock in development 
arises in trying to provide a single GUI to control all of those systems. We would like to build a 
reverse proxy API that allows you to connect all of your DIY smart devices to a single GUI by 
providing a simple “public facing” interface which allows you to makes calls (pass data) to the API 
controlling the device. For example, a single house can have a Raspberry Pi controlling the kitchen 
lights and another controlling the garage door. Our API and website will allow the user to easily
create a section for their kitchen and garage door where they can assign separate GUIs for each, as 
well as, point the data towards the correct API. The kitchen page can have inputs for toggling the 
lights on and off, a color value, and a brightness value, which can be input by the user and shipped
off to the kitchen API in the appropriate format. Another page can be used for the garage door, a 
simple toggle button to open and close the door. Both pages can be provided an API call to the 
corresponding device to get status details so that the page can display the current state of the 
systems at load time.

[No Proxy](images/NoProxy.png)

[With Proxy](images/WithProxy.png)

## GUIs
Our site will provide an interface to create simple GUI elements to control a device through their own API
hosted on a different server (Heroku) through simple API calls. For each GUI element, an endpoint
is provided that will be called when some interaction occurs. If extra information needs to be sent
along with the request (text inputs), it will be provided as JSON in the body.

### Devices
[GUI Sample](images/SampleDevice.png)

For a device, we can add controls for different elements like in the sample above. Each device is broken
in to three sections: the header, monitors, and actions.

### Header
[Device Header Sample](images/DeviceHeader.png)

The Device header has the title of the device being controlled and a high level action for the device
(something that the user decides is information that is more important than the rest of the device info/actions).
The high level action can one of three options - toggle, button, or message - and has it's own call that
will be made when interacted with. For the message, a single call will be made on page load to get it's
value.

### Monitors
[Device Monitor Sample](images/DeviceMonitors.png)

Device monitors are just values that need to be monitored for the system, such as temperature or humidity;
things that you wouldn't be able to control directly but might inform the use of some other action that
can be controlled (turn on air conditioner). Monitors will only be updated on page load, but in the future
will be updated at certain intervals.

### Actions
[Device Actions Sample](images/DeviceMonitors.png)

Device actions are elements that can be interacted with the change something about the device - turn on lights,
turn off fan, close the garage door, set the temperature that triggers the air conditioner, etc.