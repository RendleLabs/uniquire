/* global describe, it, beforeEach */
'use strict';

const expect = require('chai').expect;

describe('uniquire', () => {

  it('should be loaded', () => {
    let uniquire = require('./node_modules/uniquire/index.js');
    expect(uniquire).to.be.ok;
  });

  it('should resolve my-thing to lib/my-thing.js using config', () => {
    let uniquire = require('./node_modules/uniquire/index.js');
    let myThing = uniquire('my-thing');
    expect(myThing).to.be.ok;
    expect(myThing.found).to.be.ok;
  });

});

