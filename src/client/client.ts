import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'
import { GUI } from 'dat.gui'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

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

const material = new THREE.PointsMaterial({color: 0xffffff, size:0.1})
let tmpArray : THREE.Points[]= [];

const loadPcd = true
if(loadPcd)
{
    const pcdLoader = new PCDLoader()
    const pcdFrameSize = 17

    for(let t = 0; t < pcdFrameSize; t++)
    {
        let filename = "/pcd/0000" + String(t) + ".pcd"

        if(t >= 10 && t < 100)
            filename = "/pcd/000" + String(t) + ".pcd"

        console.log("logname = " + filename)

        pcdLoader.load(filename,
            function (points) {
                tmpArray.push(points)
            }
        );
    }
} else {
    const loader = new THREE.FileLoader()

    const streamGeometry = new THREE.BufferGeometry()

    const frameSize = 2000

    for(let t = 0; t < frameSize; t++)
    {
        let filename = "/pcl/point_00001_0000" + String(t) + ".txt"

        if(t >= 10 && t < 100)
            filename = "/pcl/point_00001_000" + String(t) + ".txt"
        else if(t >= 100 && t < 1000)
            filename = "/pcl/point_00001_00" + String(t) + ".txt"
        else if(t >= 1000 && t < 10000)
            filename = "/pcl/point_00001_0" + String(t) + ".txt"

        loader.load(filename,
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

                streamGeometry.setFromPoints(points)

                const geometry = new THREE.BufferGeometry().setFromPoints(points)
                const point = new THREE.Points(geometry, new THREE.PointsMaterial({color: 0xffffff, size:0.1}))
                // scene.add(point)
            }
        );
    }

    const streamPoint = new THREE.Points(streamGeometry, material)
    scene.add(streamPoint)
}

const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

const sphereGeometry = new THREE.SphereGeometry()
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
// sphere.position.x = -2

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

const gui = new GUI()
const pclFolder = gui.addFolder('PCL')
var redObj = { red:function(){ material.color =  new THREE.Color(0xff0000) }};
gui.add(redObj,'red');
var blueObj = { blue:function(){ material.color =  new THREE.Color(0x0000ff) }};
gui.add(blueObj,'blue');
var whiteObj = { white:function(){ material.color =  new THREE.Color(0xffffff) }};
gui.add(whiteObj,'white');
pclFolder.open()
const sphereFolder = gui.addFolder('Sphere')
var cbObj = { 'sphere': false}
gui.add(cbObj,'sphere').onChange(
    function(value) {
        if(value) scene.add(sphere)
        else scene.remove(sphere)
    }
)
sphereFolder.open()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.open()

function animate() {
    requestAnimationFrame(animate)

    // point.rotation.x += 0.01
    // point.rotation.y += 0.01

    render()
    stats.update()
}

let curr = 0;
let prev = 0;

function render() {
    renderer.render(scene, camera);

    if(tmpArray.length > 1) {
        scene.remove(tmpArray[prev]);
        scene.add(tmpArray[curr]);
        prev = curr;
        curr += 1;

        if(curr > 17) {
            curr = 0;
        }
    }
}

animate()