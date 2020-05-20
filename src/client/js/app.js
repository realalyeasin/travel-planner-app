const username = 'ayatullah81';
const geoNameUrl = 'http://api.geonames.org/searchJSON?q=';
const weather_api_key= "454cfaf9928d4266b565ee6114d23497";
const weatherUrl = "https://api.weatherbit.io/v2.0/forecast/daily?"
const pixabayUrl = "https://pixabay.com/api/?key=";
const pixabay_key = "16563376-59039a46c4ae4ad26636ed1c1";
const resultSection = document.getElementById('result');
function submitHandler() {
    const submit = document.getElementById('submit');

    submit.addEventListener('click', () => {
        const locationName = document.getElementById('location-name').value
        getGeoNames(geoNameUrl, locationName, username)
        .then(returnGeoInfo => {
            const geoObj = {
                lang: returnGeoInfo[0].lng,
                lat: returnGeoInfo[0].lat,
                cityName: returnGeoInfo[0].name,
                countryName: returnGeoInfo[0].countryName,
                countryCode: returnGeoInfo[0].countryCode
            }
            getWeather(weatherUrl, weather_api_key, geoObj)
            .then(returnWeatherInfo => {
                const result = resultFunc(returnWeatherInfo)
                
                postDataToTheServer(result)
                .then(() => {
                    fetchPlacesPhotoAndUpdateUI()
                })
            })
        })
    })

    // Start helper function

    const fetchPlacesPhotoAndUpdateUI = async () => {
        let getDataFromTheServer = await fetch('http://localhost:3000/get-back-data')
        getDataFromTheServer = await getDataFromTheServer.json()
        let getPhoto = await fetch(pixabayUrl + pixabay_key + '&q=' + getDataFromTheServer.city_name)
        getPhoto = await getPhoto.json()
        
        updateUI(getDataFromTheServer, getPhoto.hits[0].webformatURL);
    }

    function updateUI(weatherInfo, cityPhoto) {
        resultSection.innerHTML = `<h2 class="title">My Tript to: ${weatherInfo.city_name} <br/>Depurting date: ${weatherInfo.leave_time}</h2>
                                    <div id=img><img src =${cityPhoto}></div>
                                    <h3>Days left: ${weatherInfo.days_left} days</h3>
                                    <p>temp-low: ${weatherInfo.low_temp}</p>
                                    <p>temp-high: ${weatherInfo.max_temp}</p>
                                    <p>${weatherInfo.weather_des}</p>`
    }

    const postDataToTheServer = async (result={}) => {
        const postData = await fetch('http://localhost:3000/add', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
        })
    }
    function resultFunc(wInfo){
        const date = document.getElementById('date').value
            let resultW;
            let daysLeft;
            const cityName = wInfo.city_name;
            wInfo.data.forEach((eachdata, index) => {
                if(eachdata.datetime == date) {
                    resultW = eachdata;
                    daysLeft = index + 1;
                }
            })
            const weatherObj = {
                low_temp: resultW.low_temp,
                max_temp: resultW.max_temp,
                leave_time: resultW.datetime,
                weather_des: resultW.weather.description,
                days_left: daysLeft,
                city_name: cityName
            }
            return weatherObj
    }
    let getWeather = async (weatherUrl, weather_api_key, geoObj) => {
        const resData = await fetch(weatherUrl + 'lat=' + geoObj.lat + '&lon=' + geoObj.lang + '&country=' + geoObj.countryCode + '&key=' + weather_api_key)

        try {
            const resJSON = await resData.json();
            return resJSON;
        }catch(err) {
            console.log(err)
        }
    }
    let getGeoNames = async (geoNameUrl, locationName, username) => {
        const resData = await fetch(geoNameUrl + locationName + "&maxRows=5&" + "username=" + username)

        try {
            let resJSON = await resData.json();
            resJSON = resJSON.geonames
            return resJSON
        }catch(err) {
            console.log(err)
        }
    }
}

export { submitHandler }