/* eslint-env mocha */

import { expect } from 'chai';
import formatTime from '../format-time';

describe('formatTime', () => {
  it('formats aa duration of miliseconds to min:sec', () => {
    expect(formatTime(126000)).to.equal('02:06');
  });
});
