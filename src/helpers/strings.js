export const parsePPGData = (jsonString) => {
  try {
    let parsedJson = JSON.parse(jsonString);

    return parsedJson.rawPPG
  } catch (e) {
    console.log("JSON parse error:", e);
  }
}
