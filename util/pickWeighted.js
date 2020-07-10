const _ = require('lodash');

const pickWeighted = (all, weightedThree) => {
  if (Math.random() <= 0.85) {
    if (Math.random() <= 0.33) {
      return weightedThree[0];
    }
    if (Math.random() >= 0.67) {
      return weightedThree[1];
    }
    return weightedThree[2];
  }
  return _.sample(all);
};

module.exports = pickWeighted;
