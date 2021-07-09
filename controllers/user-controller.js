const { User } = require('../models');

const userController = {
    //get all users
    getAllUsers(req, res) {
        User.find({})
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(e => {
                console.log(e);
                res.status(400).json(e);
            });
    },

    //get one user by _id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with that id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(e => {
                console.log(e);
                res.status(400).json(e);
            });
    },

    //POST new user
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(e => res.status(400).json(e));
    },

    //POST friend
    addFriend({ params, body }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $push: { friends: params.friendsId } },
            { new: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(e => res.json(e));
    },

    //Delete friend
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $pull: { friends: params.friendsId } },
            { new: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "no user found with this ID" });
                return;
              }
              res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    },

    //PUT (update) user by _id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(e => res.status(400).json(e));
    },

    //delete user by _id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json({ message: 'User successfully deleted!' });
            })
            .catch(e => res.status(400).json(e));
    }
};

module.exports = userController;