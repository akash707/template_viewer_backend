exports.successResponse = (response, statusCode, data) => {
    return response.status(statusCode).json({ statusCode:statusCode, data: data });
}

exports.errorResponse = (response, statusCode, message) => {
    return response.status(statusCode).json({ statusCode:statusCode, errors: message });
}