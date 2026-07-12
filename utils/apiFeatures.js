const { excludeObj } = require("./ObjectUtils");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let filterObj = {};
    const queryObj = excludeObj(
      this.queryString,
      "page",
      "limit",
      "fields",
      "sort",
    );
    if (queryObj.search) {
      filterObj.$or = [
        { title: { $regex: queryObj.search, $options: "i" } },
        { description: { $regex: queryObj.search, $options: "i" } },
      ];
    }

    if (queryObj.priority) {
      filterObj.priority = queryObj.priority;
    }

    if (queryObj.completed) {
      filterObj.completed = queryObj.completed;
    }

    if (queryObj.dueBefore || queryObj.dueAfter) {
      filterObj.dueDate = {};
    }

    if (queryObj.dueBefore) {
      filterObj.dueDate.$lt = new Date(queryObj.dueBefore);
    }

    if (queryObj.dueAfter) {
      filterObj.dueDate.$gt = new Date(queryObj.dueAfter);
    }

    this.query = this.query.find(filterObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("_id");
    }
    return this;
  }

  limitFields() {
    if (this.query.fields) {
      const fields = this.query.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-_v");
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
