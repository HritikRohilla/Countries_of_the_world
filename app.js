var input = document.querySelector('.input_text');
var temp = document.querySelector('.temp');
var desc = document.querySelector('.desc');
var cur = document.querySelector('.currency');
var button = document.querySelector('.submit');

//for weather 
button.addEventListener('click', function(name) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + input.value + '&appid=50a7aa80fa492fa92e874d23ad061374')

    .then(response => response.json())
        .then(data => {
            var tempValue = data['main']['temp'];
            var descValue = data['weather'][0]['description'];

            desc.innerHTML = "Desc - " + descValue;
            temp.innerHTML = "Temp - " + tempValue;
            input.value = "";

        })

    .catch(err => alert("you have entered Wrong country name or wrong input"));



    //------------------------countries api and fucntion starts from here----------------------------//

    // Global Variables
    const countriesList = document.getElementById("countries");
    //let ctry = "america";
    let countries; // will contain "fetched" data

    // Event Listeners
    // countriesList.addEventListener("change", event => displayCountryInfo(event.target.value));

    countriesList.addEventListener("change", newCountrySelection);

    function newCountrySelection(event) {
        displayCountryInfo(event.target.value);
    }
    // Api for country details 
    // fetch function used for fetaching country details
    fetch('https://restcountries.eu/rest/v2/name/' + input.value)
        .then(res => res.json()) //response in json format
        .then(data1 => initialize(data1)) // data used to initialize function 
        //eror handling
        .catch(err => console.log("Error:", err));
    //initialize function
    function initialize(countriesData) {
        countries = countriesData;
        let options = "";

        countries.forEach(country => options += `<option value="${country.alpha3Code}">${country.name}</option>`);

        countriesList.innerHTML = options;
        countriesList.selectedIndex = Math.floor(Math.random() * countriesList.length);
        displayCountryInfo(countriesList[countriesList.selectedIndex].value);
    }

    function displayCountryInfo(countryByAlpha3Code) {
        const countryData = countries.find(country => country.alpha3Code === countryByAlpha3Code);
        document.querySelector("#flag-container img").src = countryData.flag;
        document.querySelector("#flag-container img").alt = `Flag of ${countryData.name}`;
        document.getElementById("capital").innerHTML = countryData.capital;
        document.getElementById("dialing-code").innerHTML = `+${countryData.callingCodes[0]}`;
        document.getElementById("population").innerHTML = countryData.population.toLocaleString("en-US");
        document.getElementById("currencies").innerHTML = countryData.currencies.filter(c => c.name).map(c => `${c.name} (${c.code})`).join(", ");
        document.getElementById("region").innerHTML = countryData.region;

        //-- for currency exchange rate here i took currency code of searched country and stored it in CurrencyCode---//

        let CurrencyCode = countryData.currencies.filter(c => c.name).map(c => `${c.code}`).join(", ");
        //--fetching the currency rate of againt USD and CurrencyCode is used to fire url in accodence with usd --//
        fetch('https://free.currconv.com/api/v7/convert?q=' + CurrencyCode + '_USD&compact=ultra&apiKey=f3601e9c548f92591f30')
            .then(res1 => res1.json())
            .then(data2 => {
                var curValue = data2['' + CurrencyCode + '_USD'];

                console.log(curValue);
                cur.innerHTML = "currency value in  USD - " + curValue;
            })
            //-- Error handling using catch--//
            .catch(err => alert("Error in currency exchange"));
    }




    //--------------------------weather image---------------------------//
    getWeather(input.value);
})

const getWeather = async(city) => {
    try {

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=50a7aa80fa492fa92e874d23ad061374`,


        );

        const weatherData = await response.json();
        const { id, main } = weatherData.weather[0];
        //--------------------function for changing images according to weather ---------------------//
        if (id < 300 && id > 200) {
            document.querySelector("#info-container img").src = "thunderstorm.svg"
        } else if (id < 400 && id > 300) {
            document.querySelector("#info-container img").src = "cloud-solid.svg"
        } else if (id < 600 && id > 500) {
            document.querySelector("#info-container img").src = "rain.svg"
        } else if (id < 700 && id > 600) {
            document.querySelector("#info-container img").src = "snow.svg"
        } else if (id < 800 && id > 700) {
            document.querySelector("#info-container img").src = "clouds.svg"
        } else if (id == 800) {
            document.querySelector("#info-container img").src = "clouds-and-sun.svg"
        }

    } //---catching error if any during accessing the images--//
    //-- you can check changing of iamges in real time using search by city name --// 
    catch (error) {
        alert('city not found');
    }
};