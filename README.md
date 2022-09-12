# Jobs-RESTful-API

This is a Restful API created with express.js.

Here, a recruiter who wants to hire candidates for his/her company can use this API.
Here, in this API, the recruiter first needs to register for an account. Then, the recruiter can create as many job openings as possible and all the job openings created by the recruiter will be stored in his/her account.

The recruiter also has the option of editing a particular job posting as well as deleting a particular job.

All the data will be stored inside the MongoDB database.

This Restful API is also protected from different malicious activities with the help of packages like helmet.js and xss-clean.

This API also has the feature of restricting users from making too many repeated requests continuously to API endpoints with the help of express-rate-limit.
