
# Post Body Routes Documentation

## Create PostBody
**URL:** `api/postBody/add-postBody`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userId",
  "text": "text",
  "image": "image.jpg",
  "video": "video.jpg"
}
```

**Description:**  
- Creates a new post body.
- Atleast one image/text/video must be provided.

---

## Edit PostBody
**URL:** `api/postBody/edit-postBody`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userId",
  "postBodyID":"postBodyID",
  "text": "text",
  "image": "image.jpg",
  "video": "video.jpg"
}
```

**Description:**  
- Creates a new post body.
- Atleast one image/text/video must be provided.

---

## Get PostBody

**URL:** `api/postBody/get-text-postBody-by-ID/:postBodyID/:id`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `postID` (string, required): postID
- `id` (string, required): userID

---

## Delete PostBody

**URL:** `api/postBody/delete-text-PostBody`  
**Method:** `DELETE`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `postBodyID` (string, required): postID
- `id` (string, required): userID

---