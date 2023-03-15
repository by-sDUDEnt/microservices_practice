import {useEffect, useState} from "react";

const UNKNOWN = "UNKNOWN"
const UNAVAILABLE = "UNAVAILABLE"

function App() {
  const [service1state, service1SetState] = useState(UNKNOWN);
  const [service2state, service2SetState] = useState(UNKNOWN);

  useEffect(() => {
    fetch('/vegetables')
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            service1SetState(data);
        })
        .catch((err) => {
      // service1SetState(UNAVAILABLE)
      console.log(err)
    });
  }, []);

  // useEffect(() => {
  //   fetch('/api/service2/ping')
  //       .then((response) => {
  //           return response.text();
  //       })
  //       .then((data) => {
  //           service2SetState(data);
  //       }).catch(() => {
  //     service2SetState(UNAVAILABLE)
  //   });
  // }, []);

  return (
    <div>
        service1 status: { service1state }<br/>
        service2 status: { service2state }
    </div>
  );
}

export default App;
