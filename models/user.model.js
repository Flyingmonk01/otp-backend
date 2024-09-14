import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        contact: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        todos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Todo'
            }
        ]
    },
    { timestamps: true }
);
// Pre-save hook to hash the password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.isPasswordCorrect =  async function(password){
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("user", userSchema);
export default User;