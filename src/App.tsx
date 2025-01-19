import styles from "./App.module.css";
import Alert from "./components/Alert/Alert";
import Form from "./components/Form/Form";
import Spinner from "./components/Spinner/Spinner";
import WeatherDetail from "./components/WeatherDetail/WeatherDetail";
import useWheather from "./hooks/useWeather";

function App() {

  const  { weather, loading, notFound, fetchWheather, hasWeatherData } = useWheather();
  
  return (
    <>
      <h1 className={styles.title}>Buscador de Clima</h1>
      <div className={styles.container}>
        <Form fetchWheather={ fetchWheather }/>
        { loading && <Spinner/> }
        { hasWeatherData && <WeatherDetail weather={ weather }  /> }
        { notFound && <Alert>Ciudad NO Encontrada...</Alert> }
      </div>
    </>
  )
}

export default App
