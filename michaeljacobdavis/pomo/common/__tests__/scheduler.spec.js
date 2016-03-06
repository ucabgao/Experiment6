/* eslint-env mocha */

import { expect } from 'chai';
import scheduler from '../scheduler';

const options = {
  setCount: 4,
  completedSets: 0,
  shortBreakDuration: 5,
  workDuration: 30,
  longBreakDuration: 15
};

describe('scheduler', () => {
  it('returns an array based on options', () => {
    const result = scheduler(options);

    expect(result[0].duration).to.equal(30);
    expect(result[1].duration).to.equal(5);
    expect(result[2].duration).to.equal(30);
    expect(result[3].duration).to.equal(5);
    expect(result[4].duration).to.equal(30);
    expect(result[5].duration).to.equal(5);
    expect(result[6].duration).to.equal(30);
    expect(result[7].duration).to.equal(15);
  });

  it('adds a work and a break per set', () => {
    const result = scheduler({
      ...options,
      setCount: 2
    });

    expect(result.length).to.equal(4);
  });

  it('adds a longBreakDuration at the end of all sets', () => {
    const result = scheduler({
      ...options,
      setCount: 1
    });

    expect(result[1].duration).to.equal(15);
  });
});
