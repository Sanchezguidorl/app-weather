import axios from 'axios';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Header.css';

function Header({ selectCoordenadas }) {
  // Estado para almacenar la lista de provincias
  const [listaProvincias, setListaProvincias] = useState([]);
  // Estado para almacenar la provincia seleccionada
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
  // Estado para almacenar la lista de municipios
  const [listaMunicipios, setListaMunicipios] = useState([]);
  // Estado para almacenar el municipio seleccionado
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState('');
  // Estado para almacenar la lista de localidades
  const [listaLocalidades, setListaLocalidades] = useState([]);
  // Estado para almacenar la localidad seleccionada
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState('');

  useEffect(() => {
    // Función para obtener la lista de provincias
    const fetchProvincias = async () => {
      try {
        // Realizar una solicitud HTTP GET para obtener las provincias
        const response = await axios.get('https://apis.datos.gob.ar/georef/api/provincias');
        // Filtrar las provincias no deseadas
        const provincias = response.data.provincias.filter(
          provincia =>
            provincia.nombre !== 'Entre Ríos' &&
            provincia.nombre !== 'Santiago del Estero' &&
            provincia.nombre !== 'Santa Cruz' &&
            provincia.nombre !== 'Ciudad Autónoma de Buenos Aires'
        );
        // Actualizar el estado con la lista de provincias filtradas
        setListaProvincias(provincias);
      } catch (error) {
        console.log('Error en el fetch de datos: ' + error);
      }
    };

    fetchProvincias();
  }, []);

  useEffect(() => {
    // Función para obtener la lista de municipios según la provincia seleccionada
    const fetchMunicipios = async () => {
      try {
        // Realizar una solicitud HTTP GET para obtener los municipios de la provincia seleccionada
        const response = await axios.get(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${provinciaSeleccionada}&campos=id,nombre,centroide&max=2000`);
        // Actualizar el estado con la lista de municipios
        setListaMunicipios(response.data);
      } catch (error) {
        console.log('Error en el fetch de datos: ' + error);
      }
    };
    if (provinciaSeleccionada) {
      fetchMunicipios();
    }
  }, [provinciaSeleccionada]);

  useEffect(() => {
    // Función para obtener la lista de localidades según el municipio seleccionado
    const fetchLocalidades = async () => {
      try {
        // Realizar una solicitud HTTP GET para obtener las localidades del municipio seleccionado
        const response = await axios.get(`https://apis.datos.gob.ar/georef/api/localidades?municipio=${municipioSeleccionado}&campos=id,nombre,centroide&max=1000`);
        // Actualizar el estado con la lista de localidades
        setListaLocalidades(response.data);
      } catch (error) {
        console.log('Error en el fetch de datos: ' + error);
      }
    };
    if (municipioSeleccionado) {
      fetchLocalidades();
    }
  }, [municipioSeleccionado]);

  // Handler para el cambio de provincia seleccionada
  const handleChangeProvincia = (e) => {
    setProvinciaSeleccionada(e.target.value);
    setMunicipioSeleccionado('');
    setListaLocalidades([]);
    setLocalidadSeleccionada('');
  };

  // Handler para el cambio de municipio seleccionado
  const handleChangeMunicipio = (e) => {
    // Obtener las coordenadas y el nombre del municipio seleccionado
    const coordenadas = listaMunicipios.municipios.filter(municipio => municipio.id === e.target.value);
    const { centroide, nombre } = coordenadas[0];
    // Llamar a la función selectCoordenadas y pasar las coordenadas y el nombre del municipio
    selectCoordenadas({ ...centroide, nombre });
    setMunicipioSeleccionado(e.target.value);
    setLocalidadSeleccionada('');
  };

  // Handler para el cambio de localidad seleccionada
  const handleChangeLocalidad = (e) => {
    // Obtener las coordenadas y el nombre de la localidad seleccionada
    const coordenadas = listaLocalidades.localidades.filter(localidad => localidad.id === e.target.value);
    const { centroide, nombre } = coordenadas[0];
    // Llamar a la función selectCoordenadas y pasar las coordenadas y el nombre de la localidad
    selectCoordenadas({ ...centroide, nombre });
    setLocalidadSeleccionada(e.target.value);
  };

  return (
    <header>
      <div className='logo-container'>
        <img src='/assets/solIcon-7ae0d39e.png' alt='Logo de la página' width='80' />
        <h1>ArgentWeather</h1>
      </div>
      <div className='container-selects'>
        <select onChange={handleChangeProvincia} defaultValue='default'>
          <option disabled value='default'>
            -- Selecciona una provincia --
          </option>
          {listaProvincias.map((provincia) => (
            <option key={provincia.id} value={provincia.id}>
              {provincia.nombre}
            </option>
          ))}
        </select>
        <select disabled={!provinciaSeleccionada} onChange={handleChangeMunicipio} defaultValue='default'>
          <option disabled value='default'>
            -- Selecciona un municipio --
          </option>
          {listaMunicipios.municipios &&
            listaMunicipios.municipios.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((municipio) => (
              <option key={municipio.id} value={municipio.id}>
                {municipio.nombre}
              </option>
            ))}
        </select>
        <select disabled={!municipioSeleccionado || !listaLocalidades} onChange={handleChangeLocalidad} value={localidadSeleccionada !== '' ? localidadSeleccionada : 'default'}>
          <option disabled value='default'>
            -- Selecciona una localidad --
          </option>
          {listaLocalidades.localidades &&
            listaLocalidades.localidades.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((localidad) => (
              <option key={localidad.id} value={localidad.id}>{localidad.nombre}</option>
            ))}
        </select>
      </div>
    </header>
  );
}

Header.propTypes = {
  selectCoordenadas: PropTypes.func,
};

export default Header;