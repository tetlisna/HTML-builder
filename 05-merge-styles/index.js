const fs = require("fs/promises");
const path = require("path");

const getFileContent = async (filePath) => {
  const readStream = fs.createReadStream(filePath, { encoding: "utf8" });
  let fileContent = "";

  for await (const chunk of readStream) {
    fileContent += chunk.toString();
  }

  return fileContent;
};

(async () => {
  const files = await fs.readdir(path.join(__dirname, "styles"), { withFileTypes: true });
  const filesContentArray = [];

  for (let file of files) {
    if (!file.isFile()) continue;
    const filePath = path.join(__dirname, "styles", file.name);
    const { ext } = path.parse(filePath);
    if (ext !== ".css") continue;
    const fileContent = await getFileContent(filePath);
    filesContentArray.push(fileContent);
  }

  const writeStream = fs.createWriteStream(path.join(__dirname, "project-dist", "bundle.css"), { encoding: "utf8" });

  writeStream.write(filesContentArray.join("\n\n"));
})();