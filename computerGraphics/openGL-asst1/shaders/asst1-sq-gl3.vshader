// If you have shader compilation problems, try changing this to 130
#version 150

uniform float uSquareShift;
uniform float uWidthScale;
uniform float uHeightScale;

in vec2 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;


void main() {
   
   //original code gl_Position = vec4(aPosition.x + uSquareShift, aPosition.y, 0, 1);

   gl_Position = vec4((aPosition.x + uSquareShift) * uWidthScale, aPosition.y * uHeightScale, 0.f, 1.f);
   vTexCoord = aTexCoord;
   
}
