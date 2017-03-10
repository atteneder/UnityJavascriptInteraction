using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

public class EditorTools {

	[MenuItem("Tools/Set Emscripten Arguments")]
	public static void SetAdvancedBuildOptionsWebGL() {
		//Debug.Log( PlayerSettings.GetPropertyString("emscriptenArgs", BuildTargetGroup.WebGL) );

		// Minimize build size:
		//PlayerSettings.SetPropertyString("emscriptenArgs", "-Oz -s INLINING_LIMIT=1 -s OUTLINING_LIMIT=0 --llvm-lto 2", BuildTargetGroup.WebGL);
		//PlayerSettings.SetPropertyString("emscriptenArgs", "-Oz -s INLINING_LIMIT=1 -s OUTLINING_LIMIT=0", BuildTargetGroup.WebGL);

		// Get more assert/error information
		PlayerSettings.SetPropertyString("emscriptenArgs", "--profiling -s ASSERTIONS=2", BuildTargetGroup.WebGL);

		// Integrated kernel sources
		//PlayerSettings.SetPropertyString("emscriptenArgs", "-Oz -std=c++11 -D NDEBUG", BuildTargetGroup.WebGL);
	}

	[MenuItem("Tools/Unset Emscripten Arguments")]
	public static void UnsetAdvancedBuildOptionsWebGL() {
		// Get more assert/error information
		PlayerSettings.SetPropertyString("emscriptenArgs", "", BuildTargetGroup.WebGL);
	}
}
