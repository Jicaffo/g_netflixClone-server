import "dotenv/config";
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const listsSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    items: [String]
})

const profileSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    img: {
        type: String,
        default: "https://randomuser.me/api/portraits/lego/1.jpg",
        trim: true
    },
    language: {
        type: String,
        require: true, //TOFIX: evaluar si se requiere o viene algo por default
        trim: true
    },
    automaticReproduction: {
        nextEpisode: Boolean,
        trailers: Boolean,
    },
    lists: {
        type: [listsSchema]
    }

});

const usersSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {  
        type: String,
        require: true,
        trim: true,
    },
    role: {
        type:String,
        enum: ["user", "admin"],
        default: "user",
    },
    profiles: {
        type: [profileSchema]
        //profileId: [mongoose.Schema.Types.ObjectId]; // Alternativa mejor, simil DB Relacional, convirtiendo Profile en un nuevo esquema/modelo
    }
});

//encripta
usersSchema.statics.encryptPassword = async (password) => {
    // Al recuperar datos del process.env los trae como string por lo que debemos parsearlo
    const saltRounds = parseInt(process.env.SALT_ROUNDS) 
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  };

//desencripta y compara
usersSchema.statics.comparePassword = async (password, passwordRecibido) => {
return await bcrypt.compare(password, passwordRecibido);
};

export default mongoose.model('User', usersSchema)