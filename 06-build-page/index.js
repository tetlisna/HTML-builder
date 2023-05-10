const fs = require("fs");
const path = require("path");

const getFileContent = async (path) => {
  const readStream = fs.createReadStream(path, { encoding: "utf8" });
  let fileContent = "";
  for await (const chunk of readStream) {
    fileContent += chunk.toString();
  }
  return fileContent;
};


const generateHtml = async () => {
  const templateHtmlPath = path.join(__dirname, "template.html");
  let templateContent = await getFileContent(templateHtmlPath);
  const placeholders = templateContent.match(/{{.*}}/g);

  for (let placeholder of placeholders) {
    templateContent = await replaceTemplateComponent(templateContent, placeholder);
  }

  const writeStream = fs.createWriteStream(path.join(__dirname, "project-dist", "index.html"), { encoding: "utf8" });
  writeStream.write(templateContent);
};
const replaceTemplateComponent = async (templateContent, placeholder) => {
  const component = placeholder.replace(/{{/g, "").replace(/}}/g, "");
  const componentPath = path.join(__dirname, "components", `${component}.html`);
  let componentContent = await getFileContent(componentPath);
  templateContent = templateContent.replace(placeholder, componentContent);
  return templateContent;
};

const generateCssBundle = async () => {
  const files = await fs.promises.readdir(path.join(__dirname, "styles"), { withFileTypes: true });

  const filesContentArray = [];

  for (let file of files) {
    if (!file.isFile()) continue;
    const filePath = path.join(__dirname, "styles", file.name);
    const { ext } = path.parse(filePath);
    if (ext !== ".css") continue;
    const fileContent = await getFileContent(filePath);
    filesContentArray.push(fileContent);
  }

  const writeStream = fs.createWriteStream(path.join(__dirname, "project-dist", "style.css"), { encoding: "utf8" });
  writeStream.write(filesContentArray.join("\n\n"));
};

const copyAssets = async (folder) => {
  const folders = await fs.promises.readdir(path.join(__dirname, folder), { withFileTypes: true });

  let promises = [];
  for (const assetFolder of folders) {
    if (assetFolder.isDirectory()) {
      const assetFolderArray = [folder, assetFolder.name];
      promises.push(copyAssetFiles(assetFolderArray));
    }
  }

  await Promise.all(promises);
};

const copyAssetFiles = async (assetFolderArray) => {
  const files = await fs.promises.readdir(path.join(__dirname, ...assetFolderArray), { withFileTypes: true });

  for (const file of files) {
    if (!file.isFile()) continue;
    await fs.promises.mkdir(path.join(__dirname, "project-dist", ...assetFolderArray), { recursive: true });
    await copySingleFile(file.name, assetFolderArray);
  }
};
const copySingleFile = async (fileName, sourceArray = []) => {
  const readStream = fs.createReadStream(path.join(__dirname, ...sourceArray, fileName));
  const writeStream = fs.createWriteStream(path.join(__dirname, "project-dist", ...sourceArray, fileName));

  for await (chunk of readStream) {
    writeStream.write(chunk);
  }
};

(async () => {
  await fs.promises.mkdir(path.join(__dirname, "project-dist"), { recursive: true });
  await Promise.all([generateHtml(), generateCssBundle(), copyAssets("assets")]);
})();

 