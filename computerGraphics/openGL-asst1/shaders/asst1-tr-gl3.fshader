// If you have shader compilation problems, try changing this to 130
#version 150

uniform sampler2D uTex2;

in vec2 vTexCoord;
in vec3 vColor;

out vec4 fragColor;

void main(void) {

    // The texture(..) calls always return a vec4. Data comes out of a texture
    // in RGBA format
    
    vec4 texColor2 = texture(uTex2, vTexCoord);
    
    // fragColor is a vec4. The components are interpreted as red, green, blue,
    // and alpha
    
    vec4 colorMod = vec4(vColor.x, vColor.y, vColor.z, 1); //color based on vertex position;
    fragColor = texColor2 + colorMod;
}
