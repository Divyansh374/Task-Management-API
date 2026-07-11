module.exports = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((e) => {
    if (allowedFields.includes(e)) filteredObj[e] = obj[e];
  });

  return filteredObj;
};
