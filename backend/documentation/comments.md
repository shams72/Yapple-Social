

# Comment Routes Documentation

## Create Comment
**URL:** `api/comment/create-comment`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "author": "userId",
  "post": "postId",
  "body": "This is a comment"
}
```

**Description:**  
Creates a new comment on a post.
---

## Get All Comments
**URL:** `api/comment/get-all-comments`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Description:**  
Retrieves all comments.

---

## Get Comment By ID
**URL:** `api/comment/get-comment-by-id/:id`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `id` (string, required): Die ID des Kommentars

**Description:**  
Retrieves a comment by its ID.

---

## Edit Comment
**URL:** `api/comment/edit-comment`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "commentId",
  "body": "Updated comment text"
}
```

**Description:**  
Edits an existing comment.

---

## Delete Comment
**URL:** `api/comment/delete-comment`  
**Method:** `DELETE`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "commentId"
}
```

**Description:**  
Deletes a comment based on its ID.

---

## Add Reply
**URL:** `api/comment/add-reply`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "commentId": "commentId",
  "author": "userId",
  "replyBody": "This is a reply"
}
```

**Description:**  
Adds a reply to a comment.

---

## Delete Reply
**URL:** `api/comment/delete-reply`  
**Method:** `DELETE`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "commentId": "commentId",
  "replyId": "replyId"
}
```

**Description:**  
Deletes a reply from a comment.

---

## Get Comments By Post ID
**URL:** `api/comment/get-comments-by-post/:postId`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `postId` (string, required): Die ID des Beitrags

**Description:**  
Retrieves all comments on a specific post.

---

## Get Comment Count
**URL:** `api/comment/comment-count/:id`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `id` (string, required): id of a user

**Description:**  
Gets the number of comments by a user.
