import { describe, it } from "node:test";
import assert from "node:assert";
import { spawnSync } from "node:child_process";
import NdJson from "./index.js";
import { Document } from "v8r";

describe("NdJson", function () {
  const expected = [
    new Document({ abc: "def" }),
    new Document({ ghi: "jkl" }),
  ];

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

describe("Integration tests", function () {
  it("lists ndjson as an output-format choice in --help output", function () {
    const result = spawnSync("npx", ["v8r", "--help"], { encoding: "utf8" });
    assert(result.stdout.includes('choices: "ndjson",'), result.stdout);
  });

  it("validates ndjson file and outputs ndjson summary", function () {
    const result = spawnSync(
      "npx",
      [
        "v8r",
        "testfiles/input.ndjson",
        "--schema",
        "testfiles/schema.json",
        "--output-format",
        "ndjson",
      ],
      { encoding: "utf8" },
    );
    const expected = [
      '{"fileLocation":"testfiles/input.ndjson","documentIndex":0,"schemaLocation":"testfiles/schema.json","valid":true,"errors":[],"code":0}',
      '{"fileLocation":"testfiles/input.ndjson","documentIndex":1,"schemaLocation":"testfiles/schema.json","valid":false,"errors":[{"instancePath":"/num","schemaPath":"#/properties/num/type","keyword":"type","params":{"type":"number"},"message":"must be number"}],"code":99}',
    ].join("\n");
    assert.equal(result.stdout.trim(), expected);
  });
});
