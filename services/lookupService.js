const lookupRepository = require("../repositories/lookupRepository");

const getBranches = async () => {
  return await lookupRepository.getBranches();
};

const getSections = async () => {
  return await lookupRepository.getSections();
};

module.exports = {
  getBranches,
  getSections,
};
