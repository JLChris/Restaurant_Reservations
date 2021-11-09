function asyncErrorBoundary(delegate, defaultStatus) {
    return (request, response, next) => {
        Promise.resolve() // turns callback function into a promise so it can have a catch
            .then(() => delegate(request, response, next)) // call callback function
            .catch((error = {}) => { // throw error if error happens
                const { status = defaultStatus, message = error } = error;
                next({
                    status,
                    message
                });
            });
    };
}

module.exports = asyncErrorBoundary;