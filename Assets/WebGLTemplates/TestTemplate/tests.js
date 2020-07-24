var iterations = 10000;

var int1 = 100;
var int2 = 200;

var vector3 = {
    x: 1,
    y: 2,
    z: 3
}

var vector3_2 = {
    x: 4,
    y: 5,
    z: 6
}

var Color =
    {
        r: 1,
        g: 0,
        b: 1,
        a: 0
    }


var Color2 =
    {
        r: 0,
        g: 1,
        b: 0,
        a: 1
    }

var MaterialModel =
    {
        alpha: 0,
        albedoColor: Color,
        emissiveColor: Color2,
        metallic: 1,
        roughness: 2,
        ambientColor: Color,
        reflectionColor: Color2,
        reflectivityColor: Color,
        directIntensity: 3,
        microSurface: 4,
        emissiveIntensity: 5,
        environmentIntensity: 6,
        specularIntensity: 7,
        albedoTexture: 8,
        alphaTexture: 9,
        emissiveTexture: 10,
        bumpTexture: 11,
        refractionTexture: 12,
        disableLighting: 1,
        transparencyMode: 14,
        hasAlpha: 1,
    }

var UpdateEntityComponent =
    {
        classId: 0,
        name: 1,
        model: MaterialModel
    }

var SendSceneMessage =
    {
        sceneId: 0,
        tag: 1,
        entityId: 2,
        updateEntityComponent: UpdateEntityComponent
    }

function run_tests() {
    var Module = unityInstance.Module
    c_v = Module.cwrap('call_cb_v', null, []);
    c_vi = Module.cwrap('call_cb_vi', null, ['number']);
    c_vf = Module.cwrap('call_cb_vf', null, ['number']);
    c_vs = Module.cwrap('call_cb_vs', null, ['string']);
    c_vv3 = Module.cwrap('call_cb_vv3', null, ['number']);
    c_vv3json = Module.cwrap('call_cb_vv3json', null, ['string']);
    c_vx = Module.cwrap('call_cb_vx', null, ['number', 'number', 'number', 'number']);
    c_vxjson = Module.cwrap('call_cb_vxjson', null, ['string']);
    c_i = Module.cwrap('call_cb_i', 'number', []);
    c_f = Module.cwrap('call_cb_f', 'number', []);
    c_s = Module.cwrap('call_cb_s', 'string', []);
    c_m = Module.cwrap('call_cb_message', null, ['number']);
    c_showMessages = Module.cwrap('call_show_messages', null, []);

    console.log('Running tests via original SendMessage');
    run_tests_sendmessage();

    optimize_sendmessage();
    console.log('Running tests via cwrap optimized SendMessage');
    run_tests_sendmessage();

    console.log('Running tests via direct invocations. Note: oposed to SendMessage, these calls are plain invocations of static methods. SendMessage on the other hand makes a name (string) based lookup of a dynamic GameObjects beforehands and thus is slower.');
    run_tests_direct();

    console.log('Running additional tests via direct invocations. These calls arent\'t directly doable with SendMessage');
    run_tests_direct_additional();

    console.log('Direct invocations + passing complex objects');
    run_tests_direct_complex_objects();
}

