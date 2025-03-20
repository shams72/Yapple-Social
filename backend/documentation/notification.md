# Notification Routes Documentation

## Get All Notifications
**URL:** `api/notification/get-notifications/:id`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `id` (string, required): userID

**Description:**  
Retrieves all notifications for a user.

---

## Mark Notification As Read
**URL:** `api/notification/set-notification-as-read`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "notificationId": "notificationId"
}
```

**Description:**  
Marks a notification as read.

---

## Mark All Notifications As Read
**URL:** `api/notification/set-all-user-notification-as-read`  
**Method:** `PUT`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "id": "userId"
}
```

**Description:**  
Marks all notifications for a user as read.
