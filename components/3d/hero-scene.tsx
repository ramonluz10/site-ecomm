'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, MeshDistortMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function FloatingOrb({ position, color, speed = 1, distort = 0.3, size = 1 }: {
  position: [number, number, number]
  color: string
  speed?: number
  distort?: number
  size?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed
    }
  })

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          envMapIntensity={0.4}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.1}
          roughness={0.2}
          distort={distort}
          speed={2}
        />
      </Sphere>
    </Float>
  )
}

function Particles({ count = 500 }) {
  const points = useRef<THREE.Points>(null)
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return positions
  }, [count])

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02
      points.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#6366f1"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6366f1" />
      <pointLight position={[10, -10, 5]} intensity={0.5} color="#14b8a6" />
      
      <Particles count={300} />
      
      {/* Main orb */}
      <FloatingOrb 
        position={[2, 0, 0]} 
        color="#6366f1" 
        speed={0.8} 
        distort={0.4}
        size={1.5}
      />
      
      {/* Secondary orbs */}
      <FloatingOrb 
        position={[-3, 1, -2]} 
        color="#14b8a6" 
        speed={1.2} 
        distort={0.3}
        size={0.8}
      />
      <FloatingOrb 
        position={[0, -2, -1]} 
        color="#8b5cf6" 
        speed={0.6} 
        distort={0.5}
        size={0.6}
      />
      <FloatingOrb 
        position={[-1, 2, 1]} 
        color="#ec4899" 
        speed={1} 
        distort={0.2}
        size={0.4}
      />
      
      <Environment preset="night" />
    </>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
