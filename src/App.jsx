import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Particles from './assets/antigravity';
import './App.css';

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#ffffff" }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <color attach="background" args={["#ffffff"]} />
        <Particles />
      </Canvas>


    </div>
  );
}

export default App;
