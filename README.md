# MosqueConnect

A respectful, community-focused web portal for mosque announcements, prayer times, and events.

## Features
- Home: Prayer times & announcements
- Events Calendar: Add/view events
- Contact/Feedback: Simple form
- Mosque Finder: Search for mosques by location, view nearby mosques, add mosques manually, edit and delete manual entries
- Location autocomplete and real-time suggestions
- Responsive, mobile-first design
- Clean, soft neutral tones with deep accent colors

## Getting Started
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. For map features, ensure you have internet access (uses OpenStreetMap APIs)

## Tech Stack
- React
- Vite
- Tailwind CSS
- react-leaflet & leaflet (map integration)
## Mosque Finder

The Mosque Finder page allows users to:
- Search for mosques by city, area, or use their real location
- View nearby mosques (data from OpenStreetMap)
- Add a mosque manually if not found (name, address, coordinates)
- Edit or delete manually added mosques (with confirmation)
- See error messages for invalid addresses or missing coordinates

### Manual Mosque Entry
- Enter mosque name and address; coordinates are auto-filled if possible
- Latitude/longitude fields are optional
- Error messages are shown inside the modal if address is not found
- Deleting a mosque requires confirmation

### Limitations
- Mosque data is limited by OpenStreetMap coverage
- Manual entries are stored only for the current session (not persisted)

---


## Admin/Public Mode Switch (Demo)

This app includes a toggle to switch between Admin and Public modes. This switch is for demonstration purposes only and does not provide real authentication or security. In a production environment, role-based access should be enforced by a backend server.

When in Admin mode, you can add, edit, and delete announcements and access admin-only features. Public mode restricts these actions.

The switch and admin banner are visible in the UI to make this clear to viewers and reviewers.

## Here is the live link to the site.
mosqueconnect.netlify.app
