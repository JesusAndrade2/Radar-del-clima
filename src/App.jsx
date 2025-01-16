import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './App.scss';
import Card from './components/Card';
import SearchByCity from './components/SearchByCity';
import { bg1, bg2, bg3, bg4 } from './assets/images';

const images = [bg1, bg2, bg3, bg4];

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?';
const apiKey = 'd0bcb029738ac7753e9e91c44808dba5';

const codes = {
	thunderstorm: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],

	drizzle: [300, 301, 302, 310, 311, 312, 313, 314, 321],

	rain: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],

	snow: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],

	atmosphere: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],

	clear: [800],

	clouds: [801, 802, 803, 804],
};

const icons = {
	thunderstorm: '⛈️',
	drizzle: '🌦️',
	rain: '🌧️',
	snow: '❄️',
	atmosphere: '🌫️',
	clear: '☀️',
	clouds: '☁️',
};

function getRandomIndex(arr) {
	return Math.floor(Math.random() * arr.length);
}

function App() {
	const [coords, setCoords] = useState('');
	const [weather, setWeather] = useState('');
	const [isCelsius, setIsCelsius] = useState(true);
	const [search, setSearch] = useState('bogota');
	const [currentTime, setCurrentTime] = useState(
		new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
	);

	const inputRef = useRef();

	const [imgBackground, setImgBackground] = useState(
		images[getRandomIndex(images)],
	);
	const [error, setError] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		setSearch(inputRef.current.value);
		inputRef.current.value = '';
		setImgBackground(images[getRandomIndex(images)]);
	};

	useEffect(() => {
		try {
			navigator.geolocation.getCurrentPosition(
				(res) => {
					setCoords({
						latitude: res.coords.latitude,
						longitude: res.coords.longitude,
					});
				},
				(err) => {
					console.log(err);
					setError(err.message);
				},
			);
		} catch (error) {
			console.log('[GEO API]', error);
		}
	}, []);

	useEffect(() => {
		if (coords) {
			getWeatherData(coords);
		}
	}, [coords]);

	const getWeatherData = async (coords) => {
		try {
			const res = await axios.get(
				`${baseUrl}lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}&lang=es`,
			);
			const codeId = res.data.weather[0].id;
			const codeKeys = Object.keys(codes);
			setWeather({
				city: res.data?.name,
				country: res.data?.sys?.country,
				temperature: Math.floor(res.data?.main?.temp - 273.15),
				main: res.data?.weather[0]?.main,
				description: res.data?.weather[0]?.description,
				clouds: res.data?.clouds?.all,
				wind: res.data?.wind?.speed,
				pressure: res.data?.main?.pressure,
				icon: icons[codeKeys.find((key) => codes[key].includes(codeId))],
			});
		} catch (error) {
			console.log('[Wheather API]', error);
		}
	};

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(
				new Date().toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				}),
			);
		}, [currentTime]);
	}, []);

	const bgStyle = `url('${imgBackground}')`;

	if (error)
		return (
			<div className="text">
				<h1>{error}</h1>
				<p>Por favor habilita la ubicacion para acceder a la App</p>
			</div>
		);

	if (!weather) return <h1 className="text">Loading ...</h1>;

	return (
		<div className="weather" style={{ backgroundImage: bgStyle }}>
			<div className="weather__container">
				<h1 className="weather__title"> RADAR DEL CLIMA</h1>
				<form className="weather__form" onSubmit={handleSubmit}>
					<input
						className="weather__form-input"
						type="text"
						ref={inputRef}
						placeholder="Ciudad"
					/>
					<button className="weather__btn">Buscar por ciudad</button>
				</form>

				<div className="weather__card">
					<div className="weather__card-item">
						<h2 className="weather__card-item--title"> Local</h2>
						<Card
							weather={weather}
							isCelsius={isCelsius}
							currentTime={currentTime}
						/>
					</div>
					<div className="weather__card-item">
						<h2 className="weather__card-item--title"> Otra Ciudad</h2>
						<SearchByCity
							isCelsius={isCelsius}
							search={search}
							baseUrl={baseUrl}
							codes={codes}
							icons={icons}
						/>
					</div>
				</div>

				<button
					className="weather__btn"
					type="button"
					onClick={() => setIsCelsius(!isCelsius)}
				>
					{' '}
					Cambiar a {isCelsius ? 'Fahrenheit' : 'Celsius'}
				</button>
			</div>
		</div>
	);
}

export default App;
