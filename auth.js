// making a function to enable the app to protect 
// a particular endpoint from unauthenticated users.

const jwt = require("jasonwebtoken");

module.exports = async (request, response, next) => {
    try {
        // get the token from the authorization header
        const token = await request.headers.authorization.split(" ")[1];
        // Check if the token that was generated matches the token
        // string (RANDOM-TOKEN) matches the suppossed origin
        const decodedToken = await jwt.verify(
            token,
            "RANDOM_TOKEN"
        )
        // retrieve the user details of the logged in users
        const user = await decodedToken;
        // pass the user down to the endpoints here
        request.user = user;
        // pass down functionality to the endpoint
        next();
    } catch (error) {
        response.status(401).json({
            error: new Error("Invalid request!"),
        });
    }
}