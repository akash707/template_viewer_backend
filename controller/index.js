const { body } = require('express-validator/check');
const { validationResult } = require('express-validator/check');
const data = require('../data/data.json');
const responseHandler = require('../responseHandler');
const LARGE_IMAGES_PATH = "/static/images/large"
const THUMBNAIL_IMAGES_PATH = "/static/images/thumbnails"

exports.validate = (method) => {
    switch (method) {
        case 'images': {
            return [
                body('pageNo').exists().withMessage('pageNo should be required'),
                body('limit').exists().withMessage('limit should be required'),
                body('pageNo').isInt().withMessage('pageNo should be number'),
                body('limit').isInt().withMessage('limit should be number')
            ]
        }
    }
}

// function to create dynamic image URL's for thumbnail and image to server through API
const handleImageURL = (records) => {
    return records.map((eachRecord)=>{
        if('thumbnail' in eachRecord && eachRecord.thumbnail) {
            eachRecord.thumbnail_image_url = `${THUMBNAIL_IMAGES_PATH}/${eachRecord.thumbnail}`;
        }
        if('image' in eachRecord && eachRecord.image) {
            eachRecord.large_image_url = `${LARGE_IMAGES_PATH}/${eachRecord.image}`;
        }
        return eachRecord;
    });
}

exports.image = async (request, response, next) => {
    try {
        // validation the request body 
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            let messages = errors.array();
            messages = messages.length > 0 && messages.map((message) => message.msg);
            return responseHandler.errorResponse(response, 422, messages);
        }
        const { pageNo, limit } = request.body;
        if ((pageNo <= 0) || (limit <= 0)) {
            return responseHandler.errorResponse(response, 400, "pageNo or limit should be greater than 0");
        }
        // calculating total pages available as per limit
        let totalPages = Math.ceil(data.length / limit);
        // if pageNo passed in request is greater than total pages then we don't return any data
        if (pageNo > totalPages) {
            return responseHandler.errorResponse(response, 400, "Please change pageNo or limit");
        }
        // calculating the last index 
        const end = pageNo * limit;
        // calculating the first index
        const start = end - limit;
        // slicing data as per start and end index
        let finalData = data.slice(start, end);
        if(finalData && finalData.length > 0) {
            finalData = handleImageURL(finalData);
        }
        return responseHandler.successResponse(response, 200, { currentPageNo: pageNo, pagesRemaining: totalPages - pageNo, data: finalData })
    } catch (err) {
        console.log(err);
        return responseHandler.errorResponse(response, 500, "Internal server error");
    }
};