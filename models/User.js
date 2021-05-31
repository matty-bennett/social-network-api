const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {

        },
        email: {

        },
        thoughts: [],
        friends: []
    },
    {
        toJSON: {
            virtuals: true
        }
    }
)