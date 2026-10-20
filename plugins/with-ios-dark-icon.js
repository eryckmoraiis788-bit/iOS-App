const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

function findAppIconSet(root) {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory() && entry.name === "AppIcon.appiconset")
      return fullPath;
    if (entry.isDirectory()) {
      const result = findAppIconSet(fullPath);
      if (result) return result;
    }
  }
  return null;
}

module.exports = function withIOSDarkIcon(config) {
  return withDangerousMod(config, [
    "ios",
    async (modConfig) => {
      const iosRoot = modConfig.modRequest.platformProjectRoot;
      const appIconSet = findAppIconSet(iosRoot);
      if (!appIconSet) return modConfig;

      const source = path.join(
        modConfig.modRequest.projectRoot,
        "assets/images/icon-dark.png",
      );
      const filename = "AppIcon-dark.png";
      fs.copyFileSync(source, path.join(appIconSet, filename));

      const contentsPath = path.join(appIconSet, "Contents.json");
      const contents = JSON.parse(fs.readFileSync(contentsPath, "utf8"));
      const images = Array.isArray(contents.images) ? contents.images : [];
      const darkImage = {
        idiom: "ios-marketing",
        filename,
        scale: "1x",
        size: "1024x1024",
        appearances: [{ appearance: "luminosity", value: "dark" }],
      };
      contents.images = images.filter(
        (image) =>
          !(
            image.idiom === darkImage.idiom &&
            image.appearances?.some(
              (appearance) =>
                appearance.appearance === "luminosity" &&
                appearance.value === "dark",
            )
          ),
      );
      contents.images.push(darkImage);
      fs.writeFileSync(contentsPath, `${JSON.stringify(contents, null, 2)}\n`);
      return modConfig;
    },
  ]);
};
