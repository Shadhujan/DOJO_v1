"use client"

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Cloud,
  Stars,
  Plane,
  Box,
  Cylinder,
  useGLTF,
  RoundedBox,
  Text3D
} from '@react-three/drei';
import * as THREE from 'three';
import anime from 'animejs';

function Ground() {
  return (
    <Plane
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.5, 0]}
      args={[50, 50]}
    >
      <meshStandardMaterial 
        color="#8B7355"
        roughness={1}
        metalness={0}
      />
    </Plane>
  );
}

function DojoWalls() {
  return (
    <group position={[0, 2, 0]}>
      {/* Front wall with door opening */}
      <group position={[0, 0, 3]}>
        <Box scale={[3, 4, 0.2]} position={[-2.5, 0, 0]}>
          <meshStandardMaterial color="#D4B886" roughness={0.7} />
        </Box>
        <Box scale={[3, 4, 0.2]} position={[2.5, 0, 0]}>
          <meshStandardMaterial color="#D4B886" roughness={0.7} />
        </Box>
        <Box scale={[2, 1, 0.2]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="#D4B886" roughness={0.7} />
        </Box>
      </group>

      {/* Side walls */}
      <Box scale={[0.2, 4, 6]} position={[4, 0, 0]}>
        <meshStandardMaterial color="#D4B886" roughness={0.9} />
      </Box>
      <Box scale={[0.2, 4, 6]} position={[-4, 0, 0]}>
        <meshStandardMaterial color="#D4B886" roughness={0.7} />
      </Box>

      {/* Back wall */}
      <Box scale={[8, 4, 0.2]} position={[0, 0, -3]}>
        <meshStandardMaterial color="#D4B886" roughness={0.7} />
      </Box>
    </group>
  );
}

function DojoInterior() {
  return (
    <group position={[0, 0, 0]}>
      {/* Tatami floor */}
      <Plane
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.49, 0]}
        args={[7.8, 5.8]}
      >
        <meshStandardMaterial
          color="#E8DCC4"
          roughness={0.8}
          metalness={0.1}
        />
      </Plane>

      {/* Kamidana (Shrine) */}
      <group position={[0, 2, -2.8]}>
        <Box scale={[2, 0.1, 0.8]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </Box>
        <Box scale={[1.8, 1.2, 0.6]} position={[0, 0.6, 0]}>
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </Box>
      </group>

      {/* Weapon Racks */}
      {[-3.5, 3.5].map((x) => (
        <group key={x} position={[x, 1, -2.5]}>
          <Box scale={[0.1, 2, 0.1]} position={[-0.4, 0, 0]}>
            <meshStandardMaterial color="#8B4513" roughness={0.7} />
          </Box>
          <Box scale={[0.1, 2, 0.1]} position={[0.4, 0, 0]}>
            <meshStandardMaterial color="#8B4513" roughness={0.7} />
          </Box>
          <Box scale={[0.9, 0.1, 0.2]} position={[0, 0.8, 0]}>
            <meshStandardMaterial color="#8B4513" roughness={0.7} />
          </Box>
          <Box scale={[0.9, 0.1, 0.2]} position={[0, -0.8, 0]}>
            <meshStandardMaterial color="#8B4513" roughness={0.7} />
          </Box>
          
          {/* Wooden swords */}
          {[-0.2, 0, 0.2].map((offset, i) => (
            <Box
              key={i}
              scale={[0.08, 1.4, 0.08]}
              position={[offset, 0, 0.1]}
              rotation={[0, 0, Math.PI / 8]}
            >
              <meshStandardMaterial color="#A0522D" roughness={0.6} />
            </Box>
          ))}
        </group>
      ))}

      {/* Scrolls on walls */}
      {[-2, 0, 2].map((x) => (
        <group key={x} position={[x, 2.5, -2.9]}>
          <Box scale={[0.8, 1.2, 0.02]}>
            <meshStandardMaterial color="#F5F5DC" roughness={0.4} />
          </Box>
        </group>
      ))}

      {/* Floor Cushions */}
      {[-2, 0, 2].map((x) => (
        [-1, 1].map((z) => (
          <group key={`${x}-${z}`} position={[x, -0.3, z]}>
            <Cylinder args={[0.3, 0.3, 0.15, 16]}>
              <meshStandardMaterial color="#4A1C1C" roughness={0.7} />
            </Cylinder>
          </group>
        ))
      ))}

      {/* Lanterns */}
      {[-3, 3].map((x) => (
        <group key={x} position={[x, 2.5, 0]}>
          <Cylinder args={[0.15, 0.15, 0.8, 8]}>
            <meshStandardMaterial color="#D4B886" roughness={0.6} />
          </Cylinder>
          <pointLight
            intensity={0.5}
            distance={3}
            color="#FFA500"
            position={[0, -0.2, 0]}
          />
        </group>
      ))}
    </group>
  );
}

