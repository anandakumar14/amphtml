/**
 * Copyright 2016 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as object from '../../src/utils/object';

describe('Object', () => {
  it('hasOwn works', () => {
    expect(object.hasOwn(object.map(), 'a')).to.be.false;
    expect(object.hasOwn(object.map({'a': 'b'}), 'b')).to.be.false;
    expect(object.hasOwn(object.map({'a': {}}), 'a')).to.be.true;
  });

  describe('map', () => {
    it('should make map like objects', () => {
      expect(object.map().prototype).to.be.undefined;
      expect(object.map().__proto__).to.be.undefined;
      expect(object.map().toString).to.be.undefined;
    });

    it('should make map like objects from objects', () => {
      expect(object.map({}).prototype).to.be.undefined;
      expect(object.map({}).__proto__).to.be.undefined;
      expect(object.map({}).toString).to.be.undefined;
      expect(object.map({foo: 'bar'}).foo).to.equal('bar');
      const obj = {foo: 'bar', test: 1};
      expect(object.map(obj).test).to.equal(1);
      expect(object.map(obj)).to.not.equal(obj);
    });
  });

  describe('getPath', () => {
    const obj = {a: {aa: [{aaa: 1}, {bbb: 2}]}, b: 3, c: null};

    it('should return the value of a single property', () => {
      expect(object.getPath(obj, 'b')).to.equal(3);
    });

    it('should return the value of a deeply nested property', () => {
      expect(object.getPath(obj, 'a.aa[0].aaa')).to.equal(1);
    });

    it('should return the value of a sub-object', () => {
      expect(object.getPath(obj, 'a.aa')).to.jsonEqual(obj.a.aa);
    });

    it('should throw when a key cannot be found', () => {
      expect(() => object.getPath(obj, 'foo')).to.throw(/foo/);
      expect(() => object.getPath(obj, 'foo.bar')).to.throw(/foo\.bar/);
      expect(() => object.getPath(obj, 'a.foo')).to.throw(/a\.foo/);
      expect(() => object.getPath(obj, 'a.aa.bar')).to.throw(/a\.aa\.bar/);
      expect(() => object.getPath(obj, 'a.c.bar')).to.throw(/a\.c\.bar/);
    });

    it('should throw for invalid paths', () => {
      const obj = {'.': {'.': 0}}; // not supported
      expect(() => object.getPath(obj, '...')).to.throw();
    });
  });
});
