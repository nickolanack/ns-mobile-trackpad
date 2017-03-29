/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

/*
NativeScript adheres to the CommonJS specification for dealing with
JavaScript modules. The CommonJS require() function is how you import
JavaScript modules defined in other files.
*/ 
var createViewModel = require("./main-view-model").createViewModel;
var gestures = require("ui/gestures");


require('nativescript-websockets');

var mySocket = new WebSocket("ws://echo.websocket.org", [ /* "protocol","another protocol" */]);
mySocket.on('open', function (evt) { console.log("We are Open"); evt.target.send("Hello"); });
mySocket.on('message', function(evt) { console.log("We got a message: ", evt.data); });
mySocket.on('close', function(evt) { console.log("The Socket was Closed:", evt.code, evt.reason); });
mySocket.on('error', function(evt) { console.log("The socket had an error", evt.error); });

function onNavigatingTo(args) {
    /*
    This gets a reference this page’s <Page> UI component. You can
    view the API reference of the Page to see what’s available at
    https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
    */
    var page = args.object;

    

    /*
    A page’s bindingContext is an object that should be used to perform
    data binding between XML markup and JavaScript code. Properties
    on the bindingContext can be accessed using the {{ }} syntax in XML.
    In this example, the {{ message }} and {{ onTap }} bindings are resolved
    against the object returned by createViewModel().

    You can learn more about data binding in NativeScript at
    https://docs.nativescript.org/core-concepts/data-binding.
    */
    page.bindingContext = createViewModel();
    page.on(gestures.GestureTypes.tap, function(args){
        mySocket.send("Tap");
    });
    page.on(gestures.GestureTypes.doubleTap, function (args) {
          mySocket.send("Double Tap");
    });
    page.on(gestures.GestureTypes.longPress, function (args) {
         mySocket.send("Long Press");
    });
    page.on(gestures.GestureTypes.swipe, function (args) {
         mySocket.send("Swipe Direction: " + args.direction);
    });
    page.on(gestures.GestureTypes.pan, function (args) {
         mySocket.send("Pan deltaX:" + args.deltaX + "; deltaY:" + args.deltaY + ";");
    });
    page.on(gestures.GestureTypes.pinch, function (args) {
         mySocket.send("Pinch Scale: " + args.scale);
    });
    page.on(gestures.GestureTypes.rotation, function (args) {
         mySocket.send("Rotation: " + args.rotation);
    });

}

/*
Exporting a function in a NativeScript code-behind file makes it accessible
to the file’s corresponding XML file. In this case, exporting the onNavigatingTo
function here makes the navigatingTo="onNavigatingTo" binding in this page’s XML
file work.
*/
exports.onNavigatingTo = onNavigatingTo;