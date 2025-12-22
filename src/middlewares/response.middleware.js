const response = (_, res, next) => {
    res.success = (data, status = 200) => {
        res.status(status).json({
            status: "success",
            data,
        });
    };

    res.error = (error, status = 500) => {
        res.status(status).json({
            status: "error",
            error,
        });
    };

    next();
};

module.exports = response;
