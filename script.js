/* */

const proPublicaKey = "cstJcNuEEeCQtdH8yWkpXroGmKK4yuuAecgKC7GL";
const civicKey = "AIzaSyBXX_LFscJIXrN_xa7JvFqda1GJXYE8L0Y";
// const govKey = "RakPSGxOLxsSUX7uu8IbJWlKgiXkarqezricuYUB"
const apikey = "6woKQBsiMzXTaqOFIAGiI2GSdgPTj31EzZIVDGnF";
const proPublicaMembersUrlForSenate = 'https://api.propublica.org/congress/v1/116/senate/members.json';
const proPublicaMembersUrlForHouse = 'https://api.propublica.org/congress/v1/116/house/members.json';
// var FECcandidateSearch = `https://api.open.fec.gov/v1/candidates/search/?sort_hide_null=false&cycle=2020&election_year=2020&sort_null_only=false&is_active_candidate=true&api_key=${govKey}&candidate_status=C&sort=name&office=H&page=1&sort_nulls_last=false&per_page=20`

var url = `https://api.open.fec.gov/v1/candidates/search/?sort_hide_null=false&sort_null_only=false&api_key=${apikey}&page=1&incumbent_challenge=C&sort=name&per_page=20&sort_nulls_last=false&cycle=2020`



// Version: {v1}. For congress parameters: {116}. 102-116 for House, 80-116 for Senate
var proPublicaMembersURL = `https://api.propublica.org/congress/v1/116/senate/members.json`

var proPublicaStatementsByMembers = `https://api.propublica.org/congress/v1/members/C001084/statements/115.json`
var FECurl = `https://api.open.fec.gov/candidates/`

var electionId = "2000";
var address ="";


var electionURL = `https://www.googleapis.com/civicinfo/v2/elections?key=${civicKey}`;

var voterURL = `https://www.googleapis.com/civicinfo/v2/voterinfo?key=${civicKey}&address=${address}&electionId=${electionId}&returnAllAvailableData=true`

