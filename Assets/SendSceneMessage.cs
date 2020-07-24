using System.Runtime.InteropServices;
using UnityEngine;

[System.Serializable]
[StructLayout(LayoutKind.Sequential, Pack = 4)]
public struct NativeColor
{
    public float r;
    public float g;
    public float b;
    public float a;
}

[System.Serializable]
[StructLayout(LayoutKind.Sequential, Pack = 4)]
public struct UpdateEntityComponent
{
    public int classId;
    public int name;
    public MaterialModel model;
}

[System.Serializable]
[StructLayout(LayoutKind.Sequential, Pack = 4)]
public struct SendSceneMessage
{
    public int sceneId;
    public int tag;
    public int entityId;

    public UpdateEntityComponent updateEntityComponent;
}

[System.Serializable]
[StructLayout(LayoutKind.Sequential, Pack = 4)]
public struct MaterialModel
{
    public float alpha;
    public NativeColor albedoColor;
    public NativeColor emissiveColor;
    public float metallic;
    public float roughness;
    public NativeColor ambientColor;
    public NativeColor reflectionColor;
    public NativeColor reflectivityColor;
    public float directIntensity;
    public float microSurface;

    public float emissiveIntensity;

    public float environmentIntensity;

    public float specularIntensity;

    public int albedoTexture;

    public int alphaTexture;

    public int emissiveTexture;

    public int bumpTexture;

    public int refractionTexture;

    public bool disableLighting;

    public float transparencyMode;

    public bool hasAlpha;
}