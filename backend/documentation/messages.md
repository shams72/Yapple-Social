

# Message Routes Documentation

## Create Message
**URL:** `api/messages/create`  
**Method:** `POST`  
**Headers:**  
- `Authorization: Bearer <token>`

**Body:**  
```json
{
  "to": "recipientUserId",
  "from": "senderUserId",
  "content": "This is a message"
}
```

**Description:**  
Creates a new message.

---

## Get All Messages
**URL:** `api/messages/get-all`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Description:**  
Retrieves all messages.

---

## Get Message By ID
**URL:** `api/messages/get/:id`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `id` (string, required): message ID

**Description:**  
Retrieves a message by its ID.

---

## Get Messages Between Users
**URL:** `api/messages/get-between/:user1/:user2/:id`  
**Method:** `GET`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `user1` (string, required): ID of user user 1
- `user2` (string, required): ID of user user 2
- `id` (string, required): userID

**Description:**  
Retrieves all messages between two users.

---

## Delete Message
**URL:** `api/messages/delete/:id`  
**Method:** `DELETE`  
**Headers:**  
- `Authorization: Bearer <token>`

**Params:**  
- `id` (string, required): Message ID

**Description:**  
Deletes a message by its ID.