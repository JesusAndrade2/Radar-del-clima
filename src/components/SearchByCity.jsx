import { useEffect, useState } from 'react';
import Card from './Card';
import axios from 'axios';

function SearchByCity({ baseUrl, search, codes, icons, isCelsius }) {
	const [weatherByCity, setWeatherByCity] = useState(null);

	useEffect(() => {
		getWeatherDataByCity(search);
	}, [search]);

	const getWeatherDataByCity = async (search) => {
		try {
			const res = await axios.get(
				`${baseUrl}q=${search}&appid=d0bcb029738ac7753e9e91c44808dba5&lang=es`,
			);
			const codeId = res.data.weather[0].id;
			const codeKeys = Object.keys(codes);
			setWeatherByCity({
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
			console.log('[Wheather By City API]', error);
		}
	};
	return (
		<div>
			<Card weather={weatherByCity} isCelsius={isCelsius} />
		</div>
	);
}

export default SearchByCity;
