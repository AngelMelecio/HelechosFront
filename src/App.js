import logo from './logo.svg';
import './App.css';
import QrReader from 'react-qr-scanner'
import { useState } from 'react';

const modelo = {
  "id": "1289312",
  "etapas": [
    "tejido",
    "corte",
    "plancha"
  ],
  "idEmpleado":"E1231231"
}

const App = () => {
  const [selected, setSelected] = useState("environment");
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  
  const [obj, setObj] = useState(null);

  const handleScan = async (scanData) => {
    setLoadingScan(true);
    //console.log(`loaded data data`, scanData.text);
    if (scanData && scanData?.text !== "") {
      console.log( scanData.text+"" );
      setObj( (scanData.text+"") );
      setStartScan(false);
      setLoadingScan(false);
      // setPrecScan(scanData);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  const RenderObj = () =>{
    const {id,etapas,idEmpleado} = obj
    return(
      <>
        {obj}
      </>
    )
  }

  return (
    <div className="App">
      <div className='scanner'>
        <button
          className='button'
          onClick={() => {
            setStartScan(!startScan);
            setLoadingScan(!loadingScan)
          }}
        >
          {startScan ? "Detener Scan" : "Iniciar Scan"}
        </button>
        {startScan && (
          <>
            <div className='camContainer'>
              <QrReader
                delay={1000}
                onError={handleError}
                onScan={handleScan}
                style={{width:'250px'}}
                // chooseDeviceId={()=>selected}
                
              />
            </div>
          </>
        )}
        {startScan && <p> <br /> Escanea el codigo QR... </p>}
      </div>
      <div className='data'>
        {obj !== null && <RenderObj/> } 
      </div>
    </div>
  );
};

export default App;

    