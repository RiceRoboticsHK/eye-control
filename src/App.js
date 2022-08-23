import axios from "axios";
import { useState } from "react";
import { useInterval } from "react-use";

const ipList = [
  "172.20.0.2",
  "172.20.0.3",
  "172.20.0.4",
  "172.20.0.52",
  "172.20.0.6",
];

const eyesList = [
  "confused",
  "curious",
  "default",
  "determined",
  "focused",
  "happy",
  "sleeping",
];

const CurrentEyes = ({ ip }) => {
  const [state, setState] = useState(null);
  useInterval(() => {
    (async () => {
      try {
        const { data } = await axios.get(`http://${ip}:3000/status`, {
          timeout: 3000,
        });
        setState(data);
      } catch (error) {
        setState(null);
      }
    })();
  }, 1000);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        opacity: state ? 1 : 0.5,
      }}
    >
      {state ? (
        <video
          src={`${state?.sharedState || "default"}.mp4`}
          style={{ width: "160px", height: "90px" }}
          muted
          loop
          autoPlay
        />
      ) : (
        <div
          style={{
            width: "160px",
            height: "90px",
            background: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        ></div>
      )}
      <div
        style={{
          width: "160px",
          fontSize: "16px",
          marginTop: "20px",
        }}
      >
        id: {state?.robotId || "offline"}
        <br />
        battery: {state ? Number(state?.charge).toFixed(2) : "offline"}
        <br />
        ss:{" "}
        <span
          style={{
            color: state ? "red" : "black",
            fontWeight: state ? "bold" : "normal",
          }}
        >
          {state ? state?.sharedState || "default" : "offline"}
        </span>
      </div>
    </div>
  );
};

const EyesSelector = ({ ip }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        fontSize: "20px",
        fontFamily: "monospace",
      }}
    >
      <CurrentEyes ip={ip} />
      <div>{ip}</div>
      {eyesList.map((name) => {
        return (
          <div key={name}>
            <button
              onClick={() => {
                axios.post(`http://${ip}:3000/set-shared-state`, {
                  state: name,
                });
              }}
              style={{
                fontSize: "20px",
                fontFamily: "monospace",
                width: "160px",
              }}
            >
              {name}
            </button>
          </div>
        );
      })}
    </div>
  );
};

const App = () => {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {ipList.map((ip) => {
        return <EyesSelector key={ip} ip={ip} />;
      })}
    </div>
  );
};

export default App;
