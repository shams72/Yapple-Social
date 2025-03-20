# User Routes Documentation

## Get All Users
**URL:** `api/user/all-users`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Description:**  
Retrieves all users.
---

## Get User By ID
**URL:** `api/user/:id`  
**Method:** `GET`  
**Params:**  
- `id` (string, required): Die ID des Benutzers

**Description:**  
Retrieves a user by their ID.

---

## Get User By Username
**URL:** `api/user/username`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "username": "exampleUsername"
}
```

**Description:**  
Retrieves a user by their username.

---

## Update User
**URL:** `api/user/update`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userId",
  "displayName": "New Display Name",
  "profilePictureUrl": "https://example.com/profile.jpg",
  "bio": "New bio",
  "links": [
    {
      "platform": "Twitter",
      "url": "https://twitter.com/example"
    }
  ]
}
```

**Description:**  
Updates a user's information.

---

## Delete User
**URL:** `api/user/delete/:id`  
**Method:** `DELETE`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `id` (string, required): Die ID des Benutzers

**Description:**  
Deletes a user by their ID.

---

## Add Follower
**URL:** `api/user/add-follower`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userId",
  "followerId": "followerId"
}
```

**Description:**  
Adds a follower to a user.

---

## Remove Follower
**URL:** `api/user/remove-follower`  
**Method:** `POST`  

**Body:**  
```json
{
  "id": "userId",
  "followerId": "followerId"
}
```

**Description:**  
Removes a follower from a user.

---

## Add Following
**URL:** `api/user/add-following`  
**Method:** `POST`  

**Body:**  
```json
{
  "id": "userId",
  "followingId": "followingId"
}
```

**Description:**  
Adds a following person to a user.

---

## Remove Following
**URL:** `api/user/remove-following`  
**Method:** `POST`  

**Body:**  
```json
{
  "id": "userId",
  "followingId": "followingId"
}
```

**Description:**  
Removes a following from a user.

---

## Add Post
**URL:** `api/user/add-post`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userId",
  "postId": "postId"
}
```

**Description:**  
Adds a post to a user.

---

## Remove Post
**URL:** `api/user/remove-post`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userId",
  "postId": "postId"
}
```

**Description:**  
Removes a post from a user.

---

## Get Suggestions
**URL:** `api/user/get-suggestions`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userId",
  "page": 0
}
```

**Description:**  
Retrieves ten user recommendations.

---

## Update Banner
**URL:** `api/user/update-banner`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userId",
  "url": "banner.jpg"
}
```

**Description:**  
Updates a user's banner image.
---

## Update Profile
**URL:** `api/user/update-profile`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userID",
  "url": "profile.jpg"
}
```

**Description:**  
Updates a user's profile picture.