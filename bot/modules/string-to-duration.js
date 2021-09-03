var npmmodules = require("../npm-modules")

function splitNumbersAndChars(string) {
    var patt1 = /[0-9]/g;
    var patt2 = /[a-zA-Z]/g;
    var letters = string.match(patt2);
    var digits = string.match(patt1);
    return {letters: (letters || [""]).join(""), digits: (digits || [""]).join("")}
}

module.exports = function(string){

    var segments = []

    var args = string.split(" ")

    while(!args[0] && args.length > 0){
        args.shift()
    }

    for(var i = 0; i < args.length; i++){
        segments.push(splitNumbersAndChars(args[i]));
    }

    var duration = npmmodules.moment.duration()

    segments.forEach(segment => {
        duration.add(segment.digits, segment.letters)
    })

    return (duration.locale("cs"));

}