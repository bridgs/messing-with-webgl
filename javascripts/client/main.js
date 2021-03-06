define([
	'config',
	'display/canvas',
	'Game',
	'shared/util/now',
	'net/conn',
	'webgl/createProgramFromFiles'
], function(
	clientConfig,
	canvas,
	Game,
	now,
	conn,
	createProgramFromFiles
) {
	return function main() {
		//get A WebGL context
		var gl = canvas.getContext('experimental-webgl');
		if(!gl) {
			gl = canvas.getContext('webgl');
		}

		//keep track of when the window has been resized
		var windowHasBeenResized = true;
		window.addEventListener('resize', function() {
			windowHasBeenResized = true;
		});

		//setup a GLSL program
		program = createProgramFromFiles(gl, '3d-texture', '3d-texture-4tap', function(program) {
			//create a new game
			var isPaused = true;
			var game = new Game(gl, program);

			//kick off the game loop
			var prevTime = null;
			function loop() {
				var currTime = now();

				//update the game
				if(prevTime && !isPaused) {
					var t = currTime - prevTime;
					game.update(t);
				}
				prevTime = currTime;

				//resize the canvas if needed
				if(windowHasBeenResized) {
					windowHasBeenResized = false;
					var size = Math.min(window.innerWidth / clientConfig.CANVAS_WIDTH,
						window.innerHeight / clientConfig.CANVAS_HEIGHT);
					canvas.width = size * clientConfig.CANVAS_WIDTH;
					canvas.height = size * clientConfig.CANVAS_HEIGHT;
					gl.viewport(0, 0, canvas.width, canvas.height);
					game.recalculateProjectionMatrix();
				}

				//render the game
				game.render(gl, program);

				//schedule the next loop
				requestAnimationFrame(loop);
			}
			requestAnimationFrame(loop);

			//reset the game whenever we connect to the server
			conn.on('handshake', function(session) {
				isPaused = false;
				game.reset(session);
			});

			//pause the game whenever we are disconnected from the server;
			conn.on('disconnect', function() {
				isPaused = true;
			});

			//connect to the server!
			conn.connect();
		});
	};
});