const classDiaryRepository = require("../repositories/classDiaryRepository");
const { getPaginationParams } = require("../helpers/pagination");

const createDiary = async (data) => {
  return await classDiaryRepository.createDiary(data);
};

const getDiaries = async (query = {}) => {
  const { page, limit, offset } = getPaginationParams(query);
  return await classDiaryRepository.getDiaries({
    branch_id: query.branch_id,
    class_id: query.class_id,
    section_id: query.section_id,
    page,
    limit,
    offset,
  });
};

const getDiaryById = async (id) => {
  return await classDiaryRepository.getDiaryById(id);
};

const updateDiary = async (id, data) => {
  return await classDiaryRepository.updateDiary(id, data);
};

const deleteDiary = async (id) => {
  return await classDiaryRepository.deleteDiary(id);
};

module.exports = {
  createDiary,
  getDiaries,
  getDiaryById,
  updateDiary,
  deleteDiary,
};
