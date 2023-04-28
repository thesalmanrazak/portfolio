varying vec2 vertexUV;
varying vec3 vertexNormal;
void main() {
    vertexUV = uv;
    vectorNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}