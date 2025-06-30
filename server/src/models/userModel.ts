import mongoose, {Schema, Model, Document} from "mongoose";

export interface Iuser extends Document{
    name: string;
    email: string;
    password: string;
    verifyOTP: string;
    verifyOTPExpireAt: number;
    isAccountVerfied: boolean;
    resetOTP: string;
    resetOTPExpireAt: number;
}

const userSchema: Schema<Iuser> = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOTP: {type: String, default:''},
    verifyOTPExpireAt: {type: Number, default: 0},
    isAccountVerfied: {type: Boolean, default: false},
    resetOTP: {type: String, default: ''},
    resetOTPExpireAt: {type: Number, default: 0},

})

const userModel: Model<Iuser> =  mongoose.models.users  || mongoose.model<Iuser>('users', userSchema);

export default userModel;