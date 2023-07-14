import './styles/App.css'
import Container from './components/Container'

function App() {

  return (
    <>
      <Container/>
      <p style={{color: 'red'}} >Algunas provincias no fueron incluidas debido a que la api no contaba con sus respectivos datos de municipios y localidades</p>
    </>
  )
}

export default App
