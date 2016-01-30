#include <stdint.h>

typedef void (*callback_v)();
typedef void (*callback_vi)(int32_t a);
typedef void (*callback_vf)(float a);
typedef void (*callback_vs)(const char *a);

typedef int32_t (*callback_I)();
typedef float (*callback_F)();
typedef const char * (*callback_S)();

callback_v cb_v;
callback_vi cb_vi;
callback_vf cb_vf;
callback_vs cb_vs;

callback_I cb_i;
callback_F cb_f;
callback_S cb_s;

void set_callbacks(
	callback_v p_v,
	callback_vi p_vi,
	callback_vf p_vf,
	callback_vs p_vs,
	callback_I p_i,
	callback_F p_f,
	callback_S p_s
)
{
	cb_v = p_v;
	cb_vi = p_vi;
	cb_vf = p_vf;
	cb_vs = p_vs;
	cb_i = p_i;
	cb_f = p_f;
	cb_s = p_s;
}

void call_cb_v() {
	cb_v();
}

void call_cb_vi(int32_t a) {
	cb_vi(a);
}

void call_cb_vf(float a) {
	cb_vf(a);
}

void call_cb_vs(const char *a) {
	cb_vs(a);
}

int32_t call_cb_i() {
	return cb_i();
}

float call_cb_f() {
	return cb_f();
}

const char * call_cb_s() {
	return cb_s();
}