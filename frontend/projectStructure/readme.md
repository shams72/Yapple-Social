## Project Structure

```
yapple-social/frontend/
├── src/
│   ├── App.tsx                # Main application component with routing
│   ├── Layout.tsx             # Root layout with navigation
│   ├── main.tsx              # Application entry point
│   │
│   ├── components/           # Reusable UI components
│   │   ├── Post.tsx          # Post display component
│   │   ├── Toast.tsx         # Toast notification system
│   │   ├── navbar.tsx        # Navigation bar
│   │   └── ProtectedRoute.tsx # Route protection wrapper
│   │
│   ├── context/             # React Context providers
│   │   ├── communityContext.tsx  # Community state management
│   │   ├── postContext.tsx       # Post state management
│   │   └── userContext.tsx       # User state management
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts        # Authentication hook
│   │   ├── useToast.tsx      # Toast notifications
│   │   └── useWebsocket.ts   # WebSocket connection
│   │
│   ├── pages/
│   │   ├── community-page/    # Community features
│   │   │   ├── viewCommunity.tsx     # Community view page
│   │   │   ├── uploadCommunityImages.tsx # Image upload handling
│   │   │   ├── editCommunityModal.tsx # Community settings modal
│   │   │   ├── createCommunityPost.tsx # Post creation in community
│   │   │   ├── communityInfo.tsx     # Community details display
│   │   │   ├── addLinks.tsx         # Community links management
│   │   │   └── communityHeader/     # Community header components
│   │   │
│   │   ├── create-page/      # Content creation
│   │   │   ├── createCommunity.tsx  # Community creation form
│   │   │   └── create-page.tsx      # Creation page layout
│   │   │
│   │   ├── home-page/        # Main feed
│   │   │   ├── allPost.tsx         # Post feed with infinite scroll
│   │   │   └── postStructure.tsx   # Post layout structure
│   │   │
│   │   ├── login-page/       # Authentication
│   │   │   ├── Layout.tsx          # Login page layout
│   │   │   └── components/
│   │   │       └── Error.tsx       # Error handling
│   │   │
│   │   ├── post-page/        # Individual post view
│   │   │   └── PostPage.tsx        # Single post display
│   │   │
│   │   └── user-page/        # User profile features
│   │       ├── UserPage.tsx        # User profile page
│   │       └── components/
│   │           ├── DiscussionBox.tsx     # Real-time chat
│   │           ├── EditProfileModal.tsx   # Profile editing
│   │           ├── FriendList.tsx        # Following/Followers
│   │           ├── FriendsSuggestion.tsx # Friend recommendations
│   │           ├── Posts.tsx             # User posts display
│   │           ├── UserCard.tsx          # User preview card
│   │           └── UserPageContent.tsx   # Profile content layout
│   │
│   └── store/               # Global state management
       └── WebSocketContext.tsx # WebSocket state provider
```