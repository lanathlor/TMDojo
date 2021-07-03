/* eslint-disable no-param-reassign */
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ReplayDataPoint } from '../../lib/replays/replayData';

interface InputOverlayProps {
    sampleRef: ReplayDataPoint,
    camera: any
}

interface InputOverlayItemProps {
    sampleRef: ReplayDataPoint,
}

const InputBrakeOverlay = ({ sampleRef }: InputOverlayItemProps) => {
    const breakMeshRef = useRef<THREE.Mesh>(null!);

    const breakInputVecs1: THREE.Vector3[] = [
        new THREE.Vector3(-1.8, -0.1, 0),
        new THREE.Vector3(1.8, -0.1, 0),
        new THREE.Vector3(1.8, -10, 0),
    ];

    const breakInputVecs2: THREE.Vector3[] = [
        new THREE.Vector3(-1.8, -0.1, 0),
        new THREE.Vector3(-1.8, -10, 0),
        new THREE.Vector3(1.8, -10, 0),
    ];

    const breakInputVecs3: THREE.Vector3[] = [
        new THREE.Vector3(-1.8, -10, 0),
        new THREE.Vector3(1.8, -10, 0),
        new THREE.Vector3(0, -12, 0),
    ];

    const f32arrayBreak1 = useMemo(
        () => Float32Array.from(
            new Array(breakInputVecs1.length)
                .fill(0)
                .flatMap((item, index) => breakInputVecs1[index].toArray()),
        ),
        [breakInputVecs1],
    );

    const f32arrayBreak2 = useMemo(
        () => Float32Array.from(
            new Array(breakInputVecs2.length)
                .fill(0)
                .flatMap((item, index) => breakInputVecs2[index].toArray()),
        ),
        [breakInputVecs2],
    );

    const f32arrayBreak3 = useMemo(
        () => Float32Array.from(
            new Array(breakInputVecs3.length)
                .fill(0)
                .flatMap((item, index) => breakInputVecs3[index].toArray()),
        ),
        [breakInputVecs3],
    );
    useFrame(() => {
        if (sampleRef && breakMeshRef && breakMeshRef.current) {
            if (sampleRef.inputIsBraking) {
                breakMeshRef.current.children.forEach((children: any) => {
                    children.material.opacity = 0.6;
                });
            } else {
                breakMeshRef.current.children.forEach((children: any) => {
                    children.material.opacity = 0.2;
                });
            }
        }
    });

    return (
        <mesh
            ref={breakMeshRef}
        >
            <mesh>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        needsUpdate
                        attachObject={['attributes', 'position']}
                        count={f32arrayBreak1.length / 3}
                        itemSize={breakInputVecs1.length}
                        array={f32arrayBreak1}
                    />
                </bufferGeometry>
                <meshBasicMaterial
                    attach="material"
                    color="#db441a"
                    transparent
                    opacity={0.2}
                    wireframe={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        needsUpdate
                        attachObject={['attributes', 'position']}
                        count={f32arrayBreak2.length / 3}
                        itemSize={breakInputVecs1.length}
                        array={f32arrayBreak2}
                    />
                </bufferGeometry>
                <meshBasicMaterial
                    attach="material"
                    color="#db441a"
                    transparent
                    opacity={0.2}
                    wireframe={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        needsUpdate
                        attachObject={['attributes', 'position']}
                        count={f32arrayBreak3.length / 3}
                        itemSize={breakInputVecs1.length}
                        array={f32arrayBreak3}
                    />
                </bufferGeometry>
                <meshBasicMaterial
                    attach="material"
                    color="#db441a"
                    transparent
                    opacity={0.2}
                    wireframe={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </mesh>
    );
};

const InputGazOverlay = ({ sampleRef }: InputOverlayItemProps) => {
    const gazMeshRef = useRef<THREE.Mesh>(null!);

    const accelInputVecs1: THREE.Vector3[] = [
        new THREE.Vector3(-1.8, 0.1, 0),
        new THREE.Vector3(1.8, 0.1, 0),
        new THREE.Vector3(1.8, 10, 0),
    ];

    const accelInputVecs2: THREE.Vector3[] = [
        new THREE.Vector3(-1.8, 0.1, 0),
        new THREE.Vector3(-1.8, 10, 0),
        new THREE.Vector3(1.8, 10, 0),
    ];

    const accelInputVecs3: THREE.Vector3[] = [
        new THREE.Vector3(-1.8, 10, 0),
        new THREE.Vector3(1.8, 10, 0),
        new THREE.Vector3(0, 12, 0),
    ];

    const f32arrayAccel1 = useMemo(
        () => Float32Array.from(
            new Array(accelInputVecs1.length)
                .fill(0)
                .flatMap((item, index) => accelInputVecs1[index].toArray()),
        ),
        [accelInputVecs1],
    );

    const f32arrayAccel2 = useMemo(
        () => Float32Array.from(
            new Array(accelInputVecs2.length)
                .fill(0)
                .flatMap((item, index) => accelInputVecs2[index].toArray()),
        ),
        [accelInputVecs2],
    );

    const f32arrayAccel3 = useMemo(
        () => Float32Array.from(
            new Array(accelInputVecs3.length)
                .fill(0)
                .flatMap((item, index) => accelInputVecs3[index].toArray()),
        ),
        [accelInputVecs3],
    );

    useFrame(() => {
        if (sampleRef && gazMeshRef && gazMeshRef.current) {
            if (sampleRef.inputGasPedal) {
                gazMeshRef.current.children.forEach((children: any) => {
                    children.material.opacity = 0.6;
                });
            } else {
                gazMeshRef.current.children.forEach((children: any) => {
                    children.material.opacity = 0.2;
                });
            }
        }
    });

    return (
        <mesh
            ref={gazMeshRef}
        >
            <mesh>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        needsUpdate
                        attachObject={['attributes', 'position']}
                        count={f32arrayAccel1.length / 3}
                        itemSize={accelInputVecs1.length}
                        array={f32arrayAccel1}
                    />
                </bufferGeometry>
                <meshBasicMaterial
                    attach="material"
                    color="lime"
                    transparent
                    opacity={0.2}
                    wireframe={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        needsUpdate
                        attachObject={['attributes', 'position']}
                        count={f32arrayAccel2.length / 3}
                        itemSize={accelInputVecs1.length}
                        array={f32arrayAccel2}
                    />
                </bufferGeometry>
                <meshBasicMaterial
                    attach="material"
                    color="lime"
                    transparent
                    opacity={0.2}
                    wireframe={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        needsUpdate
                        attachObject={['attributes', 'position']}
                        count={f32arrayAccel3.length / 3}
                        itemSize={accelInputVecs1.length}
                        array={f32arrayAccel3}
                    />
                </bufferGeometry>
                <meshBasicMaterial
                    attach="material"
                    color="lime"
                    transparent
                    opacity={0.2}
                    wireframe={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </mesh>
    );
};

const SteerLeftOverlay = ({ sampleRef }: InputOverlayItemProps) => {
    const leftMeshRef = useRef<THREE.Mesh>(null!);
    const steerLeftVecs: THREE.Vector3[] = [
        new THREE.Vector3(-2, 10, 0),
        new THREE.Vector3(-2, -10, 0),
        new THREE.Vector3(-12, 0, 0),
    ];
    const f32arrayRight = useMemo(
        () => Float32Array.from(
            new Array(steerLeftVecs.length)
                .fill(0)
                .flatMap((item, index) => steerLeftVecs[index].toArray()),
        ),
        [steerLeftVecs],
    );
    useFrame(() => {
        if (sampleRef && leftMeshRef && leftMeshRef.current) {
            if (sampleRef.inputSteer < 0) {
                steerLeftVecs[2].setX(10 * sampleRef.inputSteer - 2);
                leftMeshRef.current.geometry.setFromPoints(steerLeftVecs);
                leftMeshRef.current.geometry.attributes.position.needsUpdate = true;
            } else {
                steerLeftVecs[2].setX(-2);
                leftMeshRef.current.geometry.setFromPoints(steerLeftVecs);
                leftMeshRef.current.geometry.attributes.position.needsUpdate = true;
            }
        }
    });
    return (
        <>
            <mesh
                ref={leftMeshRef}
            >
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        needsUpdate
                        attachObject={['attributes', 'position']}
                        count={3}
                        itemSize={3}
                        array={f32arrayRight}
                    />
                </bufferGeometry>
                <meshBasicMaterial
                    attach="material"
                    color="white"
                    transparent
                    opacity={0.5}
                    wireframe={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        needsUpdate
                        attachObject={['attributes', 'position']}
                        count={3}
                        itemSize={3}
                        array={f32arrayRight}
                    />
                </bufferGeometry>
                <meshBasicMaterial
                    attach="material"
                    color="#5243aa"
                    transparent
                    opacity={0.5}
                    wireframe={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </>
    );
};

const SteerRightOverlay = ({ sampleRef }: InputOverlayItemProps) => {
    const rightMeshRef = useRef<THREE.Mesh>(null!);
    const steerRightVecs: THREE.Vector3[] = [
        new THREE.Vector3(2, 10, 0),
        new THREE.Vector3(2, -10, 0),
        new THREE.Vector3(12, 0, 0),
    ];
    const f32arrayRight = useMemo(
        () => Float32Array.from(
            new Array(steerRightVecs.length)
                .fill(0)
                .flatMap((item, index) => steerRightVecs[index].toArray()),
        ),
        [steerRightVecs],
    );
    useFrame(() => {
        if (sampleRef && rightMeshRef && rightMeshRef.current) {
            if (sampleRef.inputSteer > 0) {
                steerRightVecs[2].setX((10 * Math.abs(sampleRef.inputSteer) + 2));
                rightMeshRef.current.geometry.setFromPoints(steerRightVecs);
                rightMeshRef.current.geometry.attributes.position.needsUpdate = true;
            } else {
                steerRightVecs[2].setX(2);
                rightMeshRef.current.geometry.setFromPoints(steerRightVecs);
                rightMeshRef.current.geometry.attributes.position.needsUpdate = true;
            }
        }
    });
    return (
        <>
            <mesh
                ref={rightMeshRef}
            >
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        needsUpdate
                        attachObject={['attributes', 'position']}
                        count={3}
                        itemSize={3}
                        array={f32arrayRight}
                    />
                </bufferGeometry>
                <meshBasicMaterial
                    attach="material"
                    color="white"
                    transparent
                    opacity={0.5}
                    wireframe={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        needsUpdate
                        attachObject={['attributes', 'position']}
                        count={3}
                        itemSize={3}
                        array={f32arrayRight}
                    />
                </bufferGeometry>
                <meshBasicMaterial
                    attach="material"
                    color="#5243aa"
                    transparent
                    opacity={0.5}
                    wireframe={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </>
    );
};

// eslint-disable-next-line import/prefer-default-export
export const InputOverlay = ({ sampleRef, camera }: InputOverlayProps) => {
    const inputMeshRef = useRef<THREE.Mesh>(null!);
    useFrame(() => {
        if (inputMeshRef && inputMeshRef.current && camera) {
            inputMeshRef.current.rotation.set(
                camera.rotation.x,
                camera.rotation.y,
                camera.rotation.z,
            );
        }
    });
    return (
        <mesh
            ref={inputMeshRef}
            position={[0, 2, 0]}
            scale={0.1}
        >
            <SteerRightOverlay sampleRef={sampleRef} />
            <SteerLeftOverlay sampleRef={sampleRef} />
            <InputGazOverlay sampleRef={sampleRef} />
            <InputBrakeOverlay sampleRef={sampleRef} />
        </mesh>
    );
};
