# Community Routes Documentation

## Create Community
**URL:** `api/community/create-community`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "name": "Community Name",
  "description": "Community Description",
  "id": "userId"
  "bannerUrl": "banner.png", // Optional
  "links": [ // Optional
    {
      "platform": "Twitter",
      "url": "https://twitter.com/example"
    }
  ],
}
```

**Description:**  
Create a new community.

---

## Get All Communities
**URL:** `api/community/get-all-community`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Description:**  
Retrieves all communities.

---

## Get Ten Communities
**URL:** `api/community/get-ten-community/:id`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `id` (string, required): Last seen community IDS

**Description:**  
Retrieves ten communities.

---

## Get Community By ID
**URL:** `api/community/get-community-by-ID/:communityID`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `communityID` (string, required): communityID

**Description:**  
Retrieves a community by its ID.

---

## Get Three Community Posts
**URL:** `api/community/get-three-community-posts/:id`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `id` (string, required): Community id

**Description:**  
Retrieves three posts from a community.

---

## Add Members By ID
**URL:** `api/community/add-members-by-ID`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "communityID": "communityId",
  "memberID": "userId"
}
```

**Description:**  
Adds members to a community.

---

## Add Admin By ID
**URL:** `api/community/add-admin-by-ID`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "communityID": "communityId",
  "userID": "userId"
}
```

**Description:**  
Adds an administrator to a community.

---

## Remove Members By ID
**URL:** `api/community/remove-members-by-ID`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "communityID": "communityId",
  "userID": "userId"
}
```

**Description:**  
Removes members from a community.

---

## Edit Community Name
**URL:** `api/community/edit-community-name`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "communityID": "communityId",
  "newName": "New Community Name"
}
```

**Description:**  
Edits the name of a community.

---

## Edit Community Description
**URL:** `api/community/edit-community-description-by-ID`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id":"userID",
  "communityID": "communityId",
  "description": "New Community Description"
}
```

**Description:**  
Edit the description of a community.

---

## Add Banner URL
**URL:** `api/community/add-banner-URL-by-ID`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id":"userID",
  "communityID": "communityId",
  "url": "banner.jpg"
}
```

**Description:**  
Adds a banner URL to a community.

---

## Add Post By ID
**URL:** `api/community/add-postID-by-communityID`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id":"userID",
  "communityID": "communityId",
  "postID": "postId"
}
```

**Description:**  
Adds a post to a community.

---

## Add Platform Links By ID
**URL:** `api/community/add-platform-links-by-ID`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id":"userID",
  "communityID": "communityId",
  "platform": "Platform Name",
  "url": "https://example.com/platform"
}
```

**Description:**  
Adds platform links to a community.

---

## Edit Platform Names By ID
**URL:** `api/community/edit-platform-names-by-ID`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id":"userID",
  "communityID": "communityId",
  "platform": "Old Platform Name",
  "newPlatform": "New Platform Name"
}
```

**Description:**  
Edits the names of a community's platforms.

---

## Edit Platform Links By ID
**URL:** `api/community/edit-platform-links-by-ID`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id":"userID",
  "communityID": "communityId",
  "platform": "Platform Name",
  "url": "https://example.com/new-platform"
}
```

**Description:**  
Edits the links of a community's platforms.

---

## Delete Platform From Link By ID
**URL:** `api/community/delete-platform-from-link-by-ID`  
**Method:** `DELETE`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id":"userID",
  "communityID": "communityId",
  "platform": "Platform Name"
}
```

**Description:**  
Deletes a platform from a community's links.

---

## Delete Post By ID
**URL:** `api/community/delete-postID-by-communityID`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id":"userID",
  "communityID": "communityId",
  "postID": "postId"
}
```

**Description:**  
Deletes a post from a community.

---

## Delete Banner URL
**URL:** `api/community/delete-banner-URL-by-ID`  
**Method:** `DELETE`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id":"userID",
  "communityID": "communityId"
}
```

**Description:**  
Deletes the banner URL of a community.