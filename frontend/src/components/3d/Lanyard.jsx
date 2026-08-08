import * as THREE from 'three'
import React, { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

extend({ MeshLineGeometry, MeshLineMaterial })

export default function LanyardApp() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
      <Canvas
        camera={{
          // Mobile: Kamera dinaikkan ke Y=2.2 agar fokus ke area atas teks
          position: isMobile ? [0, 2.2, 14] : [0, 0, 13],
          fov: isMobile ? 30 : 28,
          near: 0.1,
          far: 1000
        }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={Math.PI} />

        <Suspense fallback={null}>
          <Physics gravity={[0, -30, 0]} timeStep={1 / 60} interpolate>
            <Band isMobile={isMobile} />
          </Physics>

          <Environment blur={0.75}>
            <Lightformer intensity={2} color="white" form="rect" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3} color="white" form="rect" position={[-1, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3} color="white" form="rect" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={10} color="white" form="rect" position={[-10, 0, 14]} rotation={[0, 0, Math.PI / 2]} scale={[100, 10, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  )
}

function Band({ isMobile, maxSpeed = 30, minSpeed = 5 }) {
  const band = useRef()
  const fixed = useRef()
  const j1 = useRef()
  const j2 = useRef()
  const j3 = useRef()
  const card = useRef()

  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()

  const cardTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 880;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, 600, 880);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 10;
    ctx.strokeRect(16, 16, 568, 848);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VEYORA STUDIO', 300, 220);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '500 18px sans-serif';
    ctx.fillText('Scalable · Functional · Meaningful', 300, 265);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 52px sans-serif';
    ctx.fillText('VISIONARY', 300, 620);

    ctx.fillStyle = '#6B7280';
    ctx.font = '18px sans-serif';
    ctx.fillText('Stage access to innovation', 300, 660);

    ctx.fillStyle = '#4B5563';
    ctx.font = '14px sans-serif';
    ctx.fillText('veyora studio 2026', 300, 800);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    return tex;
  }, []);

  const lanyardTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0d0e12';
    ctx.fillRect(0, 0, 128, 512);

    ctx.fillStyle = '#E5E7EB';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';

    ctx.save();
    ctx.translate(64, 256);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('VEYORA STUDIO   ✦   VEYORA STUDIO', 0, 8);
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 3);
    return tex;
  }, []);

  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 0.45, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => { document.body.style.cursor = 'auto' }
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    if (fixed.current) {
      ;[j1, j2].forEach((ref) => {
        if (!ref.current?.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })

      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(32))

      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x * 0.92, y: (ang.y - rot.y * 0.2) * 0.92, z: ang.z * 0.92 })
    }
  })

  curve.curveType = 'chordal'

  return (
    <>
      {/* Position X=0 di Mobile & X=3.2 di Desktop. Position Y=5.2 di Mobile agar tepat di area merah */}
      <group position={[isMobile ? 0 : 3.2, isMobile ? 5.2 : 4, 0]}>
        <RigidBody ref={fixed} type="fixed" />
        <RigidBody ref={j1} position={[0.3, 0, 0]} linearDamping={2.5} angularDamping={2.5}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody ref={j2} position={[0.6, 0, 0]} linearDamping={2.5} angularDamping={2.5}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody ref={j3} position={[0.9, 0, 0]} linearDamping={2.5} angularDamping={2.5}><BallCollider args={[0.1]} /></RigidBody>

        <RigidBody
          ref={card}
          position={[0, 0, 0]}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
          enabledRotations={[true, true, true]}
          linearDamping={1.2}
          angularDamping={1.2}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={isMobile ? 0.95 : 1.35}
            position={[0, -0.62, -0.05]}
            onPointerDown={(e) => (e.stopPropagation(), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}
            onPointerUp={() => drag(false)}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
          >
            <mesh position={[0, -0.45, 0]}>
              <boxGeometry args={[1.5, 2.2, 0.03]} />
              <meshPhysicalMaterial
                map={cardTexture}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>

            <mesh position={[0, 0.68, 0]}>
              <torusGeometry args={[0.08, 0.02, 16, 32]} />
              <meshStandardMaterial color="#E5E7EB" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color="white" depthTest={false} resolution={[1000, 1000]} useMap map={lanyardTexture} repeat={[-3, 1]} lineWidth={1} />
      </mesh>
    </>
  )
}
