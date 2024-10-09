const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String
})

const todoSchema = new Schema({
    userId: ObjectId,
    title: String,
    done: Boolean
})

const UserModel = mongoose.model('User', userSchema);
const TodoModel = mongoose.model('Todo', todoSchema);

module.exports = {
    UserModel, 
    TodoModel
}