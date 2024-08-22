import { prisma } from "../src/database/client";

async function main() {
  const user = await prisma.user.create({
    data: {
      username: "zylcom",
      password: "rahasia",
      phonenumber: "0987652131",
    },
  });

  console.log(user);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    console.log("\nDone");
  });
