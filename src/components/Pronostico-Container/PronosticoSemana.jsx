import { useEffect, useState } from "react";
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import Loading from "../Loading";

function PronosticoSemana({ weatherWeek, loading, setLoading }) {
    // Estado para almacenar los datos de los días de la semana
    const [dataDaysOfWeek, setDataDaysOfWeek] = useState([]);

    useEffect(() => {
        // Verificar si hay datos del pronóstico semanal
        if (weatherWeek.list) {
            // Objeto para almacenar los datos de los días de la semana
            const daysOfWeek = {};
            const parseDaysOfWeek = [];

            // Agrupar los datos por día de la semana
            for (let day of weatherWeek.list) {
                const date = getDate(day.dt);

                if (daysOfWeek[date]) {
                    daysOfWeek[date].push(day);
                } else {
                    daysOfWeek[date] = [day];
                }
            }

            // Calcular el valor máximo y mínimo de temperatura para cada día de la semana
            for (let day in daysOfWeek) {
                let max = daysOfWeek[day].map(e => parseInt(e.main.temp_max));
                let min = daysOfWeek[day].map(e => parseInt(e.main.temp_min));

                let date = daysOfWeek[day][0].dt;
                let icon = daysOfWeek[day][0].weather[0].icon;

                // Almacenar los datos del día de la semana en el formato deseado
                daysOfWeek[day] = { max: Math.max(...max), min: Math.min(...min), date, day, icon };
                parseDaysOfWeek.push(daysOfWeek[day]);
            }

            // Eliminar el primer día de la semana (duplicado)
            parseDaysOfWeek.shift();

            // Actualizar el estado con los datos de los días de la semana
            setDataDaysOfWeek(parseDaysOfWeek);
        }

        // Simula una carga de datos asincrónica durante 1 segundo
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        // Limpia el temporizador cuando el componente se desmonta
        return () => clearTimeout(timer);
    }, [weatherWeek]);

    // Obtener el nombre del día de la semana en español
    const getDate = (dt) => {
        let date = new Date(dt * 1000);
        date = format(date, 'EEEE d').split(' ');

        switch (date[0]) {
            case 'Saturday':
                date[0] = 'Sábado';
                break;
            case 'Sunday':
                date[0] = 'Domingo';
                break;
            case 'Monday':
                date[0] = 'Lunes';
                break;
            case 'Tuesday':
                date[0] = 'Martes';
                break;
            case 'Wednesday':
                date[0] = 'Miércoles';
                break;
            case 'Thursday':
                date[0] = 'Jueves';
                break;
            case 'Friday':
                date[0] = 'Viernes';
                break;
        }

        return date[0] + ' ' + date[1];
    };

    return (
        <>
            {!loading ?
                // Mostrar los datos de los días de la semana
                dataDaysOfWeek &&
                dataDaysOfWeek.map((day) => (
                    <div key={day.date} className="days-week">
                        <p>{getDate(day.date)}</p>
                        <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt="icono del estado del tiempo actual" />
                        <p>max {parseInt(day.max)}°</p>
                        <p>min {parseInt(day.min)}°</p>
                    </div>
                ))
                :
                // Mostrar el componente de carga
                <Loading />
            }
        </>
    );
}

PronosticoSemana.propTypes = {
    weatherWeek: PropTypes.object,
    loading: PropTypes.bool,
    setLoading: PropTypes.func
};

export default PronosticoSemana;