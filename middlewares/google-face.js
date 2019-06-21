// Imports the Google Cloud client library
const vision = require("@google-cloud/vision");
// Creates a client
const client = new vision.ImageAnnotatorClient({
    keyFilename: process.env.CLOUD_VISION
});

module.exports = async function generateFaces(req, res, next) {
    try {
        // Performs Object detection on the image file
        if (req.file) {
            const [result] = await client.faceDetection(
                req.file.gcsUrl
            );
            const faces = result.faceAnnotations;
            console.log('Faces:');
            let emotion = []
            faces.forEach((face, i) => {
                if(face.joyLikelihood !== `VERY_UNLIKELY`){
                    emotion.push('joy')
                }
                else if(face.angerLikelihood !== `VERY_UNLIKELY`){
                    emotion.push('anger')
                }
                else if(face.sorrowLikelihood !== `VERY_UNLIKELY`){
                    emotion.push('sorrow')
                } 
                else if(face.surpriseLikelihood !== `VERY_UNLIKELY`){
                    emotion.push('surprise')
                }
            });
            req.emotion = emotion
            next()
        } else {
            next()
        }
    } catch (error) {
        console.log(error);
    }
};