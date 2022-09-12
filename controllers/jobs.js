const { StatusCodes } = require('http-status-codes');

const { BadRequestError, NotFoundError, UnauthenticatedError } = require('./../errors');


const Job = require('./../models/Job');


const getAllJobs = async (req, res) => {

    const jobsOfAuthentiatedUser = await Job.find({ createdBy: req.user.userId }).sort('createdAt');

    res.status(StatusCodes.OK).json({
        success: 'true',
        message: `all jobs of ${req.user.fullname} has been fetched successfully`,
        totalJobs: jobsOfAuthentiatedUser.length,
        jobs: jobsOfAuthentiatedUser
    });

};

const getSingleJob = async (req, res) => {

    const { user: { userId }, params: { id: jobId } } = req;

    const jobOfAuthenticatedUser = await Job.findOne({ _id: jobId, createdBy: userId });

    if (!jobOfAuthenticatedUser) {

        throw new NotFoundError(`No job with ID ${jobId} found in your account`);

    }

    res.status(StatusCodes.OK).json({
        success: 'true',
        message: `job with ID ${jobId} has been fetched successfully`,
        jobs: jobOfAuthenticatedUser
    });

};

const createJob = async (req, res) => {

    const job = await Job.create({ ...req.body, createdBy: req.user.userId });


    res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'job created successfully',
        job
    });

};


const updateJob = async (req, res) => {

    const { body: { company, position }, user: { userId }, params: { id: jobId } } = req;


    if (!(company && position)) {

        throw new BadRequestError('Company or Position fields cannot be empty');
        
    }

    if (!await Job.findOne({ _id: jobId, createdBy: userId })) {

        throw new UnauthenticatedError(`No job with ID ${jobId} found in your account`);
    }

    const updatedJobOfAuthenticatedUser = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, { new: true, runValidators: true });

    res.status(StatusCodes.OK).json({
        success: 'true',
        message: `job with ID ${jobId} has been edited successfully`,
        jobs: updatedJobOfAuthenticatedUser
    });

};

const deleteJob = async (req, res) => {

    const { user: { userId }, params: { id: jobId } } = req;


    if (!await Job.findOne({ _id: jobId, createdBy: userId })) {

        throw new UnauthenticatedError(`No job with ID ${jobId} found in your account`);
    }

    await Job.findOneAndRemove({ _id: jobId, createdBy: userId });


    res.status(StatusCodes.OK).json({
        success: 'true',
        message: `job with ID ${jobId} has been deleted successfully`
    });

};


module.exports = {
    getAllJobs,
    getSingleJob,
    createJob,
    updateJob,
    deleteJob
};

