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
var address = "";


var electionURL = `https://www.googleapis.com/civicinfo/v2/elections?key=${civicKey}`;

var voterURL = `https://www.googleapis.com/civicinfo/v2/voterinfo?key=${civicKey}&address=${address}&electionId=${electionId}&returnAllAvailableData=true`

var representativesInfoByAddressURL = `https://www.googleapis.com/civicinfo/v2/representatives?key=${civicKey}&address=${address}`
$(document).ready(function () {
    /**
     * 
     * Work to get billing information when we get the id of the selected person name 
     */

    // this method is used to handle ajax sucess when proPublicaMemberurl is called;
    function getBillInformationByMemberIdSuccess(response) {
        console.log('getBillInformationByMemberIdSuccess');
        console.log(response);
        //using dataTable jquery library

        var dataSet = [];

        for (let i = 0; i < 20; i++) {
            var arr = [];
            arr.push(response.results[0].bills[i].introduced_date);
            arr.push(response.results[0].bills[i].short_title);
            arr.push(response.results[0].bills[i].title);
            arr.push(response.results[0].bills[i].committees);
            arr.push(response.results[0].bills[i].sponsor_name);
            dataSet.push(arr);
        }

        $('#billInformationTable').DataTable({
            data: dataSet,
            pageLength: 5,
            lengthMenu: [5, 10, 25],
            columns: [{
                    title: "Introduced On",
                    "width": "15%"
                },
                {
                    title: "Title",
                    "width": "20%"
                },
                {
                    title: "Description",
                    "width": "30%"
                },
                {
                    title: "Commitee",
                    "width": "20%"
                },
                {
                    title: "Sponsor",
                    "width": "15%"
                }
            ],
        });
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
        }).then(getBillInformationByMemberIdSuccess);

    }
//the purpose of this function is to be a placeholder for taking url of senate, name selected by the user, and condition for hasSearchForSenateCompleted
    function getMemberIdByName(url, name, hasSearchForSenateCompleted) {
        $.ajax({
            url: url,
            method: "GET",
            dataType: 'json',
            headers: {
                'X-API-Key': proPublicaKey
            }
        }).then(function (response) {
            console.log(response);
            //calling a function if successfully able to get the ajax response and giving the value response, name and hasSearchForSenateCompleted state 
            proPublicMembersUrlSuccess(response, name, hasSearchForSenateCompleted);
        });
    }
//the purpose of this function is to search all the member of the senate /house
// Since this is recursive function , we need base condition to exit from the function, so we used hasSearchForSenateCompleted condtion to exit from the function.
// When true if will execute the first part and then will call for house the next time.
// when false, it will execute the first part and will exit from function as condition at line number 135 is false.
    function proPublicMembersUrlSuccess(response, name, hasSearchForSenateCompleted) {
        var len = response.results[0].members.length;
        var arr = response.results[0].members;
        console.log(arr);
        //loop for comparing name of all members is the form of firstname, middlename, and lastname against the name provided
        for (var i = 0; i < len; i++) {
            var memberName = arr[i].first_name;
            if (arr[i].middle_name != null) {
                memberName = memberName + arr[i].middle_name;
            }
            memberName = memberName + arr[i].last_name;
            // We need to elimatnate all the white space so that we can compare the name exactly format we consider is firstname middlename and lastname
            memberName = memberName.split(' ').join('');
            //comparing the name with member name and if matched get the billing information and exit else continue with next member
            if (name === memberName) {
                //calling functiont to get billing information with member id
                getBillInformationByMemberId(arr[i].id);
                //exiting out of the function as task is completed.
                return;
            }
        }
        //Since member was not found in the senate we need to check the house members
        if (hasSearchForSenateCompleted){
            // calling the same function getMemberIdByName but this time by providing House url and senate equal to false
            getMemberIdByName(proPublicaMembersUrlForHouse, name, false);
        }
    };

    // //Test Case when billing information is clicked
    // $('#btn').on("click", function () {
    //        var name = 'Lamar Alexander';
    // //We need to elimatnate all the white space so that we can compare the name exactly format we consider is firstname middlename and lastname
    //     name = name.split(' ').join('');
    //     console.log(name);
    // /* here we are calling the function in which we are sending propublicamembersurlforsenateurl, name, and the condition for if senate is true*/
    // //first we are checking for senate and then we have to check house members
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

                if (name === "Mike Pence") {
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
$('.shape').on("click", function () {
    $('.shape').shape('flip up');
})