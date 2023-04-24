class ApiFeatures { // this is our main constructor to find the data
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    };

    // Search feature in api
    search() {
        const keyword = this.queryStr.keyword ? 
        // if the keyword is found - it will be searched by the name of the product - like in mongodb
        {
            name: { // regex - regular expression
                $regex: this.queryStr.keyword,
                // small i for case insensitive
                $options: "i",
            },

        } : {};
        // changing the product.find method -  taking the keyword which we create above using name and regex
        this.query = this.query.find({...keyword});
        // returning the class ApiFeatures - this is a by default global  
        return this;
    }


    // to filter the products
    filter(){
        // we have to modify our query str to get the selected output - we need to make a copy of it so our main one don't get disturbed
        const queryCopy = {...this.queryStr}

        // Removing fields for category
        // 1 - keyword b/c we want keyword to search the product
        const removeFields = ["keyword","page","limit"];

        // know how for each works
        removeFields.forEach(key=>delete queryCopy[key]);



        // Filter for Price and Rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);



        // this.query it is equal to product.find() method
        // now query copy is just the category of laptop
        this.query = this.query.find(JSON.parse(queryStr));


        return this;

    }


    // Pagination feature 
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1 ; // 50 product - 10 per page to show so 1 page will show 1st 10 products

    
        // when go to next page we need to skip the products we seen before in the previous page
    
        // eg skip = 10 * (1 - 1 ) // no product will be skip when go to next page skip = 10 * (2-1) =>10 so 10 product from the start will be skipped
        const skip = resultPerPage * (currentPage - 1);

        // limit decides the no of product per page and skip decide which product on which page
        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    
    }


};

module.exports = ApiFeatures;
