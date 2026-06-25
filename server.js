const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3020;

// Enable CORS and parse JSON payloads (allow large payloads for base64 images, and accept text/plain)
app.use(cors());
app.use(express.json({ limit: '50mb', type: ['application/json', 'text/plain'] }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve frontend static files
app.use(express.static(__dirname));

// Ensure directories exist
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

const SUBMISSIONS_FILE = path.join(__dirname, 'submissions.json');

// API Submit Endpoint
app.post('/api/submit', (req, res) => {
    try {
        const data = req.body;
        console.log('Received submission for business:', data.businessName);

        // 1. Process base64 logo upload if available
        let logoPath = 'No Logo Uploaded';
        if (data.logoBase64 && data.logoName) {
            const fileName = `${Date.now()}_${data.logoName.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
            const targetPath = path.join(UPLOADS_DIR, fileName);
            const fileBuffer = Buffer.from(data.logoBase64, 'base64');
            
            fs.writeFileSync(targetPath, fileBuffer);
            logoPath = `/uploads/${fileName}`;
            console.log('Saved uploaded logo to:', logoPath);
        }

        // 1b. Process multiple photo uploads
        let photoPaths = [];
        if (data.photos && data.photos.length > 0) {
            console.log(`Processing ${data.photos.length} photo(s)...`);
            for (const photo of data.photos) {
                const fileName = `${Date.now()}_${photo.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
                const targetPath = path.join(UPLOADS_DIR, fileName);
                const fileBuffer = Buffer.from(photo.base64, 'base64');
                fs.writeFileSync(targetPath, fileBuffer);
                photoPaths.push(`/uploads/${fileName}`);
            }
            console.log(`Saved ${photoPaths.length} photo(s) to uploads/`);
        }

        // 2. Prepare submission object (excluding the raw base64 data to keep JSON clean)
        const submission = {
            id: Date.now(),
            submissionDate: new Date().toISOString(),
            businessName: data.businessName,
            businessAddress: data.businessAddress,
            taxId: data.taxId || 'N/A',
            contactPerson: data.contactPerson,
            desiredDomain: data.desiredDomain,
            requestedEmails: data.requestedEmails,
            ownsDomain: data.ownsDomain,
            domainRegistrar: data.domainRegistrar || 'N/A',
            brandColors: data.brandColors || 'N/A',
            tagline: data.tagline || 'N/A',
            conversionGoals: data.conversionGoals || [],
            existingContent: data.existingContent || 'N/A',
            launchDate: data.launchDate || 'N/A',
            tos: data.tos,
            logoPath: logoPath,
            photoPaths: photoPaths
        };

        // 3. Read current submissions and append the new one
        let submissions = [];
        if (fs.existsSync(SUBMISSIONS_FILE)) {
            try {
                const fileContent = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
                submissions = JSON.parse(fileContent);
            } catch (parseError) {
                console.error('Error parsing submissions file, resetting database.', parseError);
            }
        }
        submissions.push(submission);

        fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf8');
        console.log('Successfully recorded submission inside submissions.json');

        res.status(200).json({ status: 'success', message: 'Blueprint recorded locally.' });
    } catch (error) {
        console.error('Server error processing form submission:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 ONICC Onboarding Local Test Server is live!`);
    console.log(`🔗 Address: http://localhost:${PORT}`);
    console.log(`📁 Submissions Database: submissions.json`);
    console.log(`📁 Logo Uploads Folder: ./uploads/`);
    console.log(`=======================================================`);
});
