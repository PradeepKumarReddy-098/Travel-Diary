# Travel Diary Platform Backend Development

This API empowers users to manage their travel experiences seamlessly. It offers functionalities for user registration, login, profile management, travel creation, retrieval, update, and deletion. Users maintain control over their data by managing their own travel entries.

## Featured

**User :**

- Register new users with a username, email, and password (hashed for security).
- Log in existing users using their username or email and password.
- Retrieve user profiles
- update username and email.
- update password

**Travel**

- Create new travel entries with title, description, date, location, and photos URL.
- Retrieve all travel entries for a specific authenticated user.(user can only retrieve his/her own entries)
- Update existing travel entries.(user can only update his/her own entries)
- Delete travel entries.(user can only delete his/her own entries)

## Technologies

- Node.js
- Express
- sqlite3

## Installation

- Clone this repository
- Install dependencies - npm install (or yarn install)

**Users Table**

| Column   | Type    |
| -------- | ------- |
| id       | INTEGER |
| username | TEXT    |
| email    | TEXT    |
| password | TEXT    |

**travel_details Table**

| Column      | Type    |
| ----------- | ------- |
| id          | INTEGER |
| title       | TEXT    |
| description | TEXT    |
| date        | INTEGER |
| location    | TEXT    |
| photoUrl    | TEXT    |
| userId      | INTEGER |

## API Documentation

**User Management**

<Section id="section1" >

### API 1

#### Path: `/register`

#### Method: `POST`

**Request**

```
{
  "username":"Naresh",
  "email":"naresh@gmail.com",
  "password":"Naresh123"
}
```

- **Scenario 1**

  - **Description**:

    If the username already exists

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Body**
      ```
      {message : 'Username already exists'}
      ```

- **Scenario 2**

  - **Description**:

    If the email already exists

  - **Response**

    - **Status code**

      ```
      400
      ```

    - **Body**
      ```
      {message : 'Email already exists'}
      ```

- **Scenario 3**

  - **Description**:

    successful Register

  - **Response**

    - **Status code**

      ```
      200
      ```

    - **Body**
      ```
      {message : 'User registered successfully'}
      ```

</Section>

<Section id="section2">

### API 2

#### Path: `/login`

#### Method: `POST`

**Request**

```
{
  "usernameOrEmail": "varun@gmail.com",
  "password":"varun123"
}

```

- **Scenario 1**

  - **Description**:

    If the user not found

  - **Response**

    - **Status code**
      ```
      400
      ```
    - **Body**

      ```
      {
          message : "username or email not found"
      }

      ```

- **Scenario 2**

  - **Description**:

    If the user provides an incorrect password

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Body**
      ```
      {message : "Invalid password"}
      ```

- **Scenario 3**

  - **Description**:

    Successful login of the user

  - **Response**

    Return the JWT Token

    ```
    {
    "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInVzZXJuYW1lIjoiTmFyZXNoIiwiaWF0IjoxNzEzMDkzMj........."
    }
    ```

</Section>

<Section id="section3">

### API 3

#### Path: `/profile`

#### Method: `GET`

#### Description:

Get user Details

#### Response

```
 {
    "username": "Naresh",
    "email": "naresh@gmail.com"
}
```

</Section>

<Section id="section4">

### API 4

#### Path: `/profile/update`

#### Method: `PUT`

#### Description:

Update email and username

**Request**

```
{
  "username":"Nares",
  "email":"naresh@gmail.com"
}

```

- **Description**:
- if email and username not in database

#### Response

```
{ message: 'Profile updated successfully' }
```

</Section>

<Section id="section5">

### API 5

#### Path: `/profile/password`

#### Method: `PUT`

#### Description:

Update Password

**Request**

```
{
  "password": "new password"
}
```

#### Response

- **Status code**

      ```
      200
      ```

```
{ message: Password updated successfully }
```

</Section>

<Section id="section6">

### API 6

#### Path: `/travel/create`

#### Method: `POST`

**Request**

```
{
    "title":"Taj-mahal-India",
    "description":"An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife, the Taj Mahal is the jewel of Muslim art in India and one of the universally admired masterpieces of the world's heritage.",
    "date":"2020-01-20",
    "location":"Agra, India",
    "photosUrl":"taj-mahan/india.jpg"
}

```

- **Response**

      ```
      {
      "message": {
          "message": "Travel entry created successfully"
      }

  }

  ```

  ```

</Section>

<Section id="section7">

### API 7

#### Path: `/travel`

#### Method: `GET`

#### Description:

- You can only get the data of your own entries

  - **Response**
    ```
    {
        "travelDetails": [
            {
                "id": 9,
                "title": "Taj-mahal-India",
                "description": "An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the .....",
                "date": "2020-01-20",
                "location": "Agra, India",
                "photosUrl": "",
                "userId": 9
            },
            .....
        ]
    }
    
    ```

</Section>

<Section id="section8">

### API 8

#### Path: `/travel/update/:travelId`

#### Method: `PUT`

#### Description:

- You can only update the data of your own entries.

- **Request**

  ```
       {
           "travelDetails": [
               {
                   "id": 9,
                   "title": "Taj-mahal-India",
                   "description": "An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the .....",
                   "date": "2020-01-20",
                   "location": "Agra, India",
                   "photosUrl": "",
                   "userId": 9
               },
               .....
           ]
       }
       
  ```

  - **Response**
    ```
     {
        "message": "Travel entry updated successfully"
    }
    ```

</Section>

<Section id="section9">

### API 9

#### Path: `/travel/:travelId`

#### Method: `DELETE`

#### Description:

- You can only delete the data of your own entries.
  (the user who is logged in)

  - **Response**
    ```
     {
        "message": "Travel entry deleted successfully"
    }
    ```

</Section>

<br/>

Use `npm install` to install the packages.

**Export the express instance using the default export syntax.**

**Use Common JS module syntax.**
