
function init_functions(unityInstance) {
	window.Module = unityInstance.Module;
	c_v = unityInstance.Module.cwrap('call_cb_v',null,[]);
	c_vi = unityInstance.Module.cwrap('call_cb_vi',null,['number']);
	c_vf = unityInstance.Module.cwrap('call_cb_vf',null,['number']);
	c_vs = unityInstance.Module.cwrap('call_cb_vs',null,['string']);
	c_vv3 = unityInstance.Module.cwrap('call_cb_vv3',null,['number']);
	c_vv3json = unityInstance.Module.cwrap('call_cb_vv3json',null,['string']);
	c_vx = unityInstance.Module.cwrap('call_cb_vx',null,['number','number','number','number']);
	c_vxjson = unityInstance.Module.cwrap('call_cb_vxjson',null,['string']);
	c_i = unityInstance.Module.cwrap('call_cb_i','number',[]);
	c_f = unityInstance.Module.cwrap('call_cb_f','number',[]);
	c_s = unityInstance.Module.cwrap('call_cb_s','string',[]);
};

var iterations = 10000;

var int1 = 100;
var int2 = 200;
var vector3 = {
		x:1,
		y:2,
		z:3
	}
var vector3_2 = {
		x:4,
		y:5,
		z:6
	}

function run_tests() {

	window.SendMessage = Module.SendMessage;
	
	console.log('Running tests via original SendMessage');
	run_tests_sendmessage();

	optimize_sendmessage();
	console.log('Running tests via cwrap optimized SendMessage');
	run_tests_sendmessage();

	console.log('Running tests via direct invocations. Note: oposed to SendMessage, these calls are plain invocations of static methods. SendMessage on the other hand makes a name (string) based lookup of a dynamic GameObjects beforehands and thus is slower.');
	run_tests_direct();

	console.log('Running additional tests via direct invocations. These calls arent\'t directly doable with SendMessage');
	run_tests_direct_additional();
}

function optimize_sendmessage() {
	SendMessage = function(gameObject, func, param) {
		if (param === undefined) {
			if (typeof this.SendMessage_vss != 'function')
				this.SendMessage_vss = Module.cwrap('SendMessage', 'void', ['string', 'string']);
			this.SendMessage_vss(gameObject, func);
		} else if (typeof param === "string") {
			if (typeof this.SendMessage_vsss != 'function')
				this.SendMessage_vsss = Module.cwrap('SendMessageString', 'void', ['string', 'string', 'string']);
			this.SendMessage_vsss(gameObject, func, param);
		} else if (typeof param === "number") {
			if (typeof this.SendMessage_vssn != 'function')
				this.SendMessage_vssn = Module.cwrap('SendMessageFloat', 'void', ['string', 'string', 'number']);
			this.SendMessage_vssn(gameObject, func, param);
		} else
			throw "" + param + " is does not have a type which is supported by SendMessage.";
	}
}

function run_tests_sendmessage() {

	//----------------------

	console.time('SMv');
	for(i=0;i<iterations;i++) {
		SendMessage('Receiver','TargetVWrapper');
	}
	console.timeEnd('SMv');

	//----------------------

	console.time('SMvi');
	for(i=0;i<iterations;i++) {
		SendMessage('Receiver','TargetViWrapper',42);
	}
	console.timeEnd('SMvi');
	
	//----------------------
	
	console.time('SMvf');
	for(i=0;i<iterations;i++) {
		SendMessage('Receiver','TargetVfWrapper',42.42);
	}
	console.timeEnd('SMvf');
	
	//----------------------
	
	console.time('SMvs');
	for(i=0;i<iterations;i++) {
		SendMessage('Receiver','TargetVsWrapper','This is a test string.');
	}
	console.timeEnd('SMvs');

	//----------------------

	console.time('SMvv3');
	for(i=0;i<iterations;i++) {
		var argument = JSON.stringify(vector3);
		SendMessage('Receiver','TargetVv3Wrapper',argument);
	}
	console.timeEnd('SMvv3');

	//----------------------

	console.time('SMvx');
	for(i=0;i<iterations;i++) {
		var argument = {
			a:int1,
			b:int2,
			c:vector3,
			d:vector3_2
		}
		argument = JSON.stringify(argument);
		SendMessage('Receiver','TargetVsWrapper',argument);
	}
	console.timeEnd('SMvx');
}

function run_tests_direct() {
	
	//----------------------

	console.time('Cv');
	for(i=0;i<iterations;i++) {
		c_v();
	}
	console.timeEnd('Cv');

	//----------------------

	console.time('Cvi');
	for(i=0;i<iterations;i++) {
		c_vi(42);
	}
	console.timeEnd('Cvi');
	
	//----------------------

	console.time('Cvf');
	for(i=0;i<iterations;i++) {
		c_vf(42.42);
	}
	console.timeEnd('Cvf');
	
	//----------------------

	console.time('Cvs');
	for(i=0;i<iterations;i++) {
		c_vs('This is a test string.');
	}
	console.timeEnd('Cvs');

	//----------------------

	console.time('Cvv3 JSON');
	for(i=0;i<iterations;i++) {
		var argument = JSON.stringify(vector3);
		c_vv3json(argument);
	}
	console.timeEnd('Cvv3 JSON');

	console.time('Cvv3');
	
	for(i=0;i<iterations;i++) {
		var dataPtr = Module._malloc(12);
		var fDataPtr = dataPtr>>2;
		Module.HEAPF32[fDataPtr] = vector3.x;
		Module.HEAPF32[fDataPtr+1] = vector3.y;
		Module.HEAPF32[fDataPtr+2] = vector3.z;
		c_vv3(dataPtr);
		Module._free(dataPtr);
	}
	console.timeEnd('Cvv3');

	//----------------------

	console.time('Cvx JSON');
	for(i=0;i<iterations;i++) {
		var argument = {
			a:int1,
			b:int2,
			c:vector3,
			d:vector3_2
		}
		argument = JSON.stringify(argument);
		c_vxjson(argument);
	}
	console.timeEnd('Cvx JSON');

	console.time('Cvx');
	for(i=0;i<iterations;i++) {
		var dataPtr = Module._malloc(24);
		var fDataPtr = dataPtr>>2;
		Module.HEAPF32[fDataPtr] = vector3.x;
		Module.HEAPF32[fDataPtr+1] = vector3.y;
		Module.HEAPF32[fDataPtr+2] = vector3.z;
		
		Module.HEAPF32[fDataPtr+3] = vector3_2.x;
		Module.HEAPF32[fDataPtr+4] = vector3_2.y;
		Module.HEAPF32[fDataPtr+5] = vector3_2.z;

		c_vx(int1,int2,dataPtr,dataPtr+12);

		Module._free(dataPtr);
	}
	console.timeEnd('Cvx');

	//----------------------
}

function run_tests_direct_additional() {
	
	console.time('Ci');
	for(i=0;i<iterations;i++) {
		var ri=c_i();
		// console.log(ri);
	}
	console.timeEnd('Ci');

	//----------------------

	console.time('Cf');
	for(i=0;i<iterations;i++) {
		var f=c_f();
		// console.log(f);
	}
	console.timeEnd('Cf');

	//----------------------

	console.time('Cs');
	for(i=0;i<iterations;i++) {
		var s=c_s();
		// console.log(s);
	}
	console.timeEnd('Cs');
}
