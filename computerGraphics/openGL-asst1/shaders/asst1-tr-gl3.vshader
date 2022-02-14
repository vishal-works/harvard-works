// If you have shader compilation problems, try changing this to 130
#version 150

uniform float uWidthScale;
uniform float uHeightScale;
uniform float uMoveX;
uniform float uMoveY;

in vec2 aPosition;
in vec2 aTexCoord;
in vec3 aColor;

out vec2 vTexCoord;
out vec3 vColor;


void main() {

   
   gl_Position = vec4((aPosition.x + uMoveX) * uWidthScale, (aPosition.y + uMoveY) * uHeightScale, 0.f, 1.f);
   
   vTexCoord = aTexCoord;
   vColor = aColor;
}
