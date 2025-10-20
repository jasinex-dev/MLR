# Moon Lounge Resort
This project is to build a modern and responsive resort website where users can view listings, read reviews, and contact the resort.

# Main Features

Browse resort listings with images, prices, and descriptions.
Leave and read guest reviews.
Admin panel to manage listings and reviews.
Responsive design for all screen sizes.
Basic form validation for contact and booking forms.


# Technologies Used

Frontend: React.js, CSS, JavaScript.
Backend: Node.js, Express.js.
Database: MongoDB.
Other Tools: CORS, dotenv, morgan.

# Environment Variables

For security reasons, the .env file is not included in this repository.
Please create your own .env file following the example below and add your own MongoDB credentials.
Create a `.env` file **inside `backend/`** with:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mlr
PORT=5000
ORIGIN=http://localhost:4000

```

MLR/
├─ backend/ # Express API (routes: listings, reviews, etc.)
│ ├─ src/ # Controllers, models, routes, config
│ ├─ package.json
│ └─ .env # API env vars (see below)
├─ frontend/ # React app (listings UI, reviews, forms)
│ ├─ src/
│ ├─ package.json
│ └─ .env # FE env vars (optional)
├─ README.md
└─ .gitignore

## Prerequisites

Node.js ≥ 18
npm ≥ 9 (or pnpm/yarn)
MongoDB connection (Atlas or local MongoDB)