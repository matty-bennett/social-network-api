const { Thought, User } = require('../models');

const thoughtController = {
    // get all thoughts
    getAllThoughts(req,res) {
        Thought.find({})
        .select('-__v')
        .sort({_id: -1})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(e => {
            console.log(e);
            res.status(400).json(e);
        });
    
    },
    // get one thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({_id: params.id})
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(e => {
                console.log(e);
                res.status(400).json(e);
            });
    },
    // POST new thought
    createThought({body}, res) {
        Thought.create(body)
            .then(dbThoughtData => {
                return User.findOneAndUpdate(
                    { username: dbThoughtData.username  },
                    { $push: { thoughts: dbThoughtData._id } },
                    { new: true }
                )
            })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(e => res.status(400).json(e));
    },
    // update thought by id
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.id}, body, { new: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(e => res.status(400).json(e));
    },
    // delete thought by id
    deleteThought({params}, res) {
        Thought.findOneAndDelete({ _id: params.id })
             .then(dbThoughtData => {
                 if (!dbThoughtData) {
                     res.status(404).json({ message: 'No thought found with this id' });
                     return;
                 }
                 res.json(dbThoughtData);
             })
            //    () => {
            //     return User.findOneAndUpdate(
            //         { _id: params.userId },
            //         { $pull: { thoughts: params.thoughtId } },
            //         { new: true }
            //     )
            //     .then(dbUserData => {
            //         if (!dbThoughtData) {
            //             res.status(404).json({ message: 'No thought found with this id' });
            //             return;
            //         }
            //         res.json({ message: 'Thought successfully deleted!' });
            //     })
                .catch(e => res.status(400).json(e));
    },
    // POST new reaction
    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true }
        )
            // .select('-__v')
            .then(dbThoughtData => {

                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with that id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(e => res.json(e));
    },
    // delete reaction by id
    deleteReaction({params}, res) {
        Thought.findOne(
            { _id: params.thoughtId },
        )
        .then(dbThoughtData => {
            dbThoughtData.reactions.pull(params.reactionId)
            return dbThoughtData.save();
        })
        // .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => res.json(err));
    },
};

module.exports = thoughtController;
