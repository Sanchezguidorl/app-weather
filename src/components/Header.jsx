import axios from 'axios';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Header.css';

function Header ({ selectCoordenadas }) {
  const [listaProvincias, setListaProvincias] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
  const [listaMunicipios, setListaMunicipios] = useState([]);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState('');
  const [listaLocalidades, setListaLocalidades] = useState([]);
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState('')
  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await axios.get('https://apis.datos.gob.ar/georef/api/provincias');
        const provincias = response.data.provincias.filter(
          provincia =>
            provincia.nombre !== 'Entre Ríos' &&
            provincia.nombre !== 'Santiago del Estero' &&
            provincia.nombre !== 'Santa Cruz' &&
            provincia.nombre !== 'Ciudad Autónoma de Buenos Aires'
        );
        setListaProvincias(provincias);
      } catch (error) {
        console.log('Error en el fetch de datos: ' + error);
      }
    };

    fetchProvincias();
  }, []);

  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await axios.get(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${provinciaSeleccionada}&campos=id,nombre,centroide&max=2000`);
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
    const fetchLocalidades = async () => {
      try {
        const response = await axios.get(`https://apis.datos.gob.ar/georef/api/localidades?municipio=${municipioSeleccionado}&campos=id,nombre,centroide&max=1000`);
        setListaLocalidades(response.data);
      } catch (error) {
        console.log('Error en el fetch de datos: ' + error);
      }
    };
    if (municipioSeleccionado) {
      fetchLocalidades();
    }

    return () => null
  }, [municipioSeleccionado]);

  const handleChangeProvincia = (e) => {
    setProvinciaSeleccionada(e.target.value);
    setMunicipioSeleccionado('');
    setListaLocalidades([])
    setLocalidadSeleccionada('')
  };

  const handleChangeMunicipio = (e) => {
    const coordenadas = listaMunicipios.municipios.filter(municipio => municipio.id === e.target.value)
    const   {centroide} = coordenadas[0]
    const {nombre}=coordenadas[0];
    selectCoordenadas({...centroide,nombre})
    setMunicipioSeleccionado(e.target.value);
    setLocalidadSeleccionada('')
  };


  const handleChangeLocalidad = (e) => {
 const coordenadas = listaLocalidades.localidades.filter(localidad => localidad.id === e.target.value)
     const   {centroide} = coordenadas[0]
     const {nombre}=coordenadas[0];
     selectCoordenadas({...centroide,nombre})
     setLocalidadSeleccionada(e.target.value)
  };



  return (
    <header>
      <div className='logo-container'>
      <img src='/assets/solIcon-7ae0d39e.png' alt="Logo de la página" width='80' />
      <h1>ArgentWeather</h1>
      </div>
      <div className="container-selects">
      <select onChange={handleChangeProvincia} defaultValue='default'>
        <option disabled value="default">
          -- Selecciona una provincia --
        </option>
        {listaProvincias.map((provincia) => (
          <option key={provincia.id} value={provincia.id}>
            {provincia.nombre}
          </option>
        ))}
      </select>
      <select disabled={!provinciaSeleccionada} onChange={handleChangeMunicipio} defaultValue='default'>
      <option disabled value="default">
          -- Selecciona un municipio --
        </option>
        {listaMunicipios.municipios &&
          listaMunicipios.municipios.sort((a,b) => a.nombre.localeCompare(b.nombre)).map((municipio) => (
            <option key={municipio.id} value={municipio.id}>
              {municipio.nombre}
            </option>
          ))}
      </select>
      <select disabled={!municipioSeleccionado || !listaLocalidades} onChange={handleChangeLocalidad} value={localidadSeleccionada?localidadSeleccionada:'default'}>
        <option disabled value="default">
          -- Selecciona una localidad --
        </option>
        {listaLocalidades.localidades &&
    listaLocalidades.localidades.sort((a,b) => a.nombre.localeCompare(b.nombre)).map((localidad) => (
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
export default Header