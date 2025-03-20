# Post Routes Documentation

## Create Normal Post
**URL:** `api/posts/create-normal-post`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userId",
  "author": "userId",
  "title": "Post Title",
  "postType": "normal",
  "body": "postBodyId",
  "community": "communityId" // optional,required when setting up a community post
}
```

**Description:**  
- Create a normal post.
- Set communtiy ID when creating a community post

---

## Create Time Capsule Post
**URL:** `api/posts/create-time-capsule-post`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userId",
  "author": "userId",
  "title": "Post Title",
  "postType": "timeCapsule",
  "body": "postBodyId",
  "revealAt": "2023-12-31T23:59:59.999Z",
  "expiresAt": "2123-12-31T23:59:59.999Z",
  "community": "communityId" // optional,required when setting up a community post
}
```

**Description:**  
- Create a Time Capsule post.
- Set communtiy ID when creating a community post

---

## Create Self Destruct Post
**URL:** `api/posts/create-self-destruct-post`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userId",
  "author": "userId",
  "title": "Post Title",
  "postType": "selfDestruct",
  "body": "postBodyId",
  "expiresAt": "2023-12-31T23:59:59.999Z",
  "community": "communityId" // optional,required when setting up a community post
}
```

**Description:**  
- Creates a self-destructing post.
- Set communtiy ID when creating a community post.

---

## Get Post By ID
**URL:** `api/posts/get-posts-by-id/:postID/:id`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `postID` (string, required): postID
- `id` (string, required): userID

**Description:**  
Retrieves a post by its ID.

---

## Get All Posts
**URL:** `api/posts/get-all-post`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Description:**  
Retrieves all posts.

---

## Get User Post Count
**URL:** `api/posts/get-user-post-count/:id`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `id` (string, required): userID

**Description:**  
Gets the number of posts by a user.

---

## Get Ten Posts
**URL:** `api/posts/get-ten-post`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id":"userID";
  "seenLastIDs": ["postId1", "postId2", "postId3"]
}
```

**Description:**  
Retrieves ten posts that the user has not yet seen.

---

## Add Comment ID To Existing Post
**URL:** `api/posts/add-commentID-to-existing-post`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "postID": "postId",
  "commentID": "commentId"
}
```

**Description:**  
Adds a comment ID to an existing post.

---

## Add Vote ID To Existing Post
**URL:** `api/posts/add-voteID-to-existing-post`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "postID": "postId",
  "voteID": "voteId"
}
```

**Description:**  
Adds a vote ID to an existing post.

---

## Delete Post By ID
**URL:** `api/posts/delete-post-by-ID/:postID/:id`  
**Method:** `DELETE`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `postID` (string, required): postID
- `id` (string, required): userID

**Description:**  
Deletes a post by its ID.

---

## Remove Comment ID By Post ID
**URL:** `api/posts/remove-commentID-by-postID`  
**Method:** `DELETE`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "postID": "postId",
  "commentID": "commentId"
}
```

**Description:**  
Removes a comment ID from a post.

---

## Remove All Comment ID By Post ID
**URL:** `api/posts/remove-all-commentID-by-postID`  
**Method:** `DELETE`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "postID": "postId"
}
```

**Description:**  
Removes all comment IDs from a post.
