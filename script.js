/* */

const proPublicaKey = "cstJcNuEEeCQtdH8yWkpXroGmKK4yuuAecgKC7GL";
const civicKey = "AIzaSyBXX_LFscJIXrN_xa7JvFqda1GJXYE8L0Y";
// Version: {v1}. For congress parameters: {116}. 102-116 for House, 80-116 for Senate
var proPublicaMembersURL = `https://api.propublica.org/congress/v1/116/senate/members.json`

var proPublicaStatementsByMembers = `https://api.propublica.org/congress/v1/members/C001084/statements/115.json`

var electionId = 2000;
var address = "94806"


var electionURL = `https://www.googleapis.com/civicinfo/v2/elections?key=${civicKey}`;
var voterURL = `https://www.googleapis.com/civicinfo/v2/voterinfo?key=${civicKey}&address=${address}&electionId=${electionId}&returnAllAvailableData=true`
var representativesInfoByAddressURL = `https://www.googleapis.com/civicinfo/v2/representatives?key=${civicKey}&address=${address}`
$(document).ready(function () {



    // $('#btn').on("click", function () {y
    //     $.ajax({
    //         url: proPublicaURL,
    //         method: "GET",
    //         dataType: 'json',
    //         headers: {
    //             'X-API-Key': propublicaKey
    //         }
    //     }).then(function (response) {

    //         console.log(response);

    //     })
    // })

    $('#search').on("click", function () {

        $.ajax({
            url: representativesInfoByAddressURL,
            method: "GET"
        }).then(function (response) {

            console.log(response);

            var officials = response.officials;
            console.log(officials);

            for (let i = 0; i < officials.length; i++) {

                var name = response.officials[i].name;
                var party = response.officials[i].party;
                var photo = response.officials[i].photoUrl;

                var card = (`
                <div class="row" id="${i}">
                <img>
                <section>
                    <h3></h2>
                    <h4></h3>
                </section>
                </div>`)


                $('#results').append(card)
                $(`#${i}>section>h3`).text(name)
                $(`#${i}>section>h4`).text(party)
                $(`#${i}>img`).attr("src", photo)
                $(`#${i}>img`).addClass("ui small circular image bordered")


            }

        })
    })

    $('#voter').on("click", function (e) {
        e.preventDefault()
        $.ajax({
            url: voterURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            $('#officials').empty()
            var contests = response.contests;

            for (let i = 0; i < contests.length; i++) {

                const office = contests[i].office;

                const candidates = contests[i].candidates;

                var id = office.replace(/\s+/g, '');

                $('#officials').append(`
                <div id ="${id}" class="row">
                <h1>${office}</h1> 
                </div>`)

                for (let j = 0; j < candidates.length; j++) {


                    var name = candidates[j].name
                    var party = candidates[j].party
                    // var url = candidates[i].candidateUrl;
                    // console.log(url);

                    var candId = name.replace(/\s+/g, '')

                    var card = (`<div id="${candId}">
                        <h3></h3>
                        <h4></h4>
                        </div>`)


                    $(`#${id}`).append(card)

                    $(`#${candId}>h3`).text(name)
                    $(`#${candId}>h4`).text(party)

                }
            }
        })
    })
    $('#ele').on("click", function (e) {
        e.preventDefault()
        $.ajax({
            url: electionURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

        })
    })
    $('#rep').on("click", function (e) {
        e.preventDefault()
        $.ajax({
            url: representativesInfoByAddressURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var officials = response.officials;

            for (let i = 0; i < officials.length; i++) {

                var name = response.officials[i].name;
                var party = response.officials[i].party;
                var photo = response.officials[i].photoUrl;

                var card = (`<div id ="${i}">
                <h3></h3>
                <h4></h4>
                <img width="175px" height="auto">
                </div>`)


                $('#officials').append(card)
                $(`#${i}>h3`).text(name)
                $(`#${i}>h4`).text(party)
                $(`#${i}>img`).attr("src", photo)


            }

        })
    })



})



$('#menu').on("click", function () {
    $('.ui.sidebar').sidebar('toggle');
})
$('.menu .item')
    .tab();