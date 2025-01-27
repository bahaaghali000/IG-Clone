class Apifeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter(search) {
    const queryObj = { ...this.queryStr };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((element) => delete queryObj[element]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    let dbQueryObj = JSON.parse(queryStr);

    // Implement search functionality
    if (this.queryStr.search) {
      dbQueryObj = {
        ...dbQueryObj,
        $or: search,
      };
    }

    this.query = this.query.find(dbQueryObj);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = +this.queryStr.page || 1;
    const limit = +this.queryStr.limit || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // if(this.queryStr.page){
    //     const moviesCount = await Movie.countDocuments();
    //     if(skip >= moviesCount){
    //         throw new Error("This page is not found!");
    //     }
    // }

    return this;
  }
}

module.exports = Apifeatures;
