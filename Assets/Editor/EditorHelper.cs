using UnityEngine;
using UnityEditor;
using System.Collections;

public class EditorHelper : MonoBehaviour {

	[MenuItem("Build/Set emcc arguments")]
	static void SetEmcc () {
		PlayerSettings.SetPropertyString("emscriptenArgs", "-s EXPORTED_FUNCTIONS=\"['_main','_SendMessageInt','_SendMessageFloat','_SendMessageString','_SendMessage','_SetFullscreen','_call_cb_v','_call_cb_vi','_call_cb_vf','_call_cb_vs',]\"", BuildTargetGroup.WebGL);
	}

	[MenuItem("Build/unset emcc arguments")]
	static void UnsetEmcc () {
		PlayerSettings.SetPropertyString("emscriptenArgs", "", BuildTargetGroup.WebGL);
	}
}
