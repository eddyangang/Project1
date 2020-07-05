// API key for proPublica 
const proPublicaKey = "cstJcNuEEeCQtdH8yWkpXroGmKK4yuuAecgKC7GL";

// API key for Google Civic API
const civicKey = "AIzaSyBXX_LFscJIXrN_xa7JvFqda1GJXYE8L0Y";
// const govKey = "RakPSGxOLxsSUX7uu8IbJWlKgiXkarqezricuYUB"
const apikey = "6woKQBsiMzXTaqOFIAGiI2GSdgPTj31EzZIVDGnF";

// url for all Senate information 
const proPublicaMembersUrlForSenate = 'https://api.propublica.org/congress/v1/116/senate/members.json';

// url for all House of Representative information 
const proPublicaMembersUrlForHouse = 'https://api.propublica.org/congress/v1/116/house/members.json';

// var FECcandidateSearch = `https://api.open.fec.gov/v1/candidates/search/?sort_hide_null=false&cycle=2020&election_year=2020&sort_null_only=false&is_active_candidate=true&api_key=${govKey}&candidate_status=C&sort=name&office=H&page=1&sort_nulls_last=false&per_page=20`

// var url = `https://api.open.fec.gov/v1/candidates/search/?sort_hide_null=false&sort_null_only=false&api_key=${apikey}&page=1&incumbent_challenge=C&sort=name&per_page=20&sort_nulls_last=false&cycle=2020`


// Version: {v1}. For congress parameters: {116}. 102-116 for House, 80-116 for Senate
var proPublicaMembersURL = `https://api.propublica.org/congress/v1/116/senate/members.json`

// Used to get statements from congress members, but not used in this program
var proPublicaStatementsByMembers = `https://api.propublica.org/congress/v1/members/C001084/statements/115.json`

// default to recieve all information for Google API
var electionId = "2000";

// Set address to empty string.
var address = "";

// url to get election information from google civic API
var electionURL = `https://www.googleapis.com/civicinfo/v2/elections?key=${civicKey}`;

// url to get voter information from google civic API
var voterURL = `https://www.googleapis.com/civicinfo/v2/voterinfo?key=${civicKey}&address=${address}&electionId=${electionId}&returnAllAvailableData=true`

// url to get all the names of officials and positions from google civic API
var representativesInfoByAddressURL = `https://www.googleapis.com/civicinfo/v2/representatives?key=${civicKey}&address=${address}`

//set interval to rotate cube display.
var rotate = setInterval(() => $('.shape').shape('flip up'), 3000);

// event listener for menu tab
$('#menu').on("click", function () {
    $('.ui.sidebar').sidebar('toggle');
})

// event listener for menu items
$('.menu .item').tab();

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

        $('#loader').css("display", "none")
        $('.ui.inverted.dimmer').removeClass("active");
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
        if (hasSearchForSenateCompleted) {
            // calling the same function getMemberIdByName but this time by providing House url and senate equal to false
            getMemberIdByName(proPublicaMembersUrlForHouse, name, false);
        }
    };

    // When search button is clicked, populate the page with representatives and their information
    $('#search').on("click", function () {
        // clear previous search
        $('#results').empty()

        // get information from input
        var state = $('#state').val();
        var homeAddress = $('#address').val();
        var zip = $('#zip').val();

        // make current address with given info
        address = `${homeAddress} ${zip} ${state}`

        // retrieve rep based on your address
        representativesInfoByAddressURL = `https://www.googleapis.com/civicinfo/v2/representatives?key=${civicKey}&address=${address}`

        $.ajax({
            url: representativesInfoByAddressURL,
            method: "GET"
        }).then(function (response) {
            // returns all officials with their name, position, image, and political party. 
            var officials = response.officials;;

            var officeTitle = ["President of the United States", "Vice President of the United States", "U.S. Senator", "U.S. Senator", "U.S. Representative"]

            for (let i = 0; i < 5; i++) {

                var name = response.officials[i].name;
                var party = response.officials[i].party;
                var photo = response.officials[i].photoUrl;

                if (name === "Mike Pence") {
                    continue;
                }
                // create a card for each member.
                var card = $(
                    `<div class="ui centered" id="card">
                        <h5 class="ui header">${officeTitle[i]}</h5>
                        <div class="card-flip-container">
                            <div class="card-flip" id=${i}>
                                <div class="frontcard">
                                    <img width="100%" height="100%">     
                                    <h3></h3>
                                </div>
                                <div class="backcard">
                                    <h3></h3>
                                </div>
                            </div> 
                        </div>

                        <div class="ui basic button">Bill Information</div>
                    </div>`)

                    // append the card onto page and insert their information given.
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

    // add event listener for each rep to recieve theit bill information.
    $(document).on("click", ".ui.basic.button", function () {
        // clear last input ...  currently a bug
        $('#billInformationTable').empty();

        // used to retrieve the name of the selected rep.
        var cardContainer = $(this).closest(".ui.centered").children(".card-flip-container")
        var frontcard = cardContainer.children(".card-flip").children(".frontcard")
        var name = frontcard.children("h3").text();

        // remove the spaces b/w name
        name = name.split(' ').join('');

        // diplay loader
        $('#loader').css("display", "block")
        $('.ui.inverted.dimmer').addClass("active");

        // get the membe's ID by name
        getMemberIdByName(proPublicaMembersUrlForSenate, name, true);

    })

})