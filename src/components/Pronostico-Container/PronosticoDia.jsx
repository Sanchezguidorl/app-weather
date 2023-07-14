import '../../styles/Pronosticos.css';
import Loading from './../Loading';
import PropTypes from 'prop-types';

function PronosticoDia({ weatherNow, loading }) {

    return (
        <div className="card-weatherDay">
            {loading ?
                // Mostrar el componente de carga si se está cargando el pronóstico
                <Loading />
                :
                weatherNow.main &&
                <div>
                    <div className="principal-info">
                        <div className="container-weather-icon">
                            <h2>{weatherNow.nombreCiudad}</h2>
                            <div className="extended-info">
                                {/* Mostrar el icono del estado del tiempo actual */}
                                <img src={`https://openweathermap.org/img/wn/${weatherNow.weather[0].icon}@2x.png`} alt="icono del estado del tiempo actual" />
                                <ul>
                                    <li>Humedad: {parseInt(weatherNow.main.humidity)}%</li>
                                    <li>Nublado: {parseInt(weatherNow.clouds.all)}%</li>
                                    <li>Sensación térmica: {parseInt(weatherNow.main.feels_like)}°C</li>
                                </ul>
                            </div>
                            <h2>{parseInt(weatherNow.main.temp)}°C</h2>
                            <p>Estado Actual</p>
                            {/* Mostrar la descripción del estado del tiempo */}
                            <p className='description'>{weatherNow.weather[0].description === 'nubes' ? 'Nublado' : weatherNow.weather[0].description}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

PronosticoDia.propTypes = {
    weatherNow: PropTypes.object,
    loading: PropTypes.bool,
};

export default PronosticoDia;