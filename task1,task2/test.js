const { expect } = require('chai');
const { addIt, compareIt } = require('./Task2');

describe('Task2 Functions', () => {
  it('Added two numbers ', () => {
    const result = addIt(5, 7);
    expect(result).to.equal(12);
  });

  it('Compared two numbers ', () => {
    const result1 = compareIt(5, 5);
    const result2 = compareIt(3, 7);
    expect(result1).to.be.true;
    expect(result2).to.be.false;
  });
});
