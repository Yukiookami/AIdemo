import Router from "@koa/router";

const router = new Router();

// GET /api/users
router.get("/users", (ctx) => {
  ctx.body = {
    code: 200,
    data: [
      { id: 1, name: "Alice", email: "alice@example.com" },
      { id: 2, name: "Bob", email: "bob@example.com" },
    ],
  };
});

// GET /api/users/:id
router.get("/users/:id", (ctx) => {
  const { id } = ctx.params;
  ctx.body = {
    code: 200,
    data: { id: Number(id), name: "Alice", email: "alice@example.com" },
  };
});

// POST /api/users
router.post("/users", (ctx) => {
  const body = ctx.request.body;
  ctx.status = 201;
  ctx.body = {
    code: 201,
    message: "User created",
    data: { id: Date.now(), ...body },
  };
});

export default router;
