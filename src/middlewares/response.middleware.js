const response = (_, res, next) => {
    res.success = (data, status = 200, passProps = {}) => {
        res.status(status).json({
            status: "success",
            data,
            ...passProps,
        });
    };

    res.paginate = ({ rows, pagination }) => {
        res.success(rows, 200, { pagination });
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