function DojoRoof() {
  return (
    <group position={[0, 4.5, 0]}>
      {/* Main roof structure */}
      <Box
        castShadow
        scale={[10, 0.2, 8]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="#4A3728" roughness={0.6} metalness={0.2} />
      </Box>

      {/* Sloped roof sections */}
      {[-1, 1].map((side) => (
        <Box
          key={side}
          castShadow
          scale={[5.2, 2, 8.2]}
          position={[side * 2.5, 0.5, 0]}
          rotation={[0, 0, side * Math.PI * 0.2]}
        >
          <meshStandardMaterial color="#4A3728" roughness={0.6} metalness={0.2} />
        </Box>
      ))}

      {/* Roof ridge */}
      <Cylinder
        castShadow
        args={[0.2, 0.2, 8.2, 8]}
        position={[0, 1, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#2F1810" roughness={0.7} metalness={0.3} />
      </Cylinder>
    </group>
  );
}

interface DoorInteractionProps {
  leftDoorRef: React.RefObject<THREE.Mesh>;
  rightDoorRef: React.RefObject<THREE.Mesh>;
  onDoorOpen: () => void;
}

function DoorInteraction({ leftDoorRef, rightDoorRef, onDoorOpen }: DoorInteractionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { camera } = useThree();

  const handleDoorClick = () => {
    if (isAnimating) return;

    const distance = camera.position.distanceTo(new THREE.Vector3(0, 1, 3));
    if (distance > 10) return; // Too far to interact

    setIsAnimating(true);

    // Animate left door
    anime({
      targets: leftDoorRef.current.position,
      x: -2.8,
      duration: 1000,
      easing: 'easeInOutQuad',
    });

    // Animate right door
    anime({
      targets: rightDoorRef.current.position,
      x: 2.8,
      duration: 1000,
      easing: 'easeInOutQuad',
      complete: () => {
        setIsAnimating(false);
        onDoorOpen();
      }
    });
  };

  return (
    <group
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={handleDoorClick}
    >
      <Box
        ref={leftDoorRef}
        castShadow
        position={[-1, 1, 0.5]}
        scale={[1.8, 3, 0.1]}
      >
        <meshStandardMaterial 
          color={isHovered ? "#F0E6D2" : "#E8D8C3"}
          roughness={0.5}
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </Box>
      <Box
        ref={rightDoorRef}
        castShadow
        position={[1, 1, 0.5]}
        scale={[1.8, 3, 0.1]}
      >
        <meshStandardMaterial 
          color={isHovered ? "#F0E6D2" : "#E8D8C3"}
          roughness={0.5}
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </Box>
    </group>
  );
}

interface DojoEntranceProps {
  onDoorOpen: () => void;
}

function DojoEntrance({ onDoorOpen }: DojoEntranceProps) {
  const leftDoorRef = useRef<THREE.Mesh>(null);
  const rightDoorRef = useRef<THREE.Mesh>(null);

  return (
    <group position={[0, 0, 3]}>
      {/* Wooden platform */}
      <Box
        receiveShadow
        position={[0, 0.25, 1]}
        scale={[6, 0.5, 2]}
      >
        <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.1} />
      </Box>

      {/* Steps */}
      {[0, 1, 2].map((step) => (
        <Box
          key={step}
          receiveShadow
          position={[0, step * 0.15, 2 + step * 0.4]}
          scale={[4, 0.2, 0.4]}
        >
          <meshStandardMaterial color="#A0522D" roughness={0.9} metalness={0.1} />
        </Box>
      ))}

      <DoorInteraction
        leftDoorRef={leftDoorRef}
        rightDoorRef={rightDoorRef}
        onDoorOpen={onDoorOpen}
      />
    </group>
  );
}

interface StoneLanternProps {
  position: [number, number, number];
}

function StoneLantern({ position }: StoneLanternProps) {
  return (
    <group position={position}>
      {/* Base */}
      <Cylinder
        castShadow
        receiveShadow
        args={[0.3, 0.4, 0.4, 6]}
        position={[0, 0.2, 0]}
      >
        <meshStandardMaterial color="#808080" roughness={0.9} />
      </Cylinder>

      {/* Middle section */}
      <Cylinder
        castShadow
        receiveShadow
        args={[0.15, 0.15, 1.2, 6]}
        position={[0, 0.9, 0]}
      >
        <meshStandardMaterial color="#808080" roughness={0.9} />
      </Cylinder>

      {/* Lantern housing */}
      <group position={[0, 1.5, 0]}>
        <Box
          castShadow
          receiveShadow
          args={[0.6, 0.6, 0.6]}
        >
          <meshStandardMaterial color="#808080" roughness={0.9} />
        </Box>
        {/* Light effect */}
        <pointLight
          intensity={0.5}
          distance={3}
          color="#FFA500"
          position={[0, 0, 0]}
        />
      </group>

      {/* Top */}
      <Cylinder
        castShadow
        receiveShadow
        args={[0.4, 0.2, 0.3, 6]}
        position={[0, 1.95, 0]}
      >
        <meshStandardMaterial color="#808080" roughness={0.9} />
      </Cylinder>
    </group>
  );
}

interface BambooProps {
  position: [number, number, number];
}

function Bamboo({ position }: BambooProps) {
  return (
    <group position={position}>
      {[...Array(7)].map((_, i) => {
        const x = (Math.random() - 0.5) * 1.5;
        const z = (Math.random() - 0.5) * 1.5;
        const height = 4 + Math.random() * 3;
        const segments = 5;
        const segmentHeight = height / segments;

        return (
          <group key={i} position={[x, 0, z]} rotation={[0, 0, (Math.random() - 0.5) * 0.2]}>
            {[...Array(segments)].map((_, j) => (
              <Cylinder
                key={j}
                castShadow
                args={[0.08, 0.07, segmentHeight, 8]}
                position={[0, j * segmentHeight + segmentHeight / 2, 0]}
              >
                <meshStandardMaterial
                  color={j % 2 ? "#228B22" : "#32CD32"}
                  roughness={0.6}
                  metalness={0.2}
                />
              </Cylinder>
            ))}
          </group>
        );
      })}
    </group>
  );
}

function SandPatterns() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry;
      const positions = geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        const wave1 = Math.sin(x * 2 + z * 2) * 0.05;
        const wave2 = Math.cos(x * 3 - z * 3) * 0.03;
        positions[i + 1] = wave1 + wave2;
      }
      
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  }, []);

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.49, 0]}
      receiveShadow
    >
      <planeGeometry args={[20, 20, 150, 150]} />
      <meshStandardMaterial
        color="#E6D5AC"
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

