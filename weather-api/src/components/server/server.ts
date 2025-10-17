import server from "../../main.js";

const PORT = process.env.PORT ?? 3000;

server.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});

export default server;