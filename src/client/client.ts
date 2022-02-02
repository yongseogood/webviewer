import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 15

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const loader = new THREE.FileLoader();

loader.load("/pcl/point_00001_00000.txt", 
	// onLoad callback
	function ( data ) {
		// output the text to the console
        console.log('testing yong')
        const lines = data.toString().split("\n")

        const points = []

        for(let i = 1; i < lines.length; i++)
        {
            const pos = lines[i].toString().split(' ')

            points.push(new THREE.Vector3(Number(pos[0]), Number(pos[1]), Number(pos[2])))
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const point = new THREE.Points(geometry, new THREE.PointsMaterial({color: 0xffffff, size:0.1}))
        scene.add(point)
	}
);

console.log(scene)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)

    // point.rotation.x += 0.01
    // point.rotation.y += 0.01

    render()
    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()