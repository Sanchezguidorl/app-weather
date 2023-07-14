import '../../styles/Pronosticos.css'
import Loading from './../Loading';
import PropTypes from 'prop-types';



function PronosticoDia({weatherNow, loading}) {


    return (
        <div className="card-weatherDay">
            {loading ?
                <Loading />
                :
                weatherNow.main &&
                <div>
                    <div className="principal-info">
                        <div className="container-weather-icon">
                            <h2>{weatherNow.nombreCiudad}</h2>
                            <div className="extended-info">
                                <img src={`https://openweathermap.org/img/wn/${weatherNow.weather[0].icon}@2x.png`} alt="icono del estado del tiempo actual" />
                                <ul>
                                    <li>Humedad: {parseInt(weatherNow.main.humidity)}%</li>
                                    <li>Nublado: {parseInt(weatherNow.clouds.all)}%</li>
                                    <li>Sensación térmica: {parseInt(weatherNow.main.feels_like)}°C</li>
                                </ul>
                            </div>
                            <h2>{parseInt(weatherNow.main.temp)}°C</h2>
                            <p>Estado Actual</p>
                            <p className='description'>{weatherNow.weather[0].description === 'nubes' ? 'Nublado' : weatherNow.weather[0].description}</p>
                        </div>

                    </div>
                </div>

            }
        </div>
    )
}

PronosticoDia.propTypes = {
    weatherNow: PropTypes.object,
    loading: PropTypes.bool,
}
export default PronosticoDia