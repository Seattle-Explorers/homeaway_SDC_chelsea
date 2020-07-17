const _ = require('lodash');

const pickWeighted = (all, weightedThree) => {
  if (Math.random() <= 0.85) {
    const random = Math.random();
    if (random <= 0.33) {
      return weightedThree[0];
    }
    if (random >= 0.67) {
      return weightedThree[1];
    }
    return weightedThree[2];
  }
  return _.sample(all);
};

module.exports = pickWeighted;
