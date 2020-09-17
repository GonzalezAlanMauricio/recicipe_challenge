## About
This is an API of recipes made in Node + Graphql + Typescript + TypeOrm + Apollo-server

## Installation

How to start the app:

- Clone the repository from github
```sh
$ git clone https://github.com/GonzalezAlanMauricio/recicipe_challenge.git
```
- Cd to the project folder
```sh
$ cd puzzle_challenge/
```
- Install the dependencies
```sh
$ npm install
```
- Rename the file .env_Example to .env
```sh
$ mv .env_Example .env
```
- Create a mysql data base.
- Change the content of the constants in .env to match your mysql database config
- Start the server
```sh
$ npm start
```
- Go to http://localhost:3000/recipes to make queries

## Queries

### Users
To perform the mutation updateMyAccount and deleteMyAccount you need enter a token in the http headers like the following
```json
{
  " Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFhQGEuY29tIiwiaWF0IjoxNjAwMjk1NDE2LCJleHAiOjE2MDAzODE4MTZ9.PYw4r1YzZP6WvtPCvVKxFzXRftUIZuEP8OGhn6wuAC0"
}
```
You get a token by log in
if you update your account, the previous token won't work, you have to log in again
signUp and updateMyAccount have validations

```.graphql
query get_users {
  users {
    id
    name
    email
    recipes{
      name
      id
    }
  }
}
```

```.graphql
query get_user {
  user(id: 1) {
    id
    name
    recipes{
      name
      id
    }
  }
}
```

```.graphql
query user_not_found {
  user(id: 22) {
    id
    name
    email
  }
}
```

```.graphql
mutation add_user {
  signUp(input: { name: "test1234", email: "test@test.com", password: "1234aX" }) {
    name
    email
  }
}
```

```.graphql
mutation addUser_errors {
  signUp(input: { name: "t", email: "test", password: "1" }) {
    name
    email
  }
}
```

```.graphql
mutation update_account{
  updateMyAccount(input: {name:"a12E34", email: "example2@example.com"}){
    id
    name
  }
}
```

```.graphql
mutation delete_my_account{
  deleteMyAccount{
    id
    name
  }
}
```

### Recipes
To perform the following mutations and queries you need to enter a token in the http headers like the following
```json
{
  " Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFhQGEuY29tIiwiaWF0IjoxNjAwMjk1NDE2LCJleHAiOjE2MDAzODE4MTZ9.PYw4r1YzZP6WvtPCvVKxFzXRftUIZuEP8OGhn6wuAC0"
}
```
You get a token by log in
to add a recipe you need add first a category


```.graphql
query my_recipes{
  getMyRecipes{
    id
    name
    description
  }
}
```

```.graphql
query get_all_recipes {
  getRecipes {
    id
    name
    description
    ingredients
    category {
      name
      id
    }
    user {
      id
    }
  }
}
```

```.graphql
query get_one_recipe {
  getOneRecipe(id: 1) {
    id
    name
    description
    category {
      name
    }
    user{
      id
      name
    }
  }
}
```

```.graphql
mutation add_recipe {
  createRecipe(
    input: {
      name: "Neapolitan izza",
      description: " Here’s a recipe for Neapolitan style pizza you can make at home, inspired by the best pizza in Naples Italy! ",
      ingredients:" 1/3 cup Easy Pizza Sauce: 3 ounces fresh mozzarella cheese (or about 3/4 cup shredded mozzarella) and Kosher salt ",
      categoryId: 1
    }
  ) {
    name
    description
    category {
      id
      name
    }
  }
}
```

```.graphql
mutation delete_recipe {
  deleteRecipe(id: 1) {
    name
    category {
      name
    }
    user {
      email
    }
  }
}
```

```.graphql
mutation update_recipe {
  updateRecipe(input: { name: "Neapolitan Pizza", categoryId: 1}, id: 1) {
    id
    name
  }
}
```

### Category
To perform the following mutations and queries you need to enter a token in the http headers like the following
```json
{
  " Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFhQGEuY29tIiwiaWF0IjoxNjAwMjk1NDE2LCJleHAiOjE2MDAzODE4MTZ9.PYw4r1YzZP6WvtPCvVKxFzXRftUIZuEP8OGhn6wuAC0"
}
```
You get a token by log in

```.graphql
mutation create_a_category {
  createCategory(input: { name: "izzas" }) {
    id
    name
  }
}
```

```.graphql
query get_categories {
  getCategories {
    id
    name
    recipes {
      name
      id
      description
    }
  }
}
```

```.graphql
query get_one_category {
  getOneCategory(id: 1) {
    id
    name
    recipes{
      id
      description
      name
    }
  }
}
```

```.graphql
mutation delete_recipe {
  deleteCategory(id: 1) {
    id
    name
  }
}
```

```.graphql
mutation update_category {
  updateCategory(input: { name: "Pizzas" }, id: 1) {
    id
    name
  }
}
```