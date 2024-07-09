const your_weather_tab = document.querySelector("[your_weather]");
const search_weather_tab = document.querySelector("[search_weather]");
const grant_location_access_button = document.querySelector("[grant_access_button]");
const weather_search_field = document.querySelector("[input_search_field]");
const userweatherinfo = document.querySelector(".information_container");
const loading_screen = document.querySelector(".loading_screeen");
const grant_location_access = document.querySelector(".grant_access");
const error_continer = document.querySelector(".api-error-container")

let oldtab = your_weather_tab;
oldtab.classList.add("current-tab");

const API_KEY = "914e2f7d58e0cc24ae72f44a70c6a3e5";
getfromSessionStorage();


function switch_tab(newtab){
    if(newtab!=oldtab){
        oldtab.classList.remove("current-tab");
        oldtab = newtab;
        oldtab.classList.add("current-tab");
        //now if the old tab was your weather tab then we have switched to search weather tab and now we have to check
        //if the search bar is active or not if its not active then make it active and rest hide
        if(!weather_search_field.classList.contains("active"))
            {
                grant_location_access.classList.remove("active");
                userweatherinfo.classList.remove("active");
                weather_search_field.classList.add("active");
            }
        //if the current tab is your weather tab 
        else{
                // grant_location_access.classList.add("active");
                userweatherinfo.classList.remove("active");
                weather_search_field.classList.remove("active");
                error_continer.classList.remove("active");
                getfromSessionStorage();
        }   


    }
}
your_weather_tab.addEventListener("click",()=>{
    switch_tab(your_weather_tab);

});
search_weather_tab.addEventListener("click",()=>{
    switch_tab(search_weather_tab);

});
function getfromSessionStorage() {
    const localcoordinates = sessionStorage.getItem("usercoordinates");
    if(!localcoordinates){
        grant_location_access.classList.add("active");

    }
    else{
        const usercoordinates = JSON.parse(localcoordinates);
        getyourweather(usercoordinates);
    }
}


//lets get your weather 
grant_location_access_button.addEventListener("click",getlocation);

async function getyourweather(usercoordinates){
    const {lat , lon} = usercoordinates;
    grant_location_access.classList.remove("active");
    loading_screen.classList.add("active");
    try{
        const response = await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data =await response.json();
        if (!data.sys) {
            throw data;
          }
        loading_screen.classList.remove("active");
        userweatherinfo.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err){
   
    }

}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        
    }
}

function showposition(position){
    const usercoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,

    }
    sessionStorage.setItem("usercoordinates",JSON.stringify(usercoordinates));
    getyourweather(usercoordinates);
}



//lets get weather from search field
const search_bar = document.querySelector(".search_input");
weather_search_field.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = search_bar.value;

    if(cityName==""){
        return;
    }
    else{
        getsearchweather(cityName);
    }
})

async function getsearchweather(cityName){
    loading_screen.classList.add("active");
    grant_location_access.classList.remove("active");
    userweatherinfo.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        const data1 =await response.json();
      
        console.log("removed");
        loading_screen.classList.remove("active");
        userweatherinfo.classList.add("active");
        renderweatherinfo(data1);
        if(!data1.sys){
            throw data1;
            }
    }catch(err){
        loading_screen.classList.remove("active");
        userweatherinfo.classList.remove("active");
        error_continer.classList.add("active");
    }
}

//function to render weather info 

function renderweatherinfo(weatherinfo){
    const weather_city_name = document.querySelector("[city_name]");
    const city_country_flag = document.querySelector("[country_flag]");
    const weather_description = document.querySelector("[weather_description_city]");
    const description_imag = document.querySelector("[weather_description_img]");
    const temperature = document.querySelector("[city_temperature]");
    const windspeed = document.querySelector("[city_windspeed]");
    const humidity = document.querySelector("[city_humidity]");
    const clouds = document.querySelector("[city_clouds]");

    weather_city_name.innerText = weatherinfo?.name;
    city_country_flag.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    weather_description.innerText = weatherinfo?.weather?.[0]?.description;
    description_imag.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${weatherinfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherinfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherinfo?.main?.humidity} %`;
    clouds.innerText =`${weatherinfo?.clouds?.all} %`;
   

}
