

$(document).ready(function () {
    var APIKey = "AIzaSyBXX_LFscJIXrN_xa7JvFqda1GJXYE8L0Y";
    // var address = "1263 Pacific Ave. Kansas City KS";
    var address = "94806"
    var electionURL = `https://www.googleapis.com/civicinfo/v2/elections?key=${APIKey}`;
    

    var electionId = 2000;
    var voterURL = `https://www.googleapis.com/civicinfo/v2/voterinfo?address=${address}&key=${APIKey}&officialOnly=true&returnAllAvailableData=true&electionId=${electionId}`;

    var representativesURL = `https://www.googleapis.com/civicinfo/v2/representatives?key=${APIKey}&address=${address}`
    // `https://civicinfo.googleapis.com/civicinfo/v2/representatives?address=336%20Hawk%20Ridge%20Dr.&key=AIzaSyBXX_LFscJIXrN_xa7JvFqda1GJXYE8L0Y`

    // var voterURL = `https://civicinfo.googleapis.com/civicinfo/v2/voterinfo?address=${address}&officialOnly=true&returnAllAvailableData=true&key=${APIKey}`
    
    $.ajax({
        url: voterURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);



        $.ajax({
            url: representativesURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            
        })
        
        
        
    })
});


