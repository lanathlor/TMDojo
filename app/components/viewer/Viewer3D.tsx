import React, { useContext, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ReplayData } from "../../lib/api/fileRequests";
import { ReplayLines } from "./ReplayLines";
import { Grid } from "./Grid";
import { CameraController } from "./CameraController";
import { SettingsContext } from "../../lib/contexts/SettingsContext";
import { fetchMapBlocks } from "../../lib/api/mapRequests";
import { MapBlockData } from "../../lib/blocks/blockData";
import { MapBlocks } from "./MapBlocks";

const BACKGROUND_COLOR = new THREE.Color(0.05, 0.05, 0.05);

interface Props {
    replaysData: ReplayData[];
}

export const Viewer3D = ({ replaysData }: Props): JSX.Element => {
    const { lineType, showBlocks } = useContext(SettingsContext);

    const [mapBlockData, setMapBlockData] = useState<MapBlockData | undefined>();

    useEffect(() => {
        const f = async () => {
            if (replaysData.length > 0) {
                try {
                    const blocks = await fetchMapBlocks(replaysData[0]);
                    setMapBlockData(blocks);
                } catch (e) {
                    // TODO: Either store that this map is unavailable, or just do nothing, like now
                }
            } else {
                setMapBlockData(undefined);
            }
        };
        f();
    }, [replaysData]);

    return (
        <div style={{ zIndex: -10 }} className="w-screen h-screen">
            <Canvas
                camera={{
                    fov: 45,
                    position: [-800, 400, -800],
                    near: 0.1,
                    far: 50000,
                }}
            >
                <color attach="background" args={[BACKGROUND_COLOR]} />
                <ambientLight intensity={0.2} />
                <directionalLight color="#FFFFFF" intensity={1} position={[-1, 2, 4]} />
                <CameraController />
                <Grid />
                <ReplayLines replaysData={replaysData} lineType={lineType} />
                {showBlocks && mapBlockData && <MapBlocks mapBlockData={mapBlockData} />}
            </Canvas>
        </div>
    );
};
