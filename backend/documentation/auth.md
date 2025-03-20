# Auth Routes Documentation

## Sign In
**URL:** `api/auth/sign-in`  
**Method:** `POST`  
**Body:**  
```json
{
  "username": "exampleUsername",
  "password": "examplePassword"
}
```

**Description:**  
Logs in a user and returns a JWT token.

---

## Sign Up
**URL:** `api/auth/sign-up`  
**Method:** `POST`  
**Body:**  
```json
{
  "username": "exampleUsername",
  "password": "examplePassword",
  "displayName": "Example Display Name", // Optional
  "profilePictureUrl": "profile.jpg", // Optional, 
  "bio": "Example bio", // Optional
  "links": [ // Optional
    {
      "platform": "Twitter",
      "url": "https://twitter.com/example"
    }
  ],
  "joinedAt": "2024-02-21T12:00:00.000Z", // Optional
  "posts": ["postID"], // Optional
  "followers": ["followerIDs"], // Optional
  "following": ["follwingsIDs"] // Optional
}

```

**Description:**  
Registers a new user and returns a JWT token.