const classRepository = require("../repositories/classRepository");
const messages = require("../constants/messages");
const { getPaginationParams } = require("../helpers/pagination");

const createClass = async (data) => {
  const existingName = await classRepository.findByClassName(data.class_name);
  if (existingName) {
    const error = new Error(messages.CLASS_NAME_EXISTS);
    error.statusCode = 409;
    throw error;
  }

  return await classRepository.createClass(data);
};

const getAllClasses = async (query = {}) => {
  const { page, limit, offset } = getPaginationParams(query);
  return await classRepository.getAllClasses({
    search: query.search,
    page,
    limit,
    offset,
  });
};

const getClassById = async (id) => {
  const classRecord = await classRepository.getClassById(id);
  if (!classRecord) {
    const error = new Error(messages.CLASS_NOT_FOUND);
    error.statusCode = 404;
    throw error;
  }

  return classRecord;
};

const updateClass = async (id, data) => {
  const existingClass = await classRepository.getClassById(id);
  if (!existingClass) {
    const error = new Error(messages.CLASS_NOT_FOUND);
    error.statusCode = 404;
    throw error;
  }

  if (data.class_name && data.class_name !== existingClass.class_name) {
    const duplicateName = await classRepository.findByClassName(data.class_name);
    if (duplicateName) {
      const error = new Error(messages.CLASS_NAME_EXISTS);
      error.statusCode = 409;
      throw error;
    }
  }

  return await classRepository.updateClass(id, data);
};

const deleteClass = async (id) => {
  const existingClass = await classRepository.getClassById(id);
  if (!existingClass) {
    const error = new Error(messages.CLASS_NOT_FOUND);
    error.statusCode = 404;
    throw error;
  }

  return await classRepository.deleteClass(id);
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
};