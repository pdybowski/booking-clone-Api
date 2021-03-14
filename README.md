# Booking Clone API

This is an Express application providing a REST API to the Booking Clone application.

# REST API Documentation

Generally it is a RESTful API and returns results in JSON format.

## Registration of the user

It allows to register a new user.

### Request

`POST /api/auth/register`

- **Body**

  ```
  {
      "email": "[valid user email address]",
      "password": "[user password in plain text]",
      "repeatPassword": "[repeated user password in plain text]",
      "firstName": "[user first name]",
      "lastName": "[user last name]",
      "role": "[role of the user (user | hotelOwner)]",
      "isSmsAllowed": [true|false],
      "phoneNumber": "[user phone number]",
      "tin": "[tax identification number of the hotel owner]"
  }
  ```

  Required fields:

  email, password, repeatPassword, firstName, lastName, role, isSmsAllowed

### Response

- **Success Response:**

  Status Code: 200 OK

  Body:

  ```
  {
      "userId": "[user identifier]",
      "token": "[JWT Token]"
  }
  ```

- **Error Response:**

  - Status Code: 409 Conflict

    Body:

    ```
    {
        "message": "Account with this email address already exists."
    }
    ```

  - Status Code: 400 Bad Request

    Body:

    ```
    {
        "message": "[Data validation error message]"
    }
    ```

## User login

It allows user to log in.

### Request

`POST /api/auth/login`

- **Body**

  ```
  {
      "email": "[valid user email address]",
      "password": "[user password in plain text]",
  }
  ```

  Required fields:

  email, password

### Response

- **Success Response:**

  Status Code: 200 OK

  Body:

  ```
  {
      "userId": "[user identifier]",
      "token": "[JWT Token]"
  }
  ```

  The JWT token is also returned in response headers as `X-Auth-Token`. This token must be sent in every future requests where user need to be authenticated.

- **Error Response:**

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Email or password is wrong."
    }
    ```

  - Status Code: 400 Bad Request

    Body:

    ```
    {
        "message": "[Data validation error message]"
    }
    ```

## Request resetting user password

It sends user an email with the link to reset his/her password.

### Request

`POST /api/auth/requestPasswordReset`

- **Body**

  ```
  {
      "email": "[valid user email address]",
  }
  ```

  Required fields:

  email

### Response

- **Success Response:**

  Status Code: 200 OK

  Body:

  ```
  {
      "success": true
  }
  ```

- **Error Response:**

  - Status Code: 400 Bad Request

    Body:

    ```
    {
        "message": "User does not exists."
    }
    ```

    or

    Body:

    ```
    {
        "message": "[Data validation error message]"
    }
    ```

## Reset user password

It allows user to reset his/her password.

### Request

`POST /api/auth/resetPassword`

- **Body**

  ```
  {
      "userId": "[user identifier]",
      "token": "[valid JWT token]",
      "password": "[user new password in plain text]",
  }
  ```

  Required fields:

  userId, token, password

### Response

- **Success Response:**

  Status Code: 200 OK

  Body:

  ```
  {
      "success": true
  }
  ```

- **Error Response:**

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Invalid or expired password reset token."
    }
    ```

  - Status Code: 400 Bad Request

    Body:

    ```
    {
        "message": "[Data validation error message]"
    }
    ```

## Get user info

It returns data about logged in user.

### Request

`GET /api/user/me`

- **Body**

  No body data required.

### Response

- **Success Response:**

  Status Code: 200 OK

  Body:

  ```
  {
      "isVerified": [true|false],
      "role": "[user role (user | hotelOwner)]",
      "_id": "[user identifier]",
      "email": "[user email]",
      "firstName": "[user first name]",
      "lastName": "[user last name]",
      "isSmsAllowed": [true|false]
  }
  ```

