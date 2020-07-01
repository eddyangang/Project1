/* Documentation for Google Civic API is here:

https://developers.google.com/civic-information/docs/v2

*/

$(document).ready(function () {

    var APIKey = "AIzaSyBXX_LFscJIXrN_xa7JvFqda1GJXYE8L0Y";

    // Example Address
    // var address = "1263 Pacific Ave. Kansas City KS";
  //  var address = "120 sproul hall Berkeley CA 94704"
  //var address="27009"
  var address="73008"

    // Election ID can be obtained from eletion query response, and be fed into voter query
    var electionId = 2000;
    // Returns list of available elections.
    var electionURL = `https://www.googleapis.com/civicinfo/v2/elections?key=${APIKey}`;

    // Returns polling places (if included). contest and cadidate information, and election official information.
    var voterURL = `https://www.googleapis.com/civicinfo/v2/voterinfo?address=${address}&key=${APIKey}&returnAllAvailableData=true&electionId=${electionId}`;


    // Looks up political geography and representative information for a single address
    var representativesInfoByAddressURL = `https://www.googleapis.com/civicinfo/v2/representatives?key=${APIKey}&address=${address}`
    

    $('#voter').on("click", function () {
        $.ajax({
            url: voterURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

        })
    })

    $('#ele').on("click", function () {
        $.ajax({
            url: electionURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

        })

    })

    $('#rep').on("click", function () {

        $.ajax({
            url: representativesInfoByAddressURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

        })

    })



});

/* NOTES:

528 does not have a public api. Instead their data is shared using excels sheets and can be downloaded. (it seems).


proPublica imay be the next best API to use for real-time nomination data, bill data + other things.*/