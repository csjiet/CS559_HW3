class TransformClass{
	
	
	constructor(){
		// Global variables
		this.stack = [mat3.create()];
	}


	// Instance functions
	// moveToTx(x, y){
	// 	var res = vec2.create();
	// 	vec2.transformMat3(res, [x,y], this.stack[0]);
		
	// 	return res;
	// }

	// lineToTx(x,y){
	// 	var res = vec2.create();
	// 	vec2.transformMat3(res, [x,y], this.stack[0]);
	// 	return res;
	// }
	
	translation(x, y){

		var Tx = mat3.create();
		mat3.fromTranslation(Tx, [x, y]);
		mat3.multiply(this.stack[0], this.stack[0], Tx);
		//console.log(this.stack[0]);
	}

	rotate(rad){
	
		var Tx = mat3.create();
		mat3.rotate(Tx, Tx, rad);
		mat3.multiply(this.stack[0], this.stack[0], Tx);

	}

	scale(sX, sY){
		
		var Tx = mat3.create();
		mat3.scale(Tx, Tx, [sX, sY]);
		mat3.multiply(this.stack[0], this.stack[0], Tx);
	}

	push(){
		this.stack.unshift(mat3.clone(this.stack[0]));
	}

	pop(){
		return this.stack.shift();
	}
}
