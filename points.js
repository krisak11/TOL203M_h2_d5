/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Teiknar punkt á strigann þar sem notandinn smellir músinni
//
//    Hjálmtýr Hafsteinsson, janúar 2021
/////////////////////////////////////////////////////////////////
var canvas;
var gl;


var maxNumPoints = 200;       // Hámarksfjöldi punkta sem forritið ræður við!
var index = 0; 				// Númer núverandi punkts
var points = [];               

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    // Tökum frá minnispláss í grafíkminni fyrir maxNumPoints tvívíð hnit (float er 4 bæti)
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, 8*Math.pow(3, 6), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    // Meðhöndlun á músarsmellum
    canvas.addEventListener("mousedown", function(e){
		if(e.button == 0){
			gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
			
			// Reikna heimshnit músarinnar út frá skjáhnitum
			var center = vec2(2*e.offsetX/canvas.width-1, 2*(canvas.height-e.offsetY)/canvas.height-1);
			var p1 = vec2(center[0]-0.05, center[1]-0.05);
			var p2 = vec2(center[0]+0.05, center[1]-0.05);
			var p3 = vec2(center[0],center[1]+0.05);
			triangle(p1,p2,p3);
			// Færa þessi hnit yfir í grafíkminni, á réttan stað
			gl.bufferData( gl.ARRAY_BUFFER, 8*Math.pow(3, 6), gl.STATIC_DRAW );

			index++;
		}else{
			points = [];
			render();
		}

    } );

    render();
}

function triangle( a, b, c )
{
    points.push( a, b, c );
}
function render() {
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
	
    window.requestAnimFrame(render);
}
