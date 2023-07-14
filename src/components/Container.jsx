
import { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import PronosticoDia from './Pronostico-Container/PronosticoDia';
import PronosticoSemana from './Pronostico-Container/PronosticoSemana';
import '../styles/Pronosticos.css'



function Container() {
  const apiKey = process.env.API_KEY;
  const [coordenadas, setCoordenadas] = useState('')
  const [weatherNow, setWeatherNow] = useState({})
  const [weatherWeek, setWeatherWeek] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClimaNow = async () => {
      try {
        const weatherNow = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordenadas.lat}&lon=${coordenadas.lon}&units=metric&lang=sp&appid=${apiKey}`);
        const nombreCiudad = coordenadas.nombre
        setWeatherNow({ ...weatherNow.data, nombreCiudad })
      } catch (error) {
        console.log('Error en al realizar consulta de datos: ' + error);
      }
    }

    const fetchClimaWeek = async () => {
      try {
        const weatherWeek = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordenadas.lat}&lon=${coordenadas.lon}&units=metric&lang=sp&appid=${apiKey}`)
        setWeatherWeek({ ...weatherWeek.data })
      } catch (error) {
        console.log('Error en al realizar consulta de datos: ' + error);
      }
    }
    if (coordenadas !== '') {
      fetchClimaNow()
      fetchClimaWeek()
      setLoading(true)
    }

  }, [coordenadas])
  return (

    <div className='content-container'>
      <Header selectCoordenadas={(coor) => { setCoordenadas(coor) }} />

      {coordenadas ?
        <section className='pronostico-container'>
          <PronosticoDia weatherNow={weatherNow} loading={loading} />
          <div className='container-week'>
            <PronosticoSemana weatherWeek={weatherWeek} loading={loading} setLoading={setLoading} />
          </div>
        </section>
        :
        <div id='empty-scream'>
          <h1>Selecciona una ubicación para visualizar el clima</h1>
        </div>
      }
    </div>
  )
}

export default Container