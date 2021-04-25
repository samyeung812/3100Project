module.exports = {
    authenticateJWT,
    createJWT
};

// Library for JSON Web Token (use for generating JSON web token and authentication)
const jwt = require("jsonwebtoken");

// Secret Key for JTW Encryption and Decryption
const JWT_SECRET_KEY = "2797822dc6bbfd45e3c23caa9307672770651c1618a1cdb29be33d7bb1eeef1840a274ee32a0d86aa9a550c9119fdaba";

// Authenticate JSON Web Token
function authenticateJWT (token, callback) {
    // check whether token input exist
    if (token == null) return callback(false);

    // verify token by secret key
    jwt.verify(token, JWT_SECRET_KEY, (err, res) => {
        if (!err) callback(res);
        else callback(false);
    });
}

function createJWT(data, expires) {
    return jwt.sign(data, JWT_SECRET_KEY, expires);
}