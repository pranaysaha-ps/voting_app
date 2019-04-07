const express = require('express');
const router = express.Router();
const VotingCandidates = require('../model/votingCandidates');
/* Create new VotingCandidates. */
router.post('/add', (req, res, next) => {
    let candidate = new VotingCandidates({'candidateName':req.body.candidateName});
    candidate.save()
    .then(result => {
      res.json({data: null, message: 'Candidate added successfully', status: 'success'});
    })
    .catch(error => {
      res.status(400).json({data: null, message: 'Failed to add candidate', status: 'fail'});
    });
  });

router.put('/vote', (req, res, next) => {
  VotingCandidates.findOneAndUpdate({ _id: req.body.id},{ $inc: { votingCount: 1 }}, {new: true })
  .then(result => {
    res.json({data: null, message: 'Voted successfully', status: 'success'});
  })
  .catch(error => {
    res.status(400).json({data: null, message: 'Failed to vote', status: 'fail'});
  });
});

router.get('/getCandidates', (req, res, next) => {
  if(!(req.decoded.role === 'USER')) {
    return res.status(401).json({data: null, message: 'Unauthorised!!!', status: 'fail'});
  }
  VotingCandidates.find().select('candidateName')
  .then(votingCandidates => {    
    res.json({data: votingCandidates, message: 'list of candidates', status: 'success'});
  })
  .catch(error => {
    res.status(400).json({data: null, message: 'failed to fetch candidate list', status: 'fail'});
  });
});

router.get('/getCandidatesWithDetails', (req, res, next) => {
  if(!(req.decoded.role === 'ADMIN')) {
    return res.status(401).json({data: null, message: 'Unauthorised!!!', status: 'fail'});
  }
    VotingCandidates.find().select({'candidateName': 1,'votingCount': 1})
    .then(votingCandidates => {    
      res.json({data: votingCandidates, message: 'list of candidates with vote count', status: 'success'});
    })
    .catch(error => {
      res.status(400).json({data: null, message: 'failed to fetch candidate list', status: 'fail'});
    });
  });



module.exports = router;
