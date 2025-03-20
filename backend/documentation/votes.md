
# Vote Routes Documentation

## Create Vote
**URL:** `api/vote/create`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "targetId": "targetId",
  "voteType": "upvote",
  "targetModel": "Post"
}
```

**Description:**  
Creates a new poll.

---

## Delete Vote
**URL:** `api/vote/delete`  
**Method:** `DELETE`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "targetId": "targetId",
  "voteType": "upvote",
  "targetModel": "Post"
}
```

**Description:**  
Delete a vote.

---

## Get All Votes
**URL:** `api/vote/all`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Description:**  
Retrieves all votes.

---

## Get Votes By Target
**URL:** `api/vote/get-votes/:targetModel/:targetId`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `targetModel` (string, required): The target Model(Post or Comment)
- `targetId` (string, required): ID of the target.

**Description:**  
Retrieves all votes for a specific target.