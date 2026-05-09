const Expert = require("../models/Expert");

exports.getExperts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            category,
            minExperience,
            minRating
        } = req.query;

        // Build query object
        const query = {};

        // Search by name or category (case-insensitive)
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ];
        }

        // Filter by category (exact match, if provided and not searching by it)
        if (category) {
            query.category = category;
        }

        // Filter by experience (greater than or equal to)
        if (minExperience) {
            query.experience = { $gte: Number(minExperience) };
        }

        // Filter by rating (greater than or equal to)
        if (minRating) {
            query.rating = { $gte: Number(minRating) };
        }

        // Pagination setup
        const skip = (Number(page) - 1) * Number(limit);

        // Fetch data
        const experts = await Expert.find(query)
            .skip(skip)
            .limit(Number(limit));

        // Get total count for pagination
        const total = await Expert.countDocuments(query);

        res.status(200).json({
            success: true,
            count: experts.length,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            data: experts,
        });
    } catch (error) {
        console.error("Error in getExperts:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get single expert by ID
exports.getExpertById = async (req, res) => {
    try {
        const expert = await Expert.findById(req.params.id);
        if (!expert) {
            return res.status(404).json({ success: false, message: "Expert not found" });
        }
        res.status(200).json({
            success: true,
            data: expert
        });
    } catch (error) {
        console.error("Error in getExpertById:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

