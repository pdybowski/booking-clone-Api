# Booking Clone API

This is an Express application providing a REST API to the Booking Clone application.

# REST API Documentation

Generally it is a RESTful API and returns results in JSON format.

## Registration of the user

It allows to register a new user.

### Request

`GET /api/auth/register`

* **Body**

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

* **Success Response:**
  
    Status Code: 200 OK

    Body: 
    ```
    {
        "userId": "[user identifier]",
        "token": "[JWT Token]"
    }
    ```

* **Error Response:**
  
  * Status Code: 409 Conflict

      Body:
      ```
      {
          "message": "Account with this email address already exists."
      }
      ```

  * Status Code: 400 Bad Request

      Body:
      ```
      {
          "message": "[Data validation error message]"
      }
      ```