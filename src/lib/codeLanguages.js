export const LANG_LABELS = {
  javascript: "JavaScript",
  python: "Python",
  csharp: "C#",
  cpp: "C++",
  hlsl: "HLSL",
  glsl: "GLSL",
};

export const KEYWORDS = {
  javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "new", "import", "export", "default", "from", "async", "await", "try", "catch", "this", "extends", "super", "typeof", "instanceof", "null", "undefined", "true", "false"],
  python: ["def", "return", "if", "elif", "else", "for", "while", "class", "import", "from", "as", "try", "except", "finally", "with", "lambda", "None", "True", "False", "and", "or", "not", "in", "is", "pass", "break", "continue", "yield", "self"],
  csharp: ["public", "private", "protected", "internal", "static", "void", "class", "struct", "interface", "namespace", "using", "return", "if", "else", "for", "foreach", "while", "new", "this", "base", "null", "true", "false", "var", "int", "float", "double", "string", "bool", "override", "virtual", "abstract", "try", "catch", "finally"],
  cpp: ["int", "float", "double", "void", "class", "struct", "public", "private", "protected", "return", "if", "else", "for", "while", "new", "delete", "this", "nullptr", "true", "false", "namespace", "using", "include", "template", "typename", "const", "static", "virtual", "override"],
  hlsl: ["float", "float2", "float3", "float4", "half", "fixed", "sampler2D", "Texture2D", "SamplerState", "void", "return", "if", "else", "for", "struct", "uniform", "in", "out", "inout", "const", "static"],
  glsl: ["float", "vec2", "vec3", "vec4", "mat3", "mat4", "sampler2D", "void", "return", "if", "else", "for", "uniform", "in", "out", "varying", "const", "attribute"],
};