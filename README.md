# Wallpaper Content Manager

A simple web-based tool for managing wallpaper data with automatic JSON file updates.

## Features

- ✅ **Auto-save**: Data is automatically saved to `wallpaper.json` when added
- ✅ **Live Preview**: Real-time preview of wallpaper data as you type
- ✅ **Image Preview**: See actual wallpaper image while typing the URL
- ✅ **URL Uniqueness**: Prevents duplicate URLs from being added
- ✅ **Search & Filter**: Search wallpapers by description or category
- ✅ **Individual Delete**: Delete specific wallpapers from search results
- ✅ **Real-time preview**: Live JSON preview of all data
- ✅ **Categories**: Pre-defined wallpaper categories
- ✅ **Unique IDs**: Automatically generates UUID for each wallpaper
- ✅ **Timestamps**: Automatic timestamp for each entry
- ✅ **Backup options**: Copy to clipboard and download functionality
- ✅ **Clear all data**: Option to clear all data with confirmation
- ✅ **Connection status**: Shows server status and data count

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

## How It Works

- **Backend**: Node.js server with Express that handles API requests
- **Frontend**: HTML form that sends data to the server
- **Storage**: Data is automatically saved to `wallpaper.json`
- **API Endpoints**:
  - `GET /api/wallpapers` - Get all wallpapers
  - `POST /api/wallpapers` - Add a new wallpaper (with URL uniqueness check)
  - `GET /api/wallpapers/search?q=term` - Search wallpapers by description/category
  - `DELETE /api/wallpapers/:id` - Delete a specific wallpaper
  - `DELETE /api/wallpapers` - Clear all wallpapers

## File Structure

```
wallpaper 2.0/
├── wallpaper.html      # Frontend interface
├── wallpaper.json      # Auto-updated data storage
├── server.js          # Backend API server
├── package.json       # Node.js dependencies
└── README.md          # This file
```

## Data Format

Each wallpaper entry contains:
```json
{
  "id": "unique-uuid-here",
  "url": "https://example.com/wallpaper.jpg",
  "category": "Abstract",
  "description": "Beautiful abstract wallpaper",
  "timestamp": "2025-07-21T14:02:17.321Z"
}
```

## Categories Available

- Floral and Botanical
- Textured and Embossed
- Murals and Scenic
- Geometric
- Metallics and Glam
- Abstract
- Vintage and Retro
- Kids and Themed
- Peel and Stick
- Non-Woven
- Memes

## Usage

1. **Start typing** in any form field to see the live preview appear
2. **Live Preview** shows exactly how your wallpaper data will look:
   - �️ **Image Preview** = See the actual wallpaper image (when URL is valid)
   - �🟢 Green border = All fields complete, ready to add
   - 🟠 Orange border = Missing required fields
   - ⏰ Real-time timestamp updates every second
   - 🆔 Preview UUID (actual UUID will be different)
3. **Image Preview Features**:
   - 🔄 Loading spinner while image loads
   - ❌ Error message if image fails to load
   - 🖱️ Hover effect for better interaction
   - 📏 Auto-resize to fit container (max 256px height)
4. **Fill out all fields** with wallpaper URL, category, and description
5. **Click "Add Wallpaper"** - system checks for URL uniqueness before adding
6. Data is automatically saved to `wallpaper.json`
7. Use the **search feature** to find specific wallpapers by description or category
8. **Delete individual wallpapers** from search results if needed
9. View real-time JSON preview of all data
10. Use backup options (copy/download) if needed

### Search & Delete Features

- **Search**: Enter keywords to find wallpapers by description or category
- **Delete**: Use the delete button next to search results to remove specific wallpapers
- **Show All**: Click to return to viewing all wallpapers

## Notes

- Server must be running for auto-save functionality
- **URLs must be unique** - duplicates will be rejected with a helpful error message
- Data persists in `wallpaper.json` between server restarts
- All form fields are required
- URLs are validated for proper format
- Search is case-insensitive and matches partial text




## Floral and Botanical:
This includes oversized florals, lush jungle prints, and natural motifs.

##Textured and Embossed:
Think grasscloth, linen effects, and faux finishes like wood, brick, or concrete.

Murals and Scenic: Large-scale designs or photographic images that create a dramatic focal point.

Geometric: Modern, often bold patterns with clean lines and shapes.

Metallics and Glam: Wallpapers with a shimmering or reflective surface for an elegant touch.

Abstract: Artistic, non-representational designs with unique colors and forms.

Vintage and Retro: Styles that evoke past eras, often updated with modern color palettes.

Kids and Themed: Playful and imaginative designs specifically for children's spaces.

Peel and Stick: Popular for its ease of application and removal, especially for renters.

Non-Woven: Valued for being easy to install ("paste the wall") and generally breathable.