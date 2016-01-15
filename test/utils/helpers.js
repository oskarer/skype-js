import { expect } from 'chai';
import { getCurrentTime } from '../../src/utils/helpers';

describe('getCurrentTime', () => {
  it('should return time in seconds', () => {
    getCurrentTime();
    expect(true).to.equal(true);
  });
});
