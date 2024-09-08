import { describe, it } from "node:test";
import assert from "node:assert";
import NdJson from "./index.js";
import { Document } from "v8r";

const expected = [
  new Document({ abc: "def" }),
  new Document({ ghi: "jkl" }),
];

describe("NdJson", function () {
  describe("parseInputFile", function () {
    it("parses valid ndjson inputs", function () {
      const plugin = new NdJson();
      assert.deepEqual(
        plugin.parseInputFile(
          '{"abc": "def"}\n\n{"ghi": "jkl"}\n\n\n',
          "./file.txt",
          "ndjson",
        ),
        expected,
      );
      assert.deepEqual(
        plugin.parseInputFile(
          '{"abc": "def"}\r\n{"ghi": "jkl"}\r\n',
          "./file.txt",
          "ndjson",
        ),
        expected,
      );
      assert.deepEqual(
        plugin.parseInputFile(
          '  {"abc": "def"} \n   {"ghi": "jkl"}',
          "./file.txt",
          "ndjson",
        ),
        expected,
      );
    });

    it("recognises expected extensions", function () {
      const plugin = new NdJson();
      assert.deepEqual(
        plugin.parseInputFile(
          '{"abc": "def"}\n{"ghi": "jkl"}\n',
          "./file.ndjson",
          null,
        ),
        expected,
      );
      assert.deepEqual(
        plugin.parseInputFile(
          '{"abc": "def"}\n{"ghi": "jkl"}\n',
          "./file.jsonl",
          null,
        ),
        expected,
      );
    });
  });
});
