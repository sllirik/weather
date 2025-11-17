const searchButton = document.getElementById('search-button');  // Поиск

const hero_city = document.getElementById('location');       // Город
const hero_temp = document.querySelector('.hero__temp');     // Температура
const hero_feels = document.querySelector('.hero__feels');   // Ощущение
const hero_image = document.querySelector('.hero__image');   // Иконка погоды
const hero_cloudy = document.querySelector('.hero__cloudy'); // Облачность
const hero_date = document.querySelector('.hero__date');     // Дата/время
const wind_speed = document.getElementById('wind-speed');    // Скорость ветра
const humidity = document.getElementById('humidity');        // Влажность
const pressure = document.getElementById('pressure');        // Давление

const sunset = document.getElementById('sunset');            // Восход
const sunrise = document.getElementById('sunrise');          // Закат


const API_KEY = '5f92685858e7e6e1858d0bd146813d91';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather?q=';
// const API_URL = 'https://api.openweathermap.org/data/2.5/forecast?q='; // 3-часовой на 5 дней

const form = document.getElementById("search-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    searchButton.click();
});

/* 
    1). Добавить массив объектов: Описание: иконка
*/
searchButton.addEventListener('click', async() => {
    // reset()
    try {
        let inputValue = document.getElementById('search-input').value;
        if(!inputValue) throw new Error("Введите название города");

        const res = await fetch(`${API_URL}${inputValue}&appid=${API_KEY}&units=metric&lang=ru`);
        if(!res.ok) throw new Error('Ошибка запроса погоды');

        const data = await res.json();

        console.log(data);


        // Город
        hero_city.textContent = inputValue;

        // Температура
        const temp = Math.round(data.main.temp);
        const feelTemp = Math.round(data.main.feels_like);

        hero_temp.innerHTML =  temp > 0 ? `+${temp}&deg;` : `${temp}&deg;`;
        hero_feels.innerHTML = feelTemp > 0 ? `Ощущается: +${feelTemp}&deg;` : `Ощущается: ${feelTemp}&deg;`;


        // Дата и время 
        let timezone = data.timezone;

        const lat = data.coord.lat;
        const lon = data.coord.lon;
        // Если координаты входят в Л/ДНР => добавляем +1 час
        if (isLuhansk(lat, lon) || isDonetsk(lat, lon)) {
            timezone += 3600;
        }

        const formatted = formatDate(data.dt, timezone);
        hero_date.textContent = formatted;


        // Облачность
        const cloudyIcon = data.weather[0].icon;
        const cloudyDescription = data.weather[0].description;

        hero_image.innerHTML = `
        <img src="http://openweathermap.org/img/wn/${cloudyIcon}@2x.png" alt="${cloudyDescription}" class="hero__img">`;
        hero_cloudy.textContent = cloudyDescription;


        // Ветер
        let windDegrees = +data.wind.deg;
        const directions = [
            'С', 'ССВ', 'СВ',
            'ВСВ', 'В', 'ВЮВ',
            'ЮВ', 'ЮЮВ', 'Ю', 'ЮЮЗ', 'ЮЗ',
            'ЗЮЗ', 'ЗЗ', 'ЗСЗ',
            'СЗ', 'ССЗ',
        ];
        const windIndex = Math.round(windDegrees / 22.5) % 16;
        const windDirection = directions[windIndex];

        wind_speed.textContent = data.wind.speed + ' м/с';


        // Влажность
        humidity.textContent = data.main.humidity + '%';

        // Давление
        pressure.textContent = hPaToMmHg(data.main.pressure) + ' мм рт.ст.';


        // Восход/Закат
        
        sunrise.textContent = formatTime(data.sys.sunrise, timezone);
        sunset.textContent = formatTime(data.sys.sunset, timezone);

        
    } catch (error) {
        hero_city.textContent = error.message;
    }
})




// Перевод давления из гектопаскалей в миллиметры рт. ст.
function hPaToMmHg(hPa) {
    return (hPa * 0.75006).toFixed(1); // округляем до 1 знаков
}

// Преобразование даты
function formatDate(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000); // переводим секунды → миллисекунды
  
    const months = [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                     "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();
  
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  
    return `${month} ${day}, ${hours}:${minutes}`;
}

// Преобразование времени
function formatTime(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000); // переводим секунды → миллисекунды
  
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    console.log(timezone);
    console.log(timestamp);
    console.log(timestamp+timezone);
  
    return `${hours}:${minutes}`;
}

// Координаты Луганска
function isLuhansk(lat, lon) {
    return (
        lat >= 47.8 && lat <= 49.9 &&
        lon >= 38.2 && lon <= 40.3
    );
}
// Координаты Донецка
function isDonetsk(lat, lon) {
    return (
        lat >= 46.5 && lat <= 49.1 &&
        lon >= 36.6 && lon <= 38.5
    );
}
