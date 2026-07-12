exports.filterObj = (obj, ...allowedFields) => {
  const result = {};
  Object.keys(obj).forEach((e) => {
    if (allowedFields.includes(e)) result[e] = obj[e];
  });

  return result;
};

exports.excludeObj = (obj, ...excludedFields) => {
  const result = {};
  Object.keys(obj).forEach((e) => {
    if (!excludedFields.includes(e)) result[e] = obj[e];
  });
  return result;
};
