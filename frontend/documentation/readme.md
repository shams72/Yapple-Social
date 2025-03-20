
## Component Documentation

### Core Components
- **App.tsx**: Main application component with routing setup and context providers
- **Layout.tsx**: Root layout component with navigation structure
- **main.tsx**: Application entry point with provider wrapping

### Community Features
- **viewCommunity.tsx**: Main community view with posts and member list
- **uploadCommunityImages.tsx**: Image upload for community banners and avatars
- **editCommunityModal.tsx**: Community settings and customization
- **createCommunityPost.tsx**: Post creation within communities
- **communityInfo.tsx**: Community details and statistics display
- **addLinks.tsx**: External links management for communities

### Content Creation
- **createCommunity.tsx**: Community creation wizard
- **create-page.tsx**: Generic content creation layout

### Post Management
- **allPost.tsx**: Main feed with infinite scroll and filtering
- **postStructure.tsx**: Post layout and rendering template
- **PostPage.tsx**: Individual post view with comments

### User Profile Features
- **DiscussionBox.tsx**: Real-time chat with WebSocket integration
- **EditProfileModal.tsx**: Profile customization and settings
- **FriendList.tsx**: Following/Followers management
- **FriendsSuggestion.tsx**: Friend recommendations with infinite scroll
- **Posts.tsx**: User-specific post display
- **UserCard.tsx**: User preview with quick actions
- **UserPageContent.tsx**: Profile page layout and organization

### Authentication
- **Layout.tsx** (login-page): Authentication page structure
- **Error.tsx**: Error handling and user feedback

## State Management

### Context Providers
- **communityContext.tsx**: Community data and infinite scroll
- **postContext.tsx**: Post types and states
- **userContext.tsx**: User profile and auth state
- **WebSocketContext.tsx**: Real-time communication

### Custom Hooks
- **useAuth**: Authentication and token management
- **useToast**: Toast notification system
- **useWebsocket**: WebSocket connection handling
