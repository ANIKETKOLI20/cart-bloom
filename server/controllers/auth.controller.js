
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/generateToken.js'

export const signup = async ( req , res) => {
    try {
        const { fullName , email ,username , password} = req.body
    
    if (!fullName || !email || !username || !password) {
        return res.status(400).json({ error : "All fields are required" })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email" })
    }

    const existingUser = await User.findOne({ username });
	if (existingUser) {
		return res.status(400).json({ error: "Username is already taken" });
	}

	const existingEmail = await User.findOne({ email });
	if (existingEmail) {
		return res.status(400).json({ error: "Email is already taken" });
	}


    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const newUser = new User({
        fullName,
        email,
        username,
        password: hashedPassword,
    })
    
   if(newUser){
        generateToken(newUser.id , res)
        await newUser.save()

        res.status(201).json({ 
            id: newUser.id,
            fullName: newUser.fullName,
            email: newUser.email,
            username: newUser.username,
            role: newUser.role,
     })
   }
   else{
         res.status(400).json({error: "Invalid user data"})
   }
    } catch (error) {
        console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }


}

export const login = async( req , res ) => {
    try {
        const { email , password } = req.body
    
    if (!email ||!password) {
        return res.status(400).json({ error: "All fields are required" })
    }

    const existingEmail = await User.findOne({ email });
    if (!existingEmail) {
        return res.status(400).json({ error: "Invalid credentials" });
    }   
    
    const isMatch = await bcrypt.compare(password, existingEmail.password);

    if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    generateToken(existingEmail.id , res)

    res.json({
        id: existingEmail.id,
        fullName: existingEmail.fullName,
        email: existingEmail.email,
        username: existingEmail.username,
        role: existingEmail.role,
        
    })
    } catch (error) {
        console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}

export const logout = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};