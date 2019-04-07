const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const votingCandidateSchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
        auto: true,
      },
    candidateName: String,
    votingCount: {type: Number, default: 0}
}, { collection : 'votingCandidates' });

const votingCandidates = mongoose.model('votingCandidates', votingCandidateSchema);
module.exports = votingCandidates;