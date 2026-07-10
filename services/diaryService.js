const diaryRepository = require("../repositories/diaryRepository");
const { getPaginationParams } = require("../helpers/pagination");

const createDiary = async (data) => {
  return await diaryRepository.createDiary(data);
};

const editDiary = async (id, data) => {
  return await diaryRepository.editDiary(id, data);
};

const deleteDiary = async (id) => {
  return await diaryRepository.deleteDiary(id);
};

const getDiaries = async (query = {}) => {
  const { page, limit, offset } = getPaginationParams(query);
  return await diaryRepository.getDiaries({
    page,
    limit,
    offset,
    date: query.date,
  });
};

module.exports = {
  createDiary,
  editDiary,
  deleteDiary,
  getDiaries,
};
