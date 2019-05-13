### PGOS App

#### Architecture

##### Backend

Intended to create a foundation that could evolve into a RESTful pattern ( with HATEOAS for pagination and general naviagation)

Technologies used

- Language: Rust
- Framework: actix-web
- Database: Sqlite

##### Frontend

Intended to build the early steps required for a scalable PWA

Technologies used

- Language: Typescript / Javascript
- State Management: Redux
- Component Library: LitElement (Webcomponents)

#### Trade-offs

##### 1. Isomorphism

Writing an isomorphic app would have been easier as I would have only need to write Typescript code and the nodejs ecosystem is more mature in terms of web development and testing. I decided to write the backend in Rust only because I wanted to test my current Rust skills for writing backend code.

##### 2. Database choice

Sqlite was selected as Database for simplicity of runtime required for the test but at the end imposed a couple of deviations from the main line of development just to solve sqlite<->rust issues that would have dissapeared with postgres or mysql like pagination support and other ORM goodies

##### 3. Component Library

LitElement is just a Webcomponents wrapper that uses an ultra efficient and native renderer (lit-html).

I decided to native webcomponents because is production-ready technology and it provides cheap flexibility to adopt any framework or other component libraries if needed.

The main issue with this approach is that some tools like Cypress (automated testing) are not capable of working properly with Shadow DOM.

#### How to run

Backend:

```
cd packages/api
cargo run
```

Frontend:

```
cd packages/web
npm i
npm start
```

Click [here](http://localhost:9000)

#### Why there are no automated tests nor styles (css)

I focused on other aspects/requirements and did not have time to catch up later with those requirements

#### Productionizing this

1. Replace Sqlite with a production-friendly SQL database
2. Write automated tests (unit and acceptance)
3. Implement design specs
4. Dockerize backend
5. Build CI pipeline to build and deploy backend
6. Build CI job to build and deploy frontend to CDN

I would consider this to be production ready after step 4 is achieved. 5-6 are automation.