var representativesInfoByAddressURL = `https://www.googleapis.com/civicinfo/v2/representatives?key=${civicKey}&address=${address}`
$(document).ready(function () {
   /**
    * 
    * Work to get billing information when name is provided
    */

    // this method is used to handle ajax sucess when proPublicaMemberurl is called;
    function getBillInformationByMemberIdSuccess(response) {
        console.log(response);
        var table = $('#billInformationTable');
        table.append(`<tr>
                    <th>
                        Bill No
                    </th>
                    <th>
                        Intorduced On
                    </th>
                <th>
                    Title
                </th>
                <th>
                    Description
                </th>
                <th>
                    Commitee
                </th>
                <th>
                    Sponsor
                </th>
                <th>
                    Last Action
                </th>
                <th>
                    Last Action Date
                </th>
                </tr>`);

        for (let i = 0; i < 20; i++) {
            table.append(`<tr>
                    <td>
                        <a href='${response.results[0].bills[i].congressdotgov_url}'>${response.results[0].bills[i].number}</a>
                    </td>
                    <td>
                    ${response.results[0].bills[i].introduced_date}
                    </td>
                <td>
                ${response.results[0].bills[i].short_title}
                </td>
                <td>
                ${response.results[0].bills[i].title}
                </td>
                <td>
                ${response.results[0].bills[i].committees}
                </td>
                <td>
                ${response.results[0].bills[i].sponsor_name}
                </td>
                <td>
                ${response.results[0].bills[i].number}
                </td>
                </tr>`);
        }
    };

    // this method is used to handle ajax failure when proPublicaMemberurl is called;
    function getBillInformationByMemberIdFailure(response) {
        console.log(response);
    };


    function getBillInformationByMemberId(memberId) {
        var proPublicaBillsByMembers = `https://api.propublica.org/congress/v1/members/${memberId}/bills/introduced.json`;
        $.ajax({
            url: proPublicaBillsByMembers,
            method: "GET",
            dataType: 'json',
            headers: {
                'X-API-Key': proPublicaKey
            }
        }).then(getBillInformationByMemberIdSuccess, getBillInformationByMemberIdFailure);

    }

    function getMemberIdByName(url,name,isSenate) {     
        $.ajax({
            url: url,
            method: "GET",
            dataType: 'json',
            headers: {
                'X-API-Key': proPublicaKey
            }
        }).then(function (response) {
            console.log(response);
            proPublicMembersUrlSuccess(response, name,isSenate);
        }, function (response) {
            proPublicMembersUrlFailue(response, name);
        });
    }

    function proPublicMembersUrlSuccess(response, name,isSenate) {
        var len = response.results[0].members.length;
        var arr = response.results[0].members;
        console.log(arr);
        for(var i = 0; i < len; i++)
        {
            var memberName = arr[i].first_name;
            if(arr[i].middle_name != null)
            {
                memberName = memberName + arr[i].middle_name;
            }
            memberName = memberName + arr[i].last_name;
            memberName = memberName.split(' ').join('');
            if(name === memberName){
                getBillInformationByMemberId(arr[i].id);
                return;
            }
        }
        if(isSenate)
            getMemberIdByName(proPublicaMembersUrlForHouse,name,false); 
    };

    function proPublicMembersUrlFailue(response, name) {
        return '';
    }

    // Test Case when billing information is clicked
    // $('#btn').on("click", function () {
    //     var name = 'Jefferson Van Drew';
    //     name = name.split(' ').join('');
    //     console.log(name);
    //     getMemberIdByName(proPublicaMembersUrlForSenate,name,true);        
    // })

    function search(arr) {
        return arr.state === state;
    }

    $('#can').on("click", function (event) {
        event.preventDefault()
        $.ajax({
            url: url,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            // var results = response.results;
            // console.log(results.filter(search));
        })
    })



    // Joel's first attempt; wasn't working object object error
// $('#can').on("click", function (event) {
//     event.preventDefault()
//     $.ajax({
//         url: FECcandidateSearch,
//         method: "GET"
//     }).then(function (response) {
//         console.log("candidate log here: " + response);
        
//     })
// })

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
        $('#results').empty()
        var state = $('#state').val();
        var homeAddress = $('#address').val();
        var zip = $('#zip').val();

        address = `${homeAddress} ${zip} ${state}`

        representativesInfoByAddressURL = `https://www.googleapis.com/civicinfo/v2/representatives?key=${civicKey}&address=${address}`

        $.ajax({
            url: representativesInfoByAddressURL,
            method: "GET"
        }).then(function (response) {

            console.log(response);

            var officials = response.officials;
            console.log(officials);

            for (let i = 0; i < 5; i++) {

                var name = response.officials[i].name;
                var party = response.officials[i].party;
                var photo = response.officials[i].photoUrl;

                if(name === "Mike Pence"){
                    continue;
                }

                var card = $(
                    `<div class="card-flip-container">
                        <div class="card-flip" id=${i}>
                            <div class="frontcard">
                                <img width="100%" height="100%">     
                                <h3></h3>
                            </div>
                            <div class="backcard">
                                <h3></h3>
                            </div>
                        </div>
                    </div>`)

                /* To add media icons:
                <a><i class="twitter icon"></i></a>
                <a><i class="facebook square icon"></i></a>
                <a><i class="youtube icon"></i></a>*/

                $('#results').append(card)

                $(`#${i}>.frontcard>h3`).text(name)

                if (photo) {
                    $(`#${i}>.frontcard>img`).attr("src", photo)
                } else {
                    $(`#${i}>.frontcard>img`).attr("src", "assets/unknown.png")
                }

                if (party === "Republican Party") {
                    $(`#${i}>.backcard`).addClass("red")
                } else if (party === "Democratic Party") {
                    $(`#${i}>.backcard`).addClass("blue")
                } else {
                    $(`#${i}>.backcard`).addClass("unknown")
                }

                $(`#${i}>.backcard>h3`).text(party)


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

                var office = contests[i].office;

                var candidates = contests[i].candidates;

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

    // click listenter to transistion the cube animation
    $('.shape').on("click", function() {
        $('.shape').shape('flip up');
    })
