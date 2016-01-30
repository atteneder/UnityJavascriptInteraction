function run_tests() {

	var iterations = 1000;

	var c_v = Module.cwrap('call_cb_v',null,[]);
	var c_vi = Module.cwrap('call_cb_vi',null,['number']);
	var c_vf = Module.cwrap('call_cb_vf',null,['number']);
	var c_vs = Module.cwrap('call_cb_vs',null,['string']);
	//----------------------
	console.time('SMv');
	for(i=0;i<iterations;i++) {
		SendMessage('Receiver','TargetVWrapper');
	}
	console.timeEnd('SMv');

	console.time('Cv');
	for(i=0;i<iterations;i++) {
		c_v();
	}
	console.timeEnd('Cv');
	//----------------------
	console.time('SMvi');
	for(i=0;i<iterations;i++) {
		SendMessage('Receiver','TargetViWrapper',42);
	}
	console.timeEnd('SMvi');

	console.time('Cvi');
	for(i=0;i<iterations;i++) {
		c_vi(42);
	}
	console.timeEnd('Cvi');
	//----------------------
	console.time('SMvf');
	for(i=0;i<iterations;i++) {
		SendMessage('Receiver','TargetVfWrapper',42.42);
	}
	console.timeEnd('SMvf');

	console.time('Cvf');
	for(i=0;i<iterations;i++) {
		c_vf(42.42);
	}
	console.timeEnd('Cvf');
	//----------------------
	console.time('SMvs');
	for(i=0;i<iterations;i++) {
		SendMessage('Receiver','TargetVsWrapper','This is a test string.');
	}
	console.timeEnd('SMvs');

	console.time('Cvs');
	for(i=0;i<iterations;i++) {
		c_vs('This is a test string.');
	}
	console.timeEnd('Cvs');
	//----------------------
}