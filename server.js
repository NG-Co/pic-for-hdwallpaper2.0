const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;
const JSON_FILE_PATH = path.join(__dirname, 'wallpaper.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from current directory

// Performance monitoring for ID generation
let idGenerationStats = {
    totalGenerated: 0,
    collisionAttempts: 0,
    maxCollisionRetries: 0,
    lastReset: new Date().toISOString()
};

// Initialize wallpaper.json if it doesn't exist or is empty
function initializeJsonFile() {
    try {
        if (!fs.existsSync(JSON_FILE_PATH)) {
            fs.writeFileSync(JSON_FILE_PATH, JSON.stringify([], null, 2));
            console.log('Created wallpaper.json file');
        } else {
            const content = fs.readFileSync(JSON_FILE_PATH, 'utf8').trim();
            if (!content) {
                fs.writeFileSync(JSON_FILE_PATH, JSON.stringify([], null, 2));
                console.log('Initialized empty wallpaper.json file');
            }
        }
    } catch (error) {
        console.error('Error initializing JSON file:', error);
    }
}

// Read wallpapers from JSON file
function readWallpapers() {
    try {
        const data = fs.readFileSync(JSON_FILE_PATH, 'utf8');
        const wallpapers = JSON.parse(data);
        
        // Performance warning for large datasets
        if (wallpapers.length > 1000) {
            console.warn(`⚠️  Large dataset detected: ${wallpapers.length} wallpapers. Consider migrating to a proper database for better performance.`);
        }
        
        return wallpapers;
    } catch (error) {
        console.error('Error reading wallpapers:', error);
        return [];
    }
}

// Write wallpapers to JSON file
function writeWallpapers(wallpapers) {
    try {
        fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(wallpapers, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing wallpapers:', error);
        return false;
    }
}

// Routes

// Get all wallpapers (with pagination support)
app.get('/api/wallpapers', (req, res) => {
    try {
        const wallpapers = readWallpapers();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50; // Default 50 per page
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        const paginatedWallpapers = wallpapers.slice(startIndex, endIndex);
        
        res.json({
            wallpapers: paginatedWallpapers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(wallpapers.length / limit),
                totalItems: wallpapers.length,
                itemsPerPage: limit,
                hasNextPage: endIndex < wallpapers.length,
                hasPreviousPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error getting wallpapers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new wallpaper
app.post('/api/wallpapers', (req, res) => {
    try {
        const { url, category, description } = req.body;
        
        // Validate required fields
        if (!url || !category || !description) {
            return res.status(400).json({ 
                error: 'Missing required fields: url, category, and description are required' 
            });
        }

        // Read current wallpapers
        const wallpapers = readWallpapers();
        
        // Check for duplicate URL
        const trimmedUrl = url.trim();
        const existingWallpaper = wallpapers.find(w => w.url === trimmedUrl);
        if (existingWallpaper) {
            return res.status(409).json({ 
                error: 'URL already exists',
                existing: {
                    id: existingWallpaper.id,
                    category: existingWallpaper.category,
                    description: existingWallpaper.description,
                    timestamp: existingWallpaper.timestamp
                }
            });
        }

        // Generate cryptographically secure unique ID
        function generateSecureId() {
            // Use crypto.randomBytes for cryptographically secure randomness
            const bytes = crypto.randomBytes(16);
            
            // Format as UUIDv4
            const hex = bytes.toString('hex');
            return [
                hex.substring(0, 8),
                hex.substring(8, 12),
                '4' + hex.substring(13, 16), // Version 4
                ((parseInt(hex.substring(16, 17), 16) & 0x3) | 0x8).toString(16) + hex.substring(17, 20), // Variant bits
                hex.substring(20, 32)
            ].join('-');
        }

        // Ensure ID uniqueness (highly unlikely with UUIDv4, but good practice)
        function generateUniqueId() {
            let id;
            let attempts = 0;
            const maxAttempts = 10; // Safety limit
            
            do {
                id = generateSecureId();
                attempts++;
                idGenerationStats.collisionAttempts += attempts > 1 ? 1 : 0;
                
                if (attempts > maxAttempts) {
                    throw new Error('Failed to generate unique ID after maximum attempts');
                }
            } while (wallpapers.some(w => w.id === id));
            
            idGenerationStats.totalGenerated++;
            idGenerationStats.maxCollisionRetries = Math.max(idGenerationStats.maxCollisionRetries, attempts - 1);
            
            return id;
        }

        // Create new wallpaper object
        const newWallpaper = {
            id: generateUniqueId(),
            url: trimmedUrl,
            category: category.trim(),
            description: description.trim(),
            timestamp: new Date().toISOString()
        };

        // Add new wallpaper
        wallpapers.push(newWallpaper);
        
        // Write back to file
        const success = writeWallpapers(wallpapers);
        
        if (success) {
            res.status(201).json({
                message: 'Wallpaper added successfully',
                wallpaper: newWallpaper,
                total: wallpapers.length
            });
        } else {
            res.status(500).json({ error: 'Failed to save wallpaper' });
        }
    } catch (error) {
        console.error('Error adding wallpaper:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search wallpapers by description
app.get('/api/wallpapers/search', (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const wallpapers = readWallpapers();
        const searchTerm = q.toLowerCase().trim();
        
        // Search in description and category
        const results = wallpapers.filter(wallpaper => 
            wallpaper.description.toLowerCase().includes(searchTerm) ||
            wallpaper.category.toLowerCase().includes(searchTerm)
        );

        res.json({
            query: q,
            results: results,
            total: results.length
        });
    } catch (error) {
        console.error('Error searching wallpapers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a specific wallpaper by ID
app.delete('/api/wallpapers/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        const wallpapers = readWallpapers();
        const initialCount = wallpapers.length;
        
        // Find the wallpaper to delete
        const wallpaperIndex = wallpapers.findIndex(w => w.id === id);
        
        if (wallpaperIndex === -1) {
            return res.status(404).json({ error: 'Wallpaper not found' });
        }

        const deletedWallpaper = wallpapers[wallpaperIndex];
        
        // Remove the wallpaper
        wallpapers.splice(wallpaperIndex, 1);
        
        // Write back to file
        const success = writeWallpapers(wallpapers);
        
        if (success) {
            res.json({
                message: 'Wallpaper deleted successfully',
                deleted: deletedWallpaper,
                remaining: wallpapers.length
            });
        } else {
            res.status(500).json({ error: 'Failed to delete wallpaper' });
        }
    } catch (error) {
        console.error('Error deleting wallpaper:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Clear all wallpapers
app.delete('/api/wallpapers', (req, res) => {
    try {
        const success = writeWallpapers([]);
        if (success) {
            res.json({ message: 'All wallpapers cleared successfully' });
        } else {
            res.status(500).json({ error: 'Failed to clear wallpapers' });
        }
    } catch (error) {
        console.error('Error clearing wallpapers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get system statistics and health info
app.get('/api/stats', (req, res) => {
    try {
        const wallpapers = readWallpapers();
        const fileStats = fs.statSync(JSON_FILE_PATH);
        
        res.json({
            database: {
                totalWallpapers: wallpapers.length,
                fileSize: `${(fileStats.size / 1024).toFixed(2)} KB`,
                lastModified: fileStats.mtime.toISOString()
            },
            idGeneration: {
                ...idGenerationStats,
                collisionRate: idGenerationStats.totalGenerated > 0 
                    ? (idGenerationStats.collisionAttempts / idGenerationStats.totalGenerated * 100).toFixed(4) + '%'
                    : '0%'
            },
            performance: {
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
                nodeVersion: process.version
            },
            server: {
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reset ID generation statistics (for monitoring/debugging)
app.post('/api/stats/reset', (req, res) => {
    try {
        idGenerationStats = {
            totalGenerated: 0,
            collisionAttempts: 0,
            maxCollisionRetries: 0,
            lastReset: new Date().toISOString()
        };
        res.json({ message: 'ID generation statistics reset successfully', stats: idGenerationStats });
    } catch (error) {
        console.error('Error resetting stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'wallpaper.html'));
});

// Initialize and start server
initializeJsonFile();

app.listen(PORT, () => {
    console.log(`🚀 Wallpaper Manager Server running at http://localhost:${PORT}`);
    console.log(`📝 JSON file location: ${JSON_FILE_PATH}`);
    console.log(`🌐 Open http://localhost:${PORT} in your browser to use the manager`);
});

module.exports = app;
