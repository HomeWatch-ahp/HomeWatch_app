import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { useEffect, useState } from "react";

const ShaderGradientAny = ShaderGradient as any;

export default function BackgroundGradient() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsLight(document.documentElement.classList.contains("light"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <ShaderGradientCanvas style={{ width: "100%", height: "100%" }}>
        <ShaderGradientAny
          animate="on"
          //{isLight ? "#claire" : "sombre"}
          brightness={isLight ? 1.1 : 1.1}
          color1={isLight ? "#badedc" : "#00001e"}
          color2={isLight ? "#6bf9fe" : "#074055"}
          color3={isLight ? "#c2ceb1" : "#b1c2ba"}
          // ... garde tous tes autres props identiques
          //.......
          axesHelper="on"
          bgColor1="#000000"
          bgColor2="#000000"
          cAzimuthAngle={180}
          cDistance={3.9}
          cPolarAngle={115}
          cameraZoom={1}
          destination="onCanvas"
          embedMode="off"
          envPreset="city"
          format="gif"
          fov={45}
          frameRate={10}
          gizmoHelper="hide"
          grain="off"
          lightType="3d"
          pixelDensity={1}
          positionX={-0.5}
          positionY={0.1}
          positionZ={0}
          range="disabled"
          rangeEnd={40}
          rangeStart={0}
          reflection={0.1}
          rotationX={0}
          rotationY={0}
          rotationZ={235}
          shader="defaults"
          type="waterPlane"
          uAmplitude={0}
          uDensity={1.1}
          uFrequency={5.5}
          uSpeed={0.1}
          uStrength={2.4}
          uTime={0.2}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
