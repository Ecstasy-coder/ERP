const classDetailsRepository = require("../repositories/classDetailsRepository");

const getClassDetails = async (query = {}) => {
  return await classDetailsRepository.getClassDetails({
    branch_id: query.branch_id,
    class_id: query.class_id,
    section_id: query.section_id,
  });
};

module.exports = {
  getClassDetails,
};
