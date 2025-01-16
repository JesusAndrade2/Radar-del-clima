import './Card.scss';
import { LuWind, LuCloudy, LuThermometer } from 'react-icons/lu';

function Card({ weather, isCelsius, currentTime }) {
	return (
		<div>
			<p className="weather-card__city">
				{weather?.city}, {weather?.country} - {currentTime}
			</p>
			<div className="weather-card__content">
				<span
					className="weather-card__icon"
					role="img"
					aria-label={weather?.descripcion}
					aria-hidden
				>
					{' '}
					{weather?.icon}
				</span>
				<div className="weather-card__city__info">
					<h3 className="weather-card__info-item item--temp">
						{isCelsius
							? weather?.temperature + '°C'
							: Math.floor((weather?.temperature * 9) / 5 + 32) + '°F'}
					</h3>
					<h3 className="weather-card__info-item ">{weather?.main}</h3>
					<p className="weather-card__info-item ">"{weather?.description}"</p>
				</div>
			</div>

			<div className="weather__details">
				<p className="weather__details-item">
					<LuWind className="weather__details-item--icon" /> {weather?.wind} m/s
				</p>
				<p className="weather__details-item">
					<LuCloudy className="weather__details-item--icon" /> {weather?.clouds}
					%
				</p>
				<p className="weather__details-item">
					<LuThermometer className="weather__details-item--icon" />
					{weather?.pressure} hPa
				</p>
			</div>
		</div>
	);
}

export default Card;