function Rocks() {
  return (
    <group position={[0, 0, 0]}>
      {[...Array(20)].map((_, i) => {
        const x = (Math.random() - 0.5) * 15;
        const z = (Math.random() - 0.5) * 15;
        const scale = 0.3 + Math.random() * 0.4;
        return (
          <group key={i} position={[x, 0, z]}>
            <RoundedBox
              castShadow
              receiveShadow
              args={[1, 1, 1]}
              radius={0.2}
              scale={[scale, scale * 1.2, scale]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
            >
              <meshStandardMaterial
                color={`rgb(${120 + Math.random() * 40}, ${120 + Math.random() * 40}, ${120 + Math.random() * 40})`}
                roughness={0.9}
                metalness={0.1}
              />
            </RoundedBox>
          </group>
        );
      })}
    </group>
  );
}

function Atmosphere() {
  return (
    <>
      <Environment preset="sunset" />
      <Stars 
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <Cloud
        opacity={0.5}
        speed={0.4}
        width={10}
        depth={1.5}
        segments={20}
        position={[0, 15, 0]}
      />
      <fog attach="fog" args={['#87CEEB', 30, 95]} />
    </>
  );
}

function CameraController({ isOpen }: { isOpen: boolean }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>();

  useEffect(() => {
    if (isOpen) {
      // Animate camera to enter the dojo
      anime({
        targets: camera.position,
        x: 0,
        y: 2,
        z: 0,
        duration: 2000,
        easing: 'easeInOutQuad',
        complete: () => {
          // After entering, move to viewing position
          anime({
            targets: camera.position,
            x: 0,
            y: 3,
            z: -2,
            duration: 1500,
            easing: 'easeOutQuad',
          });
        }
      });

      // Update controls target
      anime({
        targets: controlsRef.current.target,
        x: 0,
        y: 2,
        z: -3,
        duration: 2000,
        easing: 'easeInOutQuad',
      });
    }
  }, [isOpen, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      maxPolarAngle={Math.PI / 2 - 0.1}
      minPolarAngle={Math.PI / 4}
      maxDistance={25}
      minDistance={4}
      target={[0, 2, 0]}
    />
  );
}

function Dojo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <group>
      <DojoWalls />
      <DojoRoof />
      <DojoInterior />
      <DojoEntrance onDoorOpen={() => setIsOpen(true)} />
      <CameraController isOpen={isOpen} />
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas shadows camera={{ position: [15, 8, 15], fov: 45 }}>
      <color attach="background" args={['#87CEEB']} />
      
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        position={[2.5, 8, 5]}
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10]} />
      </directionalLight>

      <Atmosphere />
      <Ground />
      <SandPatterns />
      <Dojo />
      <Rocks />
      
      {/* Stone lanterns */}
      <StoneLantern position={[-4, 0, 5]} />
      <StoneLantern position={[4, 0, 5]} />
      
      {/* Bamboo groves */}
      <Bamboo position={[-8, 0, -2]} />
      <Bamboo position={[8, 0, -2]} />
      <Bamboo position={[-10, 0, 4]} />
      <Bamboo position={[10, 0, 4]} />
    </Canvas>
  );
}