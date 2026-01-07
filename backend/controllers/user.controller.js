import User from "../models/user.model.js";
import {createToken} from '../token/createToken.js'

const UserController = {
  register: async (req , res) => {
    try {
            // req.body must match schema fields
            const user = await User.register(req.body);

            const token = createToken(user._id);
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 5 * 24 * 60 * 60 * 1000
            });

            return res.status(201).json({ user , token});
            
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
  }
}

export default UserController;