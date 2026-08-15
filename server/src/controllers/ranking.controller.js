import { getFilteredRankings } from '../ranking/ranking.service.js';

export const getRankedCandidates = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { minScore, recommendation, skill, minExp, location, sort } = req.query;

    const rankings = await getFilteredRankings(
      jobId,
      { minScore, recommendation, skill, minExp, location },
      sort
    );

    res.status(200).json({
      success: true,
      message: 'Candidate rankings fetched.',
      data: rankings,
    });
  } catch (error) {
    next(error);
  }
};
