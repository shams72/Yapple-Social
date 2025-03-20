
# Media Routes Documentation

## Upload Community Pic
**URL:** `api/media/upload-community-pic`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userId",
  "url": "image.png",
  "data": "image base 64",
  "uploadedBy": "userID",
  "relatedObject": "userID"
}
```

---

## Upload Community Banner
**URL:** `api/media/upload-community-banner`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userId",
  "url": "banner.png",
  "data": "image base 64",
  "uploadedBy": "userID",
  "relatedObject": "userID"
}
```

---

## Get Community Picture

**URL:** `api/media/get-community-profile-by-ID/:communityID/:id`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `communityID` (string, required): postID
- `id` (string, required): userID

---


## Save to Disk

**URL:** `api/media/upload-and-save-to-disk`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "url": "banner.png",
}
```
---

## Get All Media

**URL:** `api/media/get-all`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

---

## Delete Media

**URL:** `api/media/delete`  
**Method:** `DELETE`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userID",
  "mediaId": "meadiaID",
}
```
---

## Delete Media

**URL:** `api/media/update-url`  
**Method:** `put`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userID",
  "mediaId": "meadiaID",
  "url":"media.png"
}
```
---

