import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        
        res.json({success: true, data: users});
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if(!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        
        res.json({success: true, data: user});
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        if (req.params.id !== req.user.id) {
            const error = new Error("You are not the owner of this account");
            error.statusCode = 401;
            throw error;
        }
        
        await User.findByIdAndDelete(req.params.id);

        res.status(204).json({success: true, message: "User deleted successfully"});
    } catch (error) {
        next(error)
    }
}