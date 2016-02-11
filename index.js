'use strict';

const fs = require('fs');
const path = require('path');

function _tryPath(dirParts) {
  let dir = dirParts.join(path.sep);
  console.log(path.join(dir, 'uniquire.json'));
  return path.join(dir, 'uniquire.json');
}

function _findConfigPath() {
  let dir = __dirname.split(path.sep);

  while (dir.length) {
    let tryPath = _tryPath(dir);
    if (fs.existsSync(tryPath)) {
      console.log(`Found: ${tryPath}`);
      return tryPath;
    }
    dir.pop();
    console.log(dir.length);
  }
  console.log('Config file not found.');
  return '!';
}

let _configPath = null;

function init(configPath) {
  if (!fs.existsSync(configPath)) {
    // If programmer has specified a path and we can't find it, that's an error
    throw new Error(`Uniquire: file '${configPath}' not found.`);
  }
  _configPath = configPath;
}

let _config = null;

function config() {
  if (_config) return _config;
  if (!_configPath) _configPath = _findConfigPath();
  if (_configPath === '!') {
    return (_config = {});
  }
  try {
    let json = fs.readFileSync(_configPath, 'utf-8');
    if (json.length) {
      _config = JSON.parse(json);
    } else {
      _config = {};
    }
    let baseDir = path.dirname(_configPath);
    for (let key of Object.keys(_config)) {
      _config[key] = path.join(baseDir, _config[key]);
    }
    return _config;
  }
  catch (err) {
    throw new Error(`Uniquire: failed to load config ("${err.message}").`);
  }
}

function resolve(identifier) {
  console.log(identifier);
  console.log(JSON.stringify(config()));
  console.log(config()[identifier]);
  return config()[identifier] || identifier;
}

const _mocks = new Map();

function uniquire(identifier) {
  return _mocks.get(identifier) || require(resolve(identifier));
}

uniquire.init = init;

uniquire.mock = function mock(identifier, mockObject) {
  _mocks.set(identifier, mockObject);
};

uniquire.stub = function stub(identifier, stubPath) {
  _mocks.set(identifier, require(stubPath));
};

uniquire.unmock = uniquire.unstub = function unMockOrStub(identifer) {
  _mocks.delete(identifer);
};

uniquire.reset = function reset() {
  _mocks.clear();
};

module.exports = uniquire;