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
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;


require('nativescript-websockets');

var mySocket = new WebSocket("ws://192.168.1.68:8080", [ /* "protocol","another protocol" */ ]);
mySocket.on('open', function(evt) {
    console.log("We are Open");
    evt.target.send("Hello");
});
mySocket.on('message', function(evt) {
    console.log("We got a message: ", evt.data);
});
mySocket.on('close', function(evt) {


    console.log("The Socket was Closed:", evt.code, evt.reason);



});
mySocket.on('error', function(evt) {
    console.log("The socket had an error", evt.error);
});

var keys = require("./keyboard.json");

var keyboard = {}
var keyLabels = {
    "audio_mute": "mute",
    "audio_vol_down": "-",
    "audio_vol_up": "+",
    "audio_play": "play",
    "audio_prev": "prev",
    "audio_next": "next"

};
keys.forEach(function(k) {
    var label=k;
    if(keyLabels[k]){
        label=keyLabels[k];
    }
    keyboard[k] = label;
});

var keysMap = {};

Object.keys(keyboard).forEach(function(k) {
    keysMap[keyboard[k]]=k;
});


var showKeys = ["audio_mute", "audio_vol_down", "audio_vol_up", "audio_play", "audio_prev", "audio_next"]



var keyboardButtons = (new ObservableArray(showKeys.map(function(k) {
    return {
        text: keyboard[k]
    }
})));



exports.buttonTap = function(args) {

    console.log(keysMap[args.object.text]);
    mySocket.send(JSON.stringify({
        event: "key",
        key: keysMap[args.object.text]
    }));

}

function onNavigatingTo(args) {
    /*
    This gets a reference this page’s <Page> UI component. You can
    view the API reference of the Page to see what’s available at
    https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
    */
    var page = args.object;


    var mult = 2.0;
    var state = 'up';



    page.bindingContext = new Observable({
        actionBarTitle: "192.168.1.68 Port:8080",
        keyboardButtons: keyboardButtons
    });


    page.on(gestures.GestureTypes.tap, function(args) {
        //if(state==='up'){
        mySocket.send(JSON.stringify({
            event: "click"
        }));
        // }
    });
    // page.on(gestures.GestureTypes.doubleTap, function (args) {
    //      mySocket.send(JSON.stringify({
    //             event:"doubletap"
    //         }));
    // });
    // page.on(gestures.GestureTypes.longPress, function (args) {
    //      mySocket.send("Long Press");
    // });
    // page.on(gestures.GestureTypes.swipe, function (args) {

    //      mySocket.send(JSON.stringify({
    //         event:"swipe",
    //         d:args.direction,
    //      }));

    //      console.log("Swipe Direction: " + args.direction);

    // });
    page.on(gestures.GestureTypes.pan, function(args) {

        if (state === 'down') {



            mySocket.send(JSON.stringify({
                event: "move",
                dx: args.deltaX * mult,
                dy: args.deltaY * mult
            }));
        }

        //console.dump(args);
    });
    // page.on(gestures.GestureTypes.pinch, function (args) {
    //      mySocket.send("Pinch Scale: " + args.scale);
    // });
    // page.on(gestures.GestureTypes.rotation, function (args) {
    //      mySocket.send("Rotation: " + args.rotation);
    // });

    page.on(gestures.GestureTypes.touch, function(args) {

        if (args.action === 'up' || args.action === 'down') {

            state = args.action;

            mySocket.send(JSON.stringify({
                event: "touch" + args.action
            }));

        }

        //console.log("Touch:  "+args.action);
        //console.log("Touch:  "+JSON.stringify(Object.keys(args)));
    });

}

/*
Exporting a function in a NativeScript code-behind file makes it accessible
to the file’s corresponding XML file. In this case, exporting the onNavigatingTo
function here makes the navigatingTo="onNavigatingTo" binding in this page’s XML
file work.
*/
exports.onNavigatingTo = onNavigatingTo;