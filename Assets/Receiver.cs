#define VERBOSE

using UnityEngine;
using System.Collections;
using System.Runtime.InteropServices;

public class Receiver : MonoBehaviour {

	delegate void delegate_V();
	delegate void delegate_Vi(int i);
	delegate void delegate_Vf(float f);
	delegate void delegate_Vs(string s);

	// Use this for initialization
	void Awake () {
		set_callbacks (
			TargetV,
			TargetVi,
			TargetVf,
			TargetVs
		);
	}

#region SENDMESSAGE_WRAPPERS
	private void TargetVWrapper() {
		TargetV ();
	}

	private void TargetViWrapper(int a) {
		TargetVi (a);
	}

	private void TargetVfWrapper(float a) {
		TargetVf (a);
	}

	private void TargetVsWrapper(string a) {
		TargetVs (a);
	}
#endregion

	[MonoPInvokeCallback (typeof (delegate_V))]
	private static void TargetV() {
		#if VERBOSE
		Debug.Log ("TargetMethod");
		#endif
	}

	[MonoPInvokeCallback (typeof (delegate_Vi))]
	private static void TargetVi(int i) {
		#if VERBOSE
		Debug.Log (string.Format("Vi: {0}",i));
		#endif
	}

	[MonoPInvokeCallback (typeof (delegate_Vf))]
	private static void TargetVf(float f) {
		#if VERBOSE
		Debug.Log (string.Format("Vf: {0}",f));
		#endif
	}

	[MonoPInvokeCallback (typeof (delegate_Vs))]
	private static void TargetVs(string s) {
		#if VERBOSE
		Debug.Log (string.Format("Vs: {0}",s));
		#endif
	}

	[DllImport("__Internal")]
	private static extern void set_callbacks(
		delegate_V v,
		delegate_Vi vi,
		delegate_Vf vf,
		delegate_Vs vs
	);
}
