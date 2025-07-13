# Tech Test Dashboard - API Integration & Real-Time Features

A Next.js application demonstrating real-time location sharing with SignalR and infinite scroll user feed functionality.

## Features

### 🗺️ Real-Time Location Sharing (SignalR)
- **Location Sender (User A)**: Send live GPS coordinates via SignalR WebSocket
- **Location Receiver (User B)**: Listen to updates and display on interactive map
- **Features**:
  - Real-time WebSocket communication using SignalR
  - Interactive Leaflet map with live location markers
  - GPS location support with fallback to simulated coordinates
  - Connection status indicators and error handling
  - Location history tracking

### 📱 Infinite Scroll User Feed
- **Paginated User List**: Load users from API with infinite scrolling
- **Features**:
  - Intersection Observer for efficient infinite scrolling
  - Skeleton loading states and error handling
  - Responsive user cards with avatar, contact info, and professional details
  - Keyboard navigation and accessibility support
  - Graceful fallback UI for errors

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS
- **Real-time**: SignalR (@microsoft/signalr)
- **Maps**: Leaflet, react-leaflet
- **Infinite Scroll**: react-intersection-observer
- **State Management**: React hooks (useState, useEffect, useCallback)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Real-Time Location Sharing

1. **Open two browser tabs/windows** of the application
2. **In the first tab**:
   - Navigate to "Real-Time Location" feature
   - Switch to "Location Sender (User A)" tab
   - Enter your email as username
   - Click "Start Sharing Location"
   - Allow location access or use simulated coordinates

3. **In the second tab**:
   - Navigate to "Real-Time Location" feature  
   - Switch to "Location Receiver (User B)" tab
   - Click "Start Listening"
   - Watch real-time location updates appear on the map

### Infinite Scroll User Feed

1. Navigate to "User Feed" feature
2. Scroll down to automatically load more users
3. View user details including:
   - Profile image and name
   - Contact information (email, phone)
   - Professional details (job title, university)

## API Endpoints

### SignalR Hub
- **URL**: `https://tech-test.raintor.com/Hub`
- **Send Location**: `SendLatLon(lat, lon, userName)`
- **Receive Location**: `ReceiveLatLon` event

### User API
- **URL**: `https://tech-test.raintor.com/api/users/GetUsersList`
- **Parameters**: `take=10&skip=0`
- **Response**: Paginated user list with total count

## Project Structure

```
src/
├── app/
│   ├── page.jsx                 # Main dashboard page
│   └── globals.css              # Global styles
├── components/
│   ├── LocationSender.jsx       # User A - Send locations
│   ├── LocationReceiver.jsx     # User B - Receive locations
│   ├── MapComponent.jsx         # Leaflet map component
│   ├── UserCard.jsx             # Individual user display
│   ├── InfiniteScrollUserFeed.jsx # Infinite scroll implementation
│   └── RealTimeLocationSharing.jsx # Combined location feature
└── assets/
├   └── images/                  # Static images
├── hooks/
      └── useSignalR.js        # Custom SignalR hook
```

## Key Components

### useSignalR Hook
Custom React hook that encapsulates SignalR connection logic:
- Automatic connection management
- Reconnection handling
- Message sending/receiving
- Error handling

### LocationSender
Component for sending real-time location updates:
- GPS location detection
- Simulated location fallback
- Periodic location broadcasting
- Connection status monitoring

### LocationReceiver  
Component for receiving and displaying location updates:
- Real-time location listening
- Interactive map display
- Location history tracking
- Connection management

### InfiniteScrollUserFeed
Component for paginated user loading:
- Intersection Observer for scroll detection
- Skeleton loading states
- Error boundaries and retry logic
- Responsive user card grid

## Browser Compatibility

- Modern browsers with WebSocket support
- Geolocation API support (for GPS features)
- ES6+ JavaScript features

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

No environment variables required - all APIs are public endpoints.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for demonstration purposes.