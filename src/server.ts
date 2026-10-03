import "colors";

import app from "@/index";
import { env } from "@/config";

app.listen(env.PORT, () => {
  console.log(
    `Server Running On http://localhost:${env.PORT}`.cyan.underline.bold,
  );
});
