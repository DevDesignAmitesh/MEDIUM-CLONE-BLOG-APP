import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { z } from "zod";
import { sign } from "hono/jwt";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

const signupBody = z.object({
  email: z.string().min(3),
  name: z.string().min(3),
  password: z.string().min(3),
});

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const email = body.email;
  const name = body.name;
  const password = body.password;

  const { success } = signupBody.safeParse(body);

  if (!success) {
    return c.json({
      message: "Invalid inputs",
    });
  }

  const exsitingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if(exsitingUser){
    return c.json({
      message: "User already exists"
    })
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password
    }
  })

  const jwt = await sign({id: newUser.id}, c.env.JWT_SECRET)

  return c.json({
    newUser: newUser.name,
    jwt
  })

});

const signinBody = z.object({
  email: z.string().min(3),
  password: z.string().min(3),
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const email = body.email;
  const password = body.password;

  const { success } = signinBody.safeParse(body);

  if (!success) {
    return c.json({
      message: "Invalid inputs",
    });
  }

  const exsitingUser = await prisma.user.findUnique({
    where: {
      email,
      password,
    },
  });

  if(!exsitingUser){
    return c.json({
      message: "User not exists"
    })
  }

  const jwt = await sign({id: exsitingUser.id}, c.env.JWT_SECRET)

  return c.json({
    exsitingUser: exsitingUser.name,
    jwt
  })

});

userRouter.get("/user", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const allUsers = await prisma.user.findMany({})

  if(!allUsers){
    return c.json({
      message: "no user found"
    })
  }

  return c.json({
    allUsers
  })
})

export default userRouter;
