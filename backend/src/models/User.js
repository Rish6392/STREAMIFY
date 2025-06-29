import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    bio: {
        type: String,
        default: "",
    },
    profilePic: {
        type: String,
        default: "",
    },
    nativeLanguage: {
        type: String,
        default: "",
    },
    learningLanguage: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"

        }
    ]

}, { timestamps: true });

//pre hook
//bcrypt password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    // 123456 => kagdsdi$#@ hash password
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error)
    }
})

// password compare
userSchema.methods.matchPassword =async function(enteresPassword){
    const isPasswordCorrect = await bcrypt.compare(enteresPassword,this.password);
    return isPasswordCorrect;
}

const User = mongoose.model("User", userSchema);




export default User;
