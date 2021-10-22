	
function setup() { "use strict";
  	
// Variables
	var sliderLength = 100; // length of slider x and y
	var canvas = document.getElementById('myCanvas');
	var updateAnimatorTracker = null;
	var speedOfRender = 125;
  	
	// Slider variables
	var sliderX = document.getElementById('sliderX');
  	sliderX.value = sliderLength/2;
  	
	var sliderY = document.getElementById('sliderY');
  	sliderY.value = sliderLength/2;

	// Sling button variables
	var slingButton = document.getElementById('slingButton');

	// Position where the sling string should start/ Sling center
	var slingStartX = 80; // initial x position of sling string when page is loaded
	var slingStartY = 203; // initial y position of sling string when page is loaded

	// Sling string end position
	var stringEndPosX = 80; // increase: closer to slingshot
	var stringEndPosY = 203; // increase: pull string downward, aiming upwards
	var stringEndPosBeforeFireX = 0; // x position of string just before firing the sling
	var stringEndPosBeforeFireY = 0; // y position of string just before firing the sling

	// Rock variables
	var rockPosX = stringEndPosX + 10; // x position of the rock
	var rockPosY = stringEndPosY + 5; // y position of the rock
	var isReleased = false; // state of rock
	var speedOfRock = 7;// refresh timer of animator
	var rockAnimatorTracker = null; // interval call for animator
	var angle = 0; // angle of sling string vector
	var time = 1; // time of rock during motion
	var displacementOfStringX = 0; // horizontal length of sling string displaced
	var displacementOfStringY = 0; // vertical length of sling string displaced
	var gravity = -0.95; // gravity for rock projectile motion

	// Grass variables
	var grassAnimatorTracker = null; // interval call for animator
	var originalStartingGrassX = 20; // starting position of grass
	var startingGrassX = 20; // current x position of grass
	var startingGrassY = 297; // current y position of grass
	var numberOfGrassToTheRight = 4; // number of duplicated grasses
	var distanceBetweenGrass = 100; // distance between each grass
	var distanceChanged = 15; // distance between movement of the grasses
	var speedOfGrass = 450; // speed of movement of grasses

	// Sun and moon variables
	var sunMoonAnimatorTracker = null;
	var sunPosX = canvas.width/2; //200
	var sunPosY = 20;
	var moonPosX = canvas.width/2;
	//var moonPosY = (295 - 71) * 2 - sunPosY;
	var moonPosY = ((canvas.height - 70) * 2) - 20;
	var timeOfSunAndMoon = 0;
	var speedOfSunMoonRotation = 100;
	var isDay = true;
	

	// Target variables
	var targetAnimatorTracker = null;
	var targetPosX = canvas.width - 150;
	var targetPosY = canvas.height/2;
	var timeOfTargetPos = 0;
	var speedOfTarget = 10;

	// Left wing stroke variables
	var innerAndOuterWingFlex = 15;
	var leftWingToInnerJointRotation = 180;
	var leftWingToOuterJointRotation = leftWingToInnerJointRotation - innerAndOuterWingFlex;
	

	// Right wing stoke variables
	var rightWingToInnerJointRotation = 0;
	var rightWingToOuterJointRotation = rightWingToInnerJointRotation + innerAndOuterWingFlex;


	// This function defines a drawings on the canvas
  	function draw() {
    		var context = canvas.getContext('2d');
    		canvas.width = canvas.width;

		// Variables to store the changes made on the slider
    		var dx = sliderX.value;
    		var dy = sliderY.value;

		context.translate(50,0);
    
		// This function draws sling shot
    		function DrawSlingShot() {
      			// sling handle
			context.fillStyle = "red";
			context.fillRect(80, 235 + ((55-35)/2), 7, 50);
			context.strokeRect(80, 235 + ((55-35)/2), 7, 50);

			// sling pillar 1 (right)
			context.fillStyle = "red";
			context.fillRect(80, 200-10, 10, 45); 
			context.strokeRect(80, 200-10, 10, 45); // added 10 to 210 and 45 (above too)
			
			DrawRock();


			// sling pillar 2 (left)
			context.fillStyle = "red";
			context.fillRect(75, 215-10, 10, 50); 
			context.strokeRect(75, 215-10, 10, 50);// added 10 to 225 and 50 (above too)
			
			// sling pillar support
			context.strokeStyle = "black";
			context.beginPath();
			context.moveTo(85, 255);
			context.lineTo(90, 235);
			context.lineTo(85, 235);
			context.lineTo(85, 255);
			context.stroke();
			context.fillStyle = "red";
			context.fill();
    		}
   
		// This function draws string of sling shot
   		function DrawSling() {
      		context.strokeStyle= "black";
      		context.beginPath();
			context.moveTo(80, 203); //fixed 
			context.lineTo(stringEndPosX + ((dx-50)*2), stringEndPosY + ((dy-50)*2));
			context.moveTo(stringEndPosX + ((dx-50)*2), stringEndPosY + ((dy-50)*2));
			displacementOfStringX = ((dx-50)*2);
			displacementOfStringY = ((dy-50)*2);
			context.lineTo(75, 218); // fixed
      
      		context.stroke();
     	}
		
		// This function draws ground where sling shot stands
		function DrawPlatform(){
			
			context.save();
			context.translate(-50, 0);			
			context.beginPath();
			context.fillStyle = "brown";
			context.fillRect(0, 295, 3000, 5);
			context.restore();
		}

		// This function draws the rock
		function DrawRock(){
			context.beginPath();

			if(isReleased ==false){
				context.arc(rockPosX + ((dx-50)*2), rockPosY + ((dy-50)*2), 15, 0, 2 * Math.PI);
			}else{
				context.arc(rockPosX, rockPosY, 15, 0, 2 * Math.PI);
			}


			context.stroke();
			context.fillStyle = "grey";
			context.fill();
		}

		// This function draws aim assist for the sling shot
		function DrawAimAssist(){

			// Get gradient of 2 points
			context.save();
			var speedMultiplier = Math.sqrt(Math.pow(slingStartX - (stringEndPosX + displacementOfStringX), 2) + Math.pow((slingStartY - (stringEndPosY+ displacementOfStringY) ), 2)) / 100;

			// Straight line equation y =mx + c is defined
			var m = (slingStartY - (stringEndPosY+displacementOfStringY))/ (slingStartX - (stringEndPosX+displacementOfStringX));
			var c = slingStartY - (m* slingStartX);
			var isRight = false;
			var directionConstant = 0; // Stores positive or negative numbers to track sling string direction

			// Checks if sling string is drawn towards the right
			if(slingStartX > stringEndPosX + displacementOfStringX){
				isRight = true;
				directionConstant = 5;
			}else{
				isRight = false;
				directionConstant = -5;
			}		

			// Define drawing of aim assist
			context.strokeStyle = "blue";	
			context.beginPath();
			context.moveTo(slingStartX + 10, m*(slingStartX+ 10) + c);
			context.lineTo(slingStartX + (directionConstant)*8*speedMultiplier, m*(slingStartX+ (directionConstant)*8*speedMultiplier) + c);
			context.stroke();
			context.restore();
			
		}
		
		// This function draws welcome/ instruction message on the screen
		function DrawLoadingScreen(){
			
			context.save();
			context.font = context.font = '50px serif';
			context.fillText('Press \'Sling!\' to launch!', 10, 90);
			context.restore();
		}

		// This function draws the grass 
		function DrawGrass(){
		
			context.save();
				
			var heightOfLeftBush = 10; // stores the position of small bush
			var heightOfRightBush = 25; // stores the position of large bush


			// Defines drawing of grasses
			context.beginPath();
			context.fillStyle = "green";
		
			// Draws the first bush
			context.arc(startingGrassX, startingGrassY, heightOfLeftBush, 0, 2 * Math.PI);
			context.arc(startingGrassX + 30, startingGrassY, heightOfRightBush, 0, 2* Math.PI );
			
			// Draws the remaining bushe(s)
			for(var i = 0; i< numberOfGrassToTheRight; i++){
				startingGrassX = startingGrassX + distanceBetweenGrass;
				context.arc(startingGrassX, startingGrassY, heightOfLeftBush, 0, 2 * Math.PI);
				context.arc(startingGrassX + 30, startingGrassY, heightOfRightBush, 0, 2* Math.PI);
				
			}

			startingGrassX = originalStartingGrassX; // Reset the position of the bush to create windy effect
			context.fill();
			context.restore();	
		}

		// This function renders the sun or the moon depending on the time
		function dayNightChanger(){

			// This function draws the sun
			function DrawSun(radOfSun, scaleX, scaleY, speedOfSun){
				

				// Make changes to background color
				context.save();
				context.translate(-50,0);
				context.beginPath();
				
				context.fillStyle = "rgb(250, 251, 189)";
				
				context.fillRect(0, 0, canvas.width, canvas.height);
				context.fill();
				context.restore();

				// Make changes to color
				context.save();
				context.beginPath();
				context.scale(scaleX, scaleY);
				context.arc(sunPosX, sunPosY, radOfSun, 0, 2 * Math.PI);
				
				context.fillStyle = "rgb(253, 224, 80)";
				
				context.fill();
				context.restore();
				
				
			}

			// This function draws the moon
			function DrawMoon(radOfMoon, scaleX, scaleY, speedOfSun){
				function moonColorChanger(){
					
					// Make changes to background color
					context.save();
					context.translate(-50,0);
					context.beginPath();
					context.fillStyle = "rgb(22, 73, 138)";
					context.fillRect(0, 0, canvas.width, canvas.height);
					context.fill();
					context.restore();
					
					

					// Make changes to moon color
					context.save();
					context.beginPath();
					context.scale(scaleX, scaleY);
					context.arc(moonPosX, moonPosY, radOfMoon, 0, 2* Math.PI);
					context.fillStyle = "grey";
					context.fill();
					context.restore();
					
				}

				moonColorChanger();
			}
			
			
			// Checks if sun position has reached the end of the canvas
			if(sunPosY <= canvas.height){
				DrawSun(50, 1, 1, 5);
			}else{
				DrawMoon(50, 1, 1, 5);
			}

		}

		// This function draws the wings of the target (piggy)
		function DrawWings(){

			// Wing span size
			var innerJointSpan = 40; // Wing span of the inner joint
			var outerJointSpan = 40; // Wing span of the outer joint

			// Left wing of target
			// Left wing inner joint
			context.save();
			context.beginPath();
			context.translate(targetPosX, targetPosY);
			context.rotate(leftWingToInnerJointRotation * Math.PI / 180);
			context.fillStyle = "rgb(138, 154, 91)";
			context.stroke();
			context.fillRect(0, 0, innerJointSpan, 2);
			context.fill();
			context.restore();

			// Left wing outer joint
			context.save();
			context.beginPath();
			context.translate(targetPosX, targetPosY);
			context.translate((innerJointSpan* Math.cos(leftWingToInnerJointRotation * Math.PI / 180)), (innerJointSpan* Math.sin(leftWingToInnerJointRotation * Math.PI / 180)));
			context.rotate(leftWingToOuterJointRotation * Math.PI / 180);
			context.fillStyle = "rgb(138, 154, 91)";
			context.stroke();
			context.fillRect(0, 0, outerJointSpan, 2);
			context.fill();
			context.restore();


			// Right wing of target
			// Right wing inner joint
			context.save();
			context.beginPath();
			context.translate(targetPosX, targetPosY);
			context.rotate(rightWingToInnerJointRotation * Math.PI / 180);
			context.fillStyle = "rgb(138, 154, 91)";
			context.stroke();
			context.fillRect(0, 0, innerJointSpan, 2);
			context.fill();
			context.restore();

			// Right wing outer joint
			context.save();
			context.beginPath();
			context.translate(targetPosX, targetPosY);
			context.translate((innerJointSpan* Math.cos(rightWingToInnerJointRotation * Math.PI / 180)), (innerJointSpan* Math.sin(rightWingToInnerJointRotation * Math.PI / 180)));
			context.rotate(rightWingToOuterJointRotation * Math.PI / 180);
			context.fillStyle = "rgb(138, 154, 91)";
			context.stroke();
			context.fillRect(0, 0, outerJointSpan, 2);
			context.fill();
			context.restore();


			// Generates the flapping motion on each wing based on the position of the target
			if(leftWingToInnerJointRotation >= 180){
				leftWingToInnerJointRotation = 180;
			}
			if(rightWingToInnerJointRotation <= 0){
				rightWingToInnerJointRotation = 0;
			}
			if(leftWingToOuterJointRotation >= 180 - innerAndOuterWingFlex){
				leftWingToOuterJointRotation = 180 - innerAndOuterWingFlex;
			}
			if(rightWingToOuterJointRotation <= 0 + innerAndOuterWingFlex){
				rightWingToOuterJointRotation = 0 + innerAndOuterWingFlex;
			}

			// Updates the rotation of the wings to create flapping motion
			leftWingToInnerJointRotation += ((targetPosY - 150));
			rightWingToInnerJointRotation -= ((targetPosY - 150));
			
			leftWingToOuterJointRotation += ((targetPosY - 150));
			rightWingToOuterJointRotation -= ((targetPosY - 150));
		
		}

		// This function draws the target (aka. piggy)
		function DrawTarget(){
			
			context.save();

			// Draw ears
			context.beginPath();
			context.ellipse(targetPosX, targetPosY - 20, 6, 8, 9.5, (2 * Math.PI), 2 * Math.PI/2);
			context.fillStyle = "green"
			context.fill();
			context.stroke();
			context.beginPath();
			context.ellipse(targetPosX + 18, targetPosY - 14, 6, 8, 10.3, (2 * Math.PI), 2 * Math.PI/2);
			context.fillStyle = "green"
			context.fill();
			context.stroke();

			// Draw head
			context.beginPath();
			context.arc(targetPosX, targetPosY, 23, 0, 2 * Math.PI);
			context.fillStyle = "rgb(102, 255, 0)"
			context.fill();

			var offsetBetweenEyes = 3;
			// Draw left brow
			context.moveTo(targetPosX - 10 - offsetBetweenEyes, targetPosY - 10);
			context.lineTo(targetPosX - 5 - offsetBetweenEyes, targetPosY - 13);

			// Draw right brow
			context.moveTo(targetPosX + 10 + offsetBetweenEyes, targetPosY - 10);
			context.lineTo(targetPosX + 5 + offsetBetweenEyes, targetPosY - 13);

			context.strokeStyle = "green";
			context.stroke();

			// Draw left eye
			context.beginPath();
			
			context.arc(targetPosX - 9 - offsetBetweenEyes, targetPosY - 5, 4, 0, 2 * Math.PI);
			context.stroke();
			context.beginPath();
			context.arc(targetPosX - 10 - offsetBetweenEyes, targetPosY - 5, 2, 0, 2 * Math.PI);
			context.fillStyle = "black";
			context.fill();

			// Draw right eye
			context.beginPath();
			context.arc(targetPosX + 9 + offsetBetweenEyes, targetPosY - 5, 4, 0, 2 * Math.PI);
			context.stroke();
			context.beginPath();
			context.arc(targetPosX + 10 + offsetBetweenEyes, targetPosY - 5, 2, 0, 2 * Math.PI);
			context.fillStyle = "black";
			context.fill();

			// Draw nose
			context.beginPath();
			context.ellipse(targetPosX, targetPosY + 5, 14, 8, 0, 0, 2 * Math.PI);
			context.stroke();

			// Left nostril
			context.beginPath();
			context.ellipse(targetPosX - 5, targetPosY + 5, 6, 3, 5, 0, 2 * Math.PI);
			context.fillStyle = "black";
			context.fill();

			// Right nostril
			context.beginPath();
			context.ellipse(targetPosX + 5, targetPosY + 5, 5, 3, -5, 0, 2 * Math.PI);
			context.fillStyle = "black";
			context.fill();

			// Draw mouth
			context.beginPath();
			context.ellipse(targetPosX, targetPosY + 13, 6, 3, 0, (2 * Math.PI), 2 * Math.PI / 2);
			context.strokeStyle = "black";
			context.stroke();

			context.restore();

			
		}

		// Draws winning text when collision is detected
		function DrawRockAndTargetCollisionDetectionText(){

			// Checks if the position of the rock collides with the position of the target
			if((targetPosX - 30 <= rockPosX && targetPosX + 30 >= rockPosX) && (targetPosY - 30 <= rockPosY && targetPosY + 30 >= rockPosY)){
				clearInterval(targetAnimatorTracker);
				clearInterval(updateAnimatorTracker);
				clearInterval(rockAnimatorTracker);
				context.save();
				context.translate(-50, 0);
				context.fillStyle = ""
				context.font = '70px serif';
				context.fillText('LEVEL CLEARED! \nScore: 10/10', 10, 90);
				context.restore();

			}

		}

		
		
		// Calls all necessary drawing functions
		context.save();
		
		dayNightChanger();
		// Checks if loading screen text should be drawn
		if(isReleased == false){
			DrawLoadingScreen();
		}
		DrawGrass();
    	DrawSling();	
		DrawAimAssist();
		DrawSlingShot();
		DrawPlatform();
		DrawWings();
		DrawTarget();
		DrawRockAndTargetCollisionDetectionText();
		
		context.restore();
    
  	}
	
	// Animations
	
	// This function animates the position of the target
	function targetAnimator(){

		// Make the target pendulum between the y axis, to create flying motion
		timeOfTargetPos += 0.05;
		targetPosY = (targetPosY + Math.sin(timeOfTargetPos));
		draw();

		// Checks if the rock has reached the ground
		if(rockPosX >=600 || rockPosX <= -50 || rockPosY >= 279){

			clearInterval(updateAnimatorTracker);
		}
	}


	// This function animates the sun and moon
	function sunAndMoonAnimator(){
		// x^2 + y^2 = r^2
		// x = r*cos(t)
		// y = r*sin(t)
		
		// Updates the position of the sun and moon in a circular motion
		timeOfSunAndMoon += 0.05;
		sunPosX = sunPosX + Math.cos(timeOfSunAndMoon) * 10;
		sunPosY = sunPosY + Math.sin(timeOfSunAndMoon) * 10;

		moonPosX = moonPosX + Math.cos(timeOfSunAndMoon) * (-10);
		moonPosY = moonPosY + Math.sin(timeOfSunAndMoon) * (-10);

	}

	// This function animates the grass
	function grassAnimator(){

		// CallS draw
		draw();

		// Updates the position of all grasses
		distanceChanged = distanceChanged * -1;
		startingGrassX = startingGrassX + distanceChanged;
		
	}

	// This function calculates distance
	function distance(slingCenterX, slingCenterY, drawbackX, drawbackY){
		
		return Math.sqrt(Math.pow((slingCenterX - drawbackX), 2) + Math.pow((slingCenterY - drawbackY), 2));
	}
	
	// This function calculates angle between two points
	function angleBetweenTwoPoints(drawbackX, drawbackY, slingCenterX, slingCenterY){
		//return Math.atan2((300 - slingCenterY)- drawbackY, slingCenterX - drawbackX);
		return Math.atan2(slingCenterY - drawbackY, slingCenterX - drawbackX);
		
	}

	// This function animates rock path using projectile motion
	function rockTravelPath(){
		// Defines trajectory

		// Defines angle of sling string
		angle = (Math.PI/2) - angleBetweenTwoPoints(stringEndPosBeforeFireX, stringEndPosBeforeFireY, slingStartX, slingStartY);
		
		// Defines distance of sling string being pulled
		var dist = Math.min(distance(slingStartX, slingStartY, stringEndPosBeforeFireX, stringEndPosBeforeFireY), 90);
		dist = dist/30;	// Tweeks the original distance so that it is smaller, to reduce speed

		// Updates displacement of rock using equations
		// x = v * t * cos(theta)
		// y = v * t * sin(theta) - (1/2)*g* (t^2)	
		// * 1.5 increases horizontal distance travelled
		rockPosX = ((dist*Math.sin(angle))*time)*2 + rockPosX; // Stores x position of rock at each frame
		rockPosY = ((((dist*Math.cos(angle))*time) * 1.3 - ((1/2)*gravity*(time*time))) + rockPosY); // Stores the y position of rock at each frame

		// Draws the changes made to the position of the rock
		draw();

		time+=0.14; // Updates the time interval when rock is traveling in the air
		
		// Stops rock animation when reach x=500 or y=270 boundary is reached
		if(rockPosX >=600 || rockPosX <= -50 || rockPosY >= 279){
			
			clearInterval(rockAnimatorTracker);
			time = 1;
		}


		
	}	

	// This function tracks when the sling button is pressed
	function slingRelease(){
		
		// This function defines animation of sling string when it is released
		function slingAnimation(){

			// Checks if sling string is already fired, if not store the position that is last stretched before firing
			if(isReleased == false){
				stringEndPosBeforeFireX = stringEndPosX + displacementOfStringX;
				stringEndPosBeforeFireY = stringEndPosY + displacementOfStringY;
			}	
			
			// Updates the position of the slider, to spring back its original position
			sliderX.value = sliderLength/2;
			sliderY.value = sliderLength/2;
			
			// Updates the position of the sling once its fired
			stringEndPosX = 80;
			stringEndPosY = 203;
		
			// Position of rock when not be altered once fired	
			if(isReleased == false){
				rockPosX = 80 + 10;
				rockPosY = 203 + 5;
			}

			isReleased = true; // Updates the condition of string release to true
			draw();

			// Starts rock animator
			rockAnimatorTracker = setInterval(rockTravelPath, speedOfRock);
			
		}

		slingAnimation();
			

	}

	
	// Function that calls all animators
	// Lines that are commented means it has 
	// its own rendering speed, which is different from what is defined here
	function callAllAnimators(){
		grassAnimator();
		sunAndMoonAnimator();
		//targetAnimator();

		draw();
		if(rockPosX >=600 || rockPosX <= -50 || rockPosY >= 279){

			clearInterval(updateAnimatorTracker);
		}

		
	}
  	
 	
	// This is a void function
	function empty(){

	}

	// Event listeners
	sliderX.addEventListener("input", empty); // Slider that reflects the X position of sling string
  	sliderY.addEventListener("input", empty); // Slider that reflects the Y position of sling string
	slingButton.addEventListener("click", slingRelease); // Button that fires the sling		
	//grassAnimatorTracker = setInterval(grassAnimator, speedOfGrass); // Starts grass animator 
	//sunMoonAnimatorTracker = setInterval(sunAndMoonAnimator, speedOfSunMoonRotation);
	targetAnimatorTracker = setInterval(targetAnimator, speedOfTarget);

	// Updates drawn frame
	updateAnimatorTracker = setInterval(callAllAnimators, speedOfRender);
  	//draw();
}


window.onload = setup; // Defines function call upon window load up