- **Error Response:**

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Invalid token."
    }
    ```

<!-- RESERVATIONS -->

## Get reservations

It returns logged in user all hotel reservations.

### Request

`GET /api/reservations`

- **Body**

  No body data required.

### Response

- **Success Response:**

  Status Code: 200 OK

  Body for standard user:

  ```
  [
      {
          "_id": "[reservation identifier]",
          "startDate": "[reservation start date]",
          "endDate": "[reservation end date]",
          "people": {
              "adults": [number of adults],
              "children": [number of children]
          },
          "hotel": {
              "name": "[name of the hotel]",
              "address": {
                  "country": "[country in which the hotel is located]",
                  "city": "[city where the hotel is located]",
                  "zipcode": "[postal code where the hotel is located]",
                  "street": "[street the hotel is located on]",
                  "buildingNumber": [number of the building where hotel is located]
              },
              "room": {
                  "roomNumber": "[room number]",
                  "price": [price of the room for one night],
                  "description": "[room description]"
              }
          }
      },
      ...
  ]
  ```

  Body for hotel owner:

  ```
  [
      {
          "_id": "[reservation identifier]",
          "isPaid: [true|false],
          "startDate": "[reservation start date]",
          "endDate": "[reservation end date]",
          "people": {
              "adults": [number of adults],
              "children": [number of children]
          },
          "hotel": {
              "name": "[name of the hotel]",
              "address": {
                  "country": "[country in which the hotel is located]",
                  "city": "[city where the hotel is located]",
                  "zipcode": "[postal code where the hotel is located]",
                  "street": "[street the hotel is located on]",
                  "buildingNumber": [number of the building where hotel is located]
              },
              "room": {
                  "roomNumber": "[room number]",
                  "price": [price of the room for one night],
                  "description": "[room description]"
              }
          },
          "user": {
              "email": "[email of the user who booked the room]",
              "firstName": "[first name of the user who booked the room]",
              "lastName": "[last name of the user who booked the room]"
          }
      },
      ...
  ]
  ```

- **Error Response:**

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Invalid token."
    }
    ```

## Get all hotels for hotel owner <!-- OWNER -->

It allows the hotel owner to get all his hotels

### Request

`GET /api/hotelOwner/hotels`

### Response

- **Success Response:**

  Status Code: 200 OK

  Body:

  ```
  [
    {
      "description": "[hotel description]",
      "_id": "[hotel identifier]",
      "localization": {
        "_id": "[localization identifier]",
        "city": "[localization city]",
        "country": "[localization country]",
        "zipcode": "[localization zipcode]",
        "street": "[localization street]",
        "buildingNumber": [localization building number]
      },
      "phoneNumber": "[hotel phone number]",
      "name": "[hotel name]",
      "email": "[hotel email]",
      "rooms": [
        {
          "description": "[room description]",
          "_id": "[room identifier]",
          "roomNumber": "[room nuber]",
          "price": [room price],
          "createdAt": "[created date]",
          "updatedAt": "[updated date]"
        }
      ],
      "ownerId": "[hotel owner identifier]",
      "clientsRates": [hotel clients rates],
      "createdAt": "[created date]",
      "updatedAt": "[updated date]"
    }
  ]
  ```

- **Error Response:**

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

  - Status Code: 403 Forbidden

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

    or

    Body:

    ```
    {
        "message": "User is not verified."
    }
    ```

## Add new hotel <!-- OWNER -->

It allows the hotel owner to add new hotel

### Request

`POST /api/hotelOwner/hotels`

- **Body**

  ```
  {
      "name": "[hotel name]",
      "description": "[hotel description]",
      "localization": {
        "city": "[localization city]",
        "country": "[localization country]",
        "zipcode": "[localization zipcode]",
        "street": "[localization street]",
        "buildingNumber": [localization building number]
      },
      "email": "[hotel email]",
      "rooms": [
        {
          "description": "[room description]",
          "roomNumber": "[room nuber]",
          "price": [room price]
        }
      ],
  }
  ```

  Required fields:

  all localization fields, phoneNumber, name, email, roomNumber, price

### Response

- **Success Response:**

  Status Code: 200 OK

  Body:

  ```
  [
    {
      "description": "[hotel description]",
      "_id": "[hotel identifier]",
      "localization": {
        "_id": "[localization identifier]",
        "city": "[localization city]",
        "country": "[localization country]",
        "zipcode": "[localization zipcode]",
        "street": "[localization street]",
        "buildingNumber": [localization building number]
      },
      "phoneNumber": "[hotel phone number]",
      "name": "[hotel name]",
      "email": "[hotel email]",
      "rooms": [
        {
          "description": "[room description]",
          "_id": "[room identifier]",
          "roomNumber": "[room nuber]",
          "price": [room price],
          "createdAt": "[created date]",
          "updatedAt": "[updated date]"
        }
      ],
      "ownerId": "[hotel owner identifier]",
      "clientsRates": [hotel clients rates],
      "createdAt": "[created date]",
      "updatedAt": "[updated date]"
    }
  ]
  ```

