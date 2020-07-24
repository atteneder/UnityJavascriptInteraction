// #define EMSCRIPTEN_KEEPALIVE

#include <stdint.h>
#include "emscripten.h"
#include "native.h"

callback_v cb_v;
callback_vi cb_vi;
callback_vf cb_vf;
callback_vs cb_vs;
callback_vv3 cb_vv3;
callback_vs cb_vv3json;
callback_vx cb_vx;
callback_vs cb_vxjson;

callback_I cb_i;
callback_F cb_f;
callback_S cb_s;

callback_message cb_message;
callback_v cb_showMessages;

void set_callbacks(
	callback_v p_v,
	callback_vi p_vi,
	callback_vf p_vf,
	callback_vs p_vs,
	callback_vv3 p_vv3,
	callback_vs p_vv3json,
	callback_vx p_vx,
	callback_vs p_vxjson,
	callback_message p_message,
	callback_I p_i,
	callback_F p_f,
	callback_S p_s,
	callback_v p_showMessages
)
{
	cb_v = p_v;
	cb_vi = p_vi;
	cb_vf = p_vf;
	cb_vs = p_vs;
	cb_vv3 = p_vv3;
	cb_vv3json = p_vv3json;
	cb_vx = p_vx;
	cb_vxjson = p_vxjson;
	cb_i = p_i;
	cb_f = p_f;
	cb_s = p_s;
	cb_message = p_message;
	cb_showMessages = p_showMessages;
}

void EMSCRIPTEN_KEEPALIVE call_cb_v() {
	cb_v();
}

void EMSCRIPTEN_KEEPALIVE call_show_messages() {
	cb_showMessages();
}

void EMSCRIPTEN_KEEPALIVE call_cb_vi(int32_t a) {
	cb_vi(a);
}

void EMSCRIPTEN_KEEPALIVE call_cb_vf(float a) {
	cb_vf(a);
}

void EMSCRIPTEN_KEEPALIVE call_cb_vs(const char *a) {
	cb_vs(a);
}

void EMSCRIPTEN_KEEPALIVE call_cb_vv3(struct Vector3 a) {
	cb_vv3(a);
}

void EMSCRIPTEN_KEEPALIVE call_cb_vv3json(const char *a) {
	cb_vv3json(a);
}

void EMSCRIPTEN_KEEPALIVE call_cb_vx(int32_t a,int32_t b,struct Vector3 c,struct Vector3 d) {
	cb_vx(a,b,c,d);
}

void EMSCRIPTEN_KEEPALIVE call_cb_vxjson(const char *a) {
	cb_vxjson(a);
}

void EMSCRIPTEN_KEEPALIVE call_cb_message(const struct SendSceneMessage m) {
	cb_message(m);
}

int32_t EMSCRIPTEN_KEEPALIVE call_cb_i() {
	return cb_i();
}

float EMSCRIPTEN_KEEPALIVE call_cb_f() {
	return cb_f();
}

const char * EMSCRIPTEN_KEEPALIVE call_cb_s() {
	return cb_s();
}