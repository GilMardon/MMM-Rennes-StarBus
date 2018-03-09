# MMM-Rennes-StarBus

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/). It tells you when the next bus arrives at your bus stop. This is for people that live in Rennes (France).

## Installation
Navigate into your MagicMirror's `modules` folder and execute git clone `https://github.com/GilMardon/MMM-Rennes-StarBus`.

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-Rennes-StarBus',
            position: "bottom_right",   // This can be any of the regions.
            config: {
                // See below for configurable options
                updateInterval: 60000,
                timeFormat : 24,
                maxEntries : 5,
                lines : [
                {
                    type: 'bus', 
                    line: '0004', 
                    stop: 'Bois+Labbé',
                    destination: 'ZA+Saint-Sulpice'
                }]
            }
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `lines`    | *Required* Fill this array with information from [www.star.fr](http://www.star.fr/).<br><br> **Type:** `array[{
                    type: 'bus', 
                    line: '0004', 
                    stop: 'Bois+Labbé',
                    destination: 'ZA+Saint-Sulpice'
                }]` <br> **Default value:** `none`
| `timeFormat`     | *Optional* Use 12 or 24 hour format. <br><br> **Possible values:** `12` or `24` <br> **Default value:** `24`
| `maxEntries`     | *Optional* The maximum number of buses to display. <br><br> **Possible values:** `1` to `10` <br> **Default value:** `5`
| `updateInterval` | *Optional* How often to check for the next bus. <br><br> **Type:** `int`<br> **Default value:** `60000` milliseconds (1 minute)
