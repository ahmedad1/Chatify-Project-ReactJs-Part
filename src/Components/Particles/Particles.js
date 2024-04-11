import { useCallback } from "react";
import Particles from "react-particles";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.
import { configsParticles } from "./Configs";

const ParticlesComp = () => {
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
  
  
    }, []);

  

    return (
        <Particles
            id="particles"
            init={particlesInit}
      
            options={configsParticles}
        />
    );
};
export default ParticlesComp