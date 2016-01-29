#include <stdint.h>

typedef void (*callback_v)();
typedef void (*callback_vi)(int32_t a);
typedef void (*callback_vf)(float a);
typedef void (*callback_vs)(const char *a);

callback_v cb_v;
callback_vi cb_vi;
callback_vf cb_vf;
callback_vs cb_vs;

void set_callbacks(
	callback_v p_v,
	callback_vi p_vi,
	callback_vf p_vf,
	callback_vs p_vs
)
{
	cb_v = p_v;
	cb_vi = p_vi;
	cb_vf = p_vf;
	cb_vs = p_vs;
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
