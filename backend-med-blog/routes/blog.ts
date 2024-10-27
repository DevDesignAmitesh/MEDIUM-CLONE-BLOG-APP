import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { string, z } from "zod";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

blogRouter.use("/blog/*", async (c, next) => {
  const jwt = c.req.header("Authorization");

  if (!jwt) {
    return c.json({
      message: "user not authenticated",
    });
  }

  const token = jwt.split(" ")[1];

  const payload = await verify(token, c.env.JWT_SECRET);

  if (!payload) {
    return c.json({
      message: "not authenticated",
    });
  }
  c.set("jwtPayload", payload);
  await next();
});

const blogPostBody = z.object({
  title: z.string(),
  content: z.string(),
});

blogRouter.post("/blog", async (c) => {
 try {
  const jwtPayload = c.get("jwtPayload");
  const authorId = jwtPayload.id;
  const author = jwtPayload.name;

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const title = body.title;
  const content = body.content;
  
  const { success } = blogPostBody.safeParse(body);

  if (!success) {
    return c.json({
      message: " invlaid inputs",
    });
  }

  const newBlog = await prisma.post.create({
    data: {
      title,
      content,
      author,
      authorId,
    },
  });

  if(!newBlog){
    return c.json({
      message: "something went wrong"
    })
  }

  return c.json({
    message: "blog created",
    id: newBlog.id,
  });
 } catch (error) {
  return c.json({
    message: (error as Error).message
  })
 }
});

const blogPutBody = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});

blogRouter.put("/blog", async (c) => {
  try {
    const jwtPayload = c.get("jwtPayload");
  const userId = jwtPayload.id;

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const id = body.id;
  const title = body.title;
  const content = body.content;

  const {success} = blogPutBody.safeParse(body)

  if(!success){
    return c.json({
      message: "invalid inputs"
    })
  }

  const updatedBlog = await prisma.post.update({
    where: {
      id,
      authorId: userId,
    },
    data: {
      title,
      content,
    },
  });

  return c.json({
    updatedBlog,
    message: "blog updated",
  });
  } catch (error) {
    return c.json({
      message: (error as Error).message
    })
  }
});

blogRouter.get("/blog", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const allBlogs = await prisma.post.findMany();
  
    if (!allBlogs) {
      return c.json({
        message: "no blogs found",
      });
    }
  
    return c.json({
      allBlogs,
    });
  } catch (error) {
    return c.json({
      message: (error as Error).message
    })
  }
});

const blogGetBody = z.object({
  id: z.string()
});

blogRouter.get("/blog/unique", async (c) => {
  const id = c.req.query("id")

  const {success} = blogGetBody.safeParse({id})
  if(!success){
    return c.json({
      message: "invalid inputs"
    })
  }
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const uniqueBlog = await prisma.post.findUnique({
      where:{
        id
      }
    });
  
    if (!uniqueBlog) {
      return c.json({
        message: "no blogs found",
      });
    }
  
    return c.json({
      uniqueBlog,
    });
  } catch (error) {
    return c.json({
      message: (error as Error).message
    })
  }
});

const blogDeleteBody = z.object({
  id: z.string()
});

blogRouter.delete("/blog", async (c) => {
  const body = await c.req.json()
  const id = body.id

  const {success} = blogDeleteBody.safeParse(body)
  
  if(!success){
    return c.json({
      message: "invalid inputs"
    })
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const deletedBlog = await prisma.post.delete({
    where: {
      id
    }
  })

  if(!deletedBlog){
    return c.json({
      message: "something went wrong"
    })
  }

  return c.json({
    message: "blog deletd",
    deletedBlog
  })
})

export default blogRouter;
