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
            const [result] = await client.objectLocalization(req.file.gcsUrl);
            const objects = result.localizedObjectAnnotations;
            let gender = []
            objects.forEach(object => {
                console.log(object.name.toLowerCase())
                if(object.name.toLowerCase() == 'man' || object.name.toLowerCase() == 'woman'){
                    gender.push(object.name)
                }
                console.log(`Name: ${object.name}`);
                console.log(`Confidence: ${object.score}`);
                const veritices = object.boundingPoly.normalizedVertices;
                veritices.forEach(v => console.log(`x: ${v.x}, y:${v.y}`));
            });
            console.log(gender)
            req.gender = gender
            next()
        } else {
            next()
        }
    } catch (error) {
        console.log(error);
    }
};