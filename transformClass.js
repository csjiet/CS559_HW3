class TransformClass{
	

	
	constructor(){
		// Global variables
		this.stack = [mat3.create()];
	}


	// Instance functions
	moveToTx(x, y){
		var res = vec2.create();
		vec2.transformMat3(res, [x,y], this.stack[0]);
		
		return res;
	}

	lineToTx(x,y){
		var res = vec2.create();
		vec2.transformMat3(res, [x,y], this.stack[0]);
		return res;
	}
	
	translation(x, y){
		var Tx = mat3.create();
		mat3.fromTranslation(Tx, [x, y]);
		mat3.multiply(this.stack[0], this.stack[0], Tx);
		
	}

	push(){
		this.stack.unshift(mat3.clone(this.stack[0]));
	}

	pop(){
		this.stack.unshift(mat3.clone(this.stack[0]));
	}
}