- **Error Response:**

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

  - Status Code: 403 Forbidden

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

    or

    Body:

    ```
    {
        "message": "User is not verified."
    }
    ```

## Update hotel <!-- OWNER -->

It allows the hotel owner to update hotel

### Request

`PUT /api/hotelOwner/hotels/:id`

- **Body**

  ```
  {
      "[hotel field]": "[new value]"
  }
  ```

### Response

- **Success Response:**

  Status Code: 200 OK

- Body:

  ```
  [
    {
      "description": "[hotel description]",
      "_id": "[hotel identifier]",
      "localization": {
        "_id": "[localization identifier]",
        "city": "[localization city]",
        "country": "[localization country]",
        "zipcode": "[localization zipcode]",
        "street": "[localization street]",
        "buildingNumber": [localization building number]
      },
      "phoneNumber": "[hotel phone number]",
      "name": "[hotel name]",
      "email": "[hotel email]",
      "rooms": [
        {
          "description": "[room description]",
          "_id": "[room identifier]",
          "roomNumber": "[room nuber]",
          "price": [room price],
          "createdAt": "[created date]",
          "updatedAt": "[updated date]"
        }
      ],
      "ownerId": "[hotel owner identifier]",
      "clientsRates": [hotel clients rates],
      "createdAt": "[created date]",
      "updatedAt": "[updated date]"
    }
  ]
  ```

- **Error Response:**

  - Status Code: 400 Bad Request

    Body:

    ```
    {
        "message": "Hotel not found."
    }
    ```

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

  - Status Code: 403 Forbidden

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

    or

    Body:

    ```
    {
        "message": "User is not verified."
    }
    ```

## Delete hotel <!-- OWNER -->

It allows the hotel owner to delet hotel

### Request

`DELETE /api/hotelOwner/hotels/:id`

- **Query**

  It allows to remove a hotel even if they have any reservation.

  `forceDelete = true`

- **Body**

  No body data required.

### Response

- **Success Response:**

  Status Code: 200 OK

- **Error Response:**

  - Status Code: 400 Bad Request

    Body:

    ```
    {
        "message": "Remove reservations first or check `force delete` flag"
    }
    ```

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

  - Status Code: 403 Forbidden

    Body:

    ```
    {
        "message": "Forbidden"
    }
    ```

    or

    Body:

    ```
    {
        "message": "User is not verified."
    }
    ```

## Add room to a hotel <!-- OWNER -->

It allows the hotel owner to add room to a hotel

### Request

`POST /api/hotelOwner/hotels/:id/addRoom`

- **Body**

  ```
  [
    {
      "description": "[room description]",
      "roomNumber": [room number]",
      "beds": {
        "single": "[single beds number]",
        "double": "[double beds number]"
      },
      "price": "[price]"
    }
  ]
  ```

  Required fields:

  roomNumber, beds, single, double, price

### Response

- **Success Response:**

  Status Code: 200 OK

  ```
  [
    {
      "description": "[hotel description]",
      "_id": "[hotel identifier]",
      "localization": {
        "_id": "[localization identifier]",
        "city": "[localization city]",
        "country": "[localization country]",
        "zipcode": "[localization zipcode]",
        "street": "[localization street]",
        "buildingNumber": [localization building number]
      },
      "phoneNumber": "[hotel phone number]",
      "name": "[hotel name]",
      "email": "[hotel email]",
      "rooms": [
        {
          "description": "[room description]",
          "_id": "[room identifier]",
          "roomNumber": "[room nuber]",
          "price": [room price],
          "createdAt": "[created date]",
          "updatedAt": "[updated date]"
        }
      ],
      "ownerId": "[hotel owner identifier]",
      "clientsRates": [hotel clients rates],
      "createdAt": "[created date]",
      "updatedAt": "[updated date]"
    }
  ]
  ```

- **Error Response:**

  - Status Code: 400 Bad Request

    Body:

    ```
    {
        "message": "Hotel with provided ID was not found."
    }
    ```

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

  - Status Code: 403 Forbidden

    Body:

    ```
    {
        "message": "Forbidden"
    }
    ```

    or

    Body:

    ```
    {
        "message": "User is not verified."
    }
    ```

## Get all users <!-- ADMIN -->

It allows the administrator to get all users

