import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ShaderGradientAny = ShaderGradient as any;

export default function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <ShaderGradientCanvas style={{ width: "100%", height: "100%" }}>
        <ShaderGradientAny
          // Partie du haut a remplacer
          animate="on"
          axesHelper="on"
          bgColor1="#000000"
          bgColor2="#000000"
          brightness={1.5}
          cAzimuthAngle={60}
          cDistance={7.1}
          cPolarAngle={90}
          cameraZoom={19.7}
          color1="#032a1f"
          color2="#143763"
          color3="#4e0000"
          destination="onCanvas"
          embedMode="off"
          envPreset="dawn"
          format="gif"
          fov={45}
          frameRate={10}
          gizmoHelper="hide"
          grain="off"
          lightType="3d"
          pixelDensity={1}
          positionX={0}
          positionY={-0.15}
          positionZ={0}
          range="disabled"
          rangeEnd={40}
          rangeStart={0}
          reflection={0.1}
          rotationX={0}
          rotationY={0}
          rotationZ={0}
          shader="defaults"
          type="sphere"
          uAmplitude={1.4}
          uDensity={1.1}
          uFrequency={5.5}
          uSpeed={0.1}
          uStrength={0.4}
          uTime={0}
          wireframe={false}
          // Partie du bas a remplacer
        />
      </ShaderGradientCanvas>
    </div>
  );
}
