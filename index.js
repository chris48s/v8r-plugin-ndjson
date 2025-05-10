import { BasePlugin, Document } from "v8r";

function parse(contents) {
  return contents
    .split(/\n/)
    .filter((doc) => doc !== "")
    .map((doc) => new Document(JSON.parse(doc)));
}

class NdJson extends BasePlugin {
  static name = "v8r-plugin-ndjson";

  registerInputFileParsers() {
    return ["ndjson"];
  }

  parseInputFile(contents, fileLocation, parser) {
    if (parser === "ndjson") {
      return parse(contents);
    } else if (parser == null) {
      if (fileLocation.endsWith(".ndjson") || fileLocation.endsWith(".jsonl")) {
        return parse(contents);
      }
    }
  }

  registerOutputFormats() {
    return ["ndjson"];
  }

  getSingleResultLogMessage(result, format) {
    if (format === "ndjson") {
      return JSON.stringify(result);
    }
  }
}

export default NdJson;