### Request

`GET /api/admin/users`

- **Body**

  No body data required.

### Response

- **Success Response:**

  Status Code: 200 OK

  Body:

  ```
  [
      {
          "isVerified": [true|false],
          "role": "[role of the user (user | hotelOwner)]",
          "_id": "[user identifier]",
          "email": "[user email address]"
          "password": "[user password]",
          "firstName": "[user first name]",
          "lastName": "[user last name]",
          "phoneNumber": "[user phone number]",
          "tin": "[tax identification number of the hotel owner]"
          "isSmsAllowed": [true|false],
      }
  ]
  ```

- **Error Response:**

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

  - Status Code: 403 Forbidden

    Body:

    ```
    {
        "message": "Forbidden"
    }
    ```

## Get all hotel owners

It allows the administrator to get all hotel owners

### Request

`GET /api/admin/hotelOwner`

- **Body**

  No body data required.

### Response

- **Success Response:**

  Status Code: 200 OK

  Body:

  ```
  [
      {
          "isVerified": [true|false],
          "role": "[role of the user (user | hotelOwner)]",
          "_id": "[user identifier]",
          "email": "[user email address]"
          "password": "[user password]",
          "firstName": "[user first name]",
          "lastName": "[user last name]",
          "phoneNumber": "[user phone number]",
          "tin": "[tax identification number of the hotel owner]"
          "isSmsAllowed": [true|false],
      }
  ]
  ```

- **Error Response:**

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

  - Status Code: 403 Forbidden

    Body:

    ```
    {
        "message": "Forbidden"
    }
    ```

## Change user role to hotel owner

It allows the administrator to change user role

### Request

`PUT /api/admin/acceptUserToHotelOwner/:id`

- **Body**

  No body data required.

### Response

- **Success Response:**

  Status Code: 200 OK

- **Error Response:**

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

  - Status Code: 403 Forbidden

    Body:

    ```
    {
        "message": "Access denied"
    }
    ```

## Verify hotel owner

It allows the administrator to verify hotel owner

### Request

`PUT /api/admin/verifyHotelOwner/:id`

- **Body**

  No body data required.

### Response

- **Success Response:**

  Status Code: 200 OK

- **Error Response:**

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

  - Status Code: 403 Forbidden

    Body:

    ```
    {
        "message": "Access denied"
    }
    ```

## Remove hotel owner

It allows the administrator to remove hotel owner

### Request

`DELETE /api/admin/hotelOwner/:id`

- **Body**

  No body data required.

### Response

- **Success Response:**

  Status Code: 200 OK

- **Error Response:**

  - Status Code: 400 Bad Request

    Body:

    ```
    {
        "message": "Remove hotel(s) first"
    }
    ```

    or

    Body:

    ```
    {
        "message": "Hotel owner with provided id not found"
    }
    ```

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

  - Status Code: 403 Forbidden

    Body:

    ```
    {
        "message": "Access denied"
    }
    ```

## Remove users

It allows the administrator to remove users

### Request

`DELETE /api/admin/users`

- **Query**

  It allows to remove a user even if they have any reservation.

  `forceDelete = true`

- **Body**

  ```
  [
      "user identifier",
  ]
  ```

### Response

- **Success Response:**

  Status Code: 200 OK

- **Error Response:**

  - Status Code: 400 Bad Request

    Body:

    ```
    {
        "message": "User not found"
    }
    ```

    or

    Body:

    ```
    {
        "message": "Remove reservations first"
    }
    ```

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

  - Status Code: 403 Forbidden

    Body:

    ```
    {
        "message": "Access denied"
    }
    ```

## Remove hotels

It allows the administrator to remove users

### Request

`DELETE /api/admin/hotels/:id`

- **Query**

  It allows to remove a hotel even if they have any reservation.

  `forceDelete = true`

- **Body**

  No body data required.

### Response

- **Success Response:**

  Status Code: 200 OK

- **Error Response:**

  - Status Code: 400 Bad Request

    Body:

    ```
    {
        "message": "Hotel not found"
    }
    ```

    or

    Body:

    ```
    {
        "message": "Remove reservations first"
    }
    ```

  - Status Code: 401 Unauthorized

    Body:

    ```
    {
        "message": "Access denied."
    }
    ```

  - Status Code: 403 Forbidden

    Body:

    ```
    {
        "message": "Access denied"
    }
    ```
