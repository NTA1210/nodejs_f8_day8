class PaginationService {
    apply(service) {
        if (!service.model) {
            throw Error("Model is required for pagination");
        }

        service.pagination = async (page, limit = 20, filters) => {
            const offset = (page - 1) * limit;
            const rows = await service.model.findAll(limit, offset, filters);
            const count = await service.model.count();
            const pagination = {
                current_page: page,
                total: count,
                per_page: limit,
            };
            if (rows.length) {
                pagination.from = offset + 1;
                pagination.to = offset + rows.length;
            }
            return {
                rows,
                pagination,
            };
        };
    }
}

module.exports = new PaginationService();