function optimize_sendmessage() {
    var Module = unityInstance.Module
    SendMessage = function (gameObject, func, param) {
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
    var SendMessage = unityInstance.Module.SendMessage

    //----------------------

    console.time('SMv');
    for (i = 0; i < iterations; i++) {
        SendMessage('Receiver', 'TargetVWrapper');
    }
    console.timeEnd('SMv');

    //----------------------

    console.time('SMvi');
    for (i = 0; i < iterations; i++) {
        SendMessage('Receiver', 'TargetViWrapper', 42);
    }
    console.timeEnd('SMvi');

    //----------------------

    console.time('SMvf');
    for (i = 0; i < iterations; i++) {
        SendMessage('Receiver', 'TargetVfWrapper', 42.42);
    }
    console.timeEnd('SMvf');

    //----------------------

    console.time('SMvs');
    for (i = 0; i < iterations; i++) {
        SendMessage('Receiver', 'TargetVsWrapper', 'This is a test string.');
    }
    console.timeEnd('SMvs');

    //----------------------

    console.time('SMvv3');
    for (i = 0; i < iterations; i++) {
        var argument = JSON.stringify(vector3);
        SendMessage('Receiver', 'TargetVsWrapper', argument);
    }
    console.timeEnd('SMvv3');

    //----------------------

    console.time('SMvx');
    for (i = 0; i < iterations; i++) {
        var argument = {
            a: int1,
            b: int2,
            c: vector3,
            d: vector3_2
        }
        argument = JSON.stringify(argument);
        SendMessage('Receiver', 'TargetVsWrapper', argument);
    }
    console.timeEnd('SMvx');
}

function run_tests_direct() {
    var Module = unityInstance.Module

    Module["setValue"] = function (dataPtr, value, foo) {
        Module.HEAPF32[dataPtr >> 2] = value
    };

    //----------------------

    console.time('Cv');
    for (i = 0; i < iterations; i++) {
        c_v();
    }
    console.timeEnd('Cv');

    //----------------------

    console.time('Cvi');
    for (i = 0; i < iterations * 32; i++) {
        c_vi(42);
    }
    console.timeEnd('Cvi');

    //----------------------

    console.time('Cvf');
    for (i = 0; i < iterations * 32; i++) {
        c_vf(42.42);
    }
    console.timeEnd('Cvf');

    //----------------------

    console.time('Cvs');
    for (i = 0; i < iterations; i++) {
        c_vs('loooooooooong string');
    }
    console.timeEnd('Cvs');

    //----------------------

    console.time('Cvv3 JSON');
    for (i = 0; i < iterations; i++) {
        var argument = JSON.stringify(vector3);
        c_vv3json(argument);
    }
    console.timeEnd('Cvv3 JSON');

    var dataPtr = Module._malloc(12);
    console.time('Cvv3');


    for (i = 0; i < iterations; i++) {
        Module.setValue(dataPtr, vector3.x, 'float');
        Module.setValue(dataPtr + 4, vector3.y, 'float');
        Module.setValue(dataPtr + 8, vector3.z, 'float');
        c_vv3(dataPtr);
    }
    console.timeEnd('Cvv3');
    Module._free(dataPtr);

    //----------------------

    console.time('Cvx JSON');
    for (i = 0; i < iterations; i++) {
        var argument = {
            a: int1,
            b: int2,
            c: vector3,
            d: vector3_2
        }
        argument = JSON.stringify(argument);
        c_vxjson(argument);
    }
    console.timeEnd('Cvx JSON');

    {
        console.time('Cvx (ccall + inner alloc)');
        for (i = 0; i < iterations; i++) {
            var dataPtr = Module._malloc(24);
            Module.setValue(dataPtr, vector3.x, 'float');
            Module.setValue(dataPtr + 4, vector3.y, 'float');
            Module.setValue(dataPtr + 8, vector3.z, 'float');

            Module.setValue(dataPtr + 12, vector3_2.x, 'float');
            Module.setValue(dataPtr + 16, vector3_2.y, 'float');
            Module.setValue(dataPtr + 20, vector3_2.z, 'float');

            c_vx(int1, int2, dataPtr, dataPtr + 12);
            Module._free(dataPtr);
        }
        console.timeEnd('Cvx (ccall + inner alloc)');
    }

    {
        var dataPtr = Module._malloc(24);
        console.time('Cvx (ccall + outer alloc)');
        for (i = 0; i < iterations; i++) {
            Module.setValue(dataPtr, vector3.x, 'float');
            Module.setValue(dataPtr + 4, vector3.y, 'float');
            Module.setValue(dataPtr + 8, vector3.z, 'float');

            Module.setValue(dataPtr + 12, vector3_2.x, 'float');
            Module.setValue(dataPtr + 16, vector3_2.y, 'float');
            Module.setValue(dataPtr + 20, vector3_2.z, 'float');

            c_vx(int1, int2, dataPtr, dataPtr + 12);
        }
        console.timeEnd('Cvx (ccall + outer alloc)');
        Module._free(dataPtr);
    }

    {
        var dataPtr = Module._malloc(24);
        var memArray = Module.HEAPF32;
        var dataPtrAligned = dataPtr >> 2

        console.time('Cvx (memory fill only + outer alloc)');

        for (i = 0; i < iterations; i++) {
            memArray[dataPtrAligned] = vector3.x;
            memArray[dataPtrAligned + 1] = vector3.y;
            memArray[dataPtrAligned + 2] = vector3.z;

            memArray[dataPtrAligned + 3] = vector3_2.x;
            memArray[dataPtrAligned + 4] = vector3_2.y;
            memArray[dataPtrAligned + 5] = vector3_2.z;

            c_vx(int1, int2, dataPtr, dataPtr + 12);
        }
    }

    console.timeEnd('Cvx (memory fill only + outer alloc)');
    Module._free(dataPtr);
}

//----------------------


function run_tests_direct_additional() {

    console.time('Ci');
    for (i = 0; i < iterations; i++) {
        var ri = c_i();
        // console.log(ri);
    }
    console.timeEnd('Ci');

    //----------------------

    console.time('Cf');
    for (i = 0; i < iterations; i++) {
        var f = c_f();
        // console.log(f);
    }
    console.timeEnd('Cf');

    //----------------------

    console.time('Cs');
    for (i = 0; i < iterations; i++) {
        var s = c_s();
        // console.log(s);
    }
    console.timeEnd('Cs');
}


function run_tests_direct_complex_objects() {
    var Module = unityInstance.Module

    {
        console.log('iterations ' + iterations);
        console.time('SendSceneMessage (memory fill + inner alloc)');

        for (i = 0; i < iterations; i++) {
            var dataPtr = Module._malloc(164);

            if (!dataPtr)
                console.log("Alloc error!");

            var memArray = Module.HEAPF32;
            var memArrayInt = Module.HEAP32;

            var dataPtrAligned = dataPtr >> 2;
            memArrayInt[dataPtrAligned++] = i;
            memArrayInt[dataPtrAligned++] = SendSceneMessage.tag;
            memArrayInt[dataPtrAligned++] = SendSceneMessage.entityId;
            memArrayInt[dataPtrAligned++] = SendSceneMessage.updateEntityComponent.classId;
            memArrayInt[dataPtrAligned++] = SendSceneMessage.updateEntityComponent.name;
            dataPtrAligned = fillMaterialModel(memArray, memArrayInt, dataPtrAligned, SendSceneMessage.updateEntityComponent.model);
            c_m(dataPtr);
            Module._free(dataPtr);
        }

        console.timeEnd('SendSceneMessage (memory fill + inner alloc)');
    }

    //c_showMessages();

    {
        console.time('SendSceneMessage (memory fill + outer alloc)');

        var dataPtr = Module._malloc(164);
        for (i = 0; i < iterations; i++) {

            if (!dataPtr)
                console.log("Alloc error!");

            var memArray = Module.HEAPF32;
            var memArrayInt = Module.HEAP32;

            var dataPtrAligned = dataPtr >> 2;
            memArrayInt[dataPtrAligned++] = i;
            memArrayInt[dataPtrAligned++] = SendSceneMessage.tag;
            memArrayInt[dataPtrAligned++] = SendSceneMessage.entityId;
            memArrayInt[dataPtrAligned++] = SendSceneMessage.updateEntityComponent.classId;
            memArrayInt[dataPtrAligned++] = SendSceneMessage.updateEntityComponent.name;
            dataPtrAligned = fillMaterialModel(memArray, memArrayInt, dataPtrAligned, SendSceneMessage.updateEntityComponent.model);
            c_m(dataPtr);
        }
        Module._free(dataPtr);

        console.timeEnd('SendSceneMessage (memory fill + outer alloc)');
    }
    //c_showMessages();
}

function fillColor(memArray, dataPtr, color) {
    memArray[dataPtr++] = color.r;
    memArray[dataPtr++] = color.g;
    memArray[dataPtr++] = color.b;
    memArray[dataPtr++] = color.a;
    return dataPtr;
}

function fillMaterialModel(memArray, memArrayInt, dataPtr, model) {
    memArray[dataPtr++] = model.alpha;
    dataPtr = fillColor(memArray, dataPtr, model.albedoColor);
    dataPtr = fillColor(memArray, dataPtr, model.emissiveColor);
    memArray[dataPtr++] = model.metallic;
    memArray[dataPtr++] = model.roughness;
    dataPtr = fillColor(memArray, dataPtr, model.ambientColor);
    dataPtr = fillColor(memArray, dataPtr, model.reflectionColor);
    dataPtr = fillColor(memArray, dataPtr, model.reflectivityColor);
    memArray[dataPtr++] = model.directIntensity;
    memArray[dataPtr++] = model.microSurface;
    memArray[dataPtr++] = model.emissiveIntensity;
    memArray[dataPtr++] = model.environmentIntensity;
    memArray[dataPtr++] = model.specularIntensity;
    memArrayInt[dataPtr++] = model.albedoTexture;
    memArrayInt[dataPtr++] = model.alphaTexture;
    memArrayInt[dataPtr++] = model.emissiveTexture;
    memArrayInt[dataPtr++] = model.bumpTexture;
    memArrayInt[dataPtr++] = model.refractionTexture;
    memArrayInt[dataPtr++] = model.disableLighting;
    memArrayInt[dataPtr++] = model.transparencyMode;
    memArrayInt[dataPtr++] = model.hasAlpha;
    return dataPtr;
}


